---
title: How to submit data via the API?
category: devs
---

To publish data to the TDC Portal via the API, you need an API key to authenticate your requests. The API key acts like a password and ensures that only authorized users can upload or modify data.

#### Get your API key:

1. Log in to the TDC Portal.

2. Click on your username in the top-right corner and select "Settings".

3. By selecting "New Token" you can provide a name to the token that will serve as your new API key.

4. After selecting "Create Token", your API key will be displayed on your settings page.

__Important:__ Make sure to copy and save it now, as you __won't be able to see it again__. Keep this key secure and do not share it publicly. You can always create a new token, in case you lost your previous key. You need to have at least editor rights for a organsation to submit data.

#### Use your API key in requests:
Include your API key in the HTTP header when making API calls. Here’s an example using curl to create a new dataset, using the [package_create](https://docs.ckan.org/en/2.9/api/#ckan.logic.action.create.package_create) command:

~~~bash
curl -X POST https://ckan.tdc.prod.datopian.com/api/3/action/package_create \
  -H "Authorization: <YOUR-API-KEY>" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "example-dataset",
        "title": "Example Dataset",
        "description": "This is a sample dataset created via the API."
      }'
~~~

__Read the following guide__ for a [complete code example](https://github.com/transport-data/portal/tree/main/src/ckanext-tdc/ckanext/tdc/data-integration).

You can also use Python (with the requests library), Postman, or other tools to send similar requests. See the following documentation for example scripts for the [creation of packages](https://github.com/transport-data/portal/blob/main/src/ckanext-tdc/ckanext/tdc/data-integration/README.md#package-create) and [resources](https://github.com/transport-data/portal/blob/main/src/ckanext-tdc/ckanext/tdc/data-integration/README.md#resource-create) with Python.
