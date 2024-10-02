import os
import logging
import requests
import random
import string
from sqlalchemy import func
from ckan.common import _, config
from ckan.plugins import toolkit as tk
import json
from ckanext.scheming import helpers as scheming_helpers
import ckan.lib.authenticator as authenticator
from ckan.common import current_user
from ckan.authz import users_role_for_group_or_org
import ckan.lib.mailer as mailer
from ckan.logic.action.create import _get_random_username_from_email
from ckan.lib.base import render
import ckan.logic as logic
from jinja2 import Environment, FileSystemLoader
from ckanext.tdc.conversions import converters

template_dir = 'src_extensions/ckanext-tdc/ckanext/tdc/templates/emails/'
env = Environment(loader=FileSystemLoader(template_dir))

NotAuthorized = logic.NotAuthorized
get_action = logic.get_action

log = logging.getLogger(__name__)


def _fix_topics_field(data_dict):
    """
    When "topics" field is provided, add dataset to the
    topic
    """
    topics_names = data_dict.get("topics", None)

    if topics_names is not None and len(topics_names) > 0:
        priviliged_context = {"ignore_auth": True}

        group_list_action = tk.get_action("group_list")
        group_list_data_dict = {
            "type": "topic",
            "groups": topics_names,
            "include_extras": True,
            "all_fields": True
        }
        group_list = group_list_action(
            priviliged_context, group_list_data_dict)

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

    if has_geographies or has_regions:
        countries = []
        regions = []

        priviliged_context = {"ignore_auth": True}

        group_list_action = tk.get_action("group_list")
        group_list_data_dict = {
            "type": "geography",
            "groups": geography_names + region_names,
            "include_extras": True,
            "all_fields": True,
            "include_groups": True
        }
        group_list = group_list_action(
            priviliged_context, group_list_data_dict)

        group_list_names = [x.get("name") for x in group_list]
        for group_name in geography_names + region_names:
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


def _update_contributors(data_dict, is_update=False):
    """
    Whenever an update happens, contributors list
    is updated based on which user did the update
    """
    current_user = tk.current_user
    if not hasattr(current_user, "id"):
        return
    current_user_id = current_user.id

    if is_update:
        dataset_id = data_dict.get("id")
        dataset_name = data_dict.get("name")
        name_or_id = dataset_id or dataset_name

        priviliged_context = {
            "ignore_auth": True
        }

        package_show_action = tk.get_action("package_show")
        package_show_data_dict = {
            "id": name_or_id
        }
        old_data_dict = package_show_action(
            priviliged_context, package_show_data_dict)
        old_contributors = old_data_dict.get("contributors")
        new_contributors = list(set(old_contributors + [current_user_id]))

        data_dict["contributors"] = new_contributors

        return new_contributors

    data_dict["contributors"] = [current_user_id]


def _fix_user_group_permission(data_dict):
    """
    By default, any user should be able to create datasets
    with any geography or topic.
    To do that, add user as member of groups.
    """
    groups = data_dict.get("groups", [])
    if not hasattr(current_user, "id"):
        return
    user_id = current_user.id

    if len(groups) > 0 and user_id:
        priviliged_context = {"ignore_auth": True}
        group_member_create_action = tk.get_action("group_member_create")

        for group in groups:
            group_id = group.get("name")
            capacity = users_role_for_group_or_org(group_id, user_id)
            if capacity not in ["member", "editor", "admin"]:
                group_member_create_data_dict = {
                        "id": group.get("name"),
                        "username": user_id,
                        "role": "member"}
                group_member_create_action(priviliged_context,
                                           group_member_create_data_dict)


def _before_dataset_create_or_update(data_dict, is_update=False):
    _fix_geographies_field(data_dict)
    _fix_topics_field(data_dict)
    _update_contributors(data_dict, is_update=is_update)
    _fix_user_group_permission(data_dict)


@tk.chained_action
def package_create(up_func, context, data_dict):
    _before_dataset_create_or_update(data_dict)
    result = up_func(context, data_dict)
    return result

@tk.chained_action
def package_delete(up_func, context, data_dict):
    package = tk.get_action('package_show')(context, {'id': data_dict['id']})
    package_search = tk.get_action('package_search')
    search_result = package_search(context, {'fq': f"related_datasets:{package['name']}"})
    for item in search_result.get('results', []):
        related_datasets = item.get('related_datasets', [])
        related_datasets.remove(package['name'])
        tk.get_action('package_patch')({ "ignore_auth": True }, {'id': item['id'], 'related_datasets': related_datasets})
    result = up_func(context, data_dict)
    return result

@tk.chained_action
def package_update(up_func, context, data_dict):
    _before_dataset_create_or_update(data_dict, is_update=True)
    result = up_func(context, data_dict)
    return result


