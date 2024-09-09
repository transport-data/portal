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
    geography_names = data_dict.get("geographies", None)

    if geography_names is not None and len(geography_names) > 0:
        countries = []
        regions = []

        priviliged_context = {"ignore_auth": True}

        group_list_action = tk.get_action("group_list")
        group_list_data_dict = {
                "type": "geography",
                "groups": geography_names,
                "include_extras": True,
                "all_fields": True,
                "include_groups": True
                }
        group_list = group_list_action(priviliged_context, group_list_data_dict)

        for group in group_list:
            geography_type = group.get("geography_type")
            if geography_type == "country":
                group_name = group.get("name")
                parent_groups = group.get("groups")
                region_names = list([x.get("name") for x in parent_groups])

                countries.append(group_name)
                regions.extend(region_names)

        countries = list(set(countries))
        regions = list(set(regions))

        geography_groups = [{"name": x, "type": "geography"} for x in countries + regions]
        groups = data_dict.get("groups", [])
        groups += geography_groups
        data_dict["groups"] = groups
        data_dict["geographies"] = countries
        data_dict["regions"] = regions


@tk.chained_action
def package_create(up_func, context, data_dict):
    _fix_geographies_field(data_dict)
    _fix_topics_field(data_dict)
    result = up_func(context, data_dict)
    return result


@tk.chained_action
def package_update(up_func, context, data_dict):
    _fix_geographies_field(data_dict)
    _fix_topics_field(data_dict)
    result = up_func(context, data_dict)
    return result


@tk.chained_action
def package_patch(up_func, context, data_dict):
    _fix_geographies_field(data_dict)
    _fix_topics_field(data_dict)
    result = up_func(context, data_dict)
    return result


@tk.chained_action
@tk.side_effect_free
def package_search(up_func, context, data_dict):
    include_archived_param = data_dict.get("include_archived", "false")
    include_archived = tk.asbool(include_archived_param)

    if not include_archived:
        if "fq" not in data_dict:
            data_dict["fq"] = ""

        data_dict["fq"] += " -is_archived:(true)"

    if "include_archived" in data_dict:
        del data_dict["include_archived"]

    result = up_func(context, data_dict)
    return result
