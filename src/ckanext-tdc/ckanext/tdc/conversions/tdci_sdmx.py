import logging
from ckanext.tdc.conversions.base import BaseConverter, attribute

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
        # TODO: I think this should be a separate field. e.g. Our World in Data
        sources = self.data_dict.get("sources", [])
        log.error(sources)
        if len(sources) > 0:
            return sources[-1].get("title")
        return None

    @attribute("URL")
    def get_url(self):
        # TODO: I think this should be a separate field. e.g. ourworldindata.com
        sources = self.data_dict.get("sources", [])
        if len(sources) > 0:
            return sources[-1].get("url")
        return None

    @attribute("MEASURE")
    def get_measure(self):
        # TODO: indicator possibly should be multiple values
        # TODO: unit and measure should be combined
        return self.data_dict.get("indicator")

    @attribute("UNIT_MEASURE")
    def get_units(self):
        units = self.data_dict.get("units")
        if isinstance(units, list):
            return ", ".join(units)
        if isinstance(units, str):
            return units

    @attribute("DATA_DESCR")
    def get_description(self):
        # TODO: add primary sources
        # TODO: add data access (?)
        # TODO: add frequency
        # frequency = self.data_dict.get("frequency")
        description = self.data_dict.get("notes")
        return description

    # TODO: comments
