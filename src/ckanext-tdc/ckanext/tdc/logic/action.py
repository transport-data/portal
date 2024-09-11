from ckan.plugins import toolkit as tk

import logging
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
        group_list = group_list_action(priviliged_context, group_list_data_dict)

        topic_groups = [{"name": x.get("name"), "type": "topic"} for x in group_list]
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

    has_geographies = isinstance(geography_names, list) and len(geography_names) > 0
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
        group_list = group_list_action(priviliged_context, group_list_data_dict)

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

        geography_groups = [{"name": x, "type": "geography"} for x in countries + regions]
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
        old_data_dict = package_show_action(priviliged_context, package_show_data_dict)
        old_contributors = old_data_dict.get("contributors")
        new_contributors = list(set(old_contributors + [current_user_id]))

        data_dict["contributors"] = new_contributors

        return new_contributors

    data_dict["contributors"] = [current_user_id]


@tk.chained_action
def package_create(up_func, context, data_dict):
    _fix_geographies_field(data_dict)
    _fix_topics_field(data_dict)
    _update_contributors(data_dict)
    result = up_func(context, data_dict)
    return result


@tk.chained_action
def package_update(up_func, context, data_dict):
    _fix_geographies_field(data_dict)
    _fix_topics_field(data_dict)
    _update_contributors(data_dict, is_update=True)
    result = up_func(context, data_dict)
    return result


@tk.chained_action
def package_patch(up_func, context, data_dict):
    _fix_geographies_field(data_dict)
    _fix_topics_field(data_dict)
    _update_contributors(data_dict, is_update=True)
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
        custom_group_types_in_facets = list(filter(lambda x: x in custom_group_types, search_facets))
        custom_group_facets = [search_facets[x] for x in custom_group_types_in_facets]

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
                group_list = group_list_action(priviliged_context, group_list_data_dict)

                for facet in custom_group_facets:
                    for item in facet["items"]:
                        item_name = item.get("name")
                        group = list(filter(lambda x: x.get("name") == item_name, group_list))
                        if len(group) > 0:
                            group = group[0]
                            group_display_name = group.get("display_name")
                            group_title = group.get("title")
                            item["display_name"] = group_display_name or group_title or item_name


@tk.chained_action
@tk.side_effect_free
def package_search(up_func, context, data_dict):
    _control_archived_datasets_visibility(data_dict)
    result = up_func(context, data_dict)
    _add_display_name_to_custom_group_facets(result)
    return result
