<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Technologies used](#technologies-used)
- [How to run and build the project locally](#how-to-run-and-build-the-project-locally)
- [How to contact support](#how-to-contact-support)
- [How to report issues](#how-to-report-issues)
- [How to keep updated with the next features](#how-to-keep-updated-with-the-next-features)
- [How the portal works](#how-the-portal-works)
    - [Home page](#home-page)
    - [Onboarding page](#onboarding-page)
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
    - [Dashboard - Settings page](#dashboard---settings-page)
    - [Add Dataset page](#add-dataset-page)
    - [Edit Dataset page](#edit-dataset-page)
    - [Dataset Details page](#dataset-details-page)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Technologies used

The technologies used in this project and their documentation to maintain the project are [CKAN](https://docs.ckan.org/en/2.11/) as backend, [Next.js](https://nextjs.org/docs) for the frontend application, [PortalJS](https://github.com/datopian/datahub/tree/main/packages/ckan#readme) to get types, interfaces, already implemented requests to CKAN, and integration with MarkdownDB more easily, [Cypress](https://docs.cypress.io/app/get-started/why-cypress) to do the End-to-End tests, [MarkdownDB](https://github.com/datopian/markdowndb?tab=readme-ov-file#markdowndb) for rendering static pages based on the markdown format, [Apache Solr](https://solr.apache.org/guide/solr/latest/getting-started/introduction.html) to index the packages and allow the users to make queries on the data faster, [PostgreSQL](https://www.postgresql.org/docs/) as the CKAN database, [DataPusher+](https://github.com/dathere/datapusher-plus?tab=readme-ov-file#datapusher) to make structured resources queryable via SQL, [Docker](https://docs.docker.com/) to containerize the CKAN, Datapusher+, and Solr that are running in [Kubernetes](https://kubernetes.io/docs/home/).

## How to run and build the project locally

To start the frontend project locally, you need to install the project's packages using `npm install` and then start the project using `npm run dev`. To generate a production build, we use `npm run build`.

To start the backend locally, you need to rename the `.env.example` to `.env` and then run `docker compose -f docker-compose.dev.yml up --build`.

## How to contact support

To contact the support you can reach out to the support@datopian.com email.

## How to report issues

To report any issues you can use the [issues tab of the project](https://github.com/transport-data/tdc-data-portal/issues/new/choose)

## How to keep updated with the next features

To keep updated with the next features you can access the [issues section](https://github.com/transport-data/tdc-data-portal/issues)

## How the portal works

<b>Note</b>: For all the requests presented in the next sections, we send the Authorization header with the user's API key when they login into the platform; most need to receive the API key to return any data.

#### Home page

The search bar of this page uses the [CKAN `package_search` endpoint to fetch the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) and filters them using the `fq` param to search using the Solr engine, the fields used in the component are present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml), and it always limits by 5 results using the `rows` parameter.

Example of a query used in the search bar: [https://ckan.tdc.dev.datopian.com/api/3/action/package_search?fq=geographies:(lby)+text:(\*"ab"\*)&start=0&rows=5&sort=score desc, metadata_modified desc&include_private=true&facet.field=["tags", "services", "modes", "sectors","frequency", "organization", "res_format", "metadata_created"]&facet.limit=1000000000&facet.mincount=0]()

The datasets section of this page uses the [CKAN `package_search` endpoint to fetch the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search), and it always limits by 6 results using the `rows` parameter and sorting by recently updated datasets using the `sort` parameter.

Query used in the datasets section: [https://ckan.tdc.dev.datopian.com/api/3/action/package_search?start=0&rows=6&sort=metadata_modified desc]()

The testimonials section of this page uses the [MarkdownDB](https://github.com/datopian/markdowndb?tab=readme-ov-file#markdowndb). For information on how to add or remove people from the page, you can take a look at this [doc](https://github.com/transport-data/tdc-data-portal/blob/main/docs/static-pages/testimonials/README.md).

#### Onboarding page

This page is restricted to logged-in users only.

First we fetch all the organizations using the [`organization_list` endpoint](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.organization_list) to be used on the first and second step, all the locations and topics using the [`group_list` endpoint](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.group_list) to be used in the first step, and we fetch all the user organizations using the [`organization_list_for_user` endpoint](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.organization_list_for_user) to be used in the second step to disable the request to participate of an org that the user already belongs to.

The request used to get all the organizations: [https://ckan.tdc.dev.datopian.com/api/3/action/organization_list?all_fields=true]()

Request used to get the [locations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/geography.yaml): [https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=geography&limit=350]()

Request used to get the [topics](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml): [https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=topic&limit=350]()

Request used to get the all the user [organizations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml): [https://ckan.tdc.dev.datopian.com/api/3/action/organization_list_for_user?id=\<user id\>&limit=1000]()

The first step of this page uses the [`follow_group endpoint`](https://ckan.tdc.dev.datopian.com/api/3/action/follow_group) to follow the [locations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/geography.yaml), [topics](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml), and [organizations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml) (all three are treated as groups under the hood to CKAN). When a user follows a group the application will present the activities related to this group on the [newsfeed tab](#dashboard---newsfeed-page).

The JSON used to follow a topic, organization, or geography is:

```json
{
  "id": "id of the group that you want to follow or unfollow"
}
```

In the second step, we have two ways to go:

1. Request to participate in an existing organisation:

    - This section uses the custom [`request_organization_owner` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/request_organization_owner) created for this flow that receives a JSON in the body of the POST request:

      ```json
      {
        "id": "id of the organization that you want to participate",
        "message": "message to the organization's admins"
      }
      ```

2. Request the creation of a new organization:

    - This section uses the custom [`request_new_organization` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/request_new_organization) created for this flow that receives a JSON in the body of the POST request:

      ```json
      {
        "org_name": "the org name",
        "org_description": "description of the new org",
        "dataset_description": "message to the sys admin approve your new organization"
      }
      ```

The third step uses the custom [`invite_user_to_tdc` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/invite_user_to_tdc) created for this flow that receives a JSON in the body of the POST request:

```json
{
  "emails": [
    "list of colleagues or friends' emails that you want to invite to the portal"
  ],
  "message": "message to them"
}
```

#### Partners page

This page uses a static JSON of the project to present the partners to update any of these partners you can access [this file](https://github.com/transport-data/tdc-data-portal/blob/main/frontend/src/data/partners.json) and edit it.

#### Datasets' browse page

It uses the [CKAN `package search` endpoint to fetch the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search). It filters them with the `fq` param using the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml), and its pagination is made using the `offset` and `rows` parameters.

Example of a query: [https://ckan.tdc.dev.datopian.com/api/3/action/package_search?fq=geographies:(lby)+text:(\*"ab"\*)&start=0&rows=9&sort=score desc, metadata_modified desc&include_private=true&facet.field=["tags", "services", "modes", "sectors","frequency", "organization", "res_format", "metadata_created"]&facet.limit=1000000000&facet.mincount=0]()

#### Geography page

We have created a CKAN CLI command to generate countries on the DMS based on the GeoJSON provided by UNECE, these geographies are created as a customized group called [geography](https://github.com/transport-data/tdc-data-portal/tree/main/docs/metadata-schema#geography), if the geography is a country we add the country flag as the image of the group, and we store the GeoJSON which maps the area of the country. We also created one command to erase all these generated countries, and another to list them you can see all the available commands related to the geographies here in this doc [these docs](https://github.com/transport-data/tdc-data-portal/blob/main/docs/geographies/README.md#commands), pointing out that you need to access the CKAN instance via SSH to run these commands via terminal.

To present the data on the map we get all the countries available on the DMS by using [the `group_list` endpoint](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.group_list), and as they are groups we have the `package_count` field created by default from CKAN for groups, this field is a counting field that counts all the packages/datasets that have these groups linked with them, and we present this counting when the users' cursor hovers on the country.

The request used to get all the geographies: https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=geography&include_shapes=true&limit=350

#### Datasets page

The search bar of this page uses the [CKAN `package_search` endpoint to fetch the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) and filters them with the `fq` param using the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml), and it always limits by 5 results.

Example of a query used in the search bar: [https://ckan.tdc.dev.datopian.com/api/3/action/package_search?fq=geographies:(lby)+text:(\*"ab"\*)&start=0&rows=5&sort=score desc, metadata_modified desc&include_private=true&facet.field=["tags", "services", "modes", "sectors","frequency", "organization", "res_format", "metadata_created"]&facet.limit=1000000000&facet.mincount=0]()

To present each card on this page we get all the [topics](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml) (a group in CKAN terminology) available using the [`group_list` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=topic&limit=350) and list their datasets, the Most Viewed and TDC Harmonized cards are different cases, the Most Viewed use the google analytics data to present the most viewed datasets, and the TDC Harmonized is using the [`package_search`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) endpoint filtering by the datasets which have the TDC Harmonized category and limiting them by 10.

Query used to fetch the TDC Harmonized datasets: [https://ckan.tdc.dev.datopian.com/api/3/action/package_search?fq=tdc_category:tdc_harmonized&rows=10]()

#### About Us page

This page utilizes the [MarkdownDB](https://github.com/datopian/markdowndb?tab=readme-ov-file#markdowndb) to render the people behind the TDC section, you can take a look in this [doc](https://github.com/transport-data/tdc-data-portal/tree/main/docs/static-pages/people/README.md) for information of how to add or remove people on the page.

#### Events page

This page utilizes the [MarkdownDB](https://github.com/datopian/markdowndb?tab=readme-ov-file#markdowndb) to render the events, you can take a look in this [doc](https://github.com/transport-data/tdc-data-portal/tree/main/docs/static-pages/events/README.md) for information of how to add or remove events on the page.

#### FAQ page

This page utilizes the [MarkdownDB](https://github.com/datopian/markdowndb?tab=readme-ov-file#markdowndb) to render the frequently asked questions, you can take a look in this [doc](https://github.com/transport-data/tdc-data-portal/blob/main/docs/static-pages/faq/README.md) for information of how to add or remove events on the page.

#### Dashboard - Newsfeed page

This page is restricted to logged-in users only.

This tab uses the custom [`tdc_dashboard_activity_list` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/tdc_dashboard_activity_list) which returns all the data that the signed-in user follows from geographies, datasets, topics, and organizations.

#### Dashboard - My Datasets page

This page is restricted to logged-in users only.

This page uses the [CKAN `package_search` endpoint to fetch the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) and filters them using the `fq` param to search using the Solr engine, it filters just the user's datasets sending the user id in the `creator_user_id` field, the other fields used in this page are present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml), and its pagination is made using the `offset` and `rows` parameters

Example of a query used in this page: [https://ckan.tdc.dev.datopian.com/api/3/action/package_search?fq=creator_user_id:(<ADD YOUR USER ID HERE>)&start=0&rows=9&sort=score desc, metadata_modified desc&include_private=true&include_drafts=true&facet.field=["tags","frequency","regions", "geographies", "organization", "res_format", "metadata_created"]&facet.limit=1000000000&facet.mincount=0]()

#### Dashboard - My Organisation page

This page is restricted to logged-in users only.

This page uses the [CKAN `package_search` endpoint to fetch the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) and filters them using the `fq` param to search using the Solr engine, it filters just the user's organizations datasets sending the organizations ids which the user belongs to in the `organization` field, the other fields used in this page are present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml), and its pagination is made using the `offset` and `rows` parameters

Example of a query used on this page: [https://ckan.tdc.dev.datopian.com/api/3/action/package_search?fq=organization:(<ORGANIZATIONS THAT YOU BELONG TO SEPARATED BY " OR ">)&start=0&rows=9&sort=score desc, metadata_modified desc&include_private=true&include_drafts=true&facet.field=["tags", "frequency","regions", "geographies", "organization", "res_format", "metadata_created", "contributors"]&facet.limit=1000000000&facet.mincount=0]()

#### Dashboard - Topics page

This page is accessible just for sys admins users, to present the data of this page we get all the [topics](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml) (a group in CKAN terminology) available using the [`group_list` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=topic&limit=350) and use the `package_count` field of the group to present the number of datasets linked to the topic.

To the creation flow by clicking in the `+ Add New` button we use the [`group_create`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.create.group_create) endpoint using the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml) being mandatory send an extra field named `type` with a string `topic` in the request, if you want to add parents topics to this topic you can send one more extra field called `groups` with an array of objects with the `name` of the parent group inside.

Example of a POST request to the `group_create` endpoint:

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

To the edit flow by clicking on a topic card we use the [`group_patch`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.edit.group_patch) endpoint using the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml) being mandatory send an extra field named `type` with a string `topic` in the request, if you want to add or remove parents topics from this topic you can send one more extra field called `groups` with an array of objects with the `name` of the parent group inside.

<b>Note</b>: this endpoint is a patch, if you don't want to edit a specific field don't send it in the payload, and the CKAN will ignore it.

Example of a POST request to the `group_patch` endpoint:

```json
{
  "id": "id of the topic that you want to edit",
  "type": "topic",
  "name": "topic name",
  "title": "topic title",
  "notes": "topic description",
  "url": "URL with the image of the topic",
  "groups": [{ "name": "name of the parent topic if wanted" }]
}
```

To delete a topic we use the [`group_delete`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.delete.group_delete) endpoint and send the id of the topic to be deleted.

Example of a POST request to the `group_delete` endpoint:

```json
{
  "id": "id of the group that you want to delete"
}
```

#### Dashboard - Organizations page

This page is restricted to logged-in users only.

To present the data of this page we get all the [organizations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml) available using the [`organization_list_for_user` endpoint](https://ckan.tdc.dev.datopian.com/api/3/action/organization_list_for_user?include_dataset_count=true&limit=1000) and use the `package_count` field of the group to present the number of datasets linked to the topic.

Request used to get the all the user [organizations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml): [https://ckan.tdc.dev.datopian.com/api/3/action/organization_list_for_user?id=\<user id\>&limit=1000]()

To the creation flow the user must be a sys admin and click on the `+ Add New` button, we use the [`organization_create`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.create.organization_create) endpoint using the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml), if you want to add parents organizations to this organization you can send one more extra field called `groups` with an array of objects with the `name` of the parent organization inside.

Example of the body of the [`organization_create`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.create.organization_create) endpoint:

```json
{
  "name": "organization-name",
  "title": "Title of the org",
  "description": "description of the org",
  "image_display_url": "image of the org URL",
  "parent": "name of the parent org if there is one",
  "image_url": "image of the org URL",
  "email": "organization email",
  "groups": [{ "name": "name of the parent org if there is one" }]
}
```

To the edit flow by clicking on an organization card we use the [`organization_patch`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.patch.organization_patch) endpoint using the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml), if you want to add or remove parents organizations from this organization you can send one more extra field called `groups` with an array of objects with the `name` of the parent organization inside.

<b>Note</b>: this endpoint is a patch, if you don't want to edit a specific field don't send it in the payload, and the CKAN will ignore it.

Example of the body of the [`organization_patch`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.patch.organization_patch) endpoint:

```json
{
  "id": "id of the organization that you want to edit",
  "name": "organization-name",
  "title": "Title of the org",
  "description": "description of the org",
  "image_display_url": "image of the org URL",
  "parent": "name of the parent org if there is one",
  "image_url": "image of the org URL",
  "email": "organization email",
  "groups": [{ "name": "name of the parent org if there is one" }]
}
```

To delete an organization we use the [`organization_delete`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.delete.organization_delete) endpoint and send the id of the organization to be deleted.

Example of a POST request to the `organization_delete` endpoint:

```json
{
  "id": "id of the organization that you want to delete"
}
```

#### Dashboard - Datasets Approvals page

This page is restricted to logged-in users only.

This page uses the [CKAN `package_search` endpoint to fetch the data](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_search) and filters them using the `fq` param to search using the Solr engine, it filters just the datasets which the user is a contributor and the datasets from the organizations which the user is an admin or editor sending the organizations ids in the `organization` field, the other field used is the `approval_status` to filter by rejected and pending datasets, and its pagination is made using the `offset` and `rows` parameters

The endpoint used to approve or reject a pending dataset by the admin and its documentation is present in [this section of the documentation](https://github.com/transport-data/tdc-data-portal/blob/main/docs/approval-workflow/README.md#approval-workflow-api-endpoint)

Example of a query used on the page: [https://ckan.tdc.dev.datopian.com/api/3/action/package_search?fq=approval_status:(pending OR rejected)+organization:(<ORGANIZATIONS THAT YOU BELONG TO SEPARATED BY " OR ">)&start=9&rows=9&sort=score desc, metadata_modified desc&include_private=true&include_drafts=true]()

#### Dashboard - Settings page

This page is restricted to logged-in users only.

The API Keys section uses the [`api_token_list`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.api_token_list) endpoint to get all the API keys of the user, to create a new API token it uses the [`api_token_create`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.create.api_token_create) endpoint, and to revoke a token it uses the [`api_token_revoke`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.delete.api_token_revoke) endpoint.

Example of the body of the [`api_token_revoke`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.delete.api_token_revoke) endpoint:

```json
{
  "jti": "<token that you want to revoke>"
}
```

The Sysadmins section is only visible for sysadmins and uses the [`user_patch`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.patch.user_patch) endpoint to add a new sysadmin to the project sending the selected user's id and the `sysadmin` field as true and to remove them it uses the [`user_patch`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.patch.user_patch) as well but sending the `sysadmin` field as false.

Example of the body of the [`user_patch`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.patch.user_patch) endpoint:

```json
{
  "id": "<user id that you want to add or remove the sysadmin role>",
  "sysadmin": <true or false>
}
```

#### Add Dataset page

This page is restricted just for signed-in users that have the editor or admin role.

When the page is opened it fetches all the user's organizations using the [`organization_list_for_user` endpoint](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.organization_list_for_user) to be selected in the creation of the dataset, all the geographies and topics using the [`group_list` endpoint](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.group_list) to allows the user to link the dataset to geographies and topics, to create the dataset we use the [`package_create`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.create.package_create) sending the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml)

Request used to get the [topics](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml): [https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=topic&limit=350]()

Request used to get the all the user [organizations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml): [https://ckan.tdc.dev.datopian.com/api/3/action/organization_list_for_user?id=\<user id\>&limit=1000]()

Request used to get the [geographies](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/geography.yaml): [https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=geography&limit=350]()

Example of a POST request to the `package_create` endpoint:

```json
{
  "id": "generated UUID",
  "name": "dataset name",
  "title": "dataset title",
  "notes": "<p>Description as HTML</p>",
  "overview_text": "<p>Overview text as HTML</p>",
  "owner_org": "id of the organization that this dataset belongs to",
  "topics": ["any topics that you want to add"],
  "is_archived": false or true,
  "tags": ["any tags that you want to add"],
  "userRepresents": false or true,
  "sources": ["any sources that you want to add"],
  "comments": ["any comments that you want to add"],
  "language": "iso 639-1 of the language of you dataset",
  "frequency": "frequency",
  "tdc_category": "tdc category",
  "modes": ["any modes that you want to add"],
  "services": ["any services that you want to add"],
  "sectors": ["any sectors that you want to add"],
  "temporal_coverage_start": "YYYY-MM-DD",
  "temporal_coverage_end": "YYYY-MM-DD",
  "geographies": ["iso3 of the countries or regions that you want to add"],
  "license_id": "any licenses that you want to add",
  "private": true or false,
  "indicators": ["any indicators that you want to add"],
  "units": ["any units that you want to add"],
  "dimensioning": "any dimensioning that you want to add",
  "url": "any URL",
  "data_provider": "any data provider that you want to add",
  "data_access": "any data access that you want to add",
  "state": "active",
  "related_datasets": ["any datasets that you want to relate to this one"],
  "resources": ["any resources that you want to add"]
}
```

#### Edit Dataset page

This page is restricted just for signed-in users that have the editor or admin role.

When the page is opened it fetches all the user's organizations using the [`organization_list_for_user` endpoint](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.organization_list_for_user) to be selected in the creation of the dataset, all the geographies and topics using the [`group_list` endpoint](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.group_list) to allows the user to link the dataset to geographies and topics, to create the dataset we use the [`package_patch`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.update.package_patch) endpoint sending the fields present [here](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml)

Request used to get the [topics](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/topic.yaml): [https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=topic&limit=350]()

Request used to get the all the user [organizations](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/organization.yaml): [https://ckan.tdc.dev.datopian.com/api/3/action/organization_list_for_user?id=\<user id\>&limit=1000]()

Request used to get the [geographies](https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/geography.yaml): [https://ckan.tdc.dev.datopian.com/api/3/action/group_list?&all_fields=True&include_extras=True&type=geography&limit=350]()

<b>Note</b>: this endpoint is a patch, if you don't want to edit a specific field don't send it in the payload, and the CKAN will ignore it.

Example of a POST request to the `package_patch` endpoint:

```json
{
  "id": "id of the dataset that you want to edit",
  "name": "dataset name",
  "title": "dataset title",
  "notes": "<p>Description as HTML</p>",
  "overview_text": "<p>Overview text as HTML</p>",
  "owner_org": "id of the organization that this dataset belongs to",
  "topics": ["any topics that you want to add"],
  "is_archived": false or true,
  "tags": ["any tags that you want to add"],
  "userRepresents": false or true,
  "sources": ["any sources that you want to add"],
  "comments": ["any comments that you want to add"],
  "language": "iso 639-1 of the language of you dataset",
  "frequency": "frequency",
  "tdc_category": "tdc category",
  "modes": ["any modes that you want to add"],
  "services": ["any services that you want to add"],
  "sectors": ["any sectors that you want to add"],
  "temporal_coverage_start": "YYYY-MM-DD",
  "temporal_coverage_end": "YYYY-MM-DD",
  "geographies": ["iso3 of the countries or regions that you want to add"],
  "license_id": "any licenses that you want to add",
  "private": true or false,
  "indicators": ["any indicators that you want to add"],
  "units": ["any units that you want to add"],
  "dimensioning": "any dimensioning that you want to add",
  "url": "any URL",
  "data_provider": "any data provider that you want to add",
  "data_access": "any data access that you want to add",
  "state": "active",
  "related_datasets": ["any datasets that you want to relate to this one"],
  "resources": ["any resources that you want to add"]
}
```

To delete the dataset, we use the [`package_delete`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.delete.package_delete) endpoint and send the dataset's ID.

Example of a POST request to the `package_delete` endpoint:

```json
{
  "id": "id of the dataset that you want to delete"
}
```

#### Dataset Details page

This page uses the [`package_show`](https://docs.ckan.org/en/2.11/api/index.html#ckan.logic.action.get.package_show) endpoint and send the name of the dataset to fetch the data and present them

Example of a request to the package_show endpoint: [https://ckan.tdc.dev.datopian.com//api/3/action/package_show?id=\<id of the dataset\>]()

The following button for the dataset uses the [`follow_dataset`](https://ckan.tdc.dev.datopian.com/api/3/action/follow_dataset) and the unfollow uses the [`unfollow_dataset`](https://ckan.tdc.dev.datopian.com/api/3/action/unfollow_dataset) both use the JSON below to follow or unfollow the dataset:

```json
{
  "id": "id of the dataset that you want to follow or unfollow"
}
```

The following button for the organization, regions, and countries uses the [`follow_group`](https://ckan.tdc.dev.datopian.com/api/3/action/follow_group) and the unfollow uses the [`unfollow_group`](https://ckan.tdc.dev.datopian.com/api/3/action/unfollow_group) both use the JSON below to follow or unfollow the geography:

```json
{
  "id": "id of the geography that you want to follow or unfollow"
}
```

The counting of downloads information is gotten from google analytics API.

To present the data on the table with sorting, filtering, and all the features available for structured data we use the [`datastore_search`](https://docs.ckan.org/en/2.9/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search) and the [`datastore_search_sql`](https://docs.ckan.org/en/2.9/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search_sql) endpoints.

Example of a request to the datastore_search endpoint: [https://ckan.tdc.dev.datopian.com//api/3/action/datastore_search?resource_id=\<id of a resource uploaded to datastore\>]()

Example of a request to the datastore_search_sql endpoint: [https://ckan.tdc.dev.datopian.com//api/action/datastore_search_sql?sql=SELECT count(\*) FROM "<id of the resource>" WHERE ("field of the resource" != 'a' )]()
