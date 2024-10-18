# Data integration

## Data publishing

* Requirements
In order to publish datasets within resources, we need to get API token from CKAN portal:
To obtain **API token**, please check this page [ckan  API](https://docs.ckan.org/en/2.10/api/#authentication-and-api-tokens)

You need to pass header as follows
```
headers = {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
    }
```

Another property is **CKAN url** for generation api url as follows for example:
```
https://ckan.tdc.dev.datopian.com/
```

## Package create

Check the documentation here https://docs.ckan.org/en/2.10/api/#ckan.logic.action.create.package_create

Please, check dataset schema for each property https://github.com/transport-data/tdc-data-portal/blob/main/src/ckanext-tdc/ckanext/tdc/schemas/dataset.yaml
Sample:

```python
dataset_name = dataset_title.lower().replace(' ', '-')
    print(dataset_name)
    data = {
        'title': dataset_title,  # Replace with your actual dataset title
        'name': dataset_name,    # Replace with your actual dataset name
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,     # Replace with your organization ID
        'temporal_coverage_start': '2013-01-01',
        'temporal_coverage_end': '2019-01-01',
        "geographies": ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'},
            {'title': 'EEA', 'url': 'https://www.eea.europa.eu/en'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger Vehicle Fleet',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['#','%'],
        'dimensioning': 'registrations by type'
    }
    headers = {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
    }
    # whenever we cannot find information on  data updates, we will use "as_needed" for frequency
    # overview_text will be provided manually later
    # topic is missing/null vehicle-read-traffic
    # indicators we need a similar approach as for tags
    
    try:
        json_data = json.dumps(data)
        print("JSON Payload to be sent:", json_data) 
    except Exception as e:
        print("Error converting data to JSON:", str(e))
    
    response = requests.post(
        urljoin(CKAN_URL, '/api/3/action/package_create'),
        data=json_data,
        headers=headers
    )
```

Once package is created, we need to add resources

## Resource create

Check the documentation here https://docs.ckan.org/en/2.10/api/#ckan.logic.action.create.resource_create

Sample:

```python
data = {
    'package_id': dataset_name,
    'url': resource_remote_url,
    'name': resource_name,
    'resource_type': 'data'
  }
  resp = requests.post(
      urljoin(CKAN_URL, '/api/3/action/resource_create'),
      data=data,
      headers={'Authorization': API_KEY},
  )
```
Note: in order to create resource, we need to pass package_id(dataset_name), for example `air-pollutants-emissions-rail-uic` here https://ckan.tdc.dev.datopian.com/dataset/air-pollutants-emissions-rail-uic

## Script

In order to run `process_tdc.py`, you need to pass 2 variables in requirements. 
This script consists functions for each dataset which differs only metadata or resource type. In order to run, remove comments in the main section.
