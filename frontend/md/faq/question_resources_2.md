---
title: Example 1 - Access list of all datasets published on the TDC Portal 
category: devs
---

If you'd like to GET a list of all datasets published on the TDC, run the [package_list](https://ckan.tdc.prod.datopian.com/api/3/action/package_list) command. This will provide a JSON-formatted list of ´names´ for each dataset (as displayed, e.g., in the URL):

~~~
$ curl https://ckan.tdc.prod.datopian.com/api/3/action/package_list
~~~

__Note:__
These examples can be executed by using the Windows or Unix / Linux command line interface or by pasting the URL in your browser.
