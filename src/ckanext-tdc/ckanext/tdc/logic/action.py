import os
import logging
import requests
import random
import string
import json
import os.path as path
from sqlalchemy import func
from jinja2 import Environment, FileSystemLoader
from socket import error as socket_error

import ckan
from ckan.common import _, config, current_user
from ckan.plugins import toolkit as tk
import ckan.lib.authenticator as authenticator
from ckan.authz import users_role_for_group_or_org
import ckan.lib.mailer as mailer
from ckan.logic.action.create import _get_random_username_from_email
from ckan.lib.base import render
import ckan.logic as logic
import ckan.lib.dictization.model_dictize as model_dictize
import ckan.lib.helpers as h

from ckanext.scheming import helpers as scheming_helpers
from ckanext.datapusher.plugin import DatapusherPlugin
from ckanext.tdc.conversions import converters
from ckanext.tdc.schemas.schemas import dataset_approval_schema
from ckanext.tdc.authz import is_org_admin_or_sysadmin
import subprocess

log = logging.getLogger(__name__)

NotAuthorized = logic.NotAuthorized
ValidationError = logic.ValidationError
get_action = logic.get_action
_validate = ckan.lib.navl.dictization_functions.validate


cwd = path.abspath(path.dirname(__file__))
template_dir = path.join(cwd, '../templates/emails/')
env = Environment(loader=FileSystemLoader(template_dir))


def get_privileged_context():
    return {
        "ignore_auth": True,
        'user': tk.current_user.id
    }


def _fix_topics_field(data_dict):
    """
    When "topics" field is provided, add dataset to the
    topic
    """
    topics_names = data_dict.get("topics", None)

    if topics_names is not None and len(topics_names) > 0:
        privileged_context = get_privileged_context()

        group_list_action = tk.get_action("group_list")
        group_list_data_dict = {
            "type": "topic",
            "groups": topics_names,
            "include_extras": True,
            "all_fields": True
        }
        group_list = group_list_action(
            privileged_context, group_list_data_dict)

        topic_groups = [{"name": x.get("name"), "type": "topic"}
                        for x in group_list]
        groups = data_dict.get("groups", [])
        groups += topic_groups
        data_dict["groups"] = groups
        data_dict["topics"] = [x.get("name") for x in group_list]


def _fix_geographies_field(data_dict):
    """
    When "geographies" field is provided, add dataset
    to geographies and regions groups
    """
    geography_names = data_dict.get("geographies", [])
    region_names = data_dict.get("regions", [])

    if isinstance(geography_names, str):
        geography_names = [geography_names]

    if isinstance(region_names, str):
        region_names = [region_names]

    has_geographies = isinstance(
        geography_names, list) and len(geography_names) > 0
    has_regions = isinstance(region_names, list) and len(region_names) > 0

    privileged_context = get_privileged_context()
    group_list_action = tk.get_action("group_list")

    if has_geographies:
        countries = []
        regions = []

        group_list_data_dict = {
            "type": "geography",
            "groups": geography_names,
            "include_extras": True,
            "all_fields": True,
            "include_groups": True
        }
        group_list = group_list_action(
            privileged_context, group_list_data_dict)

        group_list_names = [x.get("name") for x in group_list]
        for group_name in geography_names:
            if group_name not in group_list_names:
                raise logic.ValidationError(
                    {'geographies': ["Geography or region '{}' not found.".format(group_name)]})

        for group in group_list:
            geography_type = group.get("geography_type")
            group_name = group.get("name")
            if geography_type == "country":
                parent_groups = group.get("groups")
                region_names = list([x.get("name") for x in parent_groups])

                countries.append(group_name)
                regions.extend(region_names)
            elif geography_type == "region":
                regions.append(group_name)

        countries = list(set(countries))
        regions = list(set(regions))

        geography_groups = [{"name": x, "type": "geography"}
                            for x in countries + regions]
        groups = data_dict.get("groups", [])
        groups += geography_groups

        data_dict["groups"] = groups
        data_dict["geographies"] = countries
        data_dict["regions"] = regions
    elif has_regions:
        group_list_data_dict = {
            "type": "geography",
            "groups": region_names,
            "include_extras": True,
            "all_fields": True,
            "include_groups": True
        }
        group_list = group_list_action(
            privileged_context, group_list_data_dict)

        group_list_names = [x.get("name") for x in group_list]
        for group_name in region_names:
            if group_name not in group_list_names:
                raise logic.ValidationError(
                    {'geographies': ["Geography or region '{}' not found.".format(group_name)]})

        data_dict["regions"] = region_names

    if has_geographies or has_regions:
        groups = data_dict.get("groups", [])
        groups_names_not_present_on_geographies_names = set(
            x.get("name") for x in groups) - set(geography_names + region_names)
        geograhies_names = set(tk.get_action('group_list')(
            get_privileged_context(), {'type': 'geography'}))
        geographies_groups_not_present_on_the_dataset_geographies = geograhies_names & groups_names_not_present_on_geographies_names
        data_dict["groups"] = [x for x in groups if x.get(
            'name') not in geographies_groups_not_present_on_the_dataset_geographies]


