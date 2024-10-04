# SDMX metadata structure compatibility

## CKAN metadata schema -> TDCI metadata sctructure

The TDC CKAN extension uses the metadata schema defined in the [metadata schema documentation](../metadata-schema).

In order to see some examples of datasets metadata using this metadata schema, check out:

https://ckan.tdc.dev.datopian.com/api/action/package_search

> [!tip]
> Note that an individual dataset's metadata can be fetched with the [package_show endpoint](https://docs.ckan.org/en/2.11/api/#ckan.logic.action.get.package_show).

### Mapping

Based on the TDCI metadata structure, defined at https://github.com/transport-data/tools/pull/21/files#diff-a920973cf3c3bdb7578f9a3e8784fb624988297308cd07162659a7da2dceb014, the CKAN dataset metadata schema fields are sufficient and compatible for conversion to the TDCI metadata structure. See list below:

_TDCI MS -> CKAN_

- `DATAFLOW` -> `id`
- `DATA_PROVIDER` -> `data_provider`
- `URL` -> `url`
- `MEASURE` -> `indicators`
- `UNIT_MEASURE` -> `units`
- `DIMENSION`
    - `REF_AREA` -> `geographies`
    - `MODE` -> `modes`
    - `SERVICE` -> `services`
    - `TIME_PERIOD` -> `temporal_coverage_start` and `temporal_coverage_end`
- `DATA_DESCR`
    - `Data access` -> `data_access`
    - `Update frequency` -> `frequency`
    - `Primary source` -> `sources`
    - `Description` -> `notes`
- `COMMENT` -> `comments`

### Manual conversion

The conversion from CKAN dataset metadata schema to TDCI metadata structure can be handled externally by fetching the dataset's metadata from CKAN.

For that, use the CKAN API, documented at: https://docs.ckan.org/en/2.11/api/

The two main endpoints for fetching datasets metadata are:

