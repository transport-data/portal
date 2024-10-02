import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit

import ckanext.tdc.logic.action as action
import ckanext.tdc.cli as cli
import ckanext.tdc.logic.auth as auth

import json
import logging
log = logging.getLogger(__name__)


class TdcPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IActions)
    plugins.implements(plugins.IPackageController, inherit=True)
    plugins.implements(plugins.IClick, inherit=True)
    plugins.implements(plugins.IAuthFunctions, inherit=True)

    # IConfigurer

    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_resource('fanstatic', 'tdc')

    # IActions

    def get_actions(self):
        return {
                "package_create": action.package_create,
                "package_update": action.package_update,
                "package_patch": action.package_patch,
                "package_search": action.package_search,
                "package_show": action.package_show,
                "group_list": action.group_list,
                "user_login": action.user_login,
                "invite_user_to_tdc": action.invite_user_to_tdc,
                "request_organization_owner": action.request_organization_owner,
                "request_new_organization": action.request_new_organization
                }

    # IPackageController

    def before_dataset_index(self, data_dict):
        # This is a fix so that solr stores a list
        # instead of a string for multivalued fields
        multi_value_extra_fields = [
                "topics",
                "geographies",
                "regions",
                "sectors",
                "modes",
                "services",
                "contributors"]
        for field in multi_value_extra_fields:
            value = data_dict.get(field, None)
            if value is not None and isinstance(value, str):
                new_value = json.loads(value)
                if isinstance(new_value, list):
                    data_dict[field] = new_value

        metadata_created = data_dict.get("metadata_created", None)
        if metadata_created:
            year = metadata_created[0:4]
            data_dict["metadata_created_year"] = year

            date = metadata_created[0:10]
            data_dict["metadata_created_date"] = date

        return data_dict

    # IClick

    def get_commands(self):
        return cli.get_commands()

    # IAuthFunctions:

    def get_auth_functions(self):
        return auth.get_auth_functions()
