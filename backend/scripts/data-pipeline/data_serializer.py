"""
Data Serializer
-------------------------

This module is responsible for converting processed data into specific formats suitable for storage, transmission, or further processing.

Responsibilities:
- Serialization: Convert complex data structures into storage/transmission-friendly formats (e.g., JSON, XML).
- Encoding: Convert data into specific encodings for compatibility or compactness (e.g., Base64, compression).
- Decoding/Deserialization: Convert serialized or encoded data back into native data structures when needed.

This component acts as an intermediary step between stream processing and data storage or transmission.
"""

import json
import os
from datetime import datetime
from unicode_replacements import unicode_replacements


# Function to clean the job description by removing site-specific text and replacing newlines with <br>


def clean_description(description):
    # Remove 'Show more' and 'Show less'
    description = description.replace('Show more', '').replace('Show less', '')

    # Replace newlines with <br> for HTML rendering
    # description = description.replace('\n', '<br>')
    # description = description.replace('\u2019', "'")
    # description = description.replace('\u2013', '-')
    # description = description.replace('\u2026', '...')


    # Replace unicode escape characters with their actual characters
    # for key, value in unicode_replacements.items():
    #     description = description.replace(key, value)

    return description.strip()


def clean_and_transform_data(raw_data_dict):
    """
    Clean and transform the raw scraped data.
    This function can be expanded based on specific cleaning and transformation needs.
    """

    for key in raw_data_dict:
        # Convert datetime object to 'MM/DD/YYYY 00:00AM/PM' format
        if isinstance(raw_data_dict['date'], datetime):
            raw_data_dict['date'] = raw_data_dict['date'].strftime('%m/%d/%Y %I:%M%p')

        if raw_data_dict['description'] is not None:
            raw_data_dict['description'] = clean_description(raw_data_dict['description'])

        # Ensure that all keys have values (even if None) to maintain a consistent JSON structure
        for key in ['job_title', 'company_name', 'listing_details', 'description', 'location', 'date', 'url']:
            if key not in raw_data_dict:
                raw_data_dict[key] = None
    return raw_data_dict


def save_processed_data(processed_data):
    """
    Save the processed data back to a JSON file.
    """
    # Determine the directory of the current script
    script_dir = os.path.dirname(os.path.realpath(__file__))
    
    # Generate the filename using the current datetime
    current_datetime = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"job_data_{current_datetime}.json"
    
    # Set the filepath to the 'serialized-job-data' directory using an absolute path
    filepath = os.path.join(script_dir, 'serialized-job-data', filename)

    # Ensure the directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    try:
        print(f"Saving data to {filepath}...")
        with open(filepath, "w") as file:
            json.dump(processed_data, file, indent=4)
        print(f"Data saved successfully to {filepath}!")
    except Exception as e:
        print(f"Error encountered while saving data: {e}")

