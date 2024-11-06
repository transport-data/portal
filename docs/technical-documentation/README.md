<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Technologies used](#technologies-used)
- [How to run and build the project](#how-to-run-and-build-the-project)
- [How to contact support](#how-to-contact-support)
- [How to report issues](#how-to-report-issues)
- [How to keep updated with the next features](#how-to-keep-updated-with-the-next-features)
- [How the portal works](#how-the-portal-works)
    - [Home page](#home-page)
    - [Partners page](#partners-page)
    - [Datasets' browse page](#datasets-browse-page)
    - [Geography page](#geography-page)
    - [Datasets page](#datasets-page)
    - [About Us page](#about-us-page)
    - [Events page](#events-page)
    - [FAQ page](#faq-page)
    - [Dashboard - Newsfeed page](#dashboard---newsfeed-page)
    - [Dashboard - My Datasets page](#dashboard---my-datasets-page)
    - [Dashboard - My Organisation page](#dashboard---my-organisation-page)
    - [Dashboard - Topics page](#dashboard---topics-page)
    - [Dashboard - Organizations page](#dashboard---organizations-page)
    - [Dashboard - Datasets Approvals page](#dashboard---datasets-approvals-page)
    - [Add Dataset page](#add-dataset-page)
    - [Edit Dataset page](#edit-dataset-page)
    - [Dataset Details page](#dataset-details-page)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Technologies used

The technologies used in this project and their documentation to maintain the project are [CKAN](https://docs.ckan.org/en/2.11/) as backend, [Next.js](https://nextjs.org/docs) for the frontend application, [MarkdownDB](https://github.com/datopian/markdowndb?tab=readme-ov-file#markdowndb)  for rendering static pages based on the markdown format, [Apache Solr](https://solr.apache.org/guide/solr/latest/getting-started/introduction.html) to index the packages and allow the users to make queries on the data faster, Docker to containerize the CKAN, and Solr.

## How to run and build the project

To start the project locally, we use `npm run dev`, and to generate a production build, we use `npm run build`.

## How to contact support

To contact the support you can reach out to the support@datopian.com email.

## How to report issues

To report any issues you can use the [issues tab of the project](https://github.com/transport-data/tdc-data-portal/issues/new/choose)

## How to keep updated with the next features

To keep updated with the next features you can access the [issues section](https://github.com/transport-data/tdc-data-portal/issues)

## How the portal works

#### Home page

The search bar of this page uses the [CKAN `package_search` endpoint to get all the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) and filters them using the `fq` param to search using the Solr engine, the fields used in the component are present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml), and it always limits by 5 results using the `rows` field.

The datasets section of this page uses the [CKAN `package_search` endpoint to get all the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search), and it always limits by 6 results using the `rows` field.

The testimonials section of this page uses the [MarkdownDB](https://github.com/datopian/markdowndb?tab=readme-ov-file#markdowndb), you can take a look in this [doc](https://github.com/transport-data/tdc-data-portal/blob/main/docs/static-pages/testimonials/README.md) for information of how to add or remove people on the page.

#### Onboarding page

The first step of this page uses the [`follow_group endpoint`](https://ckan.tdc.dev.datopian.com/api/3/action/follow_group) to follow the [locations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/geography.yaml), [topics](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml), and [organizations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml) (the three are treated as groups under the hood to CKAN). When a user follows a group the application will present the activities related to this group on the newsfeed tab.

#### Partners page

To update any partner present on this page you can access [this file](https://github.com/transport-data/tdc-data-portal/blob/main/frontend/src/data/partners.json) and edit it.

#### Datasets' browse page

It uses the [CKAN package search endpoint to get all the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search). It filters them using the `fq` param to search using the Solr engine the fields you can use to filter the data are present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml), and its pagination is made using the `offset` and `rows` parameters.

e.g.: https://ckan.tdc.dev.datopian.com/api/3/action/package_search?fq=name:teet-test-2

#### Geography page

We have created a CKAN CLI command to generate countries on the DMS based on the GeoJSON provided by UNECE, these geographies are created as a customized group called [geography](https://github.com/transport-data/tdc-data-portal/tree/main/docs/metadata-schema#geography), if the geography is a country we add the country flag as the image of the group, and we store the GeoJSON which maps the area of the country. We also created one command to erase all these generated countries, and another to list them you can see all the available commands related to the geographies here in this doc [these docs](https://github.com/transport-data/tdc-data-portal/blob/main/docs/geographies/README.md#commands), pointing out that you need to access the CKAN instance via SSH to run these commands via terminal.

To present the data on the map we get all the countries available on the DMS by using [the `group_list` endpoint with these parameters](https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=geography&include_shapes=true&limit=350), and as they are groups we have the `package_count` field created by default from CKAN for groups, this field is a counting field that counts all the packages/datasets that have these groups linked with them, and we present this counting when the users' cursor hovers on the country.

#### Datasets page

The search bar of this page uses the [CKAN `package_search` endpoint to get all the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) and filters them using the `fq` param to search using the Solr engine, the fields used in component are present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml), and it always limits by 5 results.

To present each card on this page we get all the [topics](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml) (a group in CKAN terminology) available using the [`group_list` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=topic&limit=350) and list their datasets, the Most Viewed and TDC Harmonized cards are different cases, the Most Viewed use the google analytics data to present the most viewed datasets, and the TDC Harmonized is using the [`package_search`](https://ckan.tdc.dev.datopian.com/api/3/action/package_search?fq=tdc_category:tdc_harmonized&rows=10) endpoint filtering by the datasets which have the TDC Harmonized category and limiting them by 10.

#### About Us page

This page utilizes the [MarkdownDB](https://github.com/datopian/markdowndb?tab=readme-ov-file#markdowndb) to render the people behind the TDC section, you can take a look in this [doc](https://github.com/transport-data/tdc-data-portal/tree/main/docs/static-pages/people/README.md) for information of how to add or remove people on the page.

#### Events page

This page utilizes the [MarkdownDB](https://github.com/datopian/markdowndb?tab=readme-ov-file#markdowndb) to render the events, you can take a look in this [doc](https://github.com/transport-data/tdc-data-portal/tree/main/docs/static-pages/events/README.md) for information of how to add or remove events on the page.

#### FAQ page

This page utilizes the [MarkdownDB](https://github.com/datopian/markdowndb?tab=readme-ov-file#markdowndb) to render the frequently asked questions, you can take a look in this [doc](https://github.com/transport-data/tdc-data-portal/blob/main/docs/static-pages/faq/README.md) for information of how to add or remove events on the page.

#### Dashboard - Newsfeed page

This tab uses the [customized `tdc_dashboard_activity_list` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/tdc_dashboard_activity_list) which returns all the data that the signed-in user follows from geographies, datasets, topics, and organizations.

#### Dashboard - My Datasets page

This page uses the [CKAN `package_search` endpoint to get all the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) and filters them using the `fq` param to search using the Solr engine, it filters just the user's datasets sending the user id in the `creator_user_id` field, the other fields used in this page are present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml), and its pagination is made using the `offset` and `rows` parameters

#### Dashboard - My Organisation page

This page uses the [CKAN `package_search` endpoint to get all the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) and filters them using the `fq` param to search using the Solr engine, it filters just the user's organizations datasets sending the organizations ids which the user belongs to in the `organization` field, the other fields used in this page are present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml), and its pagination is made using the `offset` and `rows` parameters

#### Dashboard - Topics page

This page is accessible just for sys admins users, to present the data of this page we get all the [topics](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml) (a group in CKAN terminology) available using the [`group_list` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=topic&limit=350) and use the `package_count` field of the group to present the number of datasets linked to the topic.

To the creation flow by clicking in the `+ Add New` button we use the [`group_create`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.create.group_create) endpoint using the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml) being mandatory send an extra field named `type` with a string `topic` in the request, if you want to add parents topics to this topic you can send one more extra field called `groups` with an array of objects with the `name` of the parent group inside.

e.g.:

```json
{
  "type": "topic",
  "name": "topic name",
  "title": "topic title",
  "notes": "topic description",
  "url": "URL with the image of the topic",
  "groups": [{ "name": "name of the parent topic if wanted" }]
}
```

To the edit flow by clicking on a topic card we use the [`group_edit`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.edit.group_edit) endpoint using the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml) being mandatory send an extra field named `type` with a string `topic` in the request, if you want to add or remove parents topics from this topic you can send one more extra field called `groups` with an array of objects with the `name` of the parent group inside.

To delete a topic we use the [`group_delete`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.delete.group_delete) endpoint and send the id of the topic to be deleted.

#### Dashboard - Organizations page

To present the data of this page we get all the [organizations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml) available using the [`organization_list_for_user` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/organization_list_for_user?include_dataset_count=true&limit=1000) and use the `package_count` field of the group to present the number of datasets linked to the topic.

To the creation flow the user must be a sys admin and click on the `+ Add New` button, we use the [`organization_create`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.create.organization_create) endpoint using the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml), if you want to add parents organizations to this organization you can send one more extra field called `groups` with an array of objects with the `name` of the parent organization inside.

To the edit flow by clicking on an organization card we use the [`organization_edit`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.edit.organization_edit) endpoint using the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml), if you want to add or remove parents organizations from this organization you can send one more extra field called `groups` with an array of objects with the `name` of the parent organization inside.

To delete an organization we use the [`organization_delete`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.delete.organization_delete) endpoint and send the id of the organization to be deleted.

#### Dashboard - Datasets Approvals page

This page uses the [CKAN `package_search` endpoint to get all the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) and filters them using the `fq` param to search using the Solr engine, it filters just the datasets which the user is a contributor and the datasets from the organizations which the user is an admin or editor sending the organizations ids in the `organization` field, the other field used is the `approval_status` to filter by rejected and pending datasets, and its pagination is made using the `offset` and `rows` parameters

The endpoint used to approve or reject a pending dataset by the admin and its documentation is present in [this section of the documentation](https://github.com/transport-data/tdc-data-portal/blob/main/docs/approval-workflow/README.md#approval-workflow-api-endpoint)

#### Dashboard - Settings page

The API Keys section uses the [`api_token_list`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.api_token_list) endpoint to get all the API keys of the user, to create a new API token it uses the [`api_token_create`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.create.api_token_create) endpoint, and to revoke a token it uses the [`api_token_revoke`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.delete.api_token_revoke) endpoint.

The Sysadmins section is only visible for sysadmins and uses the [`user_patch`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.patch.user_patch) endpoint to add a new sysadmin to the project sending the selected user's id and the `sysadmin` field as true and to remove them it uses the [`user_patch`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.patch.user_patch) as well but sending the `sysadmin` field as false.

#### Add Dataset page

This page uses the [`package_create`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.create.package_create) endpoint to create the dataset sending the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml)

#### Edit Dataset page

This page uses the [`package_patch`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.update.package_patch) endpoint to edit the dataset sending the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml)

Note: this endpoint is a patch, if you don't want to edit a specific field don't send it in the payload and the CKAN will ignore it.

To delete the dataset, we use the [`package_delete`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.delete.package_delete) endpoint and send the dataset's ID.

#### Dataset Details page

This page uses the [`package_show`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_show) endpoint and send the name of the dataset to get all the data and present them

The following button for the dataset uses the [`follow_dataset`](https://ckan.tdc.dev.datopian.com/api/3/action/follow_dataset) and the unfollow uses the [`unfollow_dataset`](https://ckan.tdc.dev.datopian.com/api/3/action/unfollow_dataset).

The following button for the organization, regions, and countries uses the [`follow_group`](https://ckan.tdc.dev.datopian.com/api/3/action/follow_group) and the unfollow uses the [`unfollow_group`](https://ckan.tdc.dev.datopian.com/api/3/action/unfollow_group).

The counting of downloads information is gotten from google analytics.
