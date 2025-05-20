---
title: Example 2: Show details of individual dataset on the TDC Portal 
category: devs
---

If you'd like to GET the details of an individual datasets published on the TDC (including all metadata provided), run the [package_show](https://ckan.tdc.prod.datopian.com/api/3/action/package_show?id=ndc-transport-tracker) command. 

As an identifier (id=), please provide the ´name´ of the dataset, which is displayed as the last component in the URL of the dataset (e.g., 'ndc-transport-tracker' for https://portal.transport-data.org/GIZ/ndc-transport-tracker) or listed for all datasets by using the [package_list](https://ckan.tdc.prod.datopian.com/api/3/action/package_list) command:

~~~
$ curl https://ckan.tdc.prod.datopian.com/api/3/action/package_show?id=...
~~~

__Note:__
These examples can be executed by using the Windows or Unix / Linux command line interface or by pasting the URL in your browser.
