from ckanext.s3filestore.uploader import S3Uploader
from ckan.common import config

from ckan.plugins import toolkit as tk
import ckan.logic as logic

import json
import os.path as path
import logging
import requests
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
    update_group_action = tk.get_action("group_update")
    show_group_action = tk.get_action("group_show")
    data_dict["type"] = "geography"

    group_exists = True
    try:
        show_group_action(priviliged_context, {"id": data_dict["name"]})
    except logic.NotFound:
        group_exists = False

    if not group_exists:
        create_group_action(priviliged_context, data_dict)
    else:
        log.info("{} already exists. Updating it.".format(data_dict["name"]))
        data_dict["id"] = data_dict["name"]
        update_group_action(priviliged_context, data_dict)


def delete_geography(data_dict):
    site_user = tk.get_action("get_site_user")({"ignore_auth": True}, {})
    priviliged_context = {"ignore_auth": True, "user": site_user["name"]}
    delete_group_action = tk.get_action("group_delete")
    purge_group_action = tk.get_action("group_purge")
    data_dict["type"] = "geography"
    data_dict["id"] = data_dict["name"]
    delete_group_action(priviliged_context, data_dict)
    purge_group_action(priviliged_context, data_dict)


def create_region(m49_code):
    tdc_region = TDC_REGIONS[m49_code]
    data_dict = {
            "name": tdc_region["name"],
            "title": tdc_region["title"],
            "geography_type": "region",
            "m49_code": m49_code
            }
    return data_dict


def upload_country_flag(iso2):
    r = requests.get("https://flagsapi.com/{}/flat/64.png".format(iso2), stream=True)
    r.raise_for_status()

    upload_to = "group"
    filestore = S3Uploader(upload_to)
    bucket_name = filestore.bucket_name
    bucket = filestore.get_s3_bucket(bucket_name)
    storage_path = filestore.storage_path
    filename = "{}.png".format(iso2)
    key = "{}/{}".format(storage_path, filename)
    site_url = config.get("ckan.site_url")

    try:
        bucket.upload_fileobj(r.raw, key, ExtraArgs={"ACL": "public-read", "ContentType": "image/png"})
        log.info("Successfully uploaded {0} to S3!".format(key))
        return "{}/uploads/{}/{}".format(site_url, upload_to, filename)
    except Exception as e:
        log.error('Something went very very wrong for {0}'.format(str(e)))
        raise e


def create_country(data_dict, region_m49):
    properties = data_dict["properties"]
    m49_code = properties["m49_cd"]
    iso3 = properties["iso3cd"]
    iso2 = properties["iso2cd"]
    title = properties["nam_en"]
    region_name = TDC_REGIONS[region_m49]["name"]
    geography_shape = data_dict["geometry"]

    image_url = upload_country_flag(iso2)

    data_dict = {
            "name": iso3.lower(),
            "title": title,
            "geography_type": "country",
            "m49_code": m49_code,
            "groups": [{"name": region_name}],
            "geography_shape": geography_shape,
            "iso2": iso2,
            "image_url": image_url
            }

    return data_dict


def get_default_tdc_geographies():
    regions = get_un_regions()

    south_america_m49 = 5
    north_america_m49 = 3

    geographies = []
    for region_code in regions:
        # Americas must be split into South and North America
        if region_code == 19:
            geographies.append(create_region(south_america_m49))
            geographies.append(create_region(north_america_m49))
        else:
            geographies.append(create_region(region_code))

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
            geographies.append(new_country)
    return geographies


def create_default_tdc_geographies():
    geographies = get_default_tdc_geographies()
    for geography in geographies:
        create_geography(geography)


def delete_default_tdc_geographies():
    geographies = get_default_tdc_geographies()
    for geography in geographies:
        delete_geography(geography)


def list_default_tdc_geographies():
    geographies = get_default_tdc_geographies()
    for geography in geographies:
        if "geography_shape" in geography:
            del geography["geography_shape"]

    log.info(json.dumps(geographies))