@tk.chained_action
def package_patch(up_func, context, data_dict):
    _before_dataset_create_or_update(data_dict, is_update=True)
    result = up_func(context, data_dict)
    return result


def _control_archived_datasets_visibility(data_dict):
    include_archived_param = data_dict.get("include_archived", "false")
    include_archived = tk.asbool(include_archived_param)

    if not include_archived:
        if "fq" not in data_dict:
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
                priviliged_context = {"ignore_auth": True}
                group_list_action = tk.get_action("group_list")
                group_list_data_dict = {
                    "groups": all_facet_item_names,
                    "all_fields": True,
                    "type": "geography"
                }
                group_list = group_list_action(
                    priviliged_context, group_list_data_dict)

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
            priviliged_context = {"ignore_auth": True}
            user_show_action = tk.get_action("user_show")
            contributors_facet = search_facets["contributors"]
            for contributor in contributors_facet["items"]:
                name = contributor["name"]
                user = user_show_action(priviliged_context, {"id": name})
                fullname = user.get("fullname")
                display_name = user.get("display_name")
                contributor["display_name"] = display_name or fullname or name
                image_display_url = user.get("image_display_url")
                contributor["display_image"] = image_display_url


def _add_display_name_to_multi_select_facets(search_response):
    dataset_schema = scheming_helpers.scheming_get_dataset_schema("dataset")
    search_facets = search_response.get("search_facets", [])

    if len(search_facets) > 0:
        dataset_fields = dataset_schema["dataset_fields"]

        for facet_name in search_facets:
            facet_field = list(filter(lambda x: x.get("field_name") == facet_name, dataset_fields))
            if len(facet_field) > 0:
                facet_field = facet_field[0]
                preset = facet_field.get("preset")
                if preset in ["multiple_select", "select"]:
                    choices = facet_field.get("choices")
                    search_facet = search_facets[facet_name]
                    items = search_facet["items"]
                    for item in items:
                        value = item["name"]
                        value_choice = list(filter(lambda x: x.get("value") == value, choices))
                        if len(value_choice) > 0:
                            value_choice = value_choice[0]
                            value_label = value_choice["label"]
                            item["display_name"] = value_label


@tk.chained_action
@tk.side_effect_free
def package_search(up_func, context, data_dict):
    _control_archived_datasets_visibility(data_dict)
    result = up_func(context, data_dict)
    _add_display_name_to_custom_group_facets(result)
    _add_display_name_to_multi_select_facets(result)
    _add_display_name_to_contributors_facets(result)
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
            model = context['model']
            context['ignore_auth'] = True

            validated_token = validate_github_token(token)

            user_id = validated_token.get("id")

            if not user_id or not validated_token:
                return generic_error_message

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
                        'display_name': data_dict['name'],
                        'fullname': data_dict['name'],
                        'email': email,
                        'password': password,
                        'state': 'active',
                    },
                )
                log.info(user)

            else:
                user = user.as_dict()

            if config.get('ckanext.auth.include_frontend_login_token', False):
                user = generate_token(context, user)

            return json.dumps(user)
        if not data_dict.get('id') or not data_dict.get('password'):
            return generic_error_message

        model = context['model']
        if "@" in data_dict.get("id", ""):
            user = session.query(model.User).filter(model.User.email == data_dict.get("id", "")).first()
        else:
            user = model.User.get(data_dict['id'])

        if not user:
            return generic_error_message

        user = user.as_dict()

        if config.get('ckanext.auth.include_frontend_login_token', False):
            user = generate_token(context, user)

        if data_dict['password']:
            identity = {'login': user['name'], 'password': data_dict['password']}

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
    site_url = site_url if site_url else config.get('ckan.site_url')

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
    else:
        raise ValueError("Invalid Email Type.")

    body_vars = {
        'site_title': site_title,
        'site_url': site_url,
        'user_name': from_user.name,
        'user_email': from_user.email,
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
        send_email("user_invite", email, from_user, message=message)

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
    org_dict = get_action('organization_show')({}, data_dict)
    # find admin users of the org
    to_emails = []
    for user in org_dict.get("users"):
        if user.get("capacity") == "admin":
            user_show = model.User.get(user.get("id"))
            to_emails.append(user_show.email)

    for email in to_emails:
        send_email("organization_participation", email, from_user, message=message, organization=org_dict.get("name"))

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
    sysadmins = session.query(model.User).filter(model.User.sysadmin==True).all()
    to_emails = [user.email for user in sysadmins if user.email]

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


@tk.chained_action
@tk.side_effect_free
def package_show(up_func, context, data_dict):
    output_format = data_dict.get("output_format", "json")

    result = up_func(context, data_dict)

    if output_format != "json":
        converter = converters.get(output_format)
        if converter:
            result = converter(result).convert()

    return result