def _update_contributors(context, data_dict, is_update=False):
    """
    Whenever an update happens, contributors list
    is updated based on which user did the update
    """
    prevent_contributors_update = context.get(
        "prevent_contributors_update", False)

    if prevent_contributors_update:
        return

    current_user = tk.current_user
    if not hasattr(current_user, "id"):
        return
    current_user_id = current_user.id
    user_show_action = tk.get_action("user_show")
    excluded_ids = []

    untracked_contributors_ids = data_dict.get(
        "untracked_contributors_ids", [])

    log.info("[CONTRIBUTORS] _update_contributors called")
    log.info(f"[CONTRIBUTORS] current_user_id: {current_user_id}")
    log.info(f"[CONTRIBUTORS] untracked_contributors_ids: {untracked_contributors_ids}")

    if len(untracked_contributors_ids):
        excluded_ids.extend(untracked_contributors_ids)
        log.info(f"[CONTRIBUTORS] excluded_ids after adding untracked: {excluded_ids}")

    try:
        site_user = logic.get_action(u"get_site_user")(
            get_privileged_context(), {})
        excluded_ids.append(site_user.get("id"))
        ckan_admin = user_show_action(
            get_privileged_context(), {"id": "ckan_admin"})
        excluded_ids.append(ckan_admin.get("id"))
    except Exception as e:
        log.error(e)

    if is_update:
        dataset_id = data_dict.get("id")
        dataset_name = data_dict.get("name")
        name_or_id = dataset_id or dataset_name

        package_show_action = tk.get_action("package_show")
        package_show_data_dict = {
            "id": name_or_id
        }
        old_data_dict = package_show_action(
            get_privileged_context(), package_show_data_dict)
        old_contributors = old_data_dict.get("contributors")
        new_contributors = list(set(old_contributors + [current_user_id]))
        filtered_new_contributors = [
            c for c in new_contributors if c not in excluded_ids]

        data_dict["contributors"] = filtered_new_contributors

        return new_contributors

    new_contributors = [current_user_id]
    filtered_new_contributors = [
        c for c in new_contributors if c not in excluded_ids]
    data_dict["contributors"] = filtered_new_contributors

    log.info(f"[CONTRIBUTORS] Creating new dataset - new_contributors: {new_contributors}")
    log.info(f"[CONTRIBUTORS] Creating new dataset - filtered_new_contributors: {filtered_new_contributors}")
    log.info(f"[CONTRIBUTORS] Creating new dataset - excluded_ids: {excluded_ids}")


def _fix_user_group_permission(data_dict):
    """
    By default, any user should be able to create datasets
    with any geography or topic.
    To do that, add user as member of groups.
    """
    groups = data_dict.get("groups", [])
    if not hasattr(current_user, "id"):
        return
    user_id = current_user.name

    if len(groups) > 0 and user_id:
        privileged_context = get_privileged_context()
        group_member_create_action = tk.get_action("group_member_create")

        for group in groups:
            group_id = group.get("name")
            capacity = users_role_for_group_or_org(group_id, user_id)
            if capacity not in ["member", "editor", "admin"]:
                group_member_create_data_dict = {
                    "id": group.get("name"),
                    "username": user_id,
                    "role": "member"}
                group_member_create_action(privileged_context,
                                           group_member_create_data_dict)


