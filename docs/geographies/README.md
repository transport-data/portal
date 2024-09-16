# Geographies

Geographies are custom CKAN groups that can be either `regions` or `countries`. You can learn more about the `geography` entity at [the metadata schema docs](../metadata-schema#entities).

The default countries and regions for this instance are based on the United Nations geoscheme.

## Seed default geographies

In order to seed an instance with the default countries and regions, run the following CLI command:

```bash
ckan -c ckan.ini create-default-geographies

```
