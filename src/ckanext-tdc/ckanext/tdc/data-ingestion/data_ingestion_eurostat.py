import os
import re
import time
import json
import requests
import zipfile
from tqdm import tqdm
from datetime import datetime
import concurrent.futures
from urllib.parse import urljoin
           
# CKAN Configuration
CKAN_URL = os.getenv('CKAN_URL')
API_KEY = os.getenv('API_KEY')

def convert_tsv_to_csv(input_file):
# Read the content of the input file
    with open(input_file, 'r') as infile:
        content = infile.read()

# Replace tabs with commas
    content = content.replace('\t', ',')
    output_file = input_file.replace('.tsv', '.csv')
    with open(output_file, 'w') as outfile:
        outfile.write(content)
    return output_file

def get_all_datasets():
    # get json from datasets.json
    with open('src/ckanext-tdc/ckanext/tdc/data-ingestion/metadata_eurostat.json') as f:
        datasets = json.load(f)
        return datasets

def dataset_exists(id):
    url = f'{CKAN_URL}/api/3/action/package_show?id={id}'
    response = requests.get(url)
    return response.json()['success']

def create_dataset_copy(dataset):
    if dataset_exists(dataset['name']):
        print(f"Dataset already exists: {dataset['name']}")
        return dataset['name']
    else: 
        dataset_metadata = {
            'title': dataset['title'],
            'name': dataset['title'].lower().replace(' - ', '-').replace(' ', '-').replace(',','').replace('(','').replace(')','').replace('/',''),
            'notes': " ",
            'license_id': dataset['license_id'],
            'owner_org': 'eurostat',
            'temporal_coverage_start': dataset['temporal_coverage_start'],
            'temporal_coverage_end': dataset['temporal_coverage_end'],
            'geographies': ['eur'],
            'tdc_category': dataset['tdc_category'],
            'sources': dataset['sources'],
            'language': dataset['language'],
            'sectors': dataset['sectors'],
            'modes': dataset['modes'],
            'services': dataset['services'],
            'frequency': dataset['frequency'],
            'indicators':dataset['indicators'],
            'data_provider': dataset['data_provider'],
            'url': dataset['url'],
            'data_access': dataset['data_access'],
            'units': dataset['units'],
            'dimensioning': dataset['dimensioning'],
        }
        dataset = requests.post(f'{CKAN_URL}/api/3/action/package_create', headers={'Authorization': API_KEY}, json=dataset_metadata)
        __import__('pprint').pprint(dataset)
        return dataset.json()['result']['id']

def download_resource(resource, dataset_id):
    download_url = resource['url']
    today_str = datetime.now().strftime("%Y-%m-%d")
    today_str = today_str.replace('-', '_')
    resource_data = {
        'name': resource['name'] + ' ' + today_str,
        'description': resource['description'],
        'format': resource['format'],
        'package_id': dataset_id,
        'resource_type': 'data'
    }
    print(f"Downloading from {download_url}")
    response = requests.get(download_url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    content_disposition = response.headers.get('Content-Disposition')
    if content_disposition:
        filename = re.findall('filename="(.+)"', content_disposition)
        if filename:
            file_extension = os.path.splitext(filename[0])[1]
        else:
            file_extension = ''
    else:
        file_extension = ''
    
    # Save the file with the correct extension
    full_path = resource['name'] + file_extension
    full_path = resource['name'] + file_extension
    if os.path.exists(full_path):
        print(f"File already exists: {full_path}")
        return resource_data, full_path
    with open(full_path, 'wb') as f, tqdm(
        desc=full_path,
        total=total_size,
        unit='B',
        unit_scale=True,
        unit_divisor=1024,
    ) as bar:
        for data in response.iter_content(chunk_size=1024):
            f.write(data)
            bar.update(len(data))
    return resource_data, full_path
    

def dataset_publish():
    datasets = get_all_datasets()
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = []
        for pk in datasets:
            dataset = create_dataset_copy(pk)
            for resource in pk['resources']:
                futures.append(executor.submit(download_resource, resource, dataset)) 
        for future in concurrent.futures.as_completed(futures):
            resource, resource_path = future.result()
            print('Creating resource:', resource['name'])
            resource_path = convert_tsv_to_csv(resource_path)
            with open(resource_path, 'rb') as file:
                files = {
                    'upload': file,
                }
                headers = {
                    'Authorization': API_KEY,
                }
                resp = requests.post(f'{CKAN_URL}/api/3/action/resource_create', headers=headers, data=resource, files=files)
                print('Resource created successfully:', resp.json())

if __name__ == '__main__':
    dataset_publish()
