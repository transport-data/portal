import ckan.authz as core_authz
from ckan.common import _, current_user
import ckan.logic as logic
import ckan.plugins.toolkit as tk
from ckan.logic.auth.update import package_update as core_package_update

import ckanext.tdc.authz as authz
from ckanext.tdc.authz import is_org_admin_or_sysadmin

import logging

log = logging.getLogger(__name__)


def package_update(context, data_dict):
    package_id = data_dict.get("id")
    user_id = current_user.id

    approval_status = data_dict.get("approval_status")
    owner_org = data_dict.get("owner_org")

    approval_status_auto = context.get("approval_status_auto")

    if not approval_status or not owner_org:
        package_show_action = tk.get_action("package_show")
        package_show_dict = {"id": package_id}
        privileged_context = {"ignore_auth": True}

        dataset = package_show_action(privileged_context, package_show_dict)

        if not approval_status:
            approval_status = dataset.get("approval_status")

        if not owner_org:
            owner_org = dataset.get("owner_org")

    user_is_admin = is_org_admin_or_sysadmin(owner_org, user_id)

    if not user_is_admin and approval_status == "pending" and not approval_status_auto:
        return {"success": False,
                "message": "User cannot update pending dataset"}

    return core_package_update(context, data_dict)


def group_show(context, data_dict):
    return {'success': True}


def group_create(context, data_dict):
    user = context['user']
    user = core_authz.get_user_id_for_username(user, allow_none=True)

    return {'success': False,
            'msg': _('User %s not authorized to create groups') % user}


def organization_create(context, data_dict):
    user = context['user']
    user = core_authz.get_user_id_for_username(user, allow_none=True)

    return {'success': False,
            'msg': _('User %s not authorized to create organizations') % user}


@tk.auth_sysadmins_check
def dataset_review(context, data_dict):
    user = context.get('user')
    new_status = data_dict.get("status")

    if user:
        user_id = core_authz.get_user_id_for_username(user)
        package = logic.auth.get_package_object(context, data_dict)
        owner_org = package.owner_org
        # User is an administrator of the organization the dataset belongs to
        if authz.is_org_admin_or_sysadmin(owner_org, user_id):
            package_show_action = tk.get_action("package_show")
            dataset = package_show_action(context, data_dict)
            approval_status = dataset.get("approval_status")
            is_private = dataset.get("private")

            if not is_private:
                return {'success': False, 'msg': 'Dataset is not private'}

            is_pending = approval_status == "pending"
            is_rejected = approval_status == "rejected"

            if new_status == "approved" and not (is_pending or is_rejected):
                return {
                    'success': False,
                    'msg': 'Dataset must be rejected or pending to approve'
                }
            elif new_status == "rejected" and not is_pending:
                return {
                    'success': False,
                    'msg': 'Dataset must be pending to reject'
                }

            return {'success': True}

    return {'success': False, 'msg': 'Not authorized to review dataset'}


def get_auth_functions():
    return {"group_create": group_create,
            "organization_create": organization_create,
            "group_show": group_show,
            "dataset_review": dataset_review,
            "package_update": package_update}