- (`package_search`)[https://docs.ckan.org/en/2.11/api/#ckan.logic.action.get.package_search]
    - Search for CKAN datasets, optionally based on filters
- (`package_show`)[https://docs.ckan.org/en/2.11/api/#ckan.logic.action.get.package_show]
    - Pass an `?id=` parameter to the URL and retrieve the metadata for a single dataset

The result for a dataset's metadata will look like the following:

_*NOTE:*_ this example uses dummy data

```json
{
  "help": "https://ckan.tdc.dev.datopian.com/api/3/action/help_show?name=package_show",
  "success": true,
  "result": {
    "author": null,
    "author_email": null,
    "contributors": [
      "915d5a92-9c0d-41a8-a8e8-d36a890ea462"
    ],
    "creator_user_id": "915d5a92-9c0d-41a8-a8e8-d36a890ea462",
    "data_access": "provider",
    "data_provider": "provider",
    "dimensioning": "dimensioning",
    "frequency": "biannually",
    "geographies": [
      "ago"
    ],
    "id": "3210b02a-4ce4-4aea-a969-c8a22b489f73",
    "indicators": [
      "indicator"
    ],
    "is_archived": false,
    "isopen": true,
    "language": "aa",
    "license_id": "GFDL-1.3-no-cover-texts-no-invariant-sections",
    "license_title": "GNU Free Documentation License 1.3 with no cover texts and no invariant sections",
    "license_url": "http://www.opendefinition.org/licenses/gfdl",
    "maintainer": null,
    "maintainer_email": null,
    "metadata_created": "2024-10-02T12:38:25.719989",
    "metadata_modified": "2024-10-02T12:38:25.719993",
    "modes": [
      "walking"
    ],
    "name": "my-dataset-qa",
    "notes": "<p>x</p>",
    "num_resources": 2,
    "num_tags": 0,
    "organization": {
      "id": "3d5427b5-9f38-4091-838c-fdb1925f0cd5",
      "name": "sample-org",
      "title": "Sample Org",
      "type": "organization",
      "description": "",
      "image_url": "",
      "created": "2024-08-27T09:37:29.593640",
      "is_organization": true,
      "approval_status": "approved",
      "state": "active"
    },
    "overview_text": "<p>x</p>",
    "owner_org": "3d5427b5-9f38-4091-838c-fdb1925f0cd5",
    "private": false,
    "regions": [
      "afr"
    ],
    "related_datasets": [],
    "sectors": [
      "road"
    ],
    "services": [
      "passenger"
    ],
    "state": "active",
    "tdc_category": "public",
    "temporal_coverage_end": "2024-10-16",
    "temporal_coverage_start": "2024-10-02",
    "title": "my dataset qa",
    "topics": [
      "my-child-topic",
      "my-topic"
    ],
    "type": "dataset",
    "units": [
      "tonnes"
    ],
    "url": "https://google.com",
    "version": null,
    "comments": [
      {
        "comment": "comment",
        "date": "2024-10-02T12:37:02.277Z",
        "initials": "lm"
      }
    ],
    "groups": [
      {
        "description": "",
        "display_name": "Africa",
        "id": "e8b98dc1-6fa2-4652-ad47-f7e3fef7d78e",
        "image_display_url": "",
        "name": "afr",
        "title": "Africa"
      },
      {
        "description": "",
        "display_name": "Angola",
        "id": "bbe23ff6-3e11-4418-80d3-59cc4e2e8015",
        "image_display_url": "",
        "name": "ago",
        "title": "Angola"
      },
      {
        "description": "testing",
        "display_name": "my child topic",
        "id": "488d9ee7-ba2f-4ba7-9933-a5d53680d641",
        "image_display_url": "https://ckan.tdc.dev.datopian.com/uploads/group/screenshot-from-2024-09-17-08-22-12-zklmuw.png",
        "name": "my-child-topic",
        "title": "my child topic"
      },
      {
        "description": "xxxxxxx",
        "display_name": "My topic",
        "id": "40553432-2cd0-45a6-8d54-05e54e828b05",
        "image_display_url": "https://ckan.tdc.dev.datopian.com/uploads/group/screenshot-from-2024-09-17-08-22-12-nzisns.png",
        "name": "my-topic",
        "title": "My topic"
      }
    ],
    "resources": [
      {
        "cache_last_updated": null,
        "cache_url": null,
        "created": "2024-10-02T12:38:25.721804",
        "datastore_active": false,
        "description": null,
        "format": "PNG",
        "hash": "",
        "id": "fab823ee-055e-4376-ad1d-4f7409313ba1",
        "last_modified": null,
        "metadata_modified": "2024-10-02T12:38:25.712569",
        "mimetype": null,
        "mimetype_inner": null,
        "name": "Screenshot from 2024-10-02 08-43-56.png",
        "package_id": "3210b02a-4ce4-4aea-a969-c8a22b489f73",
        "position": 0,
        "resource_type": "data",
        "size": 30069,
        "state": "active",
        "type": "data",
        "url": "https://ckan.tdc.dev.datopian.com/dataset/3210b02a-4ce4-4aea-a969-c8a22b489f73/resource/fab823ee-055e-4376-ad1d-4f7409313ba1/download/screenshot-from-2024-10-02-08-43-56.png",
        "url_type": "upload"
      },
      {
        "cache_last_updated": null,
        "cache_url": null,
        "created": "2024-10-02T12:38:25.721808",
        "datastore_active": false,
        "description": null,
        "format": "PNG",
        "hash": "",
        "id": "76831bd8-25ae-4e8a-ad0e-3001f41b1978",
        "last_modified": null,
        "metadata_modified": "2024-10-02T12:38:25.713688",
        "mimetype": null,
        "mimetype_inner": null,
        "name": "Screenshot from 2024-10-02 08-43-56.png",
        "package_id": "3210b02a-4ce4-4aea-a969-c8a22b489f73",
        "position": 1,
        "resource_type": "documentation",
        "size": 30069,
        "state": "active",
        "type": "documentation",
        "url": "https://ckan.tdc.dev.datopian.com/dataset/3210b02a-4ce4-4aea-a969-c8a22b489f73/resource/76831bd8-25ae-4e8a-ad0e-3001f41b1978/download/screenshot-from-2024-10-02-08-43-56.png",
        "url_type": "upload"
      }
    ],
    "sources": [
      {
        "title": "source",
        "url": "https://google.com"
      }
    ],
    "tags": [],
    "relationships_as_subject": [],
    "relationships_as_object": []
  }
}
```

With the response above, one could manually convert the metadata to any other metadata structure.

### CKAN conversion endpoint

To enable the automatic conversion from CKAN, the `package_show` endpoint has been customized so that the CKAN metadata can be retrieved as TDCI metadata structure without the need for further transformations.

#### Usage

In order to retrieve converted metadata, simply append `&output_format=tdci-sdmx` to the `package_show` query.

Example:

http://ckan.com/api/3/action/package_show?id=my-dataset&output_format=tdci-sdmx

Response example:

```json
{
  "help": "http://ckan-dev:5000/api/3/action/help_show?name=package_show",
  "success": true,
  "result": {
    "COMMENT": "JD\n2024/01/01\nI changed this thing\n\n",
    "DATA_PROVIDER": "testing",
    "DATAFLOW": "2b688a14-c743-42da-b902-be27769890be",
    "DATA_DESCR": "- Data access: publicly available\n- Update frequency: annually\n- Primary source: Awesome Datasets\n- Example description",
    "DIMENSION": "- REF_AREA (AR; BR)\n- MODE (two-three-wheelers)\n- SERVICE (passenger)\n- TIME_PERIOD (2000-01-01 to 2000-01-01)\n",
    "MEASURE": "indicator 1; indicator 2",
    "UNIT_MEASURE": "tonnes; km/h",
    "URL": "http://google.com"
  }
}

```

#### Extending the metadata schema

First of all, the CKAN metadata schema can be extended/updated by changing the schema yaml file found at https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml

> [!tip]
> See https://github.com/datopian/ckanext-scheming for more info on how the yaml file works

Note that if a new field is added, the frontend UI still has to be updated in order to reflect new fields on a few pages, such as dataset create, edit and read pages, but it works out-of-the-box with API endpoints.

#### Extending the converter

First of all, clode the `tdc-data-portal` repo and follow the README instructions to get a local environemtn up and running.

The current conversion rules can be found at https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/conversions/tdci_sdmx.py

In this class, different attributes are defined with the `@attribute(attribute_name)` decorator.

Any function decorated with `@attribute(attribute_name)` will have its returning value mapped to the respective `attribute_name` on the `package_show?id=my-id&output_format=tdci-sdmx` response.

While working with the attributes, to get a CKAN dataset metadata field value, use `self.data_dict.get('field_name')`.

For example, in order to add a new "DUMMY" field that will return the CKAN dataset's id:

```python
@attribute("DUMMY") # => How it will look like on the response
def get_dummy(self):
    return self.data_dict.get("id") # `data_dict` is the CKAN dataset metadata
```

## CKAN metadata schema -> ESMS

Based on the `MetadataStructureDefinitions`.

For the rest of the `MetadataAttribute` that are not listed below, a direct correspondence was not found.

_ESMS (`MetadataAttribute.conceptRef`) -> CKAN_

- `DATAFLOW` -> Could be `id` but can may be customized in a different way.
- `DATA_PROVIDER` -> `data_provider`
- `TIME_PERIOD` -> `temporal_coverage_start` and `temporal_coverage_end`
- `CONTACT_ORGANISATION` -> `organization.title`
- `CONTACT_NAME` -> N/A - Maybe: creator name, organization name
- `CONTACT_EMAIL` -> `organization.email`
- `META_UPDATE` -> `metadata_updated` or `metadata_created`
- `META_LAST_UPDATE` - `metadata_created`
- `DATA_DESCR` - `notes` + Combinaton of other fields, as done on the TDCI metadata structure conversion
- `COVERAGE_SECTOR` -> `sectors`
- `REF_AREA` -> `geographies` and/or `regions`
- `UNIT_MEASURE` -> `units`
- `REF_PERIOD` -> `temporal_coverage_start` and `temporal_coverage_end`
- `COMMENT_DSET` -> `comments`
