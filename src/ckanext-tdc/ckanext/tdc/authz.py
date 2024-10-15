import ckan.authz as authz


def is_org_admin_or_sysadmin(org_id, user_id):
    return authz.has_user_permission_for_group_or_org(
            org_id,
            user_id,
            'membership')
