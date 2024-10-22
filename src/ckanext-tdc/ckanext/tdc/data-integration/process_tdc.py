import requests
import json
import sys
from urllib.parse import urljoin
import os
from dotenv import load_dotenv

load_dotenv()              
# CKAN Configuration
CKAN_URL = os.getenv('CKAN_URL')
API_KEY = os.getenv('API_KEY')

def create_resource_remote_url_with_format(dataset_name, resource_remote_url,resource_name, resource_format):
    '''
    Add resource in datasets
    '''
    print('CREATING RESOURCE')
    data = {
      'package_id': dataset_name,
      'url': resource_remote_url,
      'name': resource_name,
      'format': resource_format,
      'resource_type': 'data'
    }
    resp = requests.post(
        urljoin(CKAN_URL, '/api/3/action/resource_create'),
        data=data,
        headers={'Authorization': API_KEY},
    )

def create_resource_remote_url(dataset_name, resource_remote_url,resource_name):
    '''
    Add resource in datasets
    '''
    print('CREATING RESOURCE')
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

def create_resource_local_file(dataset_name,resource_name):
    # File to upload
    FILE_PATH = resource_name         # Replace with the path to your local CSV file

    # CKAN resource_create endpoint
    endpoint = f'{CKAN_URL}/api/3/action/resource_create'

    # Set up headers including the API key
    headers = {
        'Authorization': API_KEY,
    }

    # Set up the data and file to be sent in the request
    data = {
        'package_id': dataset_name,  # Dataset ID
        'name': resource_name, # Optional: Name of the resource
        'format': 'csv',          # Optional: Format of the file
        'resource_type': 'data'
    }

    # Read the file in binary mode
    with open(FILE_PATH, 'rb') as file:
        files = {
            'upload': file,
        }

        # Send the POST request
        resp = requests.post(endpoint, headers=headers, data=data, files=files)

    # Check response
    if resp.status_code == 200:
        print('Resource created successfully:', resp.json())
    else:
        print('Error creating resource:', resp.text)

def create_resource_local_file_with_format(dataset_name,resource_name,resource_format):
    # File to upload
    FILE_PATH = resource_name         # Replace with the path to your local CSV file

    # CKAN resource_create endpoint
    endpoint = f'{CKAN_URL}/api/3/action/resource_create'

    # Set up headers including the API key
    headers = {
        'Authorization': API_KEY,
    }

    # Set up the data and file to be sent in the request
    data = {
        'package_id': dataset_name,  # Dataset ID
        'name': resource_name, # Optional: Name of the resource
        'format': resource_format,          # Optional: Format of the file
        'resource_type': 'data'
    }

    # Read the file in binary mode
    with open(FILE_PATH, 'rb') as file:
        files = {
            'upload': file,
        }

        # Send the POST request
        resp = requests.post(endpoint, headers=headers, data=data, files=files)

    # Check response
    if resp.status_code == 200:
        print('Resource created successfully:', resp.json())
    else:
        print('Error creating resource:', resp.text)
# Our World in Data - Road Travel
def dataset_1(org_id, dataset_title, resource_name):
    '''
    Add dataset in the organizations
    '''
    
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
    
    if response.status_code == 200:
        print('Dataset created successfully:', response.json())
        create_resource_local_file(dataset_name, resource_name)
    else:
        print('Error creating dataset:', response.text)
def dataset_2(org_id, dataset_title, resource_name):
    '''
    Add dataset in the organizations
    '''
    
    dataset_name = dataset_title.lower().replace(' ', '-')
    data = {
        'title': dataset_title,  # Replace with your actual dataset title
        'name': dataset_name,    # Replace with your actual dataset name
        'notes': 'Based on new passenger vehicle registrations and for battery electric vehicles only',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,     # Replace with your organization ID
        'temporal_coverage_start': '2001-01-01',
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
        'indicators': 'Electric vehicle fleet',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'Share of new battery electric passenger vehicles'
    }
    headers = {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
    }

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
    
    if response.status_code == 200:
        print('Dataset created successfully:', response.json())
        create_resource_local_file(dataset_name, resource_name)
    else:
        print('Error creating dataset:', response.text)
def dataset_3(org_id, dataset_title, resource_name):
    '''
    Add dataset in the organizations
    '''
    
    dataset_name = dataset_title.lower().replace(' ', '-')
    data = {
        'title': dataset_title,  # Replace with your actual dataset title
        'name': dataset_name,    # Replace with your actual dataset name
        'notes': 'Carbon intensity of newly registered passenger vehicles is measured in grams of carbon dioxide emitted per kilometer driven (grams CO₂ per km).',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,     # Replace with your organization ID
        'temporal_coverage_start': '2001-01-01',
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
        'indicators': 'Carbon intensity of new passenger vehicles',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['g/km'],
        'dimensioning': 'CO2 emissions (averaged across all types of passenger vehicles)'
    }
    headers = {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
    }

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
    
    if response.status_code == 200:
        print('Dataset created successfully:', response.json())
        create_resource_local_file(dataset_name, resource_name)
    else:
        print('Error creating dataset:', response.text)
