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

# Directory containing the serialized job data
DATA_DIR = "/app/scripts/data-pipeline/serialized-job-data"

# URL endpoint for the PostJobListing view
URL_ENDPOINT = "http://localhost:8000/querier/post-job-listing"

# Define the headers for the POST request
# Assuming you have a token for authentication
HEADERS = {
    "Authorization": "Token {PLACEHOLDER_TOKEN}",  # Replace with your actual token
    "Content-Type": "application/json"
}

# Iterate over all the files in the directory
for filename in os.listdir(DATA_DIR):
    # Check if the file starts with 'job_data_'
    if filename.startswith('job_data_'):
        file_path = os.path.join(DATA_DIR, filename)
        with open(file_path, 'r') as f:
            data = json.load(f)
            for job_listing in data:
                # Send a POST request with the job listing data
                response = requests.post(URL_ENDPOINT, headers=HEADERS, json=job_listing)
                print(response)
                if response.status_code != 201:
                    print(f"Failed to post job listing from file: {filename}, job title: {job_listing['job_title']}")

print("Done processing job listings!")