def _fix_approval_workflow(context, data_dict, is_update):
    is_private = data_dict.get("private", True)
    if is_private is not None:
        is_private = tk.asbool(is_private)
    user_id = current_user.id

    is_resource_create = context.get("is_resource_create", False)

    if is_update:
        dataset_id = data_dict.get("id")
        package_show_action = tk.get_action("package_show")
        dataset = package_show_action(
            get_privileged_context(), {"id": dataset_id})

        old_dataset_is_private = dataset.get("private", None)
        if is_private is None and old_dataset_is_private is not None:
            is_private = old_dataset_is_private
    else:
        dataset = data_dict

    owner_org = dataset.get("owner_org")
    user_is_admin = is_org_admin_or_sysadmin(owner_org, user_id)

    if not user_is_admin:
        current_approval_contributors = dataset.get(
            "current_approval_contributors", [])
        data_dict["current_approval_contributors"] = list(
            set([user_id] + current_approval_contributors))
        if is_private is False:
            data_dict["private"] = True
            data_dict["approval_status"] = "pending"
            data_dict["approval_message"] = None
            data_dict["approval_requested_by"] = user_id
            context["ignore_approval_status"] = True

            # Register pending status as an approval activity
            context["is_approval_action"] = True
            context["is_approval_action_pending"] = True

            # Ignore the default acitivity to enforce that
            # the approval status change acitivty only happens
            # after the package changed activity
            context["ignore_activity_signal"] = True
        elif not is_resource_create:
            if "approval_message" in data_dict:
                data_dict.pop("approval_message")
            if "approval_status" in data_dict:
                data_dict.pop("approval_status")
            if "approval_requested_by" in data_dict:
                data_dict.pop("approval_requested_by")

    clear_current_approval_contributors = context.get(
        "clear_current_approval_contributors", False)
    if clear_current_approval_contributors:
        data_dict["previous_approval_contributors"] = data_dict.get(
            "current_approval_contributors", [])
        data_dict["current_approval_contributors"] = []

    if is_update and user_is_admin and old_dataset_is_private and not is_private and data_dict.get('approval_status', False) != 'approved':
        data_dict["approval_status"] = None
        data_dict["approval_message"] = None


def _before_dataset_create_or_update(context, data_dict, is_update=False):
    is_approval_action = context.get("is_approval_action", False)

    if not is_approval_action:
        _fix_geographies_field(data_dict)
        _fix_topics_field(data_dict)
        _update_contributors(context, data_dict, is_update=is_update)
        _fix_user_group_permission(data_dict)

    _fix_approval_workflow(context, data_dict, is_update=is_update)


def _submit_dataset_resources_to_datapusher(dataset):
    resources = dataset.get("resources", [])
    for resource in resources:
        if resource.get("resource_type") == "data":
            DatapusherPlugin()._submit_to_datapusher(resource)


def _after_dataset_create_or_update(context, data_dict, is_update=False):
    _submit_dataset_resources_to_datapusher(data_dict)


@tk.chained_action
def package_create(up_func, context, data_dict):
    _before_dataset_create_or_update(context, data_dict)
    result = up_func(context, data_dict)
    _after_dataset_create_or_update(context, result)
    return result


@tk.chained_action
def package_delete(up_func, context, data_dict):
    package = tk.get_action('package_show')(context, {'id': data_dict['id']})
    package_search = tk.get_action('package_search')
    search_result = package_search(
        context, {'fq': f"related_datasets:{package['name']}"})
    for item in search_result.get('results', []):
        related_datasets = item.get('related_datasets', [])
        related_datasets.remove(package['name'])
        tk.get_action('package_patch')({"ignore_auth": True}, {
            'id': item['id'], 'related_datasets': related_datasets})
    result = up_func(context, data_dict)
    return result


@tk.chained_action
def organization_update(up_func, context, data_dict):
    before_update_org = tk.get_action('organization_show')(
        context, {'id': data_dict['id'], 'all_fields': True})
    result = up_func(context, data_dict)
    try:
        if (result.get('name') != before_update_org.get('name')) or result.get('title') != before_update_org.get('title'):
            subprocess.Popen(["ckan", "search-index", "rebuild"])
    except Exception:
        return result

    return result


@tk.chained_action
def package_update(up_func, context, data_dict):
    _before_dataset_create_or_update(context, data_dict, is_update=True)
    result = up_func(context, data_dict)
    _after_dataset_create_or_update(context, result, is_update=True)
    return result


