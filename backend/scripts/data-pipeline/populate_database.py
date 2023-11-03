"""
Populate Database
-----------------

This module handles the insertion or updating of serialized and processed data into the target database or data store.

Responsibilities:
- Database Connection: Establish and maintain connections to the target database(s).
- Data Insertion: Add new records to the database.
- Data Update: Update existing records with new or changed data.
- Data De-duplication: Ensure that duplicate data is identified and handled appropriately.
- Error Handling: Gracefully manage any issues that arise during the data insertion/update process.
- Monitoring and Logging: Monitor the rate of data insertion/update and log any significant events or errors.

This is the final step in the data pipeline, ensuring that processed data is securely and correctly stored.
"""


import os
import json
import requests
import time
from requests.exceptions import ConnectionError, Timeout

# Directory containing the serialized job data
DATA_DIR = "/app/scripts/data-pipeline/serialized-job-data"

# URL endpoint for the PostJobListing view
URL_ENDPOINT = os.environ['API_BASE_URL'] + "/querier/batch-post-job-listings"

# Define the headers for the POST request
HEADERS = {
    "Authorization": f"Token {os.environ['USER_TOKEN']}",
    "Content-Type": "application/json"
}

session = requests.Session()
session.headers.update(HEADERS)

def post_job_listings(job_listings):
    try:
        response = session.post(URL_ENDPOINT, json=job_listings)
        response.raise_for_status()
        print("Batch job listings posted successfully.")
        return True
    except ConnectionError as ce:
        print(f"Connection error: {ce}")
    except Timeout as te:
        print(f"Timeout error: {te}")
    except requests.exceptions.HTTPError as he:
        print(f"HTTP error: {he.response.status_code} - {he.response.text}")
    except Exception as e:
        print(f"Failed to post batch job listings: {e}")
    return False

# Collect all job listings into a list
all_job_listings = []
for filename in os.listdir(DATA_DIR):
    if filename.startswith('job_data_'):
        file_path = os.path.join(DATA_DIR, filename)
        with open(file_path, 'r') as f:
            data = json.load(f)
            all_job_listings.extend(data)  # Append data from each file to the list

# Now post all job listings in a single request
if all_job_listings:
    post_job_listings(all_job_listings)

print("Done processing job listings!")
