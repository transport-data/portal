---
title: How do I access the TDC Portal via API?
category: devs
---

The TDC Portal provides a web interface for updating and managing data and metadata in the Transport Data Commons. In addition to this, the TDC Portal also supports programmatic access to data and metadata through its API.

Using the TDC Portal API allows you to access and interact with data programmatically. To get started, you’ll need to make HTTP requests to specific API endpoints, typically using tools like 'curl', Postman, or programming languages such as Python or JavaScript. 

Most interactions are done through GET (to retrieve data) and POST (to create or update data) requests. You can access datasets, search metadata, upload resources, or automate updates to keep your data synchronized. The API is RESTful and returns responses in JSON format, making it easy to integrate with other systems and applications. 

The following section provides some basic examples on how to use the TDC Portal via API. These examples can be executed by using the Windows or Unix / Linux command line 

~~~
$ curl https://ckan.tdc.prod.datopian.com/...
~~~

or by pasting the URL in your browser.

For detailed documentation, including further example requests and authentication instructions, please refer to the [CKAN API guide](https://docs.ckan.org/en/latest/api/index.html).