def _control_archived_datasets_visibility(data_dict):
    include_archived_param = data_dict.get("include_archived", "false")
    include_archived = tk.asbool(include_archived_param)

    if not include_archived:
        if not data_dict.get("fq"):
            data_dict["fq"] = ""

        data_dict["fq"] += " -is_archived:(true)"

    if "include_archived" in data_dict:
        del data_dict["include_archived"]


def _add_display_name_to_custom_group_facets(search_response):
    """
    This function fixes search facets for topics and
    geographies to use a proper display_name instead
    of the "url" name
    """
    custom_group_types = ["topics", "regions", "geographies"]

    if "search_facets" in search_response:
        search_facets = search_response["search_facets"]
        custom_group_types_in_facets = list(
            filter(lambda x: x in custom_group_types, search_facets))
        custom_group_facets = [search_facets[x]
                               for x in custom_group_types_in_facets]

        if len(custom_group_facets) > 0:
            all_facet_items = [x.get("items", []) for x in custom_group_facets]
            all_facet_item_names = []
            for items in all_facet_items:
                names = [x.get("name") for x in items]
                all_facet_item_names.extend(names)

            if len(all_facet_item_names) > 0:
                privileged_context = get_privileged_context()
                group_list_action = tk.get_action("group_list")
                group_list_data_dict = {
                    "groups": all_facet_item_names,
                    "all_fields": True,
                    "type": "geography"
                }
                group_list = group_list_action(
                    privileged_context, group_list_data_dict)

                for facet in custom_group_facets:
                    for item in facet["items"]:
                        item_name = item.get("name")
                        group = list(filter(lambda x: x.get(
                            "name") == item_name, group_list))
                        if len(group) > 0:
                            group = group[0]
                            group_display_name = group.get("display_name")
                            group_title = group.get("title")
                            item["display_name"] = group_display_name or group_title or item_name


def _add_display_name_to_contributors_facets(search_response):
    """
    This function fixes search facets for contributors 
    to use a proper display_name and display_image
    """

    if "search_facets" in search_response:
        search_facets = search_response["search_facets"]

        if "contributors" in search_facets:
            privileged_context = get_privileged_context()
            user_show_action = tk.get_action("user_show")
            contributors_facet = search_facets["contributors"]
            for contributor in contributors_facet["items"]:
                name = contributor["name"]
                try:
                    user = user_show_action({ "ignore_auth": True }, {"id": name})
                    fullname = user.get("fullname")
                    display_name = user.get("display_name")
                    contributor["display_name"] = display_name or fullname or name
                    image_display_url = user.get("image_display_url")
                    contributor["display_image"] = image_display_url
                except Exception as e:
                    contributor["display_name"] = name
                    contributor["display_image"] = None
                    log.error(f"Error getting contributor {name}")


def _fix_facet_items_per_field_type(result):
    return
    dataset_schema = scheming_helpers.scheming_get_dataset_schema("dataset")
    search_facets = result.get("search_facets", [])

    if len(search_facets) > 0:
        dataset_select_fields = {
            df.get("field_name"): df
            for df in dataset_schema["dataset_fields"]
            if (
                df.get("preset") in ['multiple_select', 'select']
                and df.get("field_name") in search_facets
            )
        }

        for facet_name in dataset_select_fields:
            dataset_field = dataset_select_fields[facet_name]
            search_facet = search_facets[facet_name]
            choices = dataset_field.get("choices")
            search_facet_items = {
                i.get("name"): i
                for i in search_facet["items"]
            }
            search_facet["items"] = []
            for choice in choices:
                name = choice.get("value")
                display_name = choice.get("label")
                search_facet_item = search_facet_items.get(name)

                search_facet["items"].append({
                    "name": name,
                    "display_name": display_name,
                    "count": search_facet_item.get("count") if search_facet_item else 0
                })


@tk.chained_action
@tk.side_effect_free
def package_search(up_func, context, data_dict):
    log.info("Calling package_search")
    _control_archived_datasets_visibility(data_dict)
    log.info("Controlled for archived datasets")
    result = up_func(context, data_dict)
    log.info("Got result")
    _fix_facet_items_per_field_type(result)
    log.info("Fixed facet items per field type")
    _add_display_name_to_custom_group_facets(result)
    log.info("Added display name to custom group facets")
    _add_display_name_to_contributors_facets(result)
    log.info("Added display name to contributors facets")
    log.info("Done")
    return result


