import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit

import ckanext.tdc.logic.action as action
import ckanext.tdc.cli as cli
import ckanext.tdc.logic.auth as auth
import ckanext.tdc.activity as activity
from ckanext.tdc.subscriptions import get_subscriptions
import ckanext.tdc.logic.validators as validators

import json
import logging

log = logging.getLogger(__name__)


class TdcPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IActions)
    plugins.implements(plugins.IPackageController, inherit=True)
    plugins.implements(plugins.IClick, inherit=True)
    plugins.implements(plugins.IAuthFunctions, inherit=True)
    plugins.implements(plugins.IValidators)
    plugins.implements(plugins.ISignal)

    # IConfigurer

    def update_config(self, config_):
        toolkit.add_template_directory(config_, "templates")
        toolkit.add_public_directory(config_, "public")
        toolkit.add_resource("fanstatic", "tdc")

    def get_validators(self):
        # we require this to so the frontend can specify an id and make resource uploads work
        # resource uploads are done directly in the browser so we need the id to upload to the right location
        # usually we could update the create_package_schema to remove the validator but for some reason that didnt work
        def empty_if_not_sysadmin(key, data, errors, context):
            return

        return {
            "empty_if_not_sysadmin": empty_if_not_sysadmin,
            "object_id_validator": validators.object_id_validator,
            "activity_type_exists": validators.activity_type_exists
        }

    # IActions

    def get_actions(self):
        return {
            "package_create": action.package_create,
            "package_delete": action.package_delete,
            "package_update": action.package_update,
            # "package_patch": action.package_patch,
            "package_search": action.package_search,
            "package_show": action.package_show,
            "group_list": action.group_list,
            "user_login": action.user_login,
            "invite_user_to_tdc": action.invite_user_to_tdc,
            "request_organization_owner": action.request_organization_owner,
            "request_new_organization": action.request_new_organization,
            "tdc_dashboard_activity_list": activity.dashboard_activity_list_action,
            "dataset_approval_update": action.dataset_approval_update,
            "user_following_groups": action.user_following_groups
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
            "related_datasets",
            "services",
            "contributors",
        ]
        for field in multi_value_extra_fields:
            value = data_dict.get(field, None)
            if value is not None and isinstance(value, str):
                new_value = json.loads(value)
                if isinstance(new_value, list):
                    data_dict[field] = new_value

        metadata_created = data_dict.get("metadata_created", None)
        if metadata_created:
            date = metadata_created[0:10]
            data_dict["metadata_created_date"] = date

        return data_dict

    # IClick

    def get_commands(self):
        return cli.get_commands()

    # IAuthFunctions:

    def get_auth_functions(self):
        return auth.get_auth_functions()

    def is_fallback(self):
        # Return True to register this plugin as the default handler for
        # package types not handled by any other IDatasetForm plugin.
        return True

    def package_types(self) -> list[str]:
        # This plugin doesn't handle any special package types, it just
        # registers itself as the default (above).
        return []

    # ISignal

    def get_signal_subscriptions(self):
        return get_subscriptions()
