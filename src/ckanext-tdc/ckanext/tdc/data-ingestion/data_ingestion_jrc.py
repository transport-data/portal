import openpyxl
import csv
import requests
import json
from urllib.parse import urljoin
import os
from dotenv import load_dotenv
import zipfile
from datetime import datetime

CKAN_URL = os.getenv('CKAN_URL')
API_KEY = os.getenv('API_KEY')

def download_and_extract_zip(extract_to='JRC-IDEES-2021_EU27'):
    # Download the ZIP file
    response = requests.get("https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/JRC-IDEES/JRC-IDEES-2021_v1/JRC-IDEES-2021_EU27.zip")
    zip_file_path = os.path.join(extract_to, 'JRC-IDEES-2021_EU27.zip')
    
    # Make sure the directory exists
    os.makedirs(extract_to, exist_ok=True)
    
    # Save the ZIP file to the specified directory
    with open(zip_file_path, 'wb') as zip_file:
        zip_file.write(response.content)
    
    # Extract the ZIP file
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)

def resource_publish(indicator,sheet_name, rows_to_extract):
    wb = openpyxl.load_workbook("JRC-IDEES-2021_EU27/JRC-IDEES-2021_Transport_EU27.xlsx", data_only=True)
    sheet = wb[sheet_name]
    current_date = datetime.now().strftime('%Y-%m-%d')
    out_csv = f'{indicator}-fetch_on-{current_date}.csv'
    data = []
    for row in rows_to_extract:
        row_data = [cell.value for cell in sheet[row]]
        data.append(row_data)
    # Pivot the data: Use the first column (A) as the label and other columns as dates
    column_headers = [cell.value for cell in sheet[1]]
    dates = column_headers[1:]
    pivoted_data = []
    for row in data:
        label = row[0]
        for i, value in enumerate(row[1:], start=1):
            # Skip rows where either date or value is None/empty
            if dates[i-1] and value and type(dates[i-1]) is int:                
                pivoted_data.append([indicator,label,str(dates[i-1])+'-01-01',round(value,1)])
    with open(out_csv, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['indicator', 'dimensioning', 'date', 'value'])
        writer.writerows(pivoted_data)
    file.close()
    return out_csv


def dataset_exists(dataset_name):
    """
    Check if a dataset already exists in CKAN.
    
    :param dataset_name: Name or ID of the dataset to check.
    :return: True if the dataset exists, False otherwise.
    """
    params = {"id": dataset_name}
    response = requests.get(
        urljoin(CKAN_URL, '/api/3/action/package_show'),
        params=params,
        headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
    )
    
    # If the dataset exists, we get a 200 status code, otherwise 404
    if response.status_code == 200:
        print(f"Dataset '{dataset_name}' already exists.")
        return True
    elif response.status_code == 404:
        print(f"Dataset '{dataset_name}' does not exist.")
        return False
    else:
        response.raise_for_status()  # Raise an error for other HTTP statuses

# WATER
def dataset_publish_1(org_id, dataset_title):
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

    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'Transport', rows_to_extract=[27,28])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'Transport', rows_to_extract=[27,28])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_2(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrNavi_act', rows_to_extract=[14,15])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrNavi_act', rows_to_extract=[14,15])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_3(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrNavi_ene', rows_to_extract=[4,5,6,7,8,9,10,11,12,13,14,15])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrNavi_ene', rows_to_extract=[4,5,6,7,8,9,10,11,12,13,14,15])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_4(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrNavi_ene', rows_to_extract=[24,25])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrNavi_ene', rows_to_extract=[24,25])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_5(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrNavi_emi', rows_to_extract=[4,5])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrNavi_emi', rows_to_extract=[4,5])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_6(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrNavi_emi', rows_to_extract=[14,15])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrNavi_emi', rows_to_extract=[14,15])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
#AVIATION
def dataset_publish_7(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrAvia_act', rows_to_extract=[5,6,7])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrAvia_act', rows_to_extract=[5,6,7])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e))  
def dataset_publish_8(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrAvia_act', rows_to_extract=[9,10,11])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrAvia_act', rows_to_extract=[9,10,11])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_9(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[25,26,27])
        resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[29,30,31])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[25,26,27])
            resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[29,30,31])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))     
