from ckan.plugins import toolkit as tk

import json
import os.path as path
import logging
log = logging.getLogger(__name__)


def get_un_geojson():
    cwd = path.abspath(path.dirname(__file__))
    filepath = path.join(cwd, "assets/UN_Geodata_simplified.geojson")
    with open(filepath) as f:
        geojson = json.load(f)
        return geojson


def get_un_regions():
    geojson = get_un_geojson()

    features = geojson["features"]
    regions = {}
    for feature in features:
        properties = feature["properties"]
        area_code = properties.get("geo_cd")
        m49_code = properties.get("m49_cd")
        title = properties.get("nam_en")
        object_id = properties.get("objectid")
        sts_code = properties.get("stscod")

        # 010 => Antarctica
        if title and m49_code != "010" and sts_code == 1:
            area_code = int(area_code)
            if area_code not in regions:
                regions[area_code] = {}
            regions[area_code][object_id] = feature

    return regions


TDC_REGIONS = {
        5: {"title": "South America", "name": "ame_s"},
        3: {"title": "North America", "name": "ame_n"},
        2: {"title": "Africa", "name": "afr"},
        142: {"title": "Asia", "name": "asi"},
        9: {"title": "Australia and Oceania", "name": "oce"},
        150: {"title": "Europe", "name": "eur"}
        }


def create_geography(data_dict):
    site_user = tk.get_action("get_site_user")({"ignore_auth": True}, {})
    priviliged_context = {"ignore_auth": True, "user": site_user["name"]}
    create_group_action = tk.get_action("group_create")
    # create_group_action = tk.get_action("group_delete")
    data_dict["type"] = "geography"
    # data_dict["id"] = data_dict["name"]
    create_group_action(priviliged_context, data_dict)


def create_region(m49_code):
    log.info("creating region {}".format(m49_code))
    tdc_region = TDC_REGIONS[m49_code]
    data_dict = {
            "name": tdc_region["name"],
            "title": tdc_region["title"],
            "geography_type": "region",
            "m49_code": m49_code
            }
    create_geography(data_dict)
    return tdc_region["title"]


def create_country(data_dict, region_m49):
    properties = data_dict["properties"]
    m49_code = properties["m49_cd"]
    iso3 = properties["iso3cd"]
    log.info("creating country {}".format(iso3))
    title = properties["nam_en"]
    region_name = TDC_REGIONS[region_m49]["name"]
    geography_shape = data_dict["geometry"]

    data_dict = {
            "name": iso3.lower(),
            "title": title,
            "geography_type": "country",
            "m49_code": m49_code,
            "groups": [{"name": region_name}],
            "geography_shape": geography_shape
            }
    create_geography(data_dict)
    return title


def create_default_tdc_geographies():
    regions = get_un_regions()

    south_america_m49 = 5
    north_america_m49 = 3

    _countries = {}
    for region_code in regions:
        # Americas must be split into South and North America
        if region_code == 19:
            create_region(south_america_m49)
            create_region(north_america_m49)
        else:
            create_region(region_code)

        countries = regions[region_code]
        for country_code in countries:
            country = countries[country_code]
            properties = country["properties"]
            _country_region_code = region_code
            if region_code == 19:
                int_region = properties.get("int_cd", -1)
                sub_region = properties.get("sub_cd", -1)
                # 5 => South America, otherwise => North America
                if int_region == south_america_m49 or sub_region == south_america_m49:
                    _country_region_code = south_america_m49
                else:
                    _country_region_code = north_america_m49

            new_country = create_country(country, _country_region_code)

            if _country_region_code not in _countries:
                _countries[_country_region_code] = []
            _countries[_country_region_code].append(new_country)

    log.info(_countries)