def dataset_4(org_id, dataset_title, resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-'),
        'notes': 'Fuel economy is measured in liters per 100 kilometers traveled. This is shown as the average for new passenger vehicle registrations.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2001-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['eur'],
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
        'indicators': 'Fuel economy of new passenger vehicles',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['litres/100km'],
        'dimensioning': 'fuel economy (averaged across all types of passenger vehicles)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
# Our World in Data - Aviation
def dataset_5(org_id, dataset_title, resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-'),
        'notes': 'Available kilometers measure carrying capacity: the number of seats available multiplied by the number of kilometers flown. Passenger-seat kilometers measure the actual number of kilometers flown by paying customers.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1929-01-01',
        'temporal_coverage_end': '2018-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICAO', 'url': 'https://www.icao.int/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Global airline passenger capacity and traffic',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['seat km','passenger seat km'],
        'dimensioning': 'passenger capacity and traffic'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_6(org_id, dataset_title, resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-'),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1950-01-01',
        'temporal_coverage_end': '2018-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICAO', 'url': 'https://www.icao.int/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Global airline passenger load factor',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'passenger load factor'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_7(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'per-capita-co2-emissions-from-domestic-aviation-2018',
        'notes': 'Domestic aviation represents flights which depart and arrive within the same country.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint Domestic Flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['kg/capita'],
        'dimensioning': 'CO2 emissions'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_8(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'co2-emissions-from-domestic-air-travel-2018',
        'notes': 'Domestic aviation represents flights which depart and arrive within the same country.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint Domestic Flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'CO2 emissions'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_9(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'share-of-global-co2-emissions-from-domestic-air-travel-2018',
        'notes': 'Domestic aviation represents flights which depart and arrive within the same country.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint Domestic Flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'Share of CO2 emissions from aviation on total CO2 emissions'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_10(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'per-capita-co2-emissions-from-international-aviation-2018',
        'notes': 'International aviation emissions are here allocated to the country of departure of each flight.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint International Flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['kg/capita'],
        'dimensioning': 'CO2 emissions (allocated to country of departure)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_11(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'co2-emissions-from-international-aviation-2018',
        'notes': 'International aviation emissions are here allocated to the country of departure of each flight.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint International Flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'CO2 emissions (allocated to country of departure)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_12(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'share-of-global-co2-emissions-from-international-aviation-2018',
        'notes': 'International aviation emissions are here allocated to the country of departure of each flight.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Graver et al. (2019)', 'url': 'https://ourworldindata.org/grapher/share-co2-international-aviation'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['international-aviation'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint International Flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'Share of CO2 emissions from aviation in total CO2 emissions'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))    
def dataset_13(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'per-capita-co2-emissions-from-international-passenger-flights-tourism-adjusted-2018',
        'notes': 'International aviation emissions are allocated to the country of departure, then adjusted for tourism.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Graver et al. (2019)', 'url': 'https://ourworldindata.org/grapher/per-capita-co2-international-flights-adjusted'},
            {'title': 'World Bank data', 'url': 'https://data.worldbank.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint International Flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['kg/capita'],
        'dimensioning': 'CO2 emissions (tourism adjusted)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_14(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'per-capita-co2-emissions-from-commercial-aviation-tourism-adjusted-2018',
        'notes': 'This includes both domestic and international flights. International aviation emissions are allocated to the country of departure, and then adjusted for tourism.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Graver et al. (2019)', 'url': 'https://ourworldindata.org/grapher/per-capita-co2-aviation-adjusted'},
            {'title': 'World Bank data', 'url': 'https://data.worldbank.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint Domestic and International',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['kg/capita'],
        'dimensioning': 'CO2 emissions (tourism adjusted)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))  
def dataset_15(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'per-capita-co2-emissions-from-aviation-2018',
        'notes': 'This includes both domestic and international flights. International aviation emissions are allocated to the country of dAviation emissions include both domestic and international flights. International aviation emissions are allocated to the country of departure of each flight.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Graver et al. (2019)', 'url': 'https://ourworldindata.org/grapher/per-capita-co2-aviation'},
            {'title': 'UN Population Prospects', 'url': 'https://population.un.org/wpp/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint Domestic and International',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['kg/capita'],
        'dimensioning': 'CO2 emissions (allocated to country of departure)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))  
def dataset_16(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'co2-emissions-from-aviation-2018',
        'notes': 'Aviation emissions include both domestic and international flights. International aviation emissions are here allocated to the country of departure of each flight.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint Domestic and International',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'CO2 emissions (allocated to country of departure)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_17(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'share-of-global-co2-emissions-from-aviation-2018',
        'notes': 'Aviation emissions include both domestic and international flights. International aviation emissions are allocated to the country of departure of each flight.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Carbon Footprint Domestic and International',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'Share of CO2 emissions from aviation in total CO2 emissions'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_18(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'per-capita-domestic-aviation-passenger-kilometers-2018',
        'notes': 'Revenue Passenger Kilometers (RPK) measures the number of kilometers traveled by paying passengers. It is calculated as the number of revenue passengers multiplied by the total distance traveled.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Most domestic flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['PKM/capita'],
        'dimensioning': 'passenger demand'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_19(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'share-of-global-domestic-aviation-passenger-kilometers-2018',
        'notes': 'Revenue Passenger Kilometers (RPK) measures the number of kilometers traveled by paying passengers. It is calculated as the number of revenue passengers multiplied by the total distance traveled.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Most domestic flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'Share of passenger demand in total air traffic'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_20(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'total-domestic-aviation-passenger-kilometers-2018',
        'notes': 'Revenue Passenger Kilometers (RPK) measures the number of kilometers traveled by paying passengers. It is calculated as the number of revenue passengers multiplied by the total distance traveled.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Most domestic flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['PKM/year'],
        'dimensioning': 'passenger demand'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_21(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'per-capita-international-aviation-passenger-kilometers-2018',
        'notes': 'Revenue Passenger Kilometers (RPK) measures the number of kilometers traveled by paying passengers. It is calculated as the number of revenue passengers multiplied by the total distance traveled. International RPKs are allocated to the country of departure.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Graver et al. (2019)', 'url': 'https://ourworldindata.org/grapher/per-capita-international-aviation-km'},
            {'title': 'UN Population Prospects', 'url': 'https://population.un.org/wpp/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Most international flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['PKM/capita'],
        'dimensioning': 'passenger demand'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_22(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name':'share-of-global-passenger-kilometers-from-international-aviation-2018',
        'notes': 'Revenue Passenger Kilometers (RPK) measures the number of kilometers traveled by paying passengers. It is calculated as the number of revenue passengers multiplied by the total distance traveled. International aviation is here allocated to the country of departure.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Graver et al. (2019)', 'url': 'https://ourworldindata.org/grapher/share-international-aviation-km'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Most international flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'Share of passenger demand in total air traffic'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_23(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',',''),
        'notes': 'Revenue Passenger Kilometers (RPK) measures the number of kilometers traveled by paying passengers. It is calculated as the number of revenue passengers multiplied by the total distance traveled. International aviation is here allocated to the country of departure.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Most international flights',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['PKM/year'],
        'dimensioning': 'passenger demand'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_24(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',',''),
        'notes': 'Revenue Passenger Kilometers (RPK) measures the number of kilometers traveled by paying passengers. Both domestic and international air travel are included here. International flights are allocated to the country of departure.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Total air travel',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['PKM/capita'],
        'dimensioning': 'passenger demand'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_25(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',',''),
        'notes': 'Revenue Passenger Kilometers (RPK) measures the number of kilometers traveled by paying passengers. Both domestic and international air travel are included here. International flights are allocated to the country of departure.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Total air travel',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'Share of passenger demand in total air traffic'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_26(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',',''),
        'notes': 'Revenue Passenger Kilometers (RPK) measures the number of kilometers traveled by paying passengers. Both domestic and international air travel are included here. International flights are allocated to the country of departure.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2018-12-31',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICCT', 'url': 'https://theicct.org/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Total air travel',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['PKM/year'],
        'dimensioning': 'passenger demand'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_27(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',',''),
        'notes': 'Air freight is the volume of freight, express, and diplomatic bags carried on each flight stage (operation of an aircraft from takeoff to its next landing), measured in metric tonnes times kilometers traveled.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ICAO (via World Bank)', 'url': 'https://www.icao.int/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['all'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Air transport freight ',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['TKM/year'],
        'dimensioning': 'freight transport demand'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
# Our World in Data - Rail
def dataset_28(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',',''),
        'notes': 'The number of passengers transported by rail, multiplied by the kilometers traveled. This is measured in passenger-kilometers.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1995-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'International Union of Railways(via World Bank)', 'url': 'https://uic.org/'},
            {'title': 'OECD (via World Bank)', 'url': 'https://www.oecd.org/en.html'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Railway passengers',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['PKM/year'],
        'dimensioning': 'passenger demand'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
# Our World in Data - Energy intensity of transport
def dataset_29(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',',''),
        'notes': 'Energy intensity is measured as kilowatt-hours of energy needed per passenger kilometer. This is based on data from the US.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1960-01-01',
        'temporal_coverage_end': '2018-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'United States department of Transportation, Bureau of Transportation Statistics (BTS)', 'url': 'https://www.usa.gov/agencies/bureau-of-transportation-statistics'}
        ],
        'language': 'en',
        'sectors': ['rail','road','water','aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Average energy intensity of transport across different modes of travel',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['kWh/PKM'],
        'dimensioning': 'Energy intensity'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
# Our World in Data - CO2 emissions from transport
def dataset_30(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': 'per-capita-co2-emissions-from-transport-2020',
        'notes': 'Emissions are measured in tonnes per person. International aviation and shipping emissions are not included.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Climate Watch', 'url': 'https://www.climatewatchdata.org/'},
            {'title': 'Climate Watch', 'url': 'https://www.climatewatchdata.org/'}
        ],
        'language': 'en',
        'sectors': ['rail','road','aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Per Capita transport emissions from transport',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['tonnes/capita'],
        'dimensioning': 'CO2 emissions (road, rail, bus, domestic air travel)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_31(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': 'co2-emissions-from-transport-2020',
        'notes': 'Emissions are measured in tonnes. Domestic aviation and shipping emissions are included at the national level. International aviation and shipping emissions are included only at the global level.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Climate Watch', 'url': 'https://www.climatewatchdata.org/'}
        ],
        'language': 'en',
        'sectors': ['rail','road','aviation'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'total transport emissions',
        'data_provider': 'Our World in Data',
        'url': 'https://ourworldindata.org/',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'total CO2 emissions (road, rail, bus, domestic air travel)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
# Climatetrace
def dataset_32(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': 'domestic-aviation-country-emissions-climate-trace',
        'notes': 'Annual country-level emissions by greenhouse gas from 2015-2022.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Climate trace', 'url': 'https://climatetrace.org/downloads'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Transport GHG emissions',
        'data_provider': 'Climate trace',
        'url': 'https://climatetrace.org',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'emissions of CO2,N2O,CH4, CO2e 20yr, CO2e 100yr sorted by country and year'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_33(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': 'international-aviation-country-emissions-climate-trace',
        'notes': 'Annual country-level emissions by greenhouse gas from 2015-2022.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Climate trace', 'url': 'https://climatetrace.org/downloads'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['international-aviation'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Transport GHG emissions',
        'data_provider': 'Climate trace',
        'url': 'https://climatetrace.org',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'emissions of CO2,N2O,CH4, CO2e 20yr, CO2e 100yr sorted by country and year'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_34(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': 'other-transport_country-emissions-climate-trace',
        'notes': 'Annual country-level emissions by greenhouse gas from 2015-2022.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Climate trace', 'url': 'https://climatetrace.org/downloads'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Transport GHG emissions',
        'data_provider': 'Climate trace',
        'url': 'https://climatetrace.org',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'emissions of CO2,N2O,CH4, CO2e 20yr, CO2e 100yr sorted by country and year'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_35(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': 'railways_country-emissions-climate-trace',
        'notes': 'Annual country-level emissions by greenhouse gas from 2015-2022.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Climate trace', 'url': 'https://climatetrace.org/downloads'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Transport GHG emissions',
        'data_provider': 'Climate trace',
        'url': 'https://climatetrace.org',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'emissions of CO2,N2O,CH4, CO2e 20yr, CO2e 100yr sorted by country and year'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_36(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': 'road-transportation-country-emissions-climate-trace',
        'notes': 'Annual country-level emissions by greenhouse gas from 2015-2022.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Climate trace', 'url': 'https://climatetrace.org/downloads'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','two-three-wheelers','private-cars','taxis','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Transport GHG emissions',
        'data_provider': 'Climate trace',
        'url': 'https://climatetrace.org',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'emissions of CO2,N2O,CH4, CO2e 20yr, CO2e 100yr sorted by country and year'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_37(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': 'domestic-shipping-country-emissions-climate-trace',
        'notes': 'Annual country-level emissions by greenhouse gas from 2015-2022.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Climate trace', 'url': 'https://climatetrace.org/downloads'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport GHG emissions',
        'data_provider': 'Climate trace',
        'url': 'https://climatetrace.org',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'emissions of CO2,N2O,CH4, CO2e 20yr, CO2e 100yr sorted by country and year'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))   
def dataset_38(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': 'international-shipping-country-emissions-climate-trace',
        'notes': 'Annual country-level emissions by greenhouse gas from 2015-2022.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Climate trace', 'url': 'https://climatetrace.org/downloads'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport GHG emissions',
        'data_provider': 'Climate trace',
        'url': 'https://climatetrace.org',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'emissions of CO2,N2O,CH4, CO2e 20yr, CO2e 100yr sorted by country and year'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))   
# WorldBank AIR
def dataset_39(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',',''),
        'notes': 'International Civil Aviation Organization, Civil Aviation Statistics of the World and ICAO staff estimates.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'International Civil Aviation Organization', 'url': 'https://www.icao.int/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Registered carrier departures (domestic takeoffs and takeoffs abroad of air carriers registered in the country) in line, bar and map diagram',
        'data_provider': 'World Bank',
        'url': 'https://data.worldbank.org/indicators/IS.AIR.DPRT?view=chart',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_40(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'International Civil Aviation Organization, Civil Aviation Statistics of the World and ICAO staff estimates.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'International Civil Aviation Organization', 'url': 'https://www.icao.int/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Air freight',
        'data_provider': 'World Bank',
        'url': 'https://data.worldbank.org/indicators/IS.AIR.GOOD.MT.K1',
        'data_access': 'publicly available',
        'units': ['TKM'],
        'dimensioning': ''
        
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))    
def dataset_41(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'International Civil Aviation Organization, Civil Aviation Statistics of the World and ICAO staff estimates.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'International Civil Aviation Organization', 'url': 'https://www.icao.int/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passengers carried (domestic and international aircraft passengers of air carriers registered in the country)',
        'data_provider': 'World Bank',
        'url': 'https://data.worldbank.org/indicators/IS.AIR.PSGR',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))  
# WorldBank RAIL
def dataset_42(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Internation Union of Railways ( UIC )',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1995-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'International Union of Railways (UIC)', 'url': 'https://uic.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Total route network',
        'data_provider': 'World Bank',
        'url': 'https://data.worldbank.org/indicators/IS.RRS.TOTL.KM',
        'data_access': 'publicly available',
        'units': ['km'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_43(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Internation Union of Railways ( UIC ), OECD Statistics',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1995-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'International Union of Railways (UIC)', 'url': 'https://uic.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Rail freight',
        'data_provider': 'World Bank',
        'url': 'https://data.worldbank.org/indicators/IS.RRS.GOOD.MT.K6',
        'data_access': 'publicly available',
        'units': ['TKM'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_44(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Internation Union of Railways ( UIC Railisa Database ), OECD Statistics',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1995-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'International Union of Railways (UIC)', 'url': 'https://uic.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Rail passenger travel',
        'data_provider': 'World Bank',
        'url': 'https://data.worldbank.org/indicators/IS.RRS.PASG.KM',
        'data_access': 'publicly available',
        'units': ['PKM'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
# WorldBank PORT
def dataset_45(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': 'UNCTAD ( unctad.org/en/Pages/statistics.aspx )',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UNCTAD', 'url': 'https://unctad.org/'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['international-maritime','coastal-shipping'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Container port traffic (flow of containers from land to sea transport modes and vice versa)',
        'data_provider': 'World Bank',
        'url': 'https://data.worldbank.org/indicators/IS.SHP.GOOD.TU',
        'data_access': 'publicly available',
        'units': ['TEU'],
        'dimensioning': 'emissions of CO2,N2O,CH4, CO2e 20yr, CO2e 100yr sorted by country and year'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
# OICA REMOTE RESOURCE
def dataset_46(org_id, dataset_title, resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': 'UNCTAD ( unctad.org/en/Pages/statistics.aspx )',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2019-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Cooperation with Ward Auto (America)', 'url': 'https://www.wardsauto.com/'},
            {'title': 'Asian Automotive Analysis Fourin (Asia)', 'url': 'https://aaa.fourin.com/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Sales new cars',
        'data_provider': 'OICA',
        'url': 'https://www.oica.net/category/sales-statistics/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'Registration or sales of new passenger cars, commercial vehicles, all vehicles'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        print(response.text)
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_remote_url(data['name'], resource_url)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_47(org_id, dataset_title, resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': 'UNCTAD ( unctad.org/en/Pages/statistics.aspx )',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Cooperation with Ward Auto (America)', 'url': 'https://www.wardsauto.com/'},
            {'title': 'Asian Automotive Analysis Fourin (Asia)', 'url': 'https://aaa.fourin.com/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Vehicle fleet',
        'data_provider': 'OICA',
        'url': 'https://www.oica.net/category/vehicles-in-use/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'Passenger cars, commercial vehicles, all vehicles, motorization rate'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        print(response.text)
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_remote_url(data['name'], resource_url)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_48(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': 'This OICA statistics web page contains world motor vehicle production statistics, obtained from national trade organizations, OICA members or correspondents.',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1999-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Cooperation with Ward Auto (America)', 'url': 'https://www.wardsauto.com/'},
            {'title': 'Asian Automotive Analysis Fourin (Asia)', 'url': 'https://aaa.fourin.com/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Vehicle production',
        'data_provider': 'OICA',
        'url': 'https://www.oica.net/production-statistics/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'vehicle production by country/region and type (passenger cars, LDV, heavy trucks, buses & coaches)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://www.oica.net/wp-content/uploads/By-country-region-2023.xlsx',
              'https://www.oica.net/wp-content/uploads/Passenger-Cars-2023.xlsx',
              'https://www.oica.net/wp-content/uploads/Light-Commercial-Vehicles-2023.xlsx',
              'https://www.oica.net/wp-content/uploads/Heavy-Trucks-2023.xlsx',
              'https://www.oica.net/wp-content/uploads/Heavy-Trucks-2023.xlsx']
        for resource in resource_url:
            filename = resource.split('/')[-1]  
            resource_name = filename.split('.')[0] 
            create_resource_remote_url(data['name'], resource, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
# ACEA
def dataset_49(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ACEA - European Automobile Manufacturers Association', 'url': 'https://www.acea.auto/files/ACEA-report-vehicles-in-use-europe-2022.pdf'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Vehicle Fleet',
        'data_provider': 'ACEA',
        'url': 'https://www.acea.auto',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'Vehicles in use, distinguished by age and by fuel type, motorization rates'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        filename = resource_url.split('/')[-1]  
        resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_50(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2024-07-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ACEA - European Automobile Manufacturers Association', 'url': 'https://www.acea.auto/nav/?content=passenger-car-registrations'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','truck','bus'],
        'services': ['passenger'],
        'frequency': 'monthly',
        'indicators': 'Vehicle Registration',
        'data_provider': 'ACEA',
        'url': 'https://www.acea.auto',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'New passenger car registrations distinguished by country and manufacturer'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        filename = resource_url.split('/')[-1]  
        resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_51(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2024-07-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ACEA - European Automobile Manufacturers Association', 'url': 'https://www.acea.auto/nav/?content=commercial-vehicle-registrations'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','truck','bus'],
        'services': ['passenger'],
        'frequency': 'monthly',
        'indicators': 'Vehicle Registration',
        'data_provider': 'ACEA',
        'url': 'https://www.acea.auto',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'New passenger car registrations distinguished by country and manufacturer'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        filename = resource_url.split('/')[-1]  
        resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_52(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ACEA - European Automobile Manufacturers Association', 'url': 'https://www.acea.auto/nav/?content=fuel-types-of-new-passenger-cars'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','truck','bus'],
        'services': ['passenger'],
        'frequency': 'monthly',
        'indicators': 'Vehicle Registration',
        'data_provider': 'ACEA',
        'url': 'https://www.acea.auto',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'New passenger car registrations by country and fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        filename = resource_url.split('/')[-1]  
        resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_53(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2020-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ACEA - European Automobile Manufacturers Association', 'url': 'https://www.acea.auto/nav/?content=fuel-types-of-new-commercial-vehicles'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','truck','bus'],
        'services': ['passenger'],
        'frequency': 'annually',
        'indicators': 'Vehicle Registration',
        'data_provider': 'ACEA',
        'url': 'https://www.acea.auto',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'New commercial vehicle registrations distinguished by country and fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://www.acea.auto/files/ACEA_buses_by_fuel_type_full-year-2022.pdf',
              'https://www.acea.auto/files/ACEA_Trucks_by_fuel_type_full-year-2022.pdf',
              'https://www.acea.auto/files/ACEA_vans_by_fuel_type_FY2022.pdf']
        for resource in resource_url:
            filename = resource.split('/')[-1]  
            resource_name = filename.split('.')[0] 
            create_resource_remote_url(data['name'], resource, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_54(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ACEA - European Automobile Manufacturers Association', 'url': 'https://www.acea.auto/figure/co2-emissions-from-car-production-in-eu/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Car Production CO2 emissions',
        'data_provider': 'ACEA',
        'url': 'https://www.acea.auto',
        'data_access': 'publicly available',
        'units': ['tonnes/year','tonnes/car'],
        'dimensioning': 'CO2 emissions per year and per vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_name = resource_url.split('/')[-1]  
        #resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_55(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': 'ENERGY CONSUMPTION DURING CAR PRODUCTION',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ACEA - European Automobile Manufacturers Association', 'url': 'https://www.acea.auto/figure/energy-consumption-during-car-production-in-eu/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Car Production energy consumption',
        'data_provider': 'ACEA',
        'url': 'https://www.acea.auto',
        'data_access': 'publicly available',
        'units': ['MWh/year','MWh/car'],
        'dimensioning': 'Energy consumption per year and per vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_name = resource_url.split('/')[-1]  
        #resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_56(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': 'WATER USED IN CAR PRODUCTION',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ACEA - European Automobile Manufacturers Association', 'url': 'https://www.acea.auto/figure/water-used-in-car-production-in-eu/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Car Production water consumption',
        'data_provider': 'ACEA',
        'url': 'https://www.acea.auto',
        'data_access': 'publicly available',
        'units': ['m³/year','m³/car'],
        'dimensioning': 'water consumption per year and per vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_name = resource_url.split('/')[-1]  
        #resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_57(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': 'WASTE FROM CAR PRODUCTION',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ACEA - European Automobile Manufacturers Association', 'url': 'https://www.acea.auto/figure/waste-from-car-production-in-eu/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Car Production water consumption',
        'data_provider': 'ACEA',
        'url': 'https://www.acea.auto',
        'data_access': 'publicly available',
        'units': ['tonnes/year','tonnes/car'],
        'dimensioning': 'waste production per year and per vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_name = resource_url.split('/')[-1]  
        #resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
        
# CCG - Climate Compatible Growth
def dataset_58(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': 'Starter kits with transport&energy datasets to simplify decarbonization policies in developing countries',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'geographies': ['afg','asm','sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UN Desa', 'url': 'https://www.un.org/en/desa'},
            {'title': 'World Bank', 'url': 'https://data.worldbank.org/'},
            {'title': 'ADB', 'url': 'https://www.adb.org/'},
            {'title': 'National Statistics Institute', 'url': 'https://climatecompatiblegrowth.com/starter-kits/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger person-kilometer',
        'data_provider': 'Climate Compatible Growth',
        'url': 'https://climatecompatiblegrowth.com/starter-kits/',
        'data_access': 'publicly available',
        'units': ['PKM'],
        'dimensioning': 'by mode (rail, road, aviation, inland waterways)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        print(response.text)
        response.raise_for_status()  # Raises an error for HTTP errors
        
        print('Dataset created successfully:', response.json())
        resource_name = resource_url.split('/')[-1]  
        #resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_59(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': 'Starter kits with transport&energy datasets to simplify decarbonization policies in developing countries',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'geographies': ['afg','asm','sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UN Desa', 'url': 'https://www.un.org/en/desa'},
            {'title': 'World Bank', 'url': 'https://data.worldbank.org/'},
            {'title': 'ADB', 'url': 'https://www.adb.org/'},
            {'title': 'National Statistics Institute', 'url': 'https://climatecompatiblegrowth.com/starter-kits/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight ton kilometer',
        'data_provider': 'Climate Compatible Growth',
        'url': 'https://climatecompatiblegrowth.com/starter-kits/',
        'data_access': 'publicly available',
        'units': ['TKM'],
        'dimensioning': 'by mode (rail, road, aviation, inland waterways)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        print(response.text)
        response.raise_for_status()  # Raises an error for HTTP errors
        
        print('Dataset created successfully:', response.json())
        resource_name = resource_url.split('/')[-1]  
        #resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_60(org_id, dataset_title,resource_url):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace(':',''),
        'notes': 'Starter kits with transport&energy datasets to simplify decarbonization policies in developing countries',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'geographies': ['afg','asm','sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UN Desa', 'url': 'https://www.un.org/en/desa'},
            {'title': 'World Bank', 'url': 'https://data.worldbank.org/'},
            {'title': 'ADB', 'url': 'https://www.adb.org/'},
            {'title': 'National Statistics Institute', 'url': 'https://climatecompatiblegrowth.com/starter-kits/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'vehicle fleet',
        'data_provider': 'Climate Compatible Growth',
        'url': 'https://climatecompatiblegrowth.com/starter-kits/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        print(response.text)
        response.raise_for_status()  # Raises an error for HTTP errors
        
        print('Dataset created successfully:', response.json())
        resource_name = resource_url.split('/')[-1]  
        #resource_name = filename.split('.')[0]
        create_resource_remote_url(data['name'], resource_url, resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
        
## EUROSTAT RAIL
def dataset_61(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ERA', 'url': 'https://www.era.europa.eu/'},
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/tran_sf_railac/default/table?lang=en&category=tran_sf.tran_sf_rail'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Number of accidents',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'accidents by type of accident'
        
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_62(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ERA', 'url': 'https://www.era.europa.eu/'},
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/tran_sf_railvi/default/table?lang=en&category=tran_sf.tran_sf_rail'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of accidents',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'accident victims'
        
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_63(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ERA', 'url': 'https://www.era.europa.eu/'},
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/tran_sf_railsu/default/table?lang=en&category=tran_sf.tran_sf_rail'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Number of accidents',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'dangerous goods'
        
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_64(org_id, dataset_title, resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'ERA', 'url': 'https://www.era.europa.eu/'},
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/tran_sf_railac/default/table?lang=en&category=tran_sf.tran_sf_rail'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of accidents',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'suicides'
        
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_65(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/rail_if_tracks?category=rail.rail_if'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['km'],
        'dimensioning': 'Length of railway tracks'
        
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_66(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/rail_if_line_ga?category=rail.rail_if'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['km'],
        'dimensioning': 'Length of railway lines'
        
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_67(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_if_line_ga/default/table?lang=en&category=rail.rail_if'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['km'],
        'dimensioning': 'Length of electrified and non-electrified railway lines'
        
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_68(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_if_line_na/default/table?lang=en&category=rail.rail_if'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['km'],
        'dimensioning': 'Length of electric and non-electric railway lines'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_69(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_if_electri/default/table?lang=en&category=rail.rail_if'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['km'],
        'dimensioning': 'Length of electrified railway lines'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_70(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_if_line_sp/default/table?lang=en&category=rail.rail_if'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['km'],
        'dimensioning': 'Length of railway lines'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_71(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_if_traff/default/table?lang=en&category=rail.rail_if'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['km'],
        'dimensioning': 'Length of railway lines'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_72(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_if_lvlcros/default/table?lang=en&category=rail.rail_if'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['km'],
        'dimensioning': 'Level crossings by type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_73(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport measurement - passengers',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_pa_total/default/table?lang=en&category=rail.rail_pa'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'passenger transported',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^6 PKM'],
        'dimensioning': 'national&international'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_74(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport measurement - passengers',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_pa_intgong/default/table?lang=en&category=rail.rail_pa'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'International transport of passengers',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 passengers'],
        'dimensioning': 'national&international'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_75(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport measurement - passengers',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_pa_intcmng/default/table?lang=en&category=rail.rail_pa'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'International transport of passengers',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 passengers'],
        'dimensioning': 'national&international'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_76(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport measurement - passengers',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_pa_typepas/default/table?lang=en&category=rail.rail_pa'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'passenger transported',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^6 PKM'],
        'dimensioning': 'by type of transport'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_77(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport measurement - passengers',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_pa_speed/default/table?lang=en&category=rail.rail_pa'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'passenger transported',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by speed of train'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_78(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport measurement - goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_total/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'freight transported',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes'],
        'dimensioning': 'national&international'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_79(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport measurement - passengers',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_intcmgn/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passengers transported',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes'],
        'dimensioning': 'national&international'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_80(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport measurement - passengers',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_intgong/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passengers transported',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes'],
        'dimensioning': 'national&international'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_81(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport equipment',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_eq_locon/default/table?lang=en&category=rail.rail_eq'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Number of locomotives and railcars',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'source of energy'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_82(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport equipment',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_eq_locop/default/table?lang=en&category=rail.rail_eq'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Number of locomotives and railcars',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by tractive power'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_83(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport equipment',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_eq_pa_nty/default/table?lang=en&category=rail.rail_eq'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Passenger railway vehicles',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by type of vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_84(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport equipment',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_eq_pa_nca/default/table?lang=en&category=rail.rail_eq'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Passenger railway vehicles',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by category of vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_85(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')',''),
        'notes': 'Railway transport equipment',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_eq_pa_cty/default/table?lang=en&category=rail.rail_eq'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Capacity of passenger railway vehicles',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['seats'],
        'dimensioning': 'by type of vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_86(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport equipment',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_eq_pa_csb/default/table?lang=en&category=rail.rail_eq'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Capacity of passenger railway vehicles',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['seats'],
        'dimensioning': 'by category of seats or berths'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_87(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport equipment',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_eq_wagon__custom_12899836/default/table?lang=en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of wagons/vans and load capacity of wagons',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#','10^3 tonnes'],
        'dimensioning': 'by type of wagons, by type of vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_88(org_id, dataset_title,resource_name):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport equipment',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_eq_trset/default/table?lang=en&category=rail.rail_eq'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Trainset',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#','10^3 seats'],
        'dimensioning': 'by speed'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_89(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - passengers',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/tran_r_rapa/default/table?lang=en&category=rail.rail_pa'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'National&international passengers',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['passengers'],
        'dimensioning': 'by loading/unloading'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_90(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - passengers',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1979-01-01',
        'temporal_coverage_end': '2012-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_pa_nbcar/default/table?lang=en&category=rail.rail_pa'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'passenger cars in accompanied car railway transport',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by type of transport'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_91(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - passengers',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1979-01-01',
        'temporal_coverage_end': '2012-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/rail_pa_nbpass?category=rail.rail_pa'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'passengers in accompanied car railway transport',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['passengers'],
        'dimensioning': 'by type of transport'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_92(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2003-01-01',
        'temporal_coverage_end': '2003-12-31',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/rail_go_typepas?category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes'],
        'dimensioning': 'by type of transport'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_93(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_grpgood/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes','10^6 TKM'],
        'dimensioning': 'by group of goods'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_94(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2003-01-01',
        'temporal_coverage_end': '2007-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_grgood7/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes','10^6 TKM'],
        'dimensioning': 'by group of goods'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_95(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2003-01-01',
        'temporal_coverage_end': '2007-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_consgmt/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes','10^6 TKM'],
        'dimensioning': 'by type of consignment'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_96(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2003-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_trsorde/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes','10^6 TKM'],
        'dimensioning': 'Transit transport of goods by loading and unloading countries'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_97(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_trsorde/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'National&international transport of goods'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_98(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2003-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_dnggood/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes','10^6 TKM'],
        'dimensioning': 'Transport of dangerous goods by type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_99(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2003-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_dnggood/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes','10^6 TKM'],
        'dimensioning': 'Goods transported in intermodal transport units by type of cargo'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_100(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway transport measurement - goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2003-01-01',
        'temporal_coverage_end': '2023-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_go_dnggood/default/table?lang=en&category=rail.rail_go'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes','10^6 TKM'],
        'dimensioning': 'Goods transported in intermodal transport units by transport coverage '
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_101(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway traffic',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2013-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_tf_traveh/default/table?lang=en&category=rail.rail_tf'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 VKM'],
        'dimensioning': 'Train movements by train category, vehicles (source of power)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_102(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway traffic',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_tf_passmov/default/table?lang=en&category=rail.rail_tf'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 VKM'],
        'dimensioning': 'Passenger train movements by type of train (speed) '
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_103(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway traffic',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1979-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_tf_hautype/default/table?lang=en&category=rail.rail_tf'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^6 gross TKM'],
        'dimensioning': 'Hauled vehicle movement by type of vehicle, source of power'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_104(org_id, dataset_title,resource_name):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway traffic',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/view/rail_tf_haulmov/default/table?lang=en&category=rail.rail_tf'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^6 VKM'],
        'dimensioning': 'Hauled vehicle movement by type of railway vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        create_resource_local_file(data['name'], resource_name)
    except Exception as e:
        print('Error creating dataset:', str(e))
## EUROSTAT ROAD
def dataset_105(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Railway traffic',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2020-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/rail_tf_ns20_bg?category=rail.rail_tf.rail_tf_ns20'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'rail network',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'Train traffic on the rail network'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_bg?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_cz?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_de?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_de?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_es?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_es?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_el?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_fr?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_hr?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_it?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_lt?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_lv?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_lu?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_hu?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_nl?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_pt?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_pl?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_ro?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_si?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_sk?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_fi?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_se?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_no?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_ch?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_tr?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_at?format=TSV&compressed=false',
              'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/rail_tf_ns20_mk?format=TSV&compressed=false'
              ]
        for resource in resource_url:
            resource_name = resource.split('/data/')[1].split('?')[0]
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_106(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Road transport safety',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2011-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/tran_sf_roadus?category=tran_sf.tran_sf_road'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','taxis','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of accidents',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'Persons killed (by sex, category of person involved, age)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_sf_roadus?format=TSV&compressed=false'
              ]
        for resource in resource_url:
            resource_name = resource.split('/data/')[1].split('?')[0]
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_107(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Road transport safety',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2011-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/tran_sf_roadro?category=tran_sf.tran_sf_road'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','taxis','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of accidents',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'Persons killed type of road'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_sf_roadro?format=TSV&compressed=false'
              ]
        for resource in resource_url:
            resource_name = resource.split('/data/')[1].split('?')[0]
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_108(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Road transport safety',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2011-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/tran_sf_roadve?category=tran_sf.tran_sf_road'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','taxis','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of accidents',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'Persons killed type of vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_sf_roadve?format=TSV&compressed=false'
              ]
        for resource in resource_url:
            resource_name = resource.split('/data/')[1].split('?')[0]
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_109(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Modal split of transport - freight',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/tran_hv_frmod?category=tran.tran_hv_ms'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail','two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport modal split',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'train, passenger car, motor coaches/buses/trolley buses'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_hv_frmod?format=TSV&compressed=false'
              ]
        for resource in resource_url:
            resource_name = resource.split('/data/')[1].split('?')[0]
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))  
def dataset_110(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Modal split of transport - passenger',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/tran_hv_psmod?category=tran.tran_hv_ms'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail','two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport modal split',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'train, passenger car, motor coaches/buses/trolley buses'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_hv_psmod?format=TSV&compressed=false'
              ]
        for resource in resource_url:
            resource_name = resource.split('/data/')[1].split('?')[0]
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))  
def dataset_111(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Road transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/road_if_motorwa?category=road.road_if'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport infrastructure - Road Network',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': 'Length of roads by categories of road, type of surface'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_if_motorwa?format=TSV&compressed=false'
              ]
        for resource in resource_url:
            resource_name = resource.split('/data/')[1].split('?')[0]
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))  
def dataset_112(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Road transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/road_if_roadsc?category=road.road_if'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport infrastructure - Road Network',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': 'Length of roads by categories of road, type of surface'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_if_roadsc?format=TSV&compressed=false'
              ]
        for resource in resource_url:
            resource_name = resource.split('/data/')[1].split('?')[0]
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))  
def dataset_113(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Road transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/road_if_barea?category=road.road_if'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport infrastructure - Road Network',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': 'Length of roads by categories of road, type of surface'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_if_barea?format=TSV&compressed=false'
              ]
        for resource in resource_url:
            resource_name = resource.split('/data/')[1].split('?')[0]
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_114(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Road transport infrastructure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/road_if_bsurfa?category=road.road_if'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport infrastructure - Road Network',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': 'Length of roads by categories of road, type of surface'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        resource_url= ['https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_if_bsurfa?format=TSV&compressed=false'
              ]
        for resource in resource_url:
            resource_name = resource.split('/data/')[1].split('?')[0]
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_115(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2010-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/product/view/road_if_bsurfa?category=road.road_if'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport equipment - Vehicle Fleet',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'Stock of vehicles by type of vehicle, by motor energy, by engine capacity, by age, by weight'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Mopeds and motorcycles by type of motor energy': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_mopeds?format=TSV&compressed=false',
            'Motorcycles by engine size': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_motorc?format=TSV&compressed=false',
            'Passenger cars by age': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_carage?format=TSV&compressed=false',
            'Passenger cars, by type of motor energy and size of engine': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_carmot?format=TSV&compressed=false',
            'Passenger cars, by type of motor energy ': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_carpda?format=TSV&compressed=false',
            'Passenger cars - per thousand inhabitants': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_carhab?format=TSV&compressed=false',
            'Passenger cars by unloaded weight': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_unlweig?format=TSV&compressed=false',
            'Motor coaches, buses and trolley buses, by type of vehicle ': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_busveh?format=TSV&compressed=false',
            'Motor coaches, buses and trolley buses by age': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_busage?format=TSV&compressed=false',
            'Motor coaches, buses and trolley buses, by type of motor energy': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_busmot?format=TSV&compressed=false',
            'Seats /berths in motor coaches, buses and trolley buses': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_bussea?format=TSV&compressed=false',
            'Trams': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_trams?format=TSV&compressed=false',
            'Lorries and road tractors by age and type of vehicle': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_lorroa?format=TSV&compressed=false',
            'Lorries, by type of motor energy': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_lormot?format=TSV&compressed=false',
            'Special purpose road vehicles': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_spurp?format=TSV&compressed=false',
            'Road tractors by type of motor energy': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_roaene?format=TSV&compressed=false'
            
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e)) 
def dataset_116(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': ' ',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2013-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport equipment',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes'],
        'dimensioning': 'Load capacities by type of vehicle, by permissible maximum gross weight'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Semi-trailers and their load capacity, by permissible maximum gross weight': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_semit?format=TSV&compressed=false',
            'Trailers and their load capacity, by permissible maximum gross weight': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqs_trail?format=TSV&compressed=false'
            
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_117(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'New registration of vehicles by type of vehicle, type of motor energy, by power of vehicle, by engine size, by unloaded weight, by seat capacity, by permissible maximum gross weight',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1989-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport equipment',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'New registration of vehicles by type of vehicle, type of motor energy, by power of vehicle, by engine size, by unloaded weight, by seat capacity, by permissible maximum gross weight'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'New mopeds and motorcycles by type of motor energy': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_mopeds?format=TSV&compressed=false',
            'New motorcycles by engine size': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_motors?format=TSV&compressed=false',
            'New passenger cars by type of motor energy and engine size':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_carmot?format=TSV&compressed=false',
            'New passenger cars by type of motor energy':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_carpda?format=TSV&compressed=false',
            'New passenger cars by unloaded weight':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_unlweig?format=TSV&compressed=false',
            'New motor coaches, buses and trolley buses , by type of vehicles':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_busveh?format=TSV&compressed=false',
            'New motor coaches, buses and trolley buses by type of motor energy':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_busmot?format=TSV&compressed=false',
            'Seat capacity of new motor coaches, buses and trolley buses':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_bussea?format=TSV&compressed=false',
            'New trams':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_trams?format=TSV&compressed=false',
            'New lorries, by type of motor energy':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_lormot?format=TSV&compressed=false',
            'New special purpose road vehicles':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_spurp?format=TSV&compressed=false',
            'New road tractors by type of motor energy':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_tracmot?format=TSV&compressed=false',
            'New zero-emission vehicles by type of vehicle and type of motor energy':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_zev?format=TSV&compressed=false',
            'Share of new zero-emission vehicles in all new vehicles of the same type, by type of vehicle and type of motor energy':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_zevpc?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_118(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Load capacitiy of new vehicles by type of vehicle and by permissible maximum gross weight',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2013-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport equipment',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes'],
        'dimensioning': 'Load capacitiy of new vehicles by type of vehicle and by permissible maximum gross weight'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'New lorries and their load capacity by permissible maximum gross weight': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_lorrit?format=TSV&compressed=false',
            'New semi-trailers and their load capacity, by permissible maximum gross weight': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_semit?format=TSV&compressed=false',
            'New trailers and their load capacity, by permissible maximum gross weight ':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_eqr_trail?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_119(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Road traffic activity - Vehicle movement by type of vehicles, by vehicle registrations, by age of vehicles',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2013-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Road traffic activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^6 VKM'],
        'dimensioning': 'Vehicle movement by type of vehicles, by vehicle registrations, by age of vehicles'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Road motor vehicle traffic performance by traffic and registration location and type of vehicle ': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_tf_vehmov?format=TSV&compressed=false',
            'Road traffic performance by category of vehicle registration and traffic, type of vehicle and motor energy': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_tf_veh?format=TSV&compressed=false',
            'National road traffic performance by type of vehicle and type of road':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_tf_road?format=TSV&compressed=false',
            'Road traffic performance on national and foreign territory by age of vehicle, type of vehicle and motor energy':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_tf_vehage?format=TSV&compressed=false',
            'Buses and coaches traffic performance registered in the reporting country by transport covarage':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_tf_buscoa?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_120(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Passenger transport activity by type of vehicles, by type of transport',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^6 PKM'],
        'dimensioning': 'by type of vehicles, by type of transport'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'National passenger road transport performance by type of vehicles registered in the reporting country': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_pa_mov?format=TSV&compressed=false',
            'Passenger transport performance of buses and coaches registered in the reporting country by transport coverage': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_pa_buscoa?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_121(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight transport activity Total road freight transport by type of transport, by type of vehicle, by age of vehicle, by type of carriage, by type of goods, by region of loading/unloading, by distance, by maximum permissible laden weight, by load capacity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1999-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['"10^3 tonnes','10^3 journeys','10^6 TKM','10^6 VKM'],
        'dimensioning': 'Total road freight transport by type of transport, by type of vehicle, by age of vehicle, by type of carriage, by type of goods, by region of loading/unloading, by distance, by maximum permissible laden weight, by load capacity'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Road freight transport by type of operation and type of transport (t, tkm, vehicle-km) - annual data': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_tott?format=TSV&compressed=false',
            'Road freight transport by type of operation and type of transport - (t, tkm, vehicle-km) - quarterly data': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_tq_tott?format=TSV&compressed=false',
            'Road freight transport by type of goods and type of transport (t, tkm) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_tg?format=TSV&compressed=false',
            'Road freight transport by region of loading (t, tkm, journeys) - annual data ':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_rl?format=TSV&compressed=false',
            'Road freight transport by region of unloading (t, tkm, journeys) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_ru?format=TSV&compressed=false',
            'Road freight transport by distance class and type of transport (t, tkm, vehicle-km, basic transport operations) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_dc?format=TSV&compressed=false',
            'Road freight transport by distance class and type of goods (t, tkm, vehicle-km, basic transport operations) - annual data (from 2008 onwards)':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_dctg?format=TSV&compressed=false',
            'Road freight transport by axle configuration of vehicle (tkm, vehicle-km, journeys) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_axle?format=TSV&compressed=false',
            'Road freight transport by age of vehicle (tkm, vehicle-km, journeys) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_agev?format=TSV&compressed=false',
            'Road freight transport by maximum permissible laden weight (MPLW) of vehicle (tkm, vehicle-km, journeys) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_mplw?format=TSV&compressed=false',
            'Road freight transport by load capacity (LC) of vehicle and type of transport (tkm, vehicle-km, journeys) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_lc?format=TSV&compressed=false',
            'Road freight transport by NACE Rev. 2 activity (tkm, vehicle-km, journeys) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_nace?format=TSV&compressed=false',
            'Road freight transport vehicle movements by loading status, type of transport and territorial coverage (vehicle-km, journeys) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_vm?format=TSV&compressed=false',
            'Road freight transport vehicle transit movements by transit country, loading status and maximum permissible laden weight (MPLW) of vehicle (t, journeys) - annual data, EU aggregates':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_trat?format=TSV&compressed=false',
            'Road freight transport vehicle transit movements by transit country, loading status and maximum permissible laden weight (MPLW) of vehicle (t, journeys) - quarterly data, EU totals':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_tq_trat?format=TSV&compressed=false',
            'Road freight transport vehicle transit movements by transit country (t, journeys) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_tra?format=TSV&compressed=false',
            'Road freight transport of dangerous goods by type of dangerous goods and territorial coverage (tkm, vehicle-km, basic transport operations) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_dg?format=TSV&compressed=false',
            'Road freight transport by type of cargo and distance class (t, tkm, vehicle-km, basic transport operations) - annual data':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/road_go_ta_tcrg?format=TSV&compressed=false',
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
# EUROSTAT AIR
def dataset_122(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Number of accidents - accident victims in commercial air transport/aerial works/general aviation by country of occurence and country of registration of aircraft',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2012-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'EASA', 'url': 'https://www.easa.europa.eu/en'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Number of accidents',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'accident victims in commercial air transport/aerial works/general aviation by country of occurence and country of registration of aircraft'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Air accident victims in commercial air transport, by country of occurrence and country of registration of aircraft': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_sf_aviaca?format=TSV&compressed=false',
            'Air accident victims in aerial works, by country of occurrence and country of registration of aircraft': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_sf_aviaaw?format=TSV&compressed=false',
            'Air accident victims in general aviation, by country of occurrence and country of registration of aircraft - maximum take-off mass above 2250 kg':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_sf_aviagah?format=TSV&compressed=false',
            'Air accident victims in general aviation by country of occurrence and country of registration of aircraft - maximum take-off mass under 2250 kg':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_sf_aviagal?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_123(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Infrastructure - Number of commercial aitports by size of airport',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2001-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'Number of commercial aitports by size of airport'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Commercial airports by type': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_if_arp?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_124(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Equipment - Commercial air craft fleet by aircraft category, by country of operatur, by age of aircraft, by country of registration',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2001-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Equipment',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'Commercial air craft fleet by aircraft category, by country of operatur, by age of aircraft, by country of registration'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Commercial aircraft fleet by aircraft category and country of operator': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_eq_arc_typ?format=TSV&compressed=false',
            'Commercial aircraft fleet by age of aircraft and country of operator': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_eq_arc_age?format=TSV&compressed=false',
            'Commercial aircraft fleet by aircraft category and country of registration': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_eq_arc_typreg?format=TSV&compressed=false',
            'Commercial aircraft fleet by age of aircraft and country of registration': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_eq_arc_agereg?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_125(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Passenger transport activity - National/international passenger transport by transport coverage, by main airports, by aircraft model',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'National/international passenger transport by transport coverage, by main airports, by aircraft model'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Air passenger transport by type of schedule, transport coverage and country': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_paoc?format=TSV&compressed=false',
            'Air passenger transport by type of schedule, transport coverage and main airports': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_paoa?format=TSV&compressed=false',
            'Air passenger transport between reporting countries': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_paocc?format=TSV&compressed=false',
            'Air passenger transport between main airports and partner reporting countries': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_paoac?format=TSV&compressed=false',
            'Air passenger transport by aircraft model, distance bands and transport coverage': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_paodis?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_126(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Passenger transport activity - Passenger transport over national territory by transport coverage',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^6 PKM'],
        'dimensioning': 'Passenger transport over national territory by transport coverage'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'National air passenger transport by reporting country': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_panc?format=TSV&compressed=false',
            'National air passenger transport by main airports': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_pana?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_127(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight and mail transport activity - National/international transport by reporting country, by aircraft model, distance bands, transport coverage',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight and mail transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'National/international transport by reporting country, by aircraft model, distance bands, transport coverage'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight and mail air transport by type of schedule, transport coverage and country': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_gooc?format=TSV&compressed=false',
            'Fright and mail air transport by type of schedule, transport coverage and main airports': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_gooa?format=TSV&compressed=false',
            'Freight and mail air transport between reporting countries': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_goocc?format=TSV&compressed=false',
            'Freight and mail air transport between main airports and partner reporting countries': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_gooac?format=TSV&compressed=false',
            'Freight and mail air transport by aircraft model, distance bands and transport coverage': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_goodis?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_128(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight and mail transport activity - Freight and mail transport over national territory by transport coverage',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight and mail transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^6 TKM'],
        'dimensioning': 'Freight and mail transport over national territory by transport coverage'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'National freight and mail air transport by reporting country': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_gonc?format=TSV&compressed=false',
            'National freight and mail air transport by main airports': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_gona?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_129(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'passenger air transport over national territory',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'passenger transported',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^6 PKM'],
        'dimensioning': 'passenger air transport over national territory'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger air transport over national territory (including territorial sea) - million passenger-km': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_tppa?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_130(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight and mail air transport over national territory',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'freight transported',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^6 TKM'],
        'dimensioning': 'freight and mail air transport over national territory'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight and mail air transport over national territory (including territorial sea) - million tonne-km': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/avia_tpgo?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
# EUROSTAT MARITIME        
def dataset_131(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Number of accidents - accident victims by sea basin of occurence and coutnry of registration of vessels, category of victims, type of vessel',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2012-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'EMSA', 'url': 'https://www.emsa.europa.eu/'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['international-maritime'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Number of accidents',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'Accident victims by sea basin of occurence and coutnry of registration of vessels, category of victims, type of vessel'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Maritime accident victims by sea basin of occurrence and country of registration of vessels': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_sf_marv?format=TSV&compressed=false',
            'Maritime accident victims by sea basin of occurrence, country of registration of vessels and category of victims': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_sf_marvper?format=TSV&compressed=false',
            'Maritime accident victims by sea basin of occurrence, country of registration of vessels and type of vessels': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_sf_marves?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_132(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight transport activity - Gross weight of goods handled in ports by type of port, by type of cargo, by type of traffic, by direction of flow',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1997-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['international-maritime'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes'],
        'dimensioning': 'Gross weight of goods handled in ports by type of port, by type of cargo, by type of traffic, by direction of flow'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Gross weight of goods handled in all ports by direction - annual data': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/mar_go_aa?format=TSV&compressed=false',
            'Gross weight of goods transported to/from main ports by direction and type of traffic (national and international) - quarterly data': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/mar_go_qm?format=TSV&compressed=false',
            'Gross weight of goods handled in main ports by direction and type of cargo - quarterly data': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/mar_go_qmc?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_133(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Passenger transport activity - passengers embarked/disembarked by type of port, by direction of transport, by type of traffic',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1997-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['international-maritime'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 #'],
        'dimensioning': 'passengers embarked/disembarked by type of port, by direction of transport, by type of traffic'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passengers embarked and disembarked in all ports by direction - annual data': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/mar_pa_aa?format=TSV&compressed=false',
            'Passengers (excluding cruise passengers) transported from/to the main ports by direction and transport coverage - quarterly data': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/mar_pa_qm?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_134(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Vessels traffic by type and size of vessels',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1997-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['international-maritime'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Vessels traffic',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#','gross tonnage'],
        'dimensioning': 'by type and size of vessels'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Vessels arriving in the main ports by type of vessels - annual data': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/mar_mt_am_csvi?format=TSV&compressed=false',
            'Vessels arriving in the main ports by type and size of vessels - quarterly data': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/mar_tf_qm?format=TSV&compressed=false',
            'Vessels arriving in main EU ports by type of vessels (estimates) - experimental statistics':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/mar_v_est?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_135(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Transport infrastructure - navigable inland waterways by waterways type, by horizontal dimension of vessels, by pushed convoys',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Transport infrastructure',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': 'Navigable inland waterways by waterways type, by horizontal dimension of vessels, by pushed convoys'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Length of navigable inland waterways by waterway type': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_if_infrastr?format=TSV&compressed=false',
            'Navigable inland waterways, by horizontal dimensions of vessels and pushed convoys': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_if_hordim?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_136(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Transport equipment - number of vessels/Power of vessels/load capacity by type of vessel, by load capacity, by date of construction',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Transport equipment',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['#','Megawatt','10^3 tonnes'],
        'dimensioning': 'Number of vessels/Power of vessels/load capacity by type of vessel, by load capacity, by date of construction'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Self-propelled vessels, dumb and pushed vessels by load capacity': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_eq_loadcap?format=TSV&compressed=false',
            'Power of self-propelled vessels by load capacity': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_eq_power_lo?format=TSV&compressed=false',
            'Self-propelled vessels, tugs and pushers and their power by year of construction':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_eq_age?format=TSV&compressed=false',
            'Load capacity of self-propelled vessels by year of construction':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_eq_age_loa?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_137(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight transport activity - transport by type of goods, by type of transport, by type of packaging, by type of cargo, by type of vessel, by nationality of vessel, by transport coverage',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2007-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 tonnes','10^6 TKM'],
        'dimensioning': 'Transport by type of goods, by type of transport, by type of packaging, by type of cargo, by type of vessel, by nationality of vessel, by transport coverage'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Transport by type of good (from 2007 onwards with NST2007) ': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_atygo?format=TSV&compressed=false',
            'Transport by type of good (country/regional flows from 2007 onwards)': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_atygofl?format=TSV&compressed=false',
            'Inland waterway transport by type of cargo and country/region of loading and unloading':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_atycafl?format=TSV&compressed=false',
            'Inland waterway transport by type of cargo, type of goods and coverage':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_atyca?format=TSV&compressed=false',
            'Transport by type of vessel':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_atyve?format=TSV&compressed=false',
            'Inland waterway transport by nationality of vessel and coverage':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_anave?format=TSV&compressed=false',
            'Transport by type of vessel (country/regional flows) ':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_atyvefl?format=TSV&compressed=false',
            'Inland waterway transport by nationality of vessel and country/region of loading and unloading (2007 onwards)':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_anavefl?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_138(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight transport activity - Container transport by type of good, by site of container',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2007-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['TEU'],
        'dimensioning': 'Container transport by type of good, by site of container'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Container transport by type of goods and coverage (from 2007 onwards)': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_actygo?format=TSV&compressed=false',
            'Container transport by size of container': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_acsize?format=TSV&compressed=false',
            'Container transport by type of goods and country/region of loading and unloading (from 2007 onwards)':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_go_actygofl?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_139(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight transport activity - Vessel movement by transport coverage, by loading status',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2007-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['10^3 vessel kilometres'],
        'dimensioning': 'Vessel movement by transport coverage, by loading status'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Vessel traffic': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/iww_tf_vetf?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_140(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight transport activity - Unitization in different modes of transport/road freight transport/rail freight transport/inland waterways freight transport/maritime freight transport',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2011-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'freight transport activity',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['TKM'],
        'dimensioning': 'Unitization in different modes of transport/road freight transport/rail freight transport/inland waterways freight transport/maritime freight transport'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Unitisation in the different modes of transport - tonne-kilometre for gross weight of goods': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_im_umod?format=TSV&compressed=false',
            'Unitisation in road freight transport - tonne-kilometre for gross weight of goods':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_im_uroad?format=TSV&compressed=false',
            'Unitisation in rail freight transport- tonne-kilometre for gross-gross weight of goods':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_im_urail?format=TSV&compressed=false',
            'Unitisation in inland waterways freight transport - tonne-kilometre for gross-gross weight of goods':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_im_uiww?format=TSV&compressed=false',
            'Unitisation in maritime freight transport - tonnes for gross weight of goods':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_im_umar?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_141(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Unitization in different modes of transport/road freight transport/rail freight transport/inland waterways freight transport/maritime freight transport',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2011-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity per GDP',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['Tkm/GDP'],
        'dimensioning': 'Unitization in different modes of transport/road freight transport/rail freight transport/inland waterways freight transport/maritime freight transport'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume of freight transport relative to GDP': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_hv_frtra?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_142(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Modal split freight transport - rail, road, inland waterways',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2011-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Modal split freight transport',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'rail, road, inland waterways'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Modal split of air, sea and inland freight transport': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_hv_ms_frmod?format=TSV&compressed=false',
            'Modal split of air, sea and inland passenger transport':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_hv_ms_psmod?format=TSV&compressed=false',
            'Modal split of inland freight transport':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_hv_frmod?format=TSV&compressed=false',
            'Modal split of inland passenger transport':'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_hv_psmod?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_143(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Passenger transport activity per GDP - volume of passenger transport relative to GDP',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2011-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EUROSTAT', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity per GDP',
        'data_provider': 'EUROSTAT',
        'url': 'https://ec.europa.eu/eurostat/databrowser/view/',
        'data_access': 'publicly available',
        'units': ['pkm/GDP'],
        'dimensioning': 'volume of passenger transport relative to GDP'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume of passenger transport relative to GDP': 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/tran_hv_pstra?format=TSV&compressed=false'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='tsv'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
# JRC-IDEES WITH NEW LATEST SCHEMA 20241002
def dataset_144(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight transport activity - domestic coastal shipping, inland waterways',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'} 
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping','coastal-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['tkm','vkm'],
        'dimensioning': 'Domestic coastal shipping, inland waterways'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight transport activity': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_145(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Load factor - domestic coastal shipping, inland waterways',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping','coastal-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Load factor',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['t/movement'],
        'dimensioning': 'Domestic coastal shipping, inland waterways'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_146(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Passenger transport activity - Domestic, international -intra-EU, international-extra-EU',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['pkm','vkm'],
        'dimensioning': 'Domestic, international -intra-EU, international-extra-EU'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger transport activity': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_147(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight transport activity - Domestic and International - Intra-EU, International - Extra-EU',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['tkm', 'vkm'],
        'dimensioning': 'Domestic and International - Intra-EU, International - Extra-EU'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight transport activity': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_148(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Number of flights - Domestic and International - Intra-EU, International - Extra-EU',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of flights',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['t'],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Number of flights': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_149(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Volume carried - Domestic and International - Intra-EU, International - Extra-EU',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Volume carried',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['people/ton'],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_150(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Stock of aircraft - total - Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Stock of aircraft - total',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_151(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Stock of aircraft - in use - Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Stock of aircraft - in use',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_152(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'New aircraft - Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'New aircraft',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_153(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Load/occupancy factor - Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
                    ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Load/occupancy factor',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['passenger/flight','ton/flight'],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_154(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Distance travelled per flight - Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
                    ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Distance travelled per flight',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['km/flight'],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_155(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Flight per year by airplane - Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
                    ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Flight per year by airplane',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_156(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Energy use - By fuel and by transport service (Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU))',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
                    ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Energy use',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['ktoe'],
        'dimensioning': 'By fuel and by transport service (Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU))'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_157(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Energy intensity over activity - By fuel and by transport service (Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU))',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
                    ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Energy intensity over activity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['toe/vkm','toe/pkm','toe/tkm'],
        'dimensioning': 'By fuel and by transport service (Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU))'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_158(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Energy consuption per flight - Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
                    ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'Energy consuption per flight',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['toe/flight'],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_159(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emissions - By fuel and by transport service (Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU))',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
                    ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emissions',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['kt CO2'],
        'dimensioning': 'By fuel and by transport service (Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU))'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_160(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emission intensity - Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UNFCCC', 'url': 'https://unfccc.int/topics/mitigation/resources/registry-and-data/ghg-data-from-unfccc'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
                    ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emission intensity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['kg CO2/pkm','kgCO2/tkm','kgCO2/vkm'],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_161(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emissions per flight - Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'UNFCCC', 'url': 'https://unfccc.int/topics/mitigation/resources/registry-and-data/ghg-data-from-unfccc'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
                    ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight','passenger'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emissions per flight',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['kg CO2/flight'],
        'dimensioning': 'Passenger transport (Domestic, international -intra-EU, international-extra-EU), freight transport (Domestic and International - Intra-EU, International - Extra-EU)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume carried': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_162(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Energy use - By fuel and by transport service (by domestic coastal shipping and inland waterways)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping','coastal-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy use',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['ktoe'],
        'dimensioning': 'By fuel and by transport service (by domestic coastal shipping and inland waterways)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_163(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Energy intensity - Domestic coastal shipping, inland waterways',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping','coastal-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy intensity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['ktoe/tkm'],
        'dimensioning': 'Domestic coastal shipping, inland waterways'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_164(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emissions - By fuel and by transport service (by domestic coastal shipping and inland waterways)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'UNFCCC', 'url': 'https://unfccc.int/topics/mitigation/resources/registry-and-data/ghg-data-from-unfccc'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping','coastal-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emissions',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['kt CO2'],
        'dimensioning': 'By fuel and by transport service (by domestic coastal shipping and inland waterways)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_165(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emission intensity - Domestic coastal shipping, inland waterways',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'UNFCCC', 'url': 'https://unfccc.int/topics/mitigation/resources/registry-and-data/ghg-data-from-unfccc'},
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping','coastal-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emission intensity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['kgCO2/tkm'],
        'dimensioning': 'Domestic coastal shipping, inland waterways'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_166(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Passenger transport activity - Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['pkm','vkm'],
        'dimensioning': 'Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_167(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight transport activity - Freight rail (diesel vs electric)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['tkm', 'vkm'],
        'dimensioning': 'Freight rail (diesel vs electric)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_168(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Stock of trains - total - Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Stock of trains - total',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_169(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Stock of trains - in use - Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Stock of trains - in use',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_170(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'New trains - Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'New trains',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_171(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Load/occupancy factor - Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Load/occupancy factor',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['passenger/movement','ton/movement'],
        'dimensioning': 'Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_172(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Capacity of representative train - Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Capacity of representative train',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['passenger-seats','tons'],
        'dimensioning': 'Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_173(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Annual mileage - Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Annual mileage',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['km/train per year'],
        'dimensioning': 'Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_174(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Energy use - By fuel and by rail service (Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric))',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy use',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['ktoe'],
        'dimensioning': 'By fuel and by rail service (Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric))'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_175(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Energy intensity over activity - Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy intensity over activity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['toe/vkm','toe/pkm','toe/tkm'],
        'dimensioning': 'Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_176(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emissions - By fuel and by rail service (by Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric))',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UNFCCC', 'url': 'https://unfccc.int/topics/mitigation/resources/registry-and-data/ghg-data-from-unfccc'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emissions',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['kt CO2'],
        'dimensioning': 'By fuel and by rail service (by Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric))'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_177(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emission intensity - Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UNFCCC', 'url': 'https://unfccc.int/topics/mitigation/resources/registry-and-data/ghg-data-from-unfccc'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emission intensity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['kg CO2/pkm','kgCO2/tkm','kgCO2/vkm'],
        'dimensioning': 'Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail), Freight rail (diesel vs electric)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_178(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Passenger transport activity - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['pkm','vkm'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_179(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Freight transport activity - Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','truck'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['tkm','vkm'],
        'dimensioning': 'Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_180(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Stock of vehicles - total - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Stock of vehicles - total',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_181(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Stock of vehicles - in use - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Stock of vehicles - in use',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_182(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'New vehicles - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'New vehicles',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_183(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Load/occupancy factor - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Load/occupancy factor',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['passenger/movement','ton/movement'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_184(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Annual mileage - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'},
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Annual mileage',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['km/vehicle per year'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_185(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Energy use - By fuel and by mode/vehicle type Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Energy use',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['ktoe'],
        'dimensioning': 'By fuel and by mode/vehicle type Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_186(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Energy intensity over activity - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Energy intensity over activity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['toe/vkm','toe/pkm','toe/tkm'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_187(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emissions - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'UNFCCC', 'url': 'https://unfccc.int/topics/mitigation/resources/registry-and-data/ghg-data-from-unfccc'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emissions',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['kt CO2'],
        'dimensioning': 'By fuel and by mode/vehicle type Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_188(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emission intensity - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'UNFCCC', 'url': 'https://unfccc.int/topics/mitigation/resources/registry-and-data/ghg-data-from-unfccc'},
            {'title': 'EU Statistical pocketbook', 'url': 'https://transport.ec.europa.eu/media-corner/publications/statistical-pocketbook-2021_en'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emission intensity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['kg CO2/pkm','kgCO2/tkm','kgCO2/vkm'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_189(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Age structure of vehicle stock (vintages) - by year of registration (before 2000, 2000-2015) and by serice (Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International))',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Age structure of vehicle stock (vintages)',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'by year of registration (before 2000, 2000-2015) and by serice (Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International))'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_190(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Stock test cycle efficiency - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Stock test cycle efficiency',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['ktoe/km'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_191(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'New vehicles test cycle efficiency - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'New vehicles test cycle efficiency',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['ktoe/km'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_192(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Stock test cycle emission intensity - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'EEA', 'url': 'https://www.eea.europa.eu/data-and-maps'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Stock test cycle emission intensity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['gCO2/km'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_193(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'New vehicles test cycle emission intensity - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'EEA', 'url': 'https://www.eea.europa.eu/data-and-maps'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'New vehicles test cycle emission intensity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['gCO2/km'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Load factor': 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
# Kapsarc      
def dataset_194(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Vehicle Fuel Economy Data &CO2 emissions - vehicle type, fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1984-01-01',
        'temporal_coverage_end': '2024-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'fuel economy.gov (ORNL)', 'url': 'https://www.fueleconomy.gov'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Vehicle Fuel Economy Data &CO2 emissions',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'vehicle type, fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Fuel Economy': 'https://www.fueleconomy.gov/feg/epadata/25data.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_195(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Vehicle Fuel Economy Data &CO2 emissions - vehicle type, fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2016-01-01',
        'temporal_coverage_end': '2018-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EEA', 'url': 'https://www.eea.europa.eu/en'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emissions from passenger cars',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['g/km'],
        'dimensioning': 'by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Monitoring of co2 emissions from passenger cars data 2016': 'https://datasource.kapsarc.org/explore/dataset/monitoring-of-co2-emissions-from-passenger-cars-data-2016/information/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_196(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Number of vehicles in use - vehicle type, fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['bhr','kwt','omn','qat','sau','are','ind'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'OICA', 'url': 'https://www.oica.net/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of vehicles in use',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by country, by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Number of vehicles in use': 'https://datasource.kapsarc.org/explore/dataset/economically-active-population-15-years-and-above-by-nationality-gender-and-econ/information/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_197(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Vehicles registerd on the road - by class of vehicle',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2011-01-01',
        'temporal_coverage_end': '2013-01-01',
        'geographies': ['are'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Dubai Statistics Center', 'url': 'https://www.dsc.gov.ae/en-us/Pages/default.aspx'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Vehicles registerd on the road',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by class of vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Vehicles registerd on the road': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_198(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Road Network - by class of vehicle',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2017-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Road Network',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': 'length of roads inside cities by type of road; Length of dirt roads paved'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Road Network': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_199(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Distance between main cities',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2013-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Distance between main cities',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Distance between main cities': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_200(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'New passenger car registrations - by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UNECE', 'url': 'https://unece.org/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'New passenger car registrations',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'New passenger car registrations': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_201(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'New road vehicle registrations - by vehicle category; by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UNECE', 'url': 'https://unece.org/'},
            {'title': 'National Center for Statistics and information', 'url': 'https://www.ncsi.gov.om/Pages/AllIndicators.aspx'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'New road vehicle registrations',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by vehicle category; by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'New road vehicle registrations': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_202(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Road vehicle fleet - by vehicle category; by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UNECE', 'url': 'https://unece.org/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Road vehicle fleet',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by vehicle category; by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Road vehicle fleet': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_203(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger vehicle fleet - by vehicle category',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UNECE', 'url': 'https://unece.org/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger vehicle fleet',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by vehicle category'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger vehicle fleet': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_204(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Share of road transport - by vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['ind'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Ministry of Road Transport and Highways', 'url': 'https://morth.nic.in/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Share of road transport',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Share of road transport': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_205(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Lenght of roads inside cities - by type of road',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2007-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Ministry of Municipal and Rural Affairs', 'url': 'https://momah.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Lenght of roads inside cities',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': 'by type of road'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Lenght of roads inside cities': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_206(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Registered motor vehicles - by type of vehicles',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1951-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['ind'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Ministry of Road Transport and Highways', 'url': 'https://morth.nic.in/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Registered motor vehicles',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by type of vehicles'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Registered motor vehicles': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_207(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Total road length - by category of roads',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1951-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['ind'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Open Government Data Platform', 'url': 'https://www.data.gov.in/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Total road length',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['KM','%'],
        'dimensioning': 'by category of roads'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Total road length': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_208(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Vehicle fleet - passenger & freight vehicles',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2017-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'KAPSARC', 'url': 'https://datasource.kapsarc.org/pages/home/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Vehicle fleet',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'passenger & freight vehicles'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Vehicle fleet': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_209(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Registered vehicles - in use; new; cancelled from records',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['bhr'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Bahrain Open Data Portal', 'url': 'https://www.data.gov.bh/pages/homepage/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Registered vehicles',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'in use; new; cancelled from records'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Registered vehicles': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_210(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Length of paved road - by type of road',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['bhr'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Bahrain Open Data Portal', 'url': 'https://www.data.gov.bh/pages/homepage/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','taxis','private-cars'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Length of paved road',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': 'by type of road'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Length of paved road': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_211(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger transport activity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1999-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['PKM'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger transport activity': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_212(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Freight transport activity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1999-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['TKM'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight transport activity': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_213(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Freight transport activity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2016-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['TKM'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight transport activity': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_214(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger transport activity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2018-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['PKM'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger transport activity': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_215(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Rolling Stock - by type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2013-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Rolling Stock',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Rolling Stock': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_216(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger transport activity - passengers carried among railway stations',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2004-01-01',
        'temporal_coverage_end': '2008-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport activity',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'passengers carried among railway stations'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger transport activity': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_217(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Distance between railway stations - by age of line',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Distance between railway stations',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['km'],
        'dimensioning': 'by age of line'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Distance between railway stations': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_218(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Number of locomotives and cars - by type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'KAPSARC', 'url': 'https://datasource.kapsarc.org/pages/home/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of locomotives and cars',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Number of locomotives and cars': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_219(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger & Cargo Traffic - by airport',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2016-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Passenger & Cargo Traffic',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#','kg'],
        'dimensioning': 'by airport'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger & Cargo Traffic': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_220(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger activity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2013-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger activity',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['passenger seat KM'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger activity': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_221(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Freight activity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2012-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight activity',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['TKM'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight activity': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_222(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Air traffic - freight, # flights, # passengers, mail',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority of Civil Aviation', 'url': 'https://gaca.gov.sa/web/en-gb/page/home'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Air traffic',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'freight, # flights, # passengers, mail'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Air traffic': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_223(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Number of airplanes - by airline',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2018-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'KAPSARC', 'url': 'https://datasource.kapsarc.org/pages/home/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Number of airplanes',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by airline'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Number of airplanes': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_224(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Cargo loaded/unloaded - by type of cargo, import/export',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1999-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['coastal-shipping','inland-shipping'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Cargo loaded/unloaded',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'by type of cargo, import/export'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Cargo loaded/unloaded': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_225(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Volume of seaports exports - by type of goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Saudi Central Bank (SAMA)', 'url': 'https://www.sama.gov.sa/en-us/pages/default.aspx'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['coastal-shipping','inland-shipping'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Volume of seaports exports',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'by type of goods'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Volume of seaports exports': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_226(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Merchant fleet - by type of ship',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2011-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UNCTD', 'url': 'https://unctad.org/'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['coastal-shipping','inland-shipping'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Merchant fleet',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by type of ship'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Merchant fleet': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_227(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Freight transport activity - by type of goods',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2002-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['ind'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Ministry of Statistics and Programme Implementation ', 'url': 'https://www.mospi.gov.in/'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['coastal-shipping','inland-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['tonnes'],
        'dimensioning': 'by type of goods'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight transport activity': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_228(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Freight transport activity - Tankers of Oil (products) by port',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2008-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['sau'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'General Authority for Statistics', 'url': 'https://www.stats.gov.sa/en'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['coastal-shipping','inland-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['barrels'],
        'dimensioning': 'Tankers of Oil (products) by port'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight transport activity': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_229(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Modal split of freight transport - By transport mode, by country',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2018-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Modal split of freight transport',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'By transport mode, by country'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Modal split of freight transport': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_230(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger transport - By transport mode, by country',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'OECD/ITF', 'url': 'https://www.itf-oecd.org/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'By transport mode, by country'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger transport': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_231(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger, Freight and container transport',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1998-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['ind','chn'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'OECD', 'url': 'https://www.oecd.org/en.html'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Passenger, Freight and container transport',
        'data_provider': 'kapsarc',
        'url': 'https://datasource.kapsarc.org/pages/home/',
        'data_access': 'publicly available',
        'units': ['TKM','PKM','TEU'],
        'dimensioning': 'By transport mode, by country'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger, Freight and container transport': 'https://datasource.kapsarc.org/pages/home/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
#ORNL
def dataset_232(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Petroleum production and consumption - by sector, by state',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1950-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['usa','worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of Energy', 'url': 'https://www.energy.gov/'},
            {'title': 'EIA', 'url': 'https://www.eia.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Petroleum production and consumption',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['million barrels/day','%'],
        'dimensioning': 'by sector, by state'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Petroleum production and consumption': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table1_12_06012022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_233(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Transportation petroleum consumption - by mode',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'DOT', 'url': 'https://www.transportation.gov/'},
            {'title': ', FHWA', 'url': 'https://highways.dot.gov/'},
            {'title': 'Highway Statistics', 'url': 'https://www.fhwa.dot.gov/policyinformation/statistics.cfm'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transportation petroleum consumption',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['thousand barrels/day'],
        'dimensioning': 'by mode'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Transportation petroleum consumption': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table1_15_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_234(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Energy consumption - by source, by sector, by state',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1950-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of Energy', 'url': 'https://www.energy.gov/'},
            {'title': 'EIA', 'url': 'https://www.eia.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy consumption',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['Btu'],
        'dimensioning': 'by source, by sector, by state'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Distribution of Energy Consumption by Source and Sector, 1973 and 2021': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table2_03_06012022.xlsx',
            'Distribution of Transportation Energy Consumption by Source, 1950-2021': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table2_04_06012022.xlsx',
            'Transportation Energy Consumption by State, 1960-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table2_05_06012022.xlsx',
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_235(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fuel production, import, consumption - by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1981-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of Energy', 'url': 'https://www.energy.gov/'},
            {'title': 'EIA', 'url': 'https://www.eia.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fuel production, import, consumption',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['gallons'],
        'dimensioning': 'by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            '	Fuel Ethanol and Biodiesel Production, Net Imports, and Consumption, 1981-2021': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table2_06_06012022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_236(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Transport energy/fuel consumption - by mode, by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1973-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'DOT', 'url': 'https://www.transportation.gov/'},
            {'title': ', FHWA', 'url': 'https://highways.dot.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Transport energy/fuel consumption',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['Btu/gallons'],
        'dimensioning': 'by mode, by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Domestic Consumption of Transportation Energy by Mode and Fuel Type, 2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Figure2_06_01312022.xlsx',
            'Transportation Energy Use by Mode, 2018–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table2_08_01312022.xlsx',
            'Highway Transportation Energy Consumption by Mode, 1970-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table2_09_01312022.xlsx',
            'Nonhighway Transportation Energy Consumption by Mode, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table2_10_01312022.xlsx',
            'Off-Highway Transportation-Related Fuel Consumption, 2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table2_11_01312022.xlsx',
            'Highway Usage of Gasoline and Diesel, 1973-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table2_12_06012022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_237(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger travel activity - by mode, # vehicles, vehicle miles, passenger miles, load factor, energy intensity, energy use',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2019-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'DOT', 'url': 'https://www.transportation.gov/'},
            {'title': ', FHWA', 'url': 'https://highways.dot.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Passenger travel activity',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['various'],
        'dimensioning': 'by mode, # vehicles, vehicle miles, passenger miles, load factor, energy intensity, energy use'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger Travel and Energy Use, 2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table2_13_06012022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_238(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Energy intensity - by mode, passenger & freight transport',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'DOT', 'url': 'https://www.transportation.gov/'},
            {'title': ', FHWA', 'url': 'https://highways.dot.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy intensity',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['Btu/vehicle mile','Btu/passenger mile'],
        'dimensioning': 'by mode, passenger & freight transport'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Energy Intensities of Highway Passenger Modes, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table2_14_01312022.xlsx',
            'Energy Intensities of Nonhighway Passenger Modes, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table2_15_01312022.xlsx',
            'Energy Intensities of Freight Modes, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table2_16_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_239(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Carbon content - by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Argonne National Laboratory', 'url': 'https://www.anl.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Carbon content',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['grams/gallon'],
        'dimensioning': 'by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Carbon Content of Transportation Fuels': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table12_12_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_240(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'CO2 emissions - by transportation mode',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Argonne National Laboratory', 'url': 'https://www.epa.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emissions',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['metric tonnes of CO2 equivalent'],
        'dimensioning': 'by transportation mode'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'U.S. Carbon Emissions from Fossil Fuel Combustion in the Transportation End-Use Sector, 1990-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table12_07_01312022.xlsx',
            'Transportation Carbon Dioxide Emissions by Mode, 1990–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table12_08_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_241(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Carbon coefficients - by energy source, by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'EIA', 'url': 'https://www.eia.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Carbon coefficients',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['metric tonnes carbon/Btu'],
        'dimensioning': 'by energy source, by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Carbon coefficients - B16': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/TEDB_40_Spreadsheets_06012022.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_242(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Freight transport activity - by transport mode, by distance band, by state, by flow direction',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of transportation', 'url': 'https://www.transportation.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport activity',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['tonnes','tonne miles'],
        'dimensioning': 'by transport mode, by distance band, by state, by flow direction'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Tons of Freight in the United States: Comparison of the 1993, 1997, 2002, 2007, 2012 and 2017 Commodity Flow Surveys': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table5_16_01312022.xlsx',
            'Ton Miles of Freight in the United States: Comparison of the 1993, 1997, 2002, 2007, 2012 and 2017 Commodity Flow Surveys': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table5_17_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_243(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Average mile per freight trip - by transport mode',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of transportation', 'url': 'https://www.transportation.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Average mile per freight trip',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['miles'],
        'dimensioning': 'by transport mode'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Average Miles per Shipment in the United States: Comparison of the 1993, 1997, 2002, 2007, 2012 and 2017 Commodity Flow Surveys': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table5_18_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_244(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Average trip length - by means of transport, by age of vehicle',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of transportation', 'url': 'https://www.transportation.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Average trip length',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['miles & minutes'],
        'dimensioning': 'by means of transport, by age of vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Household Vehicle Trips, 1990, 1995 NPTS and 2001, 2009 and 2017 NHTS': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table9_12_01312022.xlsx',
            'Daily Vehicle Miles of Travel (per Vehicle) by Number of Vehicles in the Household, 2001, 2009 and 2017 NHTS': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table9_13_01312022.xlsx',
            'Daily and Annual Vehicle Miles of Travel and Average Age for Each Vehicle in a Household, 2017 NHTS': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table9_14_01312022.xlsx',
            'Average Length and Duration of Trips To and From Work by Mode, 2017 NHTS': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table9_17_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_245(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Emission of air pollutants - by type of air pollutant, by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Environmental protection agency', 'url': 'https://www.epa.gov/'}
        ],
        'language': 'en',
        'sectors': ['all'],
        'modes': ['all'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Emission of air pollutants',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['million short tonnes'],
        'dimensioning': 'by type of air pollutant, by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Total National Emissions of Criteria Air Pollutants by Sector, 2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_01_01312022.xlsx',
            'Total National Emissions of Carbon Monoxide, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_02_01312022.xlsx',
            'Emissions of Carbon Monoxide from Highway Vehicles, 1970-2017': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_03_01312022.xlsx',
            'Total National Emissions of Nitrogen Oxides, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_04_01312022.xlsx',
            'Emissions of Nitrogen Oxides from Highway Vehicles, 1970-2017': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_05_01312022.xlsx',
            'Total National Emissions of Volatile Organic Compounds, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_06_01312022.xlsx',
            'Emissions of Volatile Organic Compounds from Highway Vehicles, 1970-2017': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_07_01312022.xlsx',
            'Total National Emissions of Particulate Matter (PM-10), 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_08_01312022.xlsx',
            'Emissions of Particulate Matter (PM-10) from Highway Vehicles, 1970-2017': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_09_01312022.xlsx',
            'otal National Emissions of Particulate Matter (PM-2.5), 1990–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_10_01312022.xlsx',
            'Emissions of Particulate Matter (PM-2.5) from Highway Vehicles, 1990-2017': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_11_01312022.xlsx',
            'Total National Emissions of Sulfur Dioxide, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table13_12_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_246(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Vehicle Fleet (also intermodal) - registrations & in use by vehicle type, by age, average vehicle age, government vehicles',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1960-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa','worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'wardsauto FHWA', 'url': 'https://www.wardsauto.com/'},
            {'title': 'IHS', 'url': 'https://www.usa.gov/agencies/indian-health-service'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Vehicle Fleet (also intermodal)',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'registrations & in use by vehicle type, by age, average vehicle age, government vehicles'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Car Registrations for Selected Countries, 1960–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table3_02_01312022.xlsx',
            'Truck and Bus Registrations for Selected Countries, 1960–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table3_03_01312022.xlsx',
            'U.S. Cars and Trucks in Use, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table3_04_01312022.xlsx',
            'Motor Vehicle Registrations by State and Vehicle Type, 2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table3_05_01312022.xlsx',
            'New Retail Vehicle Sales, 1970-2021': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table3_06_06012022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_247(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Modal split - share of highway vehicle miles by vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of Energy', 'url': 'https://www.energy.gov/'},
            {'title': 'FHWA', 'url': 'https://highways.dot.gov/'},
            {'title': 'Highway Statistics', 'url': 'https://www.fhwa.dot.gov/policyinformation/statistics.cfm'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Modal split',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['vehicle miles'],
        'dimensioning': 'share of highway vehicle miles by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Shares of Highway Vehicle-Miles Traveled by Vehicle Type, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table3_09_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_248(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Travel activity (also intermodal) - by type of road, by state, by vehicle type, government vehicles',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2020-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of Energy', 'url': 'https://www.energy.gov/'},
            {'title': 'FHWA', 'url': 'https://highways.dot.gov/'},
            {'title': 'Highway Statistics', 'url': 'https://www.fhwa.dot.gov/policyinformation/statistics.cfm'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Travel activity (also intermodal)',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['vehicle miles'],
        'dimensioning': 'by type of road, by state, by vehicle type, government vehicles'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Vehicle Miles of Travel by State, 2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table3_10_06012022.xlsx',
            'Annual Mileage for Cars and Light Trucks by Vehicle Age': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table3_14_01312022.xlsx',
            'Summary Statistics for Cars, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table4_01_06012022.xlsx',
            'Summary Statistics for Two-Axle, Four-Tire Trucks, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table4_02_06012022.xlsx',
            'Summary Statistics for Light Vehicles, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table4_03_06012022.xlsx',
            'Summary Statistics on Class 1, Class 2a, and Class 2b Light Trucks': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_04_01312022.xlsx',
            'Examples of Class 2b Vehicle Models, 2017': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_05_01312022.xlsx',
            'Summary Statistics for Class 3-8 Single-Unit Trucks, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table5_01_06012022.xlsx',
            'Summary Statistics for Class 7-8 Combination Trucks, 1970-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table5_02_06012022.xlsx',
            'Summary Statistics on Transit Buses and Trolleybuses, 1994–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table7_01_09312022.xlsx',
            'Summary Statistics on Demand Response Vehicles, 1994–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table7_02_09312022.xlsx',
            'Summary Statistics for Commuter Rail Operations, 1984–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table7_03_09312022.xlsx',
            'Summary Statistics for Rail Transit Operations, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table7_04_01312022.xlsx',
            'Average Annual Vehicle-Miles of Travel for Commercial Fleet Vehicles, 2018 and 2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table8_03_01312022.xlsx',
            
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_249(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fuel use & fuel economy (also intermodal) - by vehicle type, by speed, by fuel type, by age of vehicle, by terrain',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of Transportation', 'url': 'https://www.transportation.gov/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fuel use & fuel economy (also intermodal)',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['gallons & miles per gallon'],
        'dimensioning': 'by vehicle type, by speed, by fuel type, by age of vehicle, by terrain'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for Cars, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table4_01_06012022.xlsx',
            'Summary Statistics for Two-Axle, Four-Tire Trucks, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table4_02_06012022.xlsx',
            'Summary Statistics for Light Vehicles, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table4_03_06012022.xlsx',
            'Summary Statistics on Class 1, Class 2a, and Class 2b Light Trucks': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_04_01312022.xlsx',
            'Examples of Class 2b Vehicle Models, 2017': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_05_01312022.xlsx',
            'Summary Statistics for Class 3-8 Single-Unit Trucks, 1970–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table5_01_06012022.xlsx',
            'Summary Statistics for Class 7-8 Combination Trucks, 1970-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table5_02_06012022.xlsx',
            'Truck Statistics by Gross Vehicle Weight Class, 2002': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table5_05_01312022.xlsx',
            'Production, Production Shares, and Production-Weighted Fuel Economies of New Domestic and Import Cars, Model Years 1975-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_09_01312022.xlsx',
            'Definition of Car Sport Utility Vehicles in Model Year 2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_10_01312022.xlsx',
            'Production, Production Shares, and Production-Weighted Fuel Economies of New Domestic and Import Light Trucks, Model Years 1975-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_11_01312022.xlsx',
            'Production and Production-Weighted Fuel Economies of New Domestic and Import Cars, Light Trucks and Light Vehicles, Model Years 1975-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_12_01312022.xlsx',
            'Fuel Economy by Speed, Autonomie Model Results, Model Year 2016': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_33_01312022.xlsx',
            'Fuel Economy by Speed, 1973, 1984, 1997 and 2012 Studies': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_34_01312022.xlsx',
            'Truck Harmonic Mean Fuel Economy by Size Class, 1992, 1997 and 2002': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table5_06_01312022.xlsx',
            'Effect of Terrain on Class 8 Truck Fuel Economy': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table5_11_01312022.xlsx',
            'Fuel Economy for Class 8 Trucks as a Function of Speed and Tractor-Trailer Tire Combination': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table5_12_01312022.xlsx',
            'Summary Statistics on Transit Buses and Trolleybuses, 1994–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table7_01_09312022.xlsx',
            'Summary Statistics on Demand Response Vehicles, 1994–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table7_02_09312022.xlsx',
            'Summary Statistics for Commuter Rail Operations, 1984–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table7_03_09312022.xlsx',
            'Summary Statistics for Rail Transit Operations, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table7_04_01312022.xlsx',
            'Fuel Consumed by Federal Government Fleets, FY 2000-2021': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table8_06_06012022.xlsx',
            'A1-A7': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/TEDB_40_Spreadsheets_06012022.zip'
            
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_250(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fuel economy comparison - by driving cycle, by operational area',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2021-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'US environmental protection agency', 'url':'https://www.epa.gov/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fuel economy comparison',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['miles per gallon'],
        'dimensioning': 'by driving cycle, by operational area'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Fuel Economy Comparison Among CAFE, Window Sticker, and Real-World Estimates for the 2020 Toyota Prius Eco': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_08_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_251(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Production shares - by vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1975-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'US environmental protection agency', 'url':'https://www.epa.gov/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Production shares',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Light Vehicle Production Shares, Model Years 1975–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_13_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_252(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Technology penetration - by technology, by vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1996-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'US environmental protection agency', 'url':'https://www.epa.gov/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Technology penetration',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'by technology, by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Car Technology Penetration, 1996–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_14_01312022.xlsx',
            'Light Truck Technology Penetration, 2002-2020':'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_15_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_253(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Average material consumption - by type of material',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1995-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'wardsauto FHWA', 'url': 'https://www.wardsauto.com/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Average material consumption',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['%','pounds'],
        'dimensioning': 'by type of material'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Average Material Consumption for a Domestic Light Vehicle, Model Years 1995, 2000, and 2017': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_20_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_254(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Refueling stations - by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1972-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Lundberg survey', 'url': 'https://www.lundbergsurvey.com/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Refueling stations',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Conventional Refueling Stations, 1972-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_24_01312022.xlsx',
            'Number of Alternative Refuel Stations, 1992-2021': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table6_13_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_255(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Emission standards - by vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2017-01-01',
        'temporal_coverage_end': '2026-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Federal register', 'url': 'https://www.federalregister.gov/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Emission standards',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['miles per gallon & grams per mile'],
        'dimensioning': 'by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Fuel Economy and Carbon Dioxide Emissions Standards, MY 2017-2026': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_25_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_256(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Driving cycle attributes - by test procedure',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2022-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Fuel economy guide website', 'url': 'https://www.fueleconomy.gov/feg/printGuides.shtml'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Driving cycle attributes',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'by test procedure'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Driving Cycle Attributes': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_35_01312022.xlsx',
            'Comparison of U.S., European, and Japanese Driving Cycles Attributes': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_36_01312022.xlsx',
            'Example of Differing Results Using the U.S., European, and Japanese Driving Cycles': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table4_37_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_257(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Diesel share - by truck size',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1995-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'wardsauto FHWA', 'url': 'https://www.wardsauto.com/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Diesel share',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'by truck size'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Diesel Share of Medium and Heavy Truck Sales by Gross Vehicle Weight, 1995–2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table5_04_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_258(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Carshare members - by world regions',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2018-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Transportation sustainability research center', 'url': 'https://tsrc.berkeley.edu/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Carshare members',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by world regions'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Carshare Members and Vehicles by World Region, 2006–2018': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table7_08_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_259(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Car operating costs - insurance, tax, etc',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1975-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'wardsauto FHWA', 'url': 'https://www.wardsauto.com/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Car operating costs',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['dollar'],
        'dimensioning': 'insurance, tax, etc'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Fixed Car Operating Costs per Year, 1975-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table11_16_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_260(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fuel costs - by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['usa','worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'IEA', 'url': 'https://www.iea.org/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fuel costs',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['dollar'],
        'dimensioning': 'by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Gasoline Prices for Selected Countries, 1990-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table11_03_01312022.xlsx',
            'Diesel Fuel Prices for Selected Countries, 1990-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table11_04_01312022.xlsx',
            'Retail Prices for Motor Fuel, 1978-2021': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/Table11_06_06012022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_261(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Production weighted Carbon footprint - by vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1975-01-01',
        'temporal_coverage_end': '2020-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'US environmental protection agency', 'url':'https://www.epa.gov/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Production weighted Carbon footprint',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['tonnes of CO2'],
        'dimensioning': 'by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Production-Weighted Annual Carbon Footprint of New Domestic and Import Cars, Model Years 1975-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table12_09_01312022.xlsx',
            'Production-Weighted Annual Carbon Footprint of New Domestic and Import Light Trucks, Model Years 1975-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table12_10_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_262(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Load factor - by vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'NPTS', 'url':'https://npts.net/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Load factor',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'A19': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/TEDB_40_Spreadsheets_06012022.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_263(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fleet - by type of vehicle',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1971-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'Association of american railroads', 'url':'https://www.aar.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fleet',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by type of vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for the National Railroad Passenger Corporation (Amtrak), 1971-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_10_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_264(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Average trip length',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1971-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'Association of american railroads', 'url':'https://www.aar.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Average trip length ',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['miles'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for the National Railroad Passenger Corporation (Amtrak), 1971-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_10_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_265(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Traffic activity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1971-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'Association of american railroads', 'url':'https://www.aar.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Traffic activity',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['car miles & train miles & tonne miles'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for the National Railroad Passenger Corporation (Amtrak), 1971-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_10_01312022.xlsx',
            'Summary Statistics for Class I Freight Railroads, 1970-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_08_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_266(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Energy intensity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1971-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'Association of american railroads', 'url':'https://www.aar.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy intensity',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['Btu/passenger mile'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for the National Railroad Passenger Corporation (Amtrak), 1971-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_10_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_267(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fuel use - freight, passenger, fuel type, operation type, vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1971-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'Association of american railroads', 'url':'https://www.aar.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fuel use',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['gallons','kWh'],
        'dimensioning': 'freight, passenger, fuel type, operation type, vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'A13-A16': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/TEDB_40_Spreadsheets_06012022.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_268(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fleet - by type of vehicle',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'US environmental protection agency', 'url':'https://www.epa.gov/'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['coastal-shipping','inland-shipping','international-maritime'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fleet',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'by type of vehicle'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for Domestic Waterborne Commerce, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_05_01312022.xlsx',
            'Recreational Boat Energy Use, 1970-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_06_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_269(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Energy use - by fuel type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'US environmental protection agency', 'url':'https://www.epa.gov/'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['coastal-shipping','inland-shipping','international-maritime'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy use',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['Btu'],
        'dimensioning': 'by fuel type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for Domestic Waterborne Commerce, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_05_01312022.xlsx',
            'Recreational Boat Energy Use, 1970-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_06_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_270(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Freight activity - foreign, domestic',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'US department of army', 'url':'https://www.army.mil/'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['coastal-shipping','inland-shipping','international-maritime'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight activity',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['tonne miles & tonnes shipped'],
        'dimensioning': 'foreign, domestic'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for Domestic Waterborne Commerce, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_05_01312022.xlsx',
            'Tonnage Statistics for Domestic and International Waterborne Commerce, 1970-2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_04_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_271(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fuel use - by fuel type, by vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title':'US environmental protection agency', 'url':'https://www.epa.gov/'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['coastal-shipping','inland-shipping','international-maritime'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fuel use',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['gallons'],
        'dimensioning': 'by fuel type, by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'A11, A10': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/TEDB_40_Spreadsheets_06012022.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_272(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fleet - number of aircrafts',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of Transportation', 'url': 'https://www.transportation.gov/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fleet',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'number of aircrafts'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for General Aviation, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_03_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_273(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Travel activity - hours flown, aircraft miles, passenger miles, seat miles, load factor, tonne miles',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of Transportation', 'url': 'https://www.transportation.gov/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Travel activity',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['various'],
        'dimensioning': 'hours flown, aircraft miles, passenger miles, seat miles, load factor, tonne miles'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for General Aviation, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_03_01312022.xlsx',
            'Summary Statistics for U.S. Domestic and International Certificated Route Air Carriers (Combined Totals), 1970-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_02_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_274(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Energy use',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of Transportation', 'url': 'https://www.transportation.gov/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy use',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['btu'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Summary Statistics for General Aviation, 1970–2019': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_03_01312022.xlsx',
            'Summary Statistics for U.S. Domestic and International Certificated Route Air Carriers (Combined Totals), 1970-2020': 'https://tedb.ornl.gov/wp-content/uploads/2022/03/Table10_02_01312022.xlsx'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='xlsx'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_275(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fuel use - domestic, internation, jet, aviation',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'US Department of Transportation', 'url': 'https://www.transportation.gov/'},
            {'title':'FAA', 'url': 'https://www.faa.gov/'}
        ],
        'language': 'en',
        'sectors': ['aviation'],
        'modes': ['domestic-aviation','international-aviation'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fuel use',
        'data_provider': 'Oak Ridge National Laboratory',
        'url': 'https://tedb.ornl.gov/data/',
        'data_access': 'publicly available',
        'units': ['gallons'],
        'dimensioning': 'domestic, internation, jet, aviation'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'A08, A09': 'https://tedb.ornl.gov/wp-content/uploads/2022/06/TEDB_40_Spreadsheets_06012022.zip'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='zip'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_276(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Vehicle Sales - powertrain, kerb weight, CO2 emission class',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['arg','aus','bra','can','chl','chn','egy','fra','deu','ind','idn','ita','jpn','kor','mys','mex','per','phl','rus','zaf','tur','ukr','gbr','usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'iea (gfei)', 'url': 'https://www.iea.org/data-and-statistics/data-tools/global-fuel-economy-initiative-2021-data-explorer'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Vehicle Sales',
        'data_provider': 'iea (gfei)',
        'url': 'https://www.iea.org/data-and-statistics/data-tools/global-fuel-economy-initiative-2021-data-explorer',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'powertrain, kerb weight, CO2 emission class'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Vehicle Sales': 'https://www.iea.org/data-and-statistics/data-tools/global-fuel-economy-initiative-2021-data-explorer'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_277(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Fuel consumption - passenger cars by vehicle type, by powertrain technology',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2005-01-01',
        'temporal_coverage_end': '2019-01-01',
        'geographies': ['arg','aus','bra','can','chl','chn','egy','fra','deu','ind','idn','ita','jpn','kor','mys','mex','per','phl','rus','zaf','tur','ukr','gbr','usa'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'iea (gfei)', 'url': 'https://www.iea.org/data-and-statistics/data-tools/global-fuel-economy-initiative-2021-data-explorer'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Fuel consumption',
        'data_provider': 'iea (gfei)',
        'url': 'https://www.iea.org/data-and-statistics/data-tools/global-fuel-economy-initiative-2021-data-explorer',
        'data_access': 'publicly available',
        'units': ['lge/100km'],
        'dimensioning': 'passenger cars by vehicle type, by powertrain technology'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Fuel consumption': 'https://www.iea.org/data-and-statistics/data-tools/global-fuel-economy-initiative-2021-data-explorer'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_278(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Infrastructre length - by type of road',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructre length',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['Km'],
        'dimensioning': 'by type of road'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Infrastructre length': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__11-TRINFRA/ZZZ_en_TRInfraRoad_r.px/table/tableViewLayout1/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_279(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Vehicle fleet and new registrations - by type of vehicle, age, weight, fueltype',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Vehicle fleet and new registrations',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'by type of vehicle, age, weight, fueltype'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Vehicle fleet and new registrations': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__03-TRRoadFleet/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_280(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Traffic motor vehicle movements - by vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Traffic motor vehicle movements',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['Vkm'],
        'dimensioning': 'by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Traffic motor vehicle movements': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__02-TRROAD/01_en_TRRoadVehKm_r.px/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_281(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Freight transport - by location',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1980-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['T','Tkm'],
        'dimensioning': 'by location'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight transport': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__02-TRROAD/03_en_TRRoadGoodsTkm_r.px/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_282(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger transport  - by vehicle type (passenger car, bus, motorbike)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1980-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['Pkm'],
        'dimensioning': 'by vehicle type (passenger car, bus, motorbike)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger transport': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__02-TRROAD/04_en_TRRoadPassgKm_r.px/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_283(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Safety, accidents, fatalities, and injuries  - extensive breakdown',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Safety, accidents, fatalities, and injuries',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'extensive breakdown'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Safety, accidents, fatalities, and injuries': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__01-TRACCIDENTS/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_284(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Infrastructure length  - by track type, gauge, activity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure length',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': 'by track type, gauge, activity'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Infrastructure length': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__11-TRINFRA/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_285(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Transport equipment - by vehicle type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Transport equipment',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['Number','power'],
        'dimensioning': 'by vehicle type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Transport equipment': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__07-TRRAILVEH/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_286(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Traffic train movements - by equipment and train type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Traffic train movements',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['Train-km'],
        'dimensioning': 'by equipment and train type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Traffic train movements': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__05-TRRAIL/03_en_TRRailMvmt_r.px/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_287(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Freight transport - by location',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['T','Tkm'],
        'dimensioning': 'by location'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight transport': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__05-TRRAIL/02_en_TRrailtonneskm_r.px/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_288(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger transport - by location',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1970-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['passengers','PKM'],
        'dimensioning': 'by location'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger transport': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__05-TRRAIL/01_en_TRrailpassengers_r.px/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_289(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Safety, accidents, fatalities, and injuries - by victim',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2006-01-01',
        'temporal_coverage_end': '2018-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['heavy-rail','high-speed-rail','transit-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Safety, accidents, fatalities, and injuries',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['Number'],
        'dimensioning': 'by victim'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Safety, accidents, fatalities, and injuries': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__06-TRRAILACC/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_290(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Infrastructure navigable river length - by type',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1993-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Infrastructure navigable river length',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['KM'],
        'dimensioning': 'by type'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Infrastructure navigable river length': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__11-TRINFRA/ZZZ_en_TRInfrIWW_r.px/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_291(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Vessels - by construction year, capacity',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1990-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Vessels',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['Number','power','tonnes'],
        'dimensioning': 'by construction year, capacity'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Vessels': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__08-TRINLVESS/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_292(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Freight transport - by location',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '1980-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['water'],
        'modes': ['inland-shipping'],
        'services': ['freight'],
        'frequency': 'as_needed',
        'indicators': 'Freight transport',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['T','Tkm'],
        'dimensioning': 'by location'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Freight transport': 'https://w3.unece.org/PXWeb2015/pxweb/en/STAT/STAT__40-TRTRANS__09-TRInlWater/01_en_TRInlWaterTonKm_r.px/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_293(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Passenger transport - by vehicle type (tram, metro, light rail)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2010-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Common Questionnaire from Statistics Offices', 'url': 'https://unece.org/statistics'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Passenger transport',
        'data_provider': 'UNECE',
        'url': 'https://unece.org/',
        'data_access': 'publicly available',
        'units': ['passengers','PKM'],
        'dimensioning': 'by vehicle type (tram, metro, light rail)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Passenger transport': 'https://unece.org/tram-and-metro-data'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_294(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Number of vehicles registered - vehicle type (only for individual use)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2007-01-01',
        'temporal_coverage_end': '2007-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'OMU 1st edition', 'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of vehicles registered',
        'data_provider': 'CAF',
        'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'vehicle type (only for individual use)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Number of vehicles registered': 'https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fwww.caf.com%2Fmedia%2F6767%2Fomu_flota_js.xlsx&wdOrigin=BROWSELINK'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_295(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Number of vehicles registered - vehicle type (only for individual use)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'OMU 2nd edition', 'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis','truck','bus'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of vehicles registered',
        'data_provider': 'CAF',
        'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'vehicle type (only for individual use)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Number of vehicles registered': 'https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fwww.caf.com%2Fmedia%2F6822%2Fcaf_-_observatorio_de_movilidad_urbana_-_datos_generales_2015.xlsx&wdOrigin=BROWSELINK'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_296(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Number of vehicles per inhabitant - vehicle type (car and motorcycle)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2007-01-01',
        'temporal_coverage_end': '2007-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'OMU 1st edition', 'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of vehicles per inhabitant',
        'data_provider': 'CAF',
        'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/',
        'data_access': 'publicly available',
        'units': ['veh/1000inhab'],
        'dimensioning': 'vehicle type (car and motorcycle)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Number of vehicles per inhabitant': 'https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fwww.caf.com%2Fmedia%2F6767%2Fomu_flota_js.xlsx&wdOrigin=BROWSELINK'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_297(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Number of vehicles per inhabitant - vehicle type (car and motorcycle)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'OMU 2nd edition', 'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','private-cars','taxis'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of vehicles per inhabitant',
        'data_provider': 'CAF',
        'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/',
        'data_access': 'publicly available',
        'units': ['veh/1000inhab'],
        'dimensioning': 'vehicle type (car and motorcycle)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Number of vehicles per inhabitant': 'https://www.google.com/url?q=https://view.officeapps.live.com/op/view.aspx?src%3Dhttps%253A%252F%252Fwww.caf.com%252Fmedia%252F6822%252Fcaf_-_observatorio_de_movilidad_urbana_-_datos_generales_2015.xlsx%26wdOrigin%3DBROWSELINK&sa=D&source=editors&ust=1729165401341252&usg=AOvVaw3E6iffvEWXO8zMMOhNNk-s'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_298(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'vehicle type (taxi, jeep, bus, include urban rails)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2007-01-01',
        'temporal_coverage_end': '2007-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'OMU 1st edition', 'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','taxis','bus','high-speed-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of public transit vehicles registered',
        'data_provider': 'CAF',
        'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'vehicle type (taxi, jeep, bus, include urban rails)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Number of public transit vehicles registered': 'https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fwww.caf.com%2Fmedia%2F6767%2Fomu_flota_js.xlsx&wdOrigin=BROWSELINK'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_299(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Number of trips per person per day (trips/person) - "vehicle type( T individual	T colectivo	A pie/bici)"',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2015-01-01',
        'temporal_coverage_end': '2015-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'OMU 2nd edition', 'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','taxis','bus','high-speed-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Number of trips per person per day (trips/person)',
        'data_provider': 'CAF',
        'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/',
        'data_access': 'publicly available',
        'units': ['#'],
        'dimensioning': 'vehicle type( T individual	T colectivo	A pie/bici)'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Number of trips per person per day': 'https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fwww.caf.com%2Fmedia%2F6822%2Fcaf_-_observatorio_de_movilidad_urbana_-_datos_generales_2015.xlsx&wdOrigin=BROWSELINK'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_300(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Modal Split (distribution of trip per mode) - percetange per mode',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2022-01-01',
        'temporal_coverage_end': '2022-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'OMU 3rd Edition (based on mobility surveys', 'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['cars','private-cars','taxis','bus','high-speed-rail'],
        'services': ['passenger'],
        'frequency': 'as_needed',
        'indicators': 'Modal Split (distribution of trip per mode)',
        'data_provider': 'CAF',
        'url': 'https://www.caf.com/es/conocimiento/datos/observatorio-de-movilidad-urbana/',
        'data_access': 'publicly available',
        'units': ['%'],
        'dimensioning': 'percetange per mode'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Modal Split': 'https://omu-latam.org/indicadores/'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='webpage'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_301(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'CO2 emissions - passenger specific; freight specific',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2017-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UIC', 'url': 'https://uic.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'CO2 emissions',
        'data_provider': 'UIC',
        'url': 'https://uic.org/',
        'data_access': 'publicly available',
        'units': ['gCO2e/pkm','gCO2e/net','tkm'],
        'dimensioning': 'passenger specific; freight specific'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'CO2e emissions': 'https://uic.org/IMG/pdf/handbook_iea-uic_2017_web3.pdf'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='pdf'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_302(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Total emissions',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2017-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UIC', 'url': 'https://uic.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Total emissions',
        'data_provider': 'UIC',
        'url': 'https://uic.org/',
        'data_access': 'publicly available',
        'units': ['millioin tonnes CO2eq'],
        'dimensioning': ''
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Total emissions': 'https://uic.org/IMG/pdf/handbook_iea-uic_2017_web3.pdf'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='pdf'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_303(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Energy consumption - passsenger specific; freight specific',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2017-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UIC', 'url': 'https://uic.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy consumption',
        'data_provider': 'UIC',
        'url': 'https://uic.org/',
        'data_access': 'publicly available',
        'units': ['kWh/pkm','kWh/tkm'],
        'dimensioning': 'passsenger specific; freight specific'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Energy consumption': 'https://uic.org/IMG/pdf/handbook_iea-uic_2017_web3.pdf'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='pdf'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
def dataset_304(org_id, dataset_title):
    
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','').replace('&',''),
        'notes': 'Air pollutants emissions - PM, NOx',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2017-01-01',
        'temporal_coverage_end': '2017-01-01',
        'geographies': ['worldwide'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'UIC', 'url': 'https://uic.org/'}
        ],
        'language': 'en',
        'sectors': ['rail'],
        'modes': ['high-speed-rail','heavy-rail','transit-rail'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Air pollutants emissions',
        'data_provider': 'UIC',
        'url': 'https://uic.org/',
        'data_access': 'publicly available',
        'units': ['thousand tonnes'],
        'dimensioning': 'PM, NOx'
    }

    try:
        response = requests.post(
            urljoin(CKAN_URL, '/api/3/action/package_create'),
            json=data,
            headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an error for HTTP errors
        print('Dataset created successfully:', response.json())
        data_dict = {
            'Air pollutants emissions': 'https://uic.org/IMG/pdf/handbook_iea-uic_2017_web3.pdf'
        }
        for key, value in data_dict.items():
            resource_name = key
            resource = value
            resource_format='pdf'
            create_resource_remote_url_with_format(data['name'], resource, resource_name, resource_format)
    except Exception as e:
        print('Error creating dataset:', str(e))
if __name__ == '__main__':
    #dataset_1('transport-data-commons', 'New passenger vehicle registrations by type Norway', 'Our World in Data/new-vehicles-type-area.csv')
    #dataset_2('transport-data-commons', 'Share of new passenger vehicles that are battery electric 2019', 'Our World in Data/share-vehicle-electric.csv')
    #dataset_3('transport-data-commons', 'Average carbon intensity of new passenger vehicles 2019', 'Our World in Data/carbon-new-passenger-vehicles.csv')
    #dataset_4('transport-data-commons', 'Fuel economy of new passenger vehicles 2019', 'Our World in Data/fuel-efficiency-new-vehicles.csv')
    #dataset_5('transport-data-commons', 'Global airline passenger capacity and traffic', 'Our World in Data/airline-capacity-and-traffic.csv')
    #dataset_6('transport-data-commons', 'Share of airline seats filled by passengers', 'Our World in Data/airline-passenger-load-factor.csv')
    #dataset_7('transport-data-commons', 'Per capita CO₂ emissions from domestic aviation 2018', 'Our World in Data/per-capita-co2-domestic-aviation.csv')
    #dataset_8('transport-data-commons', 'CO₂ emissions from domestic air travel 2018', 'Our World in Data/co2-emissions-domestic-aviation.csv')
    #dataset_9('transport-data-commons', 'Share of global CO₂ emissions from domestic air travel 2018', 'Our World in Data/share-global-co2-domestic-aviation.csv')
    #dataset_10('transport-data-commons', 'Per capita CO₂ emissions from international aviation 2018', 'Our World in Data/per-capita-co2-international-aviation.csv')
    #dataset_11('transport-data-commons', 'CO₂ emissions from international aviation 2018', 'Our World in Data/co2-international-aviation.csv')
    #dataset_12('transport-data-commons', 'Share of global CO₂ emissions from international aviation, 2018', 'Our World in Data/share-co2-international-aviation.csv')
    #dataset_13('transport-data-commons', 'Per capita CO₂ emissions from international passenger flights, tourism-adjusted, 2018', 'Our World in Data/per-capita-co2-international-flights-adjusted.csv')
    #dataset_14('transport-data-commons', 'Per capita CO₂ emissions from commercial aviation, tourism-adjusted, 2018', 'Our World in Data/per-capita-co2-aviation-adjusted.csv')
    #dataset_15('transport-data-commons', 'Per capita CO₂ emissions from aviation, 2018', 'Our World in Data/per-capita-co2-aviation.csv')
    #dataset_16('transport-data-commons', 'CO₂ emissions from aviation, 2018', 'Our World in Data/co2-emissions-aviation.csv')
    #dataset_17('transport-data-commons', 'Share of global CO₂ emissions from aviation, 2018', 'Our World in Data/share-co2-emissions-aviation.csv')
    #dataset_18('transport-data-commons', 'Per capita domestic aviation passenger kilometers, 2018', 'Our World in Data/per-capita-domestic-aviation-km.csv')
    #dataset_19('transport-data-commons', 'Share of global domestic aviation passenger kilometers, 2018', 'Our World in Data/share-global-domestic-aviation-km.csv')
    #dataset_20('transport-data-commons', 'Total domestic aviation passenger kilometers, 2018', 'Our World in Data/total-domestic-aviation-km.csv')
    #dataset_21('transport-data-commons', 'Per capita international aviation passenger kilometers, 2018', 'Our World in Data/per-capita-international-aviation-km.csv')
    #dataset_22('transport-data-commons', 'Share of global passenger kilometers from international aviation, 2018', 'Our World in Data/share-international-aviation-km.csv')
    #dataset_23('transport-data-commons', 'Total passenger kilometers from international aviation, 2018', 'Our World in Data/passenger-km-international-aviation.csv')
    #dataset_24('transport-data-commons', 'Per capita passenger kilometers from air travel, 2018', 'Our World in Data/per-capita-km-aviation.csv')
    #dataset_25('transport-data-commons', 'Share of global passenger kilometers from air travel, 2018', 'Our World in Data/share-km-aviation.csv')
    #dataset_26('transport-data-commons', 'Total passenger kilometers from air travel, 2018', 'Our World in Data/total-aviation-km.csv')
    #dataset_27('transport-data-commons', 'Tonne-kilometers of air freight, 2021', 'Our World in Data/air-transport-freight-ton-km.csv')
    #dataset_28('transport-data-commons', 'Passenger-kilometers by rail, 2021', 'Our World in Data/railways-passengers-carried-passenger-km.csv')
    #dataset_29('transport-data-commons', 'Energy intensity of transport per passenger-kilometer, 2018', 'Our World in Data/energy-intensity-transport.csv')
    #dataset_30('transport-data-commons', 'Per capita CO₂ emissions from transport, 2020', 'Our World in Data/per-capita-co2-transport.csv')
    #dataset_31('transport-data-commons', 'CO₂ emissions from transport, 2020', 'Our World in Data/co2-emissions-transport.csv')
    #dataset_32('transport-data-commons', 'Domestic aviation country emissions', 'Climatetrace/domestic-aviation_country_emissions.csv')
    #dataset_33('transport-data-commons', 'International aviation country emissions', 'Climatetrace/international-aviation_country_emissions.csv')
    #dataset_34('transport-data-commons', 'Other transport country emissions', 'Climatetrace/other-transport_country_emissions.csv')
    #dataset_35('transport-data-commons', 'Railways country emissions', 'Climatetrace/railways_country_emissions.csv')
    #dataset_36('transport-data-commons', 'Road transportation country emissions', 'Climatetrace/road-transportation_country_emissions.csv')
    #dataset_37('transport-data-commons', 'Domestic shipping country emissions', 'Climatetrace/domestic-shipping_country_emissions.csv')
    #dataset_38('transport-data-commons', 'International shipping country emissions', 'Climatetrace/international-shipping_country_emissions.csv')
    #dataset_39('transport-data-commons', 'Air transport, registered carrier departures worldwide', 'World Bank/API_IS_AIR_DPRT_DS2_en_csv_v2_3415031.csv')
    #dataset_40('transport-data-commons', 'Air transport, freight (million ton-km)', 'World Bank/API_IS_AIR_GOOD_MT_K1_DS2_en_csv_v2_3401747.csv')
    #dataset_41('transport-data-commons', 'Air transport, passengers carried', 'World Bank/API_IS_AIR_PSGR_DS2_en_csv_v2_3401550.csv')
    #dataset_42('transport-data-commons', 'Rail lines (total route-km)', 'World Bank/API_IS_RRS_TOTL_KM_DS2_en_csv_v2_3434344.csv')
    #dataset_43('transport-data-commons', 'Railways, goods transported (million ton-km)', 'World Bank/API_IS_RRS_GOOD_MT_K6_DS2_en_csv_v2_3434337.csv')
    #dataset_44('transport-data-commons', 'Railways, passengers carried (million passenger-km)', 'World Bank/API_IS_RRS_PASG_KM_DS2_en_csv_v2_3434340.csv')
    #dataset_45('transport-data-commons', 'Container port traffic (TEU: 20 foot equivalent units)', 'World Bank/API_IS_SHP_GOOD_TU_DS2_en_csv_v2_3434242.csv')
    #dataset_46('transport-data-commons', 'Global Sales Statistics 2019-2023', 'https://www.oica.net/wp-content/uploads/total_sales_2023.xlsx')
    #dataset_47('transport-data-commons', 'Motorization rate 2020 - WORLDWIDE', 'https://www.oica.net/wp-content/uploads/Total-World-vehicles-in-use-2020.xlsx')
    #dataset_48('transport-data-commons', '2023 production statistics')
    #dataset_49('transport-data-commons', 'VEHICLES IN USE EUROPE 2022', 'https://www.acea.auto/files/ACEA-report-vehicles-in-use-europe-2022.pdf')
    #dataset_50('transport-data-commons', 'NEW CAR REGISTRATIONS, EUROPEAN UNION IN JULY 2024', 'https://www.acea.auto/files/Press_release_car_registrations_July_2024.pdf')
    #dataset_51('transport-data-commons', 'NEW COMMERCIAL VEHICLE REGISTRATIONS, EUROPEAN UNION H1 2024', 'https://www.acea.auto/files/Press_release_commercial_vehicle_registrations_H1-2024.pdf')
    #dataset_52('transport-data-commons', 'NEW CAR REGISTRATIONS BY FUEL TYPE, EUROPEAN UNION IN Q4 2022', 'https://www.acea.auto/files/20230201_PRPC-fuel_Q4-2022_FINAL-1.pdf')
    #dataset_53('transport-data-commons', 'NEW BUS, TRUCK AND VAN REGISTRATIONS BY FUEL TYPE, EUROPEAN UNION 2022')
    #dataset_54('transport-data-commons', 'CO2 emissions from car production in the EU', 'https://www.acea.auto/figure/co2-emissions-from-car-production-in-eu')
    #dataset_55('transport-data-commons', 'Energy consumption during car production in the EU', 'https://www.acea.auto/figure/energy-consumption-during-car-production-in-eu')
    #dataset_56('transport-data-commons', 'Water used in car production in the EU', 'https://www.acea.auto/figure/water-used-in-car-production-in-eu')
    #dataset_57('transport-data-commons', 'Waste from car production in the EU', 'https://www.acea.auto/figure/waste-from-car-production-in-eu')
    #dataset_58('transport-data-commons', 'Transport Starter Data Kit - PKM', 'https://zenodo.org/records/10406893/files/TSDK_ALL.xlsx')
    #dataset_59('transport-data-commons', 'Transport Starter Data Kit - TKM', 'https://zenodo.org/records/10406893/files/TSDK_ALL.xlsx')
    #dataset_60('transport-data-commons', 'Transport Starter Data Kit - Quantity', 'https://zenodo.org/records/10406893/files/TSDK_ALL.xlsx')
    #dataset_61('transport-data-commons', 'Rail accidents by type of accident', 'EUROSTAT/tran_sf_railac_linear.csv')
    #dataset_62('transport-data-commons', 'Rail accidents victims by type of accident and category of persons involved', 'EUROSTAT/tran_sf_railvi_linear.csv')
    #dataset_63('transport-data-commons', 'Rail accidents involving the transport of dangerous goods', 'EUROSTAT/tran_sf_raildg_linear.csv')
    #dataset_64('transport-data-commons', 'Suicides involving railways', 'EUROSTAT/tran_sf_railsu_linear.csv')
    #dataset_65('transport-data-commons', 'Length of railway tracks by electrification of tracks', 'EUROSTAT/rail_if_tracks_linear.csv' )
    #dataset_66('transport-data-commons', 'Length of railway lines by number of tracks and electrification of lines', 'EUROSTAT/rail_if_line_tr_linear.csv')
    #dataset_67('transport-data-commons', 'Length of electrified and non-electrified railway lines by track gauge', 'EUROSTAT/rail_if_line_ga_linear.csv')
    #dataset_68('transport-data-commons', 'Length of electric and non-electric railway lines by nature of transport', 'EUROSTAT/rail_if_line_na_linear.csv')
    #dataset_69('transport-data-commons', 'Length of electrified railway lines by type of current', 'EUROSTAT/rail_if_electri_linear.csv')
    #dataset_70('transport-data-commons', 'Length of railway lines by maximum permitted speed', 'EUROSTAT/rail_if_line_sp_linear.csv')
    #dataset_71('transport-data-commons', 'Length of railway lines equipped with the railway traffic management system by type of signalling', 'EUROSTAT/rail_if_traff_linear.csv')
    #dataset_72('transport-data-commons', 'Level crossings by type', 'EUROSTAT/rail_if_lvlcros_linear.csv')
    #dataset_73('transport-data-commons', 'Passengers transported', 'EUROSTAT/rail_pa_total_linear.csv')
    #dataset_74('transport-data-commons', 'International transport of passengers from the reporting country to the country of disembarkation', 'EUROSTAT/rail_pa_intgong_linear.csv')
    #dataset_75('transport-data-commons', 'International transport of passengers from the country of embarkation to the reporting country', 'EUROSTAT/rail_pa_intcmng_linear.csv')
    #dataset_76('transport-data-commons', 'Passenger transport by type of transport (detailed reporting only)', 'EUROSTAT/rail_pa_typepas_linear.csv')
    #dataset_77('transport-data-commons', 'Passengers transported by type of train speed', 'EUROSTAT/rail_pa_speed_linear.csv')
    #dataset_78('transport-data-commons', 'Goods transported', 'EUROSTAT/rail_go_total_linear.csv')
    #dataset_79('transport-data-commons', 'International transport of goods from the loading country to the reporting country', 'EUROSTAT/rail_go_intcmgn_linear.csv')
    #dataset_80('transport-data-commons', 'International transport of goods from the reporting country to the unloading country', 'EUROSTAT/rail_go_intgong_linear.csv')
    #dataset_81('transport-data-commons', 'Locomotives and railcars by source of energy', 'EUROSTAT/rail_eq_locon_linear.csv')
    #dataset_82('transport-data-commons', 'Tractive power of locomotives and railcars by source of energy', 'EUROSTAT/rail_eq_locop_linear.csv')
    #dataset_83('transport-data-commons', 'Passenger railway vehicles, by type of vehicle', 'EUROSTAT/rail_eq_pa_nty_linear.csv')
    #dataset_84('transport-data-commons', 'Passenger railway vehicles by category of vehicle (until 2012)', 'EUROSTAT/rail_eq_pa_nca_linear.csv')
    #dataset_85('transport-data-commons', 'Seat capacity of passenger railway vehicles by type of vehicles', 'EUROSTAT/rail_eq_pa_cty_linear.csv')
    #dataset_86('transport-data-commons', 'Seat/berth capacity of passenger railway vehicles', 'EUROSTAT/rail_eq_pa_csb_linear.csv')
    #dataset_87('transport-data-commons', 'Wagons and their load capacity by type of wagons', 'EUROSTAT/rail_eq_wagon_linear.csv')
    #dataset_88('transport-data-commons', 'Trainsets and capacity by type of speed', 'EUROSTAT/rail_eq_trset_linear.csv')
    #dataset_89('transport-data-commons', 'National and international railway passengers transport by loading/unloading NUTS 2 region', 'EUROSTAT/tran_r_rapa_linear.csv')
    #dataset_90('transport-data-commons', 'Passenger cars in accompanied passenger car railway transport, by type of transport', 'EUROSTAT/rail_pa_nbcar_linear.csv')
    #dataset_91('transport-data-commons', 'Passengers in accompanied passenger car railway transport, by type of transport', 'EUROSTAT/rail_pa_nbpass_linear.csv')
    #dataset_92('transport-data-commons', 'Goods transported by type of transport', 'EUROSTAT/rail_go_typepas_linear.csv')
    #dataset_93('transport-data-commons', 'Goods transported by group of goods - from 2008 onwards based on NST 2007', 'EUROSTAT/rail_go_grpgood_linear.csv')
    #dataset_94('transport-data-commons', 'Goods transported by group of goods - until 2007 based on NST/R', 'EUROSTAT/rail_go_grgood7_linear.csv')
    #dataset_95('transport-data-commons', 'Goods transported by type of consignment', 'EUROSTAT/rail_go_total_linear.csv')
    #dataset_96('transport-data-commons', 'Transit transport of goods by loading and unloading countries', 'EUROSTAT/rail_go_trsorde_linear.csv')
    #dataset_97('transport-data-commons', 'National and international railway goods transport by loading/unloading NUTS 2 region', 'EUROSTAT/tran_r_rago_linear.csv')
    #dataset_98('transport-data-commons', 'Transport of dangerous goods', 'EUROSTAT/rail_go_dnggood_linear.csv')
    #dataset_99('transport-data-commons', 'Goods transported in intermodal transport units', 'EUROSTAT/rail_go_contwgt_linear.csv')
    #dataset_100('transport-data-commons', 'Empty and loaded intermodal transport units', 'EUROSTAT/rail_go_itu_linear.csv')
    #dataset_101('transport-data-commons', 'Train traffic performance by train category and source of energy', 'EUROSTAT/rail_tf_traveh_linear.csv')
    #dataset_102('transport-data-commons', 'Passenger train traffic performance by type of train speed', 'EUROSTAT/rail_tf_passmov_linear.csv')
    #dataset_103('transport-data-commons', 'Hauled railway vehicle traffic performance by train category and source of energy (gross tkm hauled)', 'EUROSTAT/rail_tf_haulmov_linear.csv')
    #dataset_104('transport-data-commons', 'Hauled railway vehicle traffic performance by type of railway vehicle', 'EUROSTAT/rail_tf_hautype_linear.csv')
    #dataset_105('transport-data-commons', 'Train traffic on the rail network')
    #dataset_106('transport-data-commons', 'Persons killed in road accidents by age, sex and category of persons involved')
    #dataset_107('transport-data-commons', 'Persons killed in road accidents by type of road')
    #dataset_108('transport-data-commons', 'Persons killed in road accidents by type of vehicle')
    #dataset_109('transport-data-commons', 'Modal split of inland freight transport')
    #dataset_110('transport-data-commons', 'Modal split of inland passenger transport')
    #dataset_111('transport-data-commons', 'Length of motorways and e-roads')
    #dataset_112('transport-data-commons', 'Length of state, provincial and communal roads')
    #dataset_113('transport-data-commons', 'Length of other roads within/outside built-up areas')
    #dataset_114('transport-data-commons', 'Length of paved and unpaved roads')
    #dataset_115('transport-data-commons', 'Road transport equipment - stock of vehicles')
    #dataset_116('transport-data-commons', 'Road transport equipment - load capacities')
    #dataset_117('transport-data-commons', 'Road transport equipment - new registration - stock of vehicles')
    #dataset_118('transport-data-commons', 'Road transport equipment - new registration - load capacities')
    #dataset_119('transport-data-commons', 'Road traffic activity')
    #dataset_120('transport-data-commons', 'Road transport measurement - passengers')
    #dataset_121('transport-data-commons', 'Road transport measurement - freight')
    #dataset_122('transport-data-commons', 'Air transport safety')
    #dataset_123('transport-data-commons', 'Air transport infrastructure - commercial airports')
    #dataset_124('transport-data-commons', 'Air transport equipment')
    #dataset_125('transport-data-commons', 'Overview of the air passenger transport by country and airports')
    #dataset_126('transport-data-commons', 'National air passenger transport by country and airports')
    #dataset_127('transport-data-commons', 'Overview of the freight and mail air transport by country and airports')
    #dataset_128('transport-data-commons', 'National freight and mail air transport by country and airports')
    #dataset_129('transport-data-commons', 'Air transport performance - passengers')
    #dataset_130('transport-data-commons', 'Air transport performance - freight and mail')
    #dataset_131('transport-data-commons', 'Maritime transport safety')
    #dataset_132('transport-data-commons', 'Maritime transport - goods - detailed annual and quarterly results')
    #dataset_133('transport-data-commons', 'Maritime transport - passengers - detailed annual and quarterly results')
    #dataset_134('transport-data-commons', 'Maritime vessels movements')
    #dataset_135('transport-data-commons', 'Inland waterways transport infrastructure')
    #dataset_136('transport-data-commons', 'Inland waterways transport equipment')
    #dataset_137('transport-data-commons', 'Inland waterways transport measurement - goods - annual data transport')
    #dataset_138('transport-data-commons', 'Inland waterways transport measurement - goods - annual data - container')
    #dataset_139('transport-data-commons', 'Inland waterways transport measurement - goods - annual data - Vessel')
    #dataset_140('transport-data-commons', 'Intermodal transport - unitisation in freight transport')
    #dataset_141('transport-data-commons','Index of inland transport performance per GDP unit - freight')
    #dataset_142('transport-data-commons','Modal split of transport')
    #dataset_143('transport-data-commons','Index of inland transport performance per GDP unit - passenger')
    #dataset_144('transport-data-commons', 'Freight transport activity - Domestic coastal shipping, inland waterways - JRC-IDEES')	
    #dataset_145('transport-data-commons', 'Load factor - Domestic coastal shipping, inland waterways - JRC-IDEES')	
    #dataset_146('transport-data-commons', 'Passenger transport activity - Domestic, international -intra-EU, international-extra-EU - JRC-IDEES')	
    #dataset_147('transport-data-commons', 'Freight transport activity - Domestic and International - Intra-EU, International - Extra-EU - JRC-IDEES')	
    #dataset_148('transport-data-commons', 'Number of flights - Domestic and International - Intra-EU, International - Extra-EU - JRC-IDEES')	
    #dataset_149('transport-data-commons', 'Volume carried - Domestic and International - Intra-EU, International - Extra-EU - JRC-IDEES')	
    #dataset_150('transport-data-commons', 'Stock of aircraft - total - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_151('transport-data-commons', 'Stock of aircraft - in use - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_152('transport-data-commons', 'New aircraft - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_153('transport-data-commons', 'Load/occupancy factor - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_154('transport-data-commons', 'Distance travelled per flight - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_155('transport-data-commons', 'Flight per year by airplane - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_156('transport-data-commons', 'Energy use - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_157('transport-data-commons', 'Energy intensity over activity - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_158('transport-data-commons', 'Energy consuption per flight - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_159('transport-data-commons', 'CO2 emissions - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_160('transport-data-commons', 'CO2 emission intensity - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_161('transport-data-commons', 'CO2 emissions per flight - Intra-EU, International - Extra-EU - JRC-IDEES')
    #dataset_162('transport-data-commons', 'Energy use - by fuel and by transport service - JRC-IDEES')
    #dataset_163('transport-data-commons', 'Energy intensity - Domestic coastal shipping, inland waterways - JRC-IDEES')
    #dataset_164('transport-data-commons', 'CO2 emissions - By fuel and by transport service - JRC-IDEES')
    #dataset_165('transport-data-commons', 'CO2 emission intensity - Domestic coastal shipping, inland waterways - JRC-IDEES')
    #dataset_166('transport-data-commons', 'Passenger transport activity - rail - JRC-IDEES')
    #dataset_167('transport-data-commons', 'Freight transport activity - rail - JRC-IDEES')
    #dataset_168('transport-data-commons', 'Stock of trains - total - rail - JRC-IDEES')
    #dataset_169('transport-data-commons', 'Stock of trains - in use - rail - JRC-IDEES')
    #dataset_170('transport-data-commons', 'New trains - rail - JRC-IDEES')
    #dataset_171('transport-data-commons', 'Load/occupancy factor - rail - JRC-IDEES')
    #dataset_172('transport-data-commons', 'Capacity of representative train - rail - JRC-IDEES')
    #dataset_173('transport-data-commons', 'Annual mileage - rail - JRC-IDEES')
    #dataset_174('transport-data-commons', 'Energy use - rail - JRC-IDEES')
    #dataset_175('transport-data-commons', 'Energy intensity over activity - rail - JRC-IDEES')
    #dataset_176('transport-data-commons', 'CO2 emissions - rail - JRC-IDEES')
    #dataset_177('transport-data-commons', 'CO2 emission intensity - rail - JRC-IDEES')
    #dataset_178('transport-data-commons', 'Passenger transport activity - road - JRC-IDEES')
    #dataset_179('transport-data-commons', 'Freight transport activity - road - JRC-IDEES')
    #dataset_180('transport-data-commons', 'Stock of vehicles - total - road - JRC-IDEES')
    #dataset_181('transport-data-commons', 'Stock of vehicles - in use - road - JRC-IDEES')
    #dataset_182('transport-data-commons', 'New vehicles - road - JRC-IDEES')
    #dataset_183('transport-data-commons', 'Load/occupancy factor - road - JRC-IDEES')
    #dataset_184('transport-data-commons', 'Annual mileage - road - JRC-IDEES')
    #dataset_185('transport-data-commons', 'Energy use - road - JRC-IDEES')
    #dataset_186('transport-data-commons', 'Energy intensity over activity - road - JRC-IDEES')
    #dataset_187('transport-data-commons', 'CO2 emissions - road - JRC-IDEES')
    #dataset_188('transport-data-commons', 'CO2 emission intensity - road - JRC-IDEES')
    #dataset_189('transport-data-commons', 'Age structure of vehicle stock (vintages) - road - JRC-IDEES')
    #dataset_190('transport-data-commons', 'Stock test cycle efficiency - road - JRC-IDEES')
    #dataset_191('transport-data-commons', 'New vehicles test cycle efficiency - road - JRC-IDEES')
    #dataset_192('transport-data-commons', 'Stock test cycle emission intensity - road - JRC-IDEES')
    #dataset_193('transport-data-commons', 'New vehicles test cycle emission intensity - road - JRC-IDEES')
    #dataset_194('transport-data-commons', 'Vehicle Fuel Economy Data & CO2 emissions - road - kapsarc')
    #dataset_195('transport-data-commons', 'CO2 emissions from passenger cars - road - kapsarc')
    #dataset_196('transport-data-commons', 'Number of vehicles in use - road - kapsarc')
    #dataset_197('transport-data-commons', 'Vehicles registerd on the road - road - kapsarc')
    #dataset_198('transport-data-commons', 'Road Network - road - kapsarc')
    #dataset_199('transport-data-commons', 'Distance between main cities - road - kapsarc')
    #dataset_200('transport-data-commons', 'New passenger car registrations - road - kapsarc')
    #dataset_201('transport-data-commons', 'New road vehicle registrations - road - kapsarc')
    #dataset_202('transport-data-commons', 'Road vehicle fleet - road - kapsarc')
    #dataset_203('transport-data-commons', 'Passenger vehicle fleet - road - kapsarc')
    #dataset_204('transport-data-commons', 'Share of road transport - road - kapsarc')
    #dataset_205('transport-data-commons', 'Lenght of roads inside cities - road - kapsarc')
    #dataset_206('transport-data-commons', 'Registered motor vehicles - road - kapsarc')
    #dataset_207('transport-data-commons', 'Total road length - road - kapsarc')
    #dataset_208('transport-data-commons', 'Vehicle fleet - road - kapsarc')
    #dataset_209('transport-data-commons', 'Registered vehicles  - road - kapsarc')
    #dataset_210('transport-data-commons', 'Length of paved road - road - kapsarc')
    #dataset_211('transport-data-commons', 'Passenger transport activity - rail - kapsarc')
    #dataset_212('transport-data-commons', 'Freight transport activity - rail - kapsarc')
    #dataset_213('transport-data-commons', 'Freight transport activity - eurostat - rail - kapsarc')
    #dataset_214('transport-data-commons', 'Passenger transport activity - eurostat - rail - kapsarc')
    #dataset_215('transport-data-commons', 'Rolling Stock - rail - kapsarc')
    #dataset_216('transport-data-commons', 'Passenger transport activity - passengers carried - rail - kapsarc')
    #dataset_217('transport-data-commons', 'Distance between railway stations - rail - kapsarc')
    #dataset_218('transport-data-commons', 'Number of locomotives and cars - rail - kapsarc')
    #dataset_219('transport-data-commons', 'Passenger & Cargo Traffic - air - kapsarc')
    #dataset_220('transport-data-commons', 'Passenger activity - air - kapsarc')
    #dataset_221('transport-data-commons', 'Freight activity - air - kapsarc')
    #dataset_222('transport-data-commons', 'Air traffic - air - kapsarc')
    #dataset_223('transport-data-commons', 'Number of airplanes - air - kapsarc')
    #dataset_224('transport-data-commons', 'Cargo loaded/unloaded - water - kapsarc')
    #dataset_225('transport-data-commons', 'Volume of seaports exports - water - kapsarc')
    #dataset_226('transport-data-commons', 'Merchant fleet - water - kapsarc')
    #dataset_227('transport-data-commons', 'Freight transport activity - water - kapsarc')
    #dataset_228('transport-data-commons', 'Freight transport activity - tankers - water - kapsarc')
    #dataset_229('transport-data-commons', 'Modal split of freight transport - intermodal - kapsarc')
    #dataset_230('transport-data-commons', 'Passenger transport - intermodal - kapsarc')
    #dataset_231('transport-data-commons', 'Passenger, Freight and container transport - intermodal - kapsarc')
    #dataset_232('transport-data-commons', 'Petroleum production and consumption - intermodal - ornl')
    #dataset_233('transport-data-commons', 'Transportation petroleum consumption - intermodal - ornl')
    #dataset_234('transport-data-commons', 'Energy consumption - intermodal - ornl')
    #dataset_235('transport-data-commons', 'Fuel production, import, consumption - intermodal - ornl')
    #dataset_236('transport-data-commons', 'Transport energy/fuel consumption - intermodal - ornl')
    #dataset_237('transport-data-commons', 'Passenger travel activity - intermodal - ornl')
    #dataset_238('transport-data-commons', 'Energy intensity - intermodal - ornl')
    #dataset_239('transport-data-commons', 'Carbon content - intermodal - ornl')
    #dataset_240('transport-data-commons', 'CO2 emissions - intermodal - ornl')
    #dataset_241('transport-data-commons', 'Carbon coefficients - intermodal - ornl')
    #dataset_242('transport-data-commons', 'Freight transport activity - intermodal - ornl')
    #dataset_243('transport-data-commons', 'Average mile per freight trip - intermodal - ornl')
    #dataset_244('transport-data-commons', 'Average trip length - intermodal - ornl')
    #dataset_245('transport-data-commons', 'Emission of air pollutants - intermodal - ornl')
    #dataset_246('transport-data-commons', 'Vehicle Fleet (also intermodal) - road - ornl')
    #dataset_247('transport-data-commons', 'Modal split - road - ornl')
    #dataset_248('transport-data-commons', 'Travel activity (also intermodal) - road - ornl')
    #dataset_249('transport-data-commons', 'Fuel use & fuel economy (also intermodal) - road - ornl')
    #dataset_250('transport-data-commons', 'Fuel economy comparison - road - ornl')
    #dataset_251('transport-data-commons', 'Production shares - road - ornl')
    #dataset_252('transport-data-commons', 'Technology penetration - road - ornl')
    #dataset_253('transport-data-commons', 'Average material consumption - road - ornl')
    #dataset_254('transport-data-commons', 'Refueling stations - road - ornl')
    #dataset_255('transport-data-commons', 'Emission standards - road - ornl')
    #dataset_256('transport-data-commons', 'Driving cycle attributes - road - ornl')
    #dataset_257('transport-data-commons', 'Diesel share - road - ornl')
    #dataset_258('transport-data-commons', 'Carshare members - road - ornl')
    #dataset_259('transport-data-commons', 'Car operating costs - road - ornl')
    #dataset_260('transport-data-commons', 'Fuel costs - road - ornl')
    #dataset_261('transport-data-commons', 'Production weighted Carbon footprint - road - ornl')
    #dataset_262('transport-data-commons', 'Load factor - road - ornl')
    #dataset_263('transport-data-commons', 'Fleet - rail - ornl')
    #dataset_264('transport-data-commons', 'Average trip length - rail - ornl')
    #dataset_265('transport-data-commons', 'Traffic activity - rail - ornl')
    #dataset_266('transport-data-commons', 'Energy intensity - rail - ornl')
    #dataset_267('transport-data-commons', 'Fuel use - rail - ornl')
    #dataset_268('transport-data-commons', 'Fleet - water - ornl')
    #dataset_269('transport-data-commons', 'Energy use - water - ornl')
    #dataset_270('transport-data-commons', 'Freight activity - water - ornl')
    #dataset_271('transport-data-commons', 'Fuel use - water - ornl')
    #dataset_272('transport-data-commons', 'Fleet - air - ornl')
    #dataset_273('transport-data-commons', 'Travel activity - air - ornl')
    #dataset_274('transport-data-commons', 'Energy use - air - ornl')
    #dataset_275('transport-data-commons', 'Fuel use - air - ornl')
    #dataset_276('transport-data-commons', 'Vehicle Sales - road - gfei')
    #dataset_277('transport-data-commons', 'Fuel consumption - road - gfei')
    #dataset_278('transport-data-commons', 'Infrastructre length - road - unece')
    #dataset_279('transport-data-commons', 'Vehicle fleet and new registrations - road - unece')
    #dataset_280('transport-data-commons', 'Traffic motor vehicle movements - road - unece')
    #dataset_281('transport-data-commons', 'Freight transport - road - unece')
    #dataset_282('transport-data-commons', 'Passenger transport - road - unece')
    #dataset_283('transport-data-commons', 'Safety, accidents, fatalities, and injuries - road - unece')
    #dataset_284('transport-data-commons', 'Infrastructure length - rail - unece')
    #dataset_285('transport-data-commons', 'Transport equipment - rail - unece')
    #dataset_286('transport-data-commons', 'Traffic train movements - rail - unece')
    #dataset_287('transport-data-commons', 'Freight transport - rail - unece')
    #dataset_288('transport-data-commons', 'Passenger transport- rail - unece')
    #dataset_289('transport-data-commons', 'Safety, accidents, fatalities, and injuries - rail - unece')
    #dataset_290('transport-data-commons', 'Infrastructure navigable river length - water - unece')
    #dataset_291('transport-data-commons', 'Vessels - water - unece')
    #dataset_292('transport-data-commons', 'Freight transport - water - unece')
    #dataset_293('transport-data-commons', 'Passenger transport - rail - unece')
    #dataset_294('transport-data-commons', 'Number of vehicles registered - road - caf')
    #dataset_295('transport-data-commons', 'Number of vehicles registered 2nd - road - caf')
    #dataset_296('transport-data-commons', 'Number of vehicles per inhabitant - road - caf')
    #dataset_297('transport-data-commons', 'Number of vehicles per inhabitant 2nd - road - caf')
    #dataset_298('transport-data-commons', 'Number of public transit vehicles registered - road - caf')
    #dataset_299('transport-data-commons', 'Number of trips per person per day - road - caf')
    #dataset_300('transport-data-commons', 'Modal Split - road - caf')
    #dataset_301('transport-data-commons', 'CO2 emissions - rail - uic')
    #dataset_302('transport-data-commons', 'Total emissions - rail - uic')
    #dataset_303('transport-data-commons', 'Energy consumption - rail - uic')
    #dataset_304('transport-data-commons', 'Air pollutants emissions - rail - uic')
    
    
    