@tk.chained_action
@tk.side_effect_free
def group_list(up_func, context, data_dict):
    group_type = data_dict.get("type")

    result = up_func(context, data_dict)

    if group_type == "geography":
        include_shapes = tk.asbool(data_dict.get("include_shapes", "False"))
        if not include_shapes:
            for item in result:
                if "geography_shape" in item:
                    del item["geography_shape"]

    return result


generic_error_message = {
    'errors': {'auth': [_('Unable to authenticate user')]},
    'error_summary': {_('auth'): _('Unable to authenticate user')},
}


def validate_github_token(access_token):
    try:
        # GitHub OAuth API to check if the token is valid
        url = "https://api.github.com/user"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            return generic_error_message

    except Exception as e:
        log.error(e)
        return generic_error_message


def user_login(context, data_dict):
    try:

        frontend_secret = os.getenv("CKANEXT__TDC__CLIENT_AUTH_SECRET")
        client_secret = data_dict['client_secret']

        if frontend_secret != client_secret:
            return {
                'errors': {'auth': [_('Unable to authenticate user')]},
                'error_summary': {_('auth'): _('Client not authorized to authenticate')},
            }

        session = context['session']

        from_github = data_dict.get('from_github', False)

        if from_github:
            token = data_dict['token']
            email = data_dict['email']
            fullname = data_dict['fullname'] or data_dict['name']
            model = context['model']
            context['ignore_auth'] = True
            invite_id = data_dict.get("invite_id", None)

            validated_token = validate_github_token(token)

            user_id = validated_token.get("id")

            if not user_id or not validated_token:
                return generic_error_message

            if invite_id:
                invited_ckan_user_q = session.query(model.User).filter(
                    model.User.reset_key == invite_id)
                invited_ckan_user = invited_ckan_user_q.first()
                if not invited_ckan_user:
                    error = {
                        'errors': {'auth': [_('This invite is not valid. Please, try again or contact an administrator.')]},
                    }
                    return error

                email_already_used = session.query(model.User).filter(
                    model.User.email == email,
                    model.User.state == 'active').all()

                if len(email_already_used) > 0:
                    error = {
                        'errors': {'auth': [_('The email address of the GitHub account you signed in with is already assigned to another TDC account.')]},
                    }
                    return error

                # Email adress is available and invite is valid
                invited_ckan_user.email = email
                invited_ckan_user.fullname = fullname
                invited_ckan_user.reset_key = mailer.make_key()
                invited_ckan_user.state = 'active'
                model.repo.commit_and_remove()

            user = session.query(model.User).filter(func.lower(
                model.User.email) == func.lower(email)).first()

            if not user:
                password_length = 10
                password = ''.join(
                    random.choice(string.ascii_letters + string.digits)
                    for _ in range(password_length)
                )

                user_name = ''.join(
                    c.lower() if c.isalnum() else '_' for c in email.split('@')[0]
                )

                user = tk.get_action('user_create')(
                    context,
                    {
                        'name': user_name,
                        'display_name': fullname,
                        'fullname': fullname,
                        'email': email,
                        'password': password,
                        'state': 'active',
                    },
                )
            else:
                if fullname != user.fullname:
                    user.fullname = fullname
                    model.repo.commit()
                user = user.as_dict()

            if config.get('ckanext.auth.include_frontend_login_token', False):
                user = generate_token(context, user)

            plugin_extras = user.get("plugin_extras")
            onboarding_completed = False
            if plugin_extras:
                onboarding_completed = plugin_extras.get(
                    "onboarding_completed", False)
            user["onboarding_completed"] = onboarding_completed

            return json.loads(json.dumps(user))
        if not data_dict.get('id') or not data_dict.get('password'):
            return generic_error_message

        model = context['model']
        if "@" in data_dict.get("id", ""):
            user = session.query(model.User).filter(
                model.User.email == data_dict.get("id", "")).first()
        else:
            user = model.User.get(data_dict['id'])

        if not user:
            return generic_error_message

        user = user.as_dict()

        if config.get('ckanext.auth.include_frontend_login_token', False):
            user = generate_token(context, user)

        if data_dict['password']:
            identity = {'login': user['name'],
                        'password': data_dict['password']}

            auth = authenticator

            try:
                authUser = auth.default_authenticate(identity)
                authUser_name = model.User.get(authUser.id).name

                if authUser_name != user['name']:
                    return generic_error_message
                else:
                    return user
            except Exception as e:
                log.error(e)
                return generic_error_message

    except Exception as e:
        log.error(e)
        return json.dumps({"error": True})


