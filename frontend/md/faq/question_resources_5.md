---
title: Example 4 - Query tabular data on the TDC Portal 
category: devs
---

If you’d like to search inside the content of a tabular dataset (e.g., a CSV or Excel file published on the TDC Portal), you can use the [datastore_search](https://docs.ckan.org/en/2.9/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search) API command.

~~~
$ curl "https://ckan.tdc.prod.datopian.com/api/3/action/datastore_search?id=..."
~~~

To do this, provide the resource ID as the id= parameter in the URL. This ID is the unique hash assigned to the dataset's file and can be copied from the “Access by API” link found in the “Downloads” section of the dataset page.

You can also apply optional parameters, such as:

- limit= – to specify the number of rows (default is 100)

- filters= – to filter results (search text or key-value)

- offset= – to page through results

__Example 1__:
Retrieve the first 5 rows of a tabular dataset:

~~~
$ curl "https://ckan.tdc.prod.datopian.com/api/3/action/datastore_search?id=9e9b5650-a509-45f9-958a-53c1589f00a3&limit=5"
~~~

__Example 2__:
Retrieve all results with "geo" = "AT" of a tabular dataset:

~~~
$ curl "https://ckan.tdc.prod.datopian.com/api/3/action/datastore_search?id=9e9b5650-a509-45f9-958a-53c1589f00a3&filters={%22geo%22:%22AT%22}"
~~~

__Note:__
This only works for datasets that are DataStore-enabled (e.g., structured data like CSVs or spreadsheets). You won’t be able to search inside unstructured resources like PDFs.

__Note:__
These examples can be executed by using the Windows or Unix / Linux command line interface or by pasting the URL in your browser.
