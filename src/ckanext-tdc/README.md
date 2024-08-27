## Requirements

This has been tested on CKAN v2.10.

## Installation

To install ckanext-tdc:

1. Activate your CKAN virtual environment, for example::

     . /usr/lib/ckan/default/bin/activate

2. Install the ckanext-tdc Python package into your virtual environment::

     pip install --no-cache-dir -e git+https://github.com/datopian/ckanext-tdc.git#egg=ckanext-tdc

3. Add ``tdc`` to the ``ckan.plugins`` setting in your CKAN
   config file (by default the config file is located at
   ``/etc/ckan/default/production.ini``).

4. Restart CKAN. For example if you've deployed CKAN with Apache on Ubuntu::

     sudo service apache2 reload
