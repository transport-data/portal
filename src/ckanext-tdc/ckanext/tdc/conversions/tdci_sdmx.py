import logging
from ckanext.tdc.conversions.base import BaseConverter, attribute
from ckan.plugins import toolkit as tk

log = logging.getLogger(__name__)


class TdciConverter(BaseConverter):
    def __init__(self, data_dict):
        super().__init__(data_dict)

    @attribute("DATAFLOW")
    def get_dataflow(self):
        # TODO: see guidelines for DATAFLOW
        # https://github.com/transport-data/tools/pull/21/files#diff-a920973cf3c3bdb7578f9a3e8784fb624988297308cd07162659a7da2dceb014R21
        # Should there be a custom id convention for datasets that
        # come from CKAN?
        return self.data_dict.get("id")

    @attribute("DATA_PROVIDER")
    def get_data_provider(self):
        data_provider = self.data_dict.get("data_provider")
        return data_provider

    @attribute("URL")
    def get_url(self):
        url = self.data_dict.get("url")
        return url

    @attribute("MEASURE")
    def get_measure(self):
        indicators = self.data_dict.get("indicators", [])
        if isinstance(indicators, list):
            return "; ".join(indicators)
        if isinstance(indicators, str):
            return indicators

    @attribute("UNIT_MEASURE")
    def get_units(self):
        units = self.data_dict.get("units")
        if isinstance(units, list):
            return "; ".join(units)
        if isinstance(units, str):
            return units
        return 1

    @attribute("DIMENSION")
    def get_dimensions(self):
        dimensions = {}

        # REF_AREA
        geographies = self.data_dict.get("geographies")
        if geographies:
            priviliged_context = {"ignore_auth": True}
            group_list_action = tk.get_action("group_list")
            group_list_data_dict = {"groups": geographies,
                                    "type": "geography",
                                    "include_extras": True,
                                    "all_fields": True}
            group_list = group_list_action(priviliged_context, group_list_data_dict)
            geographies_iso2 = list(map(lambda x: x.get("iso2"), group_list))

            dimensions["REF_AREA"] = geographies_iso2

        # MODE
        modes = self.data_dict.get("modes")
        if modes:
            dimensions["MODE"] = modes

        # SERVICE
        service = self.data_dict.get("services")
        if service:
            dimensions["SERVICE"] = service

        # TIME_PERIOD
        temporal_coverage_start = self.data_dict.get("temporal_coverage_start")
        temporal_coverage_end = self.data_dict.get("temporal_coverage_end")
        if temporal_coverage_start:
            dimensions["TIME_PERIOD"] = temporal_coverage_start
            if temporal_coverage_end:
                dimensions["TIME_PERIOD"] += " to {}".format(temporal_coverage_end)

        dimensions_txt = ""
        for key in dimensions:
            value = dimensions[key]
            if value:
                value_txt = value
                if isinstance(value, list):
                    value_txt = "; ".join(dimensions[key])
                dimensions_txt += "- {} ({})\n".format(key, value_txt)

        return dimensions_txt

    @attribute("DATA_DESCR")
    def get_description(self):
        description = {}

        data_access = self.data_dict.get("data_access")
        if data_access:
            description["Data access"] = data_access

        frequency = self.data_dict.get("frequency")
        if frequency:
            description["Update frequency"] = frequency

        primary_sources = self.data_dict.get("sources")
        if primary_sources:
            description["Primary source"] = list(map(lambda x: x.get("title"), primary_sources))

        notes = self.data_dict.get("notes")

        description_txt = ""
        for key in description:
            value = description[key]
            if value:
                value_txt = value
                if isinstance(value, list):
                    value_txt = ", ".join(description[key])
                description_txt += "- {}: {}\n".format(key, value_txt)

        if description:
            description_txt += "- {}".format(notes)

        return description_txt

    @attribute("COMMENT")
    def get_comments(self):
        comments = self.data_dict.get("comments")
        comments_str = ""

        if comments:
            for comment in comments:
                comments_str += comment.get("initials") + "\n"
                comments_str += comment.get("date") + "\n"
                comments_str += comment.get("comment") + "\n"
                comments_str += "\n"

        return comments_str
