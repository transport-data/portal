import os
import re
import time
import json
import requests
import zipfile
from tqdm import tqdm
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urljoin


# CKAN Configuration
CKAN_URL = os.getenv("CKAN_URL")
API_KEY = os.getenv("API_KEY")

def convert_tsv_to_csv(input_file):
    """Converts a TSV file to CSV."""
    with open(input_file, "r") as infile, open(input_file.replace(".tsv", ".csv"), "w") as outfile:
        outfile.write(infile.read().replace("\t", ","))
    return input_file.replace(".tsv", ".csv")

def get_all_datasets():
    """Loads datasets from a JSON file."""
    with open("metadata_eurostat.json") as f:
        return json.load(f)

def dataset_exists(id):
    """Checks if a dataset exists on CKAN."""
    url = f"{CKAN_URL}/api/3/action/package_show?id={id}"
    return requests.get(url).json()["success"]

def create_dataset_copy(dataset):
    """Creates a copy of a dataset on CKAN if it doesn't exist."""
    if dataset_exists(dataset["name"]):
        print(f"Dataset already exists: {dataset['name']}")
        return dataset["name"]
    dataset["name"] = re.sub(r"[^a-zA-Z0-9-]", "", dataset["title"].lower().replace(" ", "-"))
    response = requests.post(
        f"{CKAN_URL}/api/3/action/package_create",
        headers={"Authorization": API_KEY},
        json=dataset
    )
    return response.json()["result"]["id"]

def download_resource(resource, dataset_id):
    """Downloads a resource file with progress bar and saves it."""
    response = requests.get(resource["url"], stream=True)
    file_extension = os.path.splitext(re.findall(r'filename="(.+)"', response.headers.get("Content-Disposition", ""))[0] or "")[1]
    full_path = f"{resource['name']}{file_extension}"

    if not os.path.exists(full_path):
        with open(full_path, "wb") as f, tqdm(total=int(response.headers.get("content-length", 0)), unit="B", unit_scale=True) as bar:
            for chunk in response.iter_content(chunk_size=1024):
                f.write(chunk)
                bar.update(len(chunk))
    return {"name": resource["name"], "package_id": dataset_id, "format": resource["format"]}, full_path

def upload_resource(resource, resource_path):
    """Uploads a file to CKAN."""
    with open(resource_path, "rb") as file:
        response = requests.post(
            f"{CKAN_URL}/api/3/action/resource_create",
            headers={"Authorization": API_KEY},
            data=resource,
            files={"upload": file}
        )
        print("Resource created:", response.json())

def datasets_publish():
    """Processes all datasets concurrently for download and upload to CKAN."""
    datasets = get_all_datasets()
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [
            executor.submit(download_resource, resource, create_dataset_copy(dataset))
            for dataset in datasets for resource in dataset["resources"]
        ]
        for future in futures:
            resource, path = future.result()
            csv_path = convert_tsv_to_csv(path)
            upload_resource(resource, csv_path)

if __name__ == '__main__':
    datasets_publish()