def generate_token(context, user):
    context['ignore_auth'] = True
    user['frontend_token'] = None

    try:
        api_tokens = tk.get_action('api_token_list')(
            context, {'user_id': user['name']}
        )

        for token in api_tokens:
            if token['name'] == 'frontend_token':
                tk.get_action('api_token_revoke')(
                    context, {'jti': token['id']})

        frontend_token = tk.get_action('api_token_create')(
            context, {'user': user['name'], 'name': 'frontend_token'}
        )

        user['frontend_token'] = frontend_token.get('token')

    except Exception as e:
        log.error(e)

    return user


def render_html_template(template_name, vars):
    template = env.get_template(template_name)
    return template.render(vars)


def send_email(email_type, to_email, from_user, site_title=None, site_url=None, **kwargs):

    site_title = site_title if site_title else config.get('ckan.site_title')
    site_url = site_url if site_url else config.get('ckan.frontend_portal_url')
    user_name = from_user.fullname
    if not user_name or user_name == "":
        user_name = from_user.name

    if email_type == "organization_participation":
        subject_template = 'emails/user_participation_subject.txt'
        subject_vars = {}
    elif email_type == "user_invite":
        subject_template = 'emails/invite_user_subject.txt'
        subject_vars = {
            'site_title': site_title
        }
    elif email_type == "new_organization_request":
        subject_template = 'emails/new_organization_request_subject.txt'
        subject_vars = {}
    elif email_type.startswith("dataset_approval_"):
        subject_template = 'emails/{}_subject.txt'.format(email_type)
        subject_vars = {
            "dataset_title": kwargs["dataset_title"],
            "user_name": user_name
        }
    else:
        raise ValueError("Invalid Email Type.")

    body_vars = {
        'site_title': site_title,
        'site_url': site_url,
        'user_name': user_name,
        'user_email': from_user.email,
        'to_email': to_email,
        **kwargs
    }

    subject = render(subject_template, subject_vars)
    body_html = render_html_template(email_type+"_template.html", body_vars)

    name = _get_random_username_from_email(to_email)
    mailer._mail_recipient(
        name, to_email, site_title, site_url, subject, "sample_body", body_html=body_html
    )


def invite_user_to_tdc(context, data_dict):
    if not context.get('user'):
        return generic_error_message

    model = context['model']

    from_user = model.User.get(context['user'])
    if not from_user:
        return generic_error_message

    to_emails = data_dict.get("emails")
    message = data_dict.get("message")

    if not (to_emails and message):
        raise ValueError("Missing Parameters.")

    for email in to_emails:
        send_email("user_invite",
                   email,
                   from_user,
                   site_url=tk.config.get('ckan.frontend_portal_url', None),
                   message=message
                   )

    return "Invited User Successfully"


def request_organization_owner(context, data_dict):

    if not context.get('user'):
        return generic_error_message

    model = context['model']

    from_user = model.User.get(context['user'])
    if not from_user:
        return generic_error_message

    org_id = data_dict.get("id")
    message = data_dict.get("message")

    if not org_id:
        raise ValueError("Missing Parameters.")

    data_dict = {
        'id': org_id,
        'include_users': True,
    }
    org_dict = get_action('organization_show')(
        {"ignore_auth": True}, data_dict)
    to_emails = [from_user.email]
    users = tk.get_action('user_list')({"ignore_auth": True})
    sysadmins_users = [user for user in users if user.get('sysadmin')]
    # find admin users of the org
    for user in org_dict.get("users") + sysadmins_users:
        if user.get("capacity") == "admin" or user.get("sysadmin"):
            user_show = model.User.get(user.get("id"))
            to_emails.append(user_show.email)

    for email in set(to_emails):
        send_email("organization_participation", email, from_user,
                   message=message, organization=org_dict.get("name"))

    return "Request Sent Successfully"


