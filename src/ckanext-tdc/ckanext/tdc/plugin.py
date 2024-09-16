import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit

import ckanext.tdc.logic.action as action
import ckanext.tdc.cli as cli

import json
import logging
log = logging.getLogger(__name__)


class TdcPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IActions)
    plugins.implements(plugins.IPackageController, inherit=True)
    plugins.implements(plugins.IClick, inherit=True)

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
                "package_search": action.package_search
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
        return data_dict

    # IClick
    def get_commands(self):
        return cli.get_commands()