def dataset_publish_10(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[35,36,37])
        resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[39,40,41])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[35,36,37])
            resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[39,40,41])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e)) 
def dataset_publish_11(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[45,46,47])
        resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[49,50,51])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[45,46,47])
            resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[49,50,51])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_12(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[55,56,57])
        resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[59,60,61])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[55,56,57])
            resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[59,60,61])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))  
def dataset_publish_13(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[67,68,69])
        resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[71,72,73])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[67,68,69])
            resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[71,72,73])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))  
def dataset_publish_14(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[77,78,79])
        resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[81,82,83])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[77,78,79])
            resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[81,82,83])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))  
def dataset_publish_15(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[97,98,99])
        resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[101,102,103])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_act', rows_to_extract=[97,98,99])
            resource_name2 = resource_publish('Freight transport','TrAvia_act', rows_to_extract=[101,102,103])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))  
def dataset_publish_16(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_ene', rows_to_extract=[7,8,9])
        resource_name2 = resource_publish('Freight transport','TrAvia_ene', rows_to_extract=[11,12,13])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_ene', rows_to_extract=[7,8,9])
            resource_name2 = resource_publish('Freight transport','TrAvia_ene', rows_to_extract=[11,12,13])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))  
def dataset_publish_17(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_ene', rows_to_extract=[29,30,31])
        resource_name2 = resource_publish('Freight transport','TrAvia_ene', rows_to_extract=[33,34,35])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_ene', rows_to_extract=[29,30,31])
            resource_name2 = resource_publish('Freight transport','TrAvia_ene', rows_to_extract=[33,34,35])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))  
def dataset_publish_18(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_ene', rows_to_extract=[39,40,41])
        resource_name2 = resource_publish('Freight transport','TrAvia_ene', rows_to_extract=[43,44,45])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_ene', rows_to_extract=[39,40,41])
            resource_name2 = resource_publish('Freight transport','TrAvia_ene', rows_to_extract=[43,44,45])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))  
def dataset_publish_19(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_emi', rows_to_extract=[7,8,9])
        resource_name2 = resource_publish('Freight transport','TrAvia_emi', rows_to_extract=[11,12,13])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_emi', rows_to_extract=[7,8,9])
            resource_name2 = resource_publish('Freight transport','TrAvia_emi', rows_to_extract=[11,12,13])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))  
def dataset_publish_20(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_emi', rows_to_extract=[23,24,25])
        resource_name2 = resource_publish('Freight transport','TrAvia_emi', rows_to_extract=[27,28,29])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_emi', rows_to_extract=[23,24,25])
            resource_name2 = resource_publish('Freight transport','TrAvia_emi', rows_to_extract=[27,28,29])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))  
