import ckan.authz as authz
from ckan.common import _


def group_create(context, data_dict):
    user = context['user']
    user = authz.get_user_id_for_username(user, allow_none=True)

    return {'success': False,
            'msg': _('User %s not authorized to create groups') % user}


def organization_create(context, data_dict):
    user = context['user']
    user = authz.get_user_id_for_username(user, allow_none=True)

    return {'success': False,
            'msg': _('User %s not authorized to create organizations') % user}


def get_auth_functions():
    return {"group_create": group_create,
            "organization_create": organization_create}
