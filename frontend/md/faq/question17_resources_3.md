---
title: Example 3 - Show resource for individual dataset on the TDC Portal 
category: devs
---

If you'd like to GET the resource connected to an individual datasets published on the TDC (e.g., a CSV file containing the data), run the [resource_show](https://ckan.tdc.prod.datopian.com/api/action/resource_show?id=f41f7235-7dae-4dc4-8ac8-e998e9254b4c) command. 

~~~
$ curl https://ckan.tdc.prod.datopian.com/api/3/action/resource_show?id=...
~~~

As an identifier (id=), please provide the hash created for the resource. You can access the command for each resource, by navigating to the "Downloads" section for a dataset on the TDC Portal. By clicking on "Access by API", the full URL (including the hash) shows and can be copied to your clipboard. 

![image](https://github.com/user-attachments/assets/6d57eb88-83ef-4912-ab33-0491bca9977e)

__Note:__
These examples can be executed by using the Windows or Unix / Linux command line interface or by pasting the URL in your browser.