def request_new_organization(context, data_dict):

    if not context.get('user'):
        return generic_error_message

    model = context['model']
    session = context['session']

    from_user = model.User.get(context['user'])
    if not from_user:
        return generic_error_message

    org_name = data_dict.get("org_name")
    org_description = data_dict.get("org_description")
    dataset_description = data_dict.get("dataset_description")

    if not (org_name and org_description and dataset_description):
        raise ValueError("Missing Parameters.")

    # get sysadmins emails
    sysadmins = session.query(model.User).filter(
        model.User.sysadmin == True).all()
    to_emails = [user.email for user in sysadmins if user.email] + \
        [from_user.email]

    # send mails
    for email in to_emails:
        send_email(
            "new_organization_request",
            email,
            from_user,
            org_name=org_name,
            org_description=org_description,
            dataset_description=dataset_description
        )
    return "Request Sent Successfully"


def _add_contributors_data_to_dataset(dataset):
    user_show_action = tk.get_action("user_show")
    organization_show_action = tk.get_action("organization_show")
    privileged_context = {"ignore_auth": True}

    owner_org = dataset.get("owner_org")
    org_dict = {"id": owner_org, "include_extras": True}
    full_org = organization_show_action(privileged_context, org_dict)

    # Hiding too much information
    full_org['users'] = None
    dataset['organization'] = full_org

    creator_user_id = dataset.get("creator_user_id")
    creator_user_dict = {"id": creator_user_id}
    creator_user = user_show_action(privileged_context, creator_user_dict)

    if creator_user:
        dataset['creator_user'] = {
            "fullname": creator_user.get("fullname"),
            "display_name": creator_user.get("display_name"),
            "name": creator_user.get("name"),
            "email": creator_user.get("email")
        }

    contributor_ids = dataset.get("contributors", [])
    contributors_dict_list = [
        user_show_action(privileged_context, {"id": id})
        for id in contributor_ids]

    contributors_data = [{
        "fullname": contributor.get("fullname"),
        "display_name": contributor.get("display_name"),
        "name": contributor.get("name"),
        "email": contributor.get("email")
    } for contributor in contributors_dict_list]

    dataset['contributors_data'] = contributors_data


@tk.chained_action
@tk.side_effect_free
def package_show(up_func, context, data_dict):
    output_format = data_dict.get("output_format", "json")
    include_extras = data_dict.get("include_extras", False)

    result = up_func(context, data_dict)

    if include_extras:
        _add_contributors_data_to_dataset(result)

    if output_format != "json":
        converter = converters.get(output_format)
        if converter:
            result = converter(result).convert()

    return result


@logic.validate(dataset_approval_schema)
def dataset_approval_update(context, data_dict):
    tk.check_access("dataset_review", context, data_dict)
    id = data_dict.get("id")

    status = data_dict.get("status")

    package_patch_action = tk.get_action("package_patch")
    package_patch_dict = {"id": id}

    if status == "approved":
        package_patch_dict["private"] = False
        package_patch_dict["approval_message"] = None
        package_patch_dict["approval_status"] = "approved"
        context["clear_current_approval_contributors"] = True

    if status == "rejected":
        package_patch_dict["private"] = True
        package_patch_dict["approval_message"] = data_dict.get("feedback")
        package_patch_dict["approval_status"] = "rejected"

    context["is_approval_action"] = True

    # This prevents the default package activity from being created
    context["ignore_activity_signal"] = True

    package_patch_action(context, package_patch_dict)


def user_following_groups(context, data_dict):
    """
    Returns a list of group IDs the user is following within a given array of group-ids.

    :param context: CKAN context object
    :param data_dict: Dictionary containing 'group_list' and 'user_id'
    :returns: List of group IDs the user is following
    :raises ValidationError: If 'user_id' or 'group_list' is missing
    """
    group_list = data_dict.get('group_list')
    user_id = data_dict.get('user_id')

    if not user_id:
        raise ValidationError('Missing required parameter: user_id')

    if not group_list:
        raise ValidationError('Missing required parameter: group_list')

    followed_groups = []

    for group_id in group_list:
        try:
            # Fetch followers of the group
            result = get_action('group_follower_list')(
                context, {'id': group_id})

            # Add group to the list if the user is following it
            if any(follower['id'] == user_id for follower in result):
                followed_groups.append(group_id)

        except logic.NotFound:
            # Continue if the group does not exist
            continue
        except Exception as e:
            # Optional: Log or handle other exceptions
            log.error(f"Error processing group {group_id}: {str(e)}")
            continue

    return followed_groups