def dataset_publish_21(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger transport','TrAvia_emi', rows_to_extract=[43,44,45])
        resource_name2 = resource_publish('Freight transport','TrAvia_emi', rows_to_extract=[47,48,49])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger transport','TrAvia_emi', rows_to_extract=[43,44,45])
            resource_name2 = resource_publish('Freight transport','TrAvia_emi', rows_to_extract=[47,48,49])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
# Railway
def dataset_publish_22(org_id, dataset_title):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Passenger transport activity - Passenger rail (Metro & tram &urban light rail, conventional passenger trains (diesel vs electric), high speed rail)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2021-01-01',
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrRail_act', rows_to_extract=[5,6,7,8,9])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrRail_act', rows_to_extract=[5,6,7,8,9])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e)) 
def dataset_publish_23(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrRail_act', rows_to_extract=[11,12])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrRail_act', rows_to_extract=[11,12])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e)) 
def dataset_publish_24(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger rail','TrRail_act', rows_to_extract=[27,28,29,30,31])
        resource_name2 = resource_publish('Freight rail','TrRail_act', rows_to_extract=[33,34])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger rail','TrRail_act', rows_to_extract=[27,28,29,30,31])
            resource_name2 = resource_publish('Freight rail','TrRail_act', rows_to_extract=[33,34])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_25(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger rail','TrRail_act', rows_to_extract=[38,39,40,41,42])
        resource_name2 = resource_publish('Freight rail','TrRail_act', rows_to_extract=[44,45])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger rail','TrRail_act', rows_to_extract=[38,39,40,41,42])
            resource_name2 = resource_publish('Freight rail','TrRail_act', rows_to_extract=[44,45])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_26(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger rail','TrRail_act', rows_to_extract=[51,52,53,54,55])
        resource_name2 = resource_publish('Freight rail','TrRail_act', rows_to_extract=[57,58])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger rail','TrRail_act', rows_to_extract=[51,52,53,54,55])
            resource_name2 = resource_publish('Freight rail','TrRail_act', rows_to_extract=[57,58])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_27(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger rail','TrRail_act', rows_to_extract=[62,63,64,65,66])
        resource_name2 = resource_publish('Freight rail','TrRail_act', rows_to_extract=[68,69])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger rail','TrRail_act', rows_to_extract=[62,63,64,65,66])
            resource_name2 = resource_publish('Freight rail','TrRail_act', rows_to_extract=[68,69])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_28(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger rail','TrRail_act', rows_to_extract=[84,85,86,87,88])
        resource_name2 = resource_publish('Freight rail','TrRail_act', rows_to_extract=[90,91])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger rail','TrRail_act', rows_to_extract=[84,85,86,87,88])
            resource_name2 = resource_publish('Freight rail','TrRail_act', rows_to_extract=[90,91])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_29(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger rail','TrRail_ene', rows_to_extract=[5,6,7,8,12,13,14,15,16])
        resource_name2 = resource_publish('Freight rail','TrRail_ene', rows_to_extract=[18,19])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger rail','TrRail_ene', rows_to_extract=[5,6,7,8,12,13,14,15,16])
            resource_name2 = resource_publish('Freight rail','TrRail_ene', rows_to_extract=[18,19])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_30(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger rail','TrRail_ene', rows_to_extract=[36,37,38,39,40])
        resource_name2 = resource_publish('Freight rail','TrRail_ene', rows_to_extract=[42,43])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger rail','TrRail_ene', rows_to_extract=[36,37,38,39,40])
            resource_name2 = resource_publish('Freight rail','TrRail_ene', rows_to_extract=[42,43])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_31(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger rail','TrRail_emi', rows_to_extract=[10,11,12,13,14])
        resource_name2 = resource_publish('Freight rail','TrRail_emi', rows_to_extract=[16,17])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger rail','TrRail_emi', rows_to_extract=[10,11,12,13,14])
            resource_name2 = resource_publish('Freight rail','TrRail_emi', rows_to_extract=[16,17])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_32(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger rail','TrRail_emi', rows_to_extract=[28,29,30,31,32])
        resource_name2 = resource_publish('Freight rail','TrRail_emi', rows_to_extract=[34,35])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger rail','TrRail_emi', rows_to_extract=[28,29,30,31,32])
            resource_name2 = resource_publish('Freight rail','TrRail_emi', rows_to_extract=[34,35])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_33(org_id, dataset_title):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Passenger transport activity - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2021-01-01',
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrRoad_act', rows_to_extract=[5,6,7,8,9,10,11,12,13,14,15,16,17,18])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrRoad_act', rows_to_extract=[5,6,7,8,9,10,11,12,13,14,15,16,17,18])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e)) 
def dataset_publish_34(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name = resource_publish(data['indicators'],'TrRoad_act', rows_to_extract=[20,21,22,23,24,25,26,27,28])
        headers = {
            'Authorization': API_KEY,
        }
        data = {
            'package_id': data['name'],
            'name': resource_name, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name, 'rb') as file:
            files = {
                'upload': file,
            }
            resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
            print('Resource created successfully:', resp.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name = resource_publish(data['indicators'],'TrRoad_act', rows_to_extract=[20,21,22,23,24,25,26,27,28])
            headers = {
                'Authorization': API_KEY,
            }
            data = {
                'package_id': data['name'],
                'name': resource_name, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name, 'rb') as file:
                files = {
                    'upload': file,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data, files=files)
                print('Resource created successfully:', resp.json())
        except Exception as e:
            print('Error creating dataset:', str(e)) 
def dataset_publish_35(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_act', rows_to_extract=[59,60,61,62,63,64,65,66,67,68,69,70,71,72])
        resource_name2 = resource_publish('Freight road','TrRoad_act', rows_to_extract=[74,75,76,77,78,79,80,81,82])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_act', rows_to_extract=[59,60,61,62,63,64,65,66,67,68,69,70,71,72])
            resource_name2 = resource_publish('Freight road','TrRoad_act', rows_to_extract=[74,75,76,77,78,79,80,81,82])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_36(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_act', rows_to_extract=[113,114,115,116,117,118,119,120,121,122,123,124,125,126])
        resource_name2 = resource_publish('Freight road','TrRoad_act', rows_to_extract=[128,129,130,131,132,133,134,135,136])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_act', rows_to_extract=[113,114,115,116,117,118,119,120,121,122,123,124,125,126])
            resource_name2 = resource_publish('Freight road','TrRoad_act', rows_to_extract=[128,129,130,131,132,133,134,135,136])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_37(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_act', rows_to_extract=[142,143,144,145,146,147,148,149,150,151,152,153,154,155])
        resource_name2 = resource_publish('Freight road','TrRoad_act', rows_to_extract=[157,158,159,160,161,162,163,164,165])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_act', rows_to_extract=[142,143,144,145,146,147,148,149,150,151,152,153,154,155])
            resource_name2 = resource_publish('Freight road','TrRoad_act', rows_to_extract=[157,158,159,160,161,162,163,164,165])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_38(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_act', rows_to_extract=[169,170,171,172,173,174,175,176,177,178,179,180,181,182])
        resource_name2 = resource_publish('Freight road','TrRoad_act', rows_to_extract=[184,185,186,187,188,189,190,191,192])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_act', rows_to_extract=[169,170,171,172,173,174,175,176,177,178,179,180,181,182])
            resource_name2 = resource_publish('Freight road','TrRoad_act', rows_to_extract=[184,185,186,187,188,189,190,191,192])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_39(org_id, dataset_title):
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
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Energy use',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['ktoe'],
        'dimensioning': 'By fuel and by mode/vehicle type Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_ene', rows_to_extract=[19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41])
        resource_name2 = resource_publish('Freight road','TrRoad_ene', rows_to_extract=[43,44,45,46,47,48,49,50,51,52,53,54,55,56])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_ene', rows_to_extract=[19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41])
            resource_name2 = resource_publish('Freight road','TrRoad_ene', rows_to_extract=[43,44,45,46,47,48,49,50,51,52,53,54,55,56])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_40(org_id, dataset_title):
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_ene', rows_to_extract=[89,90,91,92,93,94,95,96,97,98,99,100,101,102])
        resource_name2 = resource_publish('Freight road','TrRoad_ene', rows_to_extract=[104,105,106,107,108,109,110,111,112])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_ene', rows_to_extract=[89,90,91,92,93,94,95,96,97,98,99,100,101,102])
            resource_name2 = resource_publish('Freight road','TrRoad_ene', rows_to_extract=[104,105,106,107,108,109,110,111,112])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_41(org_id, dataset_title):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emissions - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2021-01-01',
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_emi', rows_to_extract=[19,20,21,22,23,24,25,26,27,28,29,30,31,32])
        resource_name2 = resource_publish('Freight road','TrRoad_emi', rows_to_extract=[34,35,36,37,38,39,40,41,42])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_emi', rows_to_extract=[19,20,21,22,23,24,25,26,27,28,29,30,31,32])
            resource_name2 = resource_publish('Freight road','TrRoad_emi', rows_to_extract=[34,35,36,37,38,39,40,41,42])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_42(org_id, dataset_title):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'CO2 emission intensity - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2021-01-01',
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
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_emi', rows_to_extract=[56,57,58,59,60,61,62,63,64,65,66,67,68,69])
        resource_name2 = resource_publish('Freight road','TrRoad_emi', rows_to_extract=[71,72,73,74,75,76,77,78,79])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_emi', rows_to_extract=[56,57,58,59,60,61,62,63,64,65,66,67,68,69])
            resource_name2 = resource_publish('Freight road','TrRoad_emi', rows_to_extract=[71,72,73,74,75,76,77,78,79])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_43(org_id, dataset_title):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Age structure of vehicle stock (vintages) - by year of registration (before 2000, 2000-2015) and by serice (Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International))',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger', 'freight'],
        'frequency': 'as_needed',
        'indicators': 'Age structure of vehicle stock (vintages)',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': [''],
        'dimensioning': 'by year of registration (before 2000, 2000-2015) and by serice (Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International))'
    }
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_tech', rows_to_extract=[61,62,63,64,65,66,67,68,69,70,71,72,73,74])
        resource_name2 = resource_publish('Freight road','TrRoad_tech', rows_to_extract=[76,77,78,79,80,81,82,83,84])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_tech', rows_to_extract=[61,62,63,64,65,66,67,68,69,70,71,72,73,74])
            resource_name2 = resource_publish('Freight road','TrRoad_tech', rows_to_extract=[76,77,78,79,80,81,82,83,84])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_44(org_id, dataset_title):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Stock test cycle efficiency - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Stock test cycle efficiency',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['ktoe/km'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_tech', rows_to_extract=[90,91,92,93,94,95,96,97,98,99,100,101,102,103])
        resource_name2 = resource_publish('Freight road','TrRoad_tech', rows_to_extract=[105,106,107,108,109,110,111,112,113])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_tech', rows_to_extract=[90,91,92,93,94,95,96,97,98,99,100,101,102,103])
            resource_name2 = resource_publish('Freight road','TrRoad_tech', rows_to_extract=[105,106,107,108,109,110,111,112,113])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_45(org_id, dataset_title):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'New vehicles test cycle efficiency - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'New vehicles test cycle efficiency',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['ktoe/km'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_tech', rows_to_extract=[144,145,146,147,148,149,150,151,152,153,154,155,156,157])
        resource_name2 = resource_publish('Freight road','TrRoad_tech', rows_to_extract=[159,160,161,162,163,164,165,166,167])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_tech', rows_to_extract=[144,145,146,147,148,149,150,151,152,153,154,155,156,157])
            resource_name2 = resource_publish('Freight road','TrRoad_tech', rows_to_extract=[159,160,161,162,163,164,165,166,167])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_46(org_id, dataset_title):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'Stock test cycle emission intensity - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'EEA', 'url': 'https://www.eea.europa.eu/data-and-maps'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'Stock test cycle emission intensity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['gCO2/km'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_tech', rows_to_extract=[171,172,173,174,175,176,177,178,179,180,181,182,183,184])
        resource_name2 = resource_publish('Freight road','TrRoad_tech', rows_to_extract=[186,187,188,189,190,191,192,193,194])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_tech', rows_to_extract=[171,172,173,174,175,176,177,178,179,180,181,182,183,184])
            resource_name2 = resource_publish('Freight road','TrRoad_tech', rows_to_extract=[186,187,188,189,190,191,192,193,194])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
def dataset_publish_47(org_id, dataset_title):
    data = {
        'title': dataset_title,
        'name': dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
        'notes': 'New vehicles test cycle emission intensity - Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)',
        'license_id': 'CC-BY-4.0',
        'owner_org': org_id,
        'temporal_coverage_start': '2000-01-01',
        'temporal_coverage_end': '2021-01-01',
        'geographies': ['eur'],
        'tdc_category': 'public',
        'sources': [
            {'title': 'Eurostat', 'url': 'https://ec.europa.eu/eurostat/databrowser/explore/all/all_themes?lang=en&display=list&sort=category'},
            {'title': 'EEA', 'url': 'https://www.eea.europa.eu/data-and-maps'}
        ],
        'language': 'en',
        'sectors': ['road'],
        'modes': ['two-three-wheelers','cars','taxis','private-cars','bus'],
        'services': ['passenger','freight'],
        'frequency': 'as_needed',
        'indicators': 'New vehicles test cycle emission intensity',
        'data_provider': 'JRC-IDEES',
        'url': 'https://joint-research-centre.ec.europa.eu/scientific-tools-databases/potencia-policy-oriented-tool-energy-and-climate-change-impact-assessment-0/jrc-idees_en',
        'data_access': 'publicly available',
        'units': ['gCO2/km'],
        'dimensioning': 'Passenger transport: 2-wheelers, passenger cars (gasoline ICE, diesel ICE, LPG ICE, NG ICE, PHEV, BEV), buses &coaches (gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), Freight transport: light commercial vehicles ( gasoline ICE, diesel ICE, LPG ICE, NG ICE, BEV), heavy duty vehicles (Domestic, International)'
    }
    if dataset_exists(dataset_title.lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/','')):
        resource_name1 = resource_publish('Passenger road','TrRoad_tech', rows_to_extract=[225,226,227,228,229,230,231,232,233,234,235,236,237,238])
        resource_name2 = resource_publish('Freight road','TrRoad_tech', rows_to_extract=[240,241,242,243,244,245,246,247,248])
        headers = {
            'Authorization': API_KEY,
        }
        data1 = {
            'package_id': data['name'],
            'name': resource_name1, 
            'format': 'csv',
            'resource_type': 'data'
        }
        data2 = {
            'package_id': data['name'],
            'name': resource_name2, 
            'format': 'csv',
            'resource_type': 'data'
        }
        # Read the file in binary mode
        with open(resource_name1, 'rb') as file1:
            files1 = {
                'upload': file1,
            }
            resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
            print('Resource created successfully:', resp1.json())
        with open(resource_name2, 'rb') as file2:
            files2 = {
                'upload': file2,
            }
            resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
            print('Resource created successfully:', resp2.json())
    else:
        try:
            response = requests.post(
                urljoin(CKAN_URL, '/api/3/action/package_create'),
                json=data,
                headers={'Authorization': API_KEY, 'Content-Type': 'application/json'}
            )
            print('Dataset created successfully:', response.json())
            resource_name1 = resource_publish('Passenger road','TrRoad_tech', rows_to_extract=[225,226,227,228,229,230,231,232,233,234,235,236,237,238])
            resource_name2 = resource_publish('Freight road','TrRoad_tech', rows_to_extract=[240,241,242,243,244,245,246,247,248])
            headers = {
                'Authorization': API_KEY,
            }
            data1 = {
                'package_id': data['name'],
                'name': resource_name1, 
                'format': 'csv',
                'resource_type': 'data'
            }
            data2 = {
                'package_id': data['name'],
                'name': resource_name2, 
                'format': 'csv',
                'resource_type': 'data'
            }
            # Read the file in binary mode
            with open(resource_name1, 'rb') as file1:
                files1 = {
                    'upload': file1,
                }
                resp1 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data1, files=files1)
                print('Resource created successfully:', resp1.json())
            with open(resource_name2, 'rb') as file2:
                files2 = {
                    'upload': file2,
                }
                resp2 = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=data2, files=files2)
                print('Resource created successfully:', resp2.json())
        except Exception as e:
            print('Error creating dataset:', str(e))
if __name__ == '__main__':
    download_and_extract_zip()
    dataset_publish_1('jrc-idees','Freight transport activity - water - JRC-IDEES')
    dataset_publish_2('jrc-idees','Load factor - water - JRC-IDEES')
    dataset_publish_3('jrc-idees','Energy use - water - JRC-IDEES')
    dataset_publish_4('jrc-idees','Energy intensity - water - JRC-IDEES')
    dataset_publish_5('jrc-idees', 'CO2 emissions - water - JRC-IDEES')
    dataset_publish_6('jrc-idees', 'CO2 emission intensity - water - JRC-IDEES')
    dataset_publish_7('jrc-idees', 'Passenger transport activity - aviation - JRC-IDEES')
    dataset_publish_8('jrc-idees', 'Freight transport activity - aviation - JRC-IDEES')
    dataset_publish_9('jrc-idees', 'Number of flights - aviation - JRC-IDEES')
    dataset_publish_10('jrc-idees', 'Volume carried - aviation - JRC-IDEES')
    dataset_publish_11('jrc-idees', 'Stock of aircraft - total - aviation - JRC-IDEES')
    dataset_publish_12('jrc-idees', 'New aircraft - aviation - JRC-IDEES')
    dataset_publish_13('jrc-idees', 'Load/occupancy factor - aviation - JRC-IDEES')
    dataset_publish_14('jrc-idees', 'Distance travelled per flight - aviation - JRC-IDEES')
    dataset_publish_15('jrc-idees', 'Flight per year by airplane - aviation - JRC-IDEES')
    dataset_publish_16('jrc-idees', 'Energy use - aviation - JRC-IDEES')
    dataset_publish_17('jrc-idees', 'Energy intensity over activity - aviation - JRC-IDEES')
    dataset_publish_18('jrc-idees', 'Energy consuption per flight - aviation - JRC-IDEES')
    dataset_publish_19('jrc-idees', 'CO2 emissions - avidation - JRC-IDEES')
    dataset_publish_20('jrc-idees', 'CO2 emission intensity - aviation - JRC-IDEES')
    dataset_publish_21('jrc-idees', 'CO2 emissions per flight - aviation - JRC-IDEES')
    dataset_publish_22('jrc-idees', 'Passenger transport activity - rail - JRC-IDEES')
    dataset_publish_23('jrc-idees', 'Freight transport activity - rail - JRC-IDEES')
    dataset_publish_24('jrc-idees', 'Stock of trains - total - rail - JRC-IDEES')
    dataset_publish_25('jrc-idees', 'New trains - total - rail - JRC-IDEES')
    dataset_publish_26('jrc-idees', 'Load/occupancy factor - rail - JRC-IDEES')
    dataset_publish_27('jrc-idees', 'Capacity of representative train - rail - JRC-IDEES')
    dataset_publish_28('jrc-idees', 'Annual mileage - rail - JRC-IDEES')
    dataset_publish_29('jrc-idees', 'Energy use - rail - JRC-IDEES')
    dataset_publish_30('jrc-idees', 'Energy intensity over activity - rail - JRC-IDEES')
    dataset_publish_31('jrc-idees', 'CO2 emissions - rail - JRC-IDEES')
    dataset_publish_32('jrc-idees', 'CO2 emission intensity - rail - JRC-IDEES')
    dataset_publish_33('jrc-idees', 'Passenger transport activity - road - JRC-IDEES')
    dataset_publish_34('jrc-idees', 'Freight transport activity - road - JRC-IDEES')
    dataset_publish_35('jrc-idees', 'Stock of vehicles - total - road - JRC-IDEES')
    dataset_publish_36('jrc-idees', 'New vehicles - road - JRC-IDEES')
    dataset_publish_37('jrc-idees', 'Load/occupancy factor - road - JRC-IDEES')
    dataset_publish_38('jrc-idees', 'Annual mileage - road - JRC-IDEES')
    dataset_publish_39('jrc-idees', 'Energy use - road - JRC-IDEES')
    dataset_publish_40('jrc-idees', 'Energy intensity over activity - road - JRC-IDEES')
    dataset_publish_41('jrc-idees', 'CO2 emissions - road - JRC-IDEES')
    dataset_publish_42('jrc-idees', 'CO2 emission intensity - road - JRC-IDEES')
    dataset_publish_43('jrc-idees', 'Age structure of vehicle stock (vintages) - road - JRC-IDEES')
    dataset_publish_44('jrc-idees', 'Stock test cycle efficiency - road - JRC-IDEES')
    dataset_publish_45('jrc-idees', 'New vehicles test cycle efficiency - road - JRC-IDEES')
    dataset_publish_46('jrc-idees', 'Stock test cycle emission intensity - road - JRC-IDEES')
    dataset_publish_47('jrc-idees', 'New vehicles test cycle emission intensity - road - JRC-IDEES')