def get_invite_body(user,
                    group_dict=None,
                    role=None):
    frontend_url = tk.config.get('ckan.frontend_portal_url', None)
    extra_vars = {
        'reset_link': "{}/auth/signup?invite_id={}".format(frontend_url, user.reset_key),
        'site_title': config.get('ckan.site_title'),
        'site_url': config.get('ckan.site_url'),
        'user_name': user.name,
    }

    if role:
        extra_vars['role_name'] = h.roles_translated().get(role, _(role))
    if group_dict:
        group_type = (_('organization') if group_dict['is_organization']
                      else _('group'))
        extra_vars['group_type'] = group_type
        extra_vars['group_title'] = group_dict.get('title')

    return render_html_template('github_user_invite_template.html', extra_vars)


def send_invite(
        user,
        group_dict=None,
        role=None):
    mailer.create_reset_key(user)
    body = get_invite_body(user, group_dict, role)
    extra_vars = {
        'site_title': config.get('ckan.site_title')
    }
    subject = render('emails/github_user_invite_subject.txt', extra_vars)

    # Make sure we only use the first line
    subject = subject.split('\n')[0]

    # TODO: implement non-html body
    mailer.mail_recipient(user.display_name, user.email,
                          subject, "Invite", body_html=body)


# Imported from ckan core user_invite
def github_user_invite(context, data_dict):
    tk.check_access('user_invite', context, data_dict)

    schema = context.get('schema',
                         logic.schema.default_user_invite_schema())
    data, errors = _validate(data_dict, schema, context)
    if errors:
        raise ValidationError(errors)

    model = context['model']
    group = model.Group.get(data['group_id'])
    if not group:
        raise logic.NotFound()

    name = _get_random_username_from_email(data['email'])

    data['name'] = name
    # send the proper schema when creating a user from here
    # so the password field would be ignored.
    invite_schema = ckan.logic.schema.create_user_for_user_invite_schema()

    data['state'] = model.State.PENDING
    user_dict = get_action('user_create')(
        {**context, "schema": invite_schema, "ignore_auth": True},
        data)
    user = model.User.get(user_dict['id'])
    assert user
    member_dict = {
        'username': user.id,
        'id': data['group_id'],
        'role': data['role']
    }

    org_or_group = 'organization' if group.is_organization else 'group'
    get_action(f'{org_or_group}_member_create')(context, member_dict)
    group_dict = get_action(f'{org_or_group}_show')(
        context, {'id': data['group_id']})

    try:
        send_invite(user, group_dict, data['role'])
    except (socket_error, mailer.MailerException) as error:
        # Email could not be sent, delete the pending user

        get_action('user_delete')(context, {'id': user.id})

        message = _(
            'Error sending the invite email, '
            'the user was not created: {0}').format(error)
        raise ValidationError(message)

    return model_dictize.user_dictize(user, context)


def resource_upsert_many(context, data_dict):
    """
    Patches multiple resources at once, also deletes any resources which are not in the list
    """
    _resources = data_dict.get("resources")
    dataset_id = data_dict.get("dataset_id")
    dataset_resources = get_action("package_show")(
        context, {"id": dataset_id}).get('resources', [])
    context["ignore_approval_status"] = True
    context["is_resource_create"] = True
    context["prevent_contributors_update"] = True

    def _exists(resource, resource_list):
        for item in resource_list:
            if resource.get('id', None) == item['id']:
                return True
        return False

    def upsert(resource):
        exists = _exists(resource, dataset_resources)
        if exists:
            return get_action("resource_patch")(context, resource)
        else:
            return get_action("resource_create")(context, {**resource, **{"package_id": dataset_id}})

    resources_to_update_or_create = [
        upsert(resource) for resource in _resources]
    [get_action("resource_delete")(context, {"id": resource['id']})
     for resource in dataset_resources if not _exists(resource, _resources)]
    return resources_to_update_or_create
