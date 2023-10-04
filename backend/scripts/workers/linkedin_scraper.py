"""
LinkedIn Scraper
----------------

This module (or collection of modules) is dedicated to scraping job-related data from LinkedIn.

Responsibilities:
- Web Navigation: Use tools like Selenium to automate the browsing process, especially if the data requires interacting with the page or navigating through multiple pages.
- Data Extraction: Use libraries like Beautiful Soup to parse the HTML content and extract relevant data.
- Data Pre-processing: Clean and preprocess the scraped data to ensure it's in a usable format.
- Error Handling: Manage potential errors that may arise during the scraping process, such as changes in the website structure or connection issues.
- Rate Limiting: Implement pauses or delays to respect LinkedIn's `robots.txt` file and avoid being IP-banned.
- Monitoring and Logging: Keep track of the data scraping process, monitor success rates, and log significant events or errors.

"""


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.service import Service
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import time
import json
import os
import sys
import random
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'data-pipeline'))
from data_serializer import clean_and_transform_data, save_processed_data 


# if testing locally
from dotenv import load_dotenv
load_dotenv()


def setup_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    path_to_chromedriver = os.environ['CHROMEDRIVER_PATH']
    service = Service(executable_path=path_to_chromedriver)
    driver = webdriver.Chrome(service=service, options=options)
    return driver


def navigate_to_url(driver):
    BASE_URL = 'https://www.linkedin.com/jobs/search?keywords={job_role}&location=United%20States&geoId=103644278&f_TPR=r604800&position=1&pageNum=0'
    JOB_ROLE = 'Software Engineer'
    driver.get(BASE_URL.format(job_role=JOB_ROLE))
    time.sleep(3)


def random_sleep(min_time=1, max_time=3):
    """Sleeps for a random time between min_time and max_time seconds."""
    time.sleep(random.uniform(min_time, max_time))


def calculate_posted_date(date_posted):
    parts = date_posted.split()
    number = int(parts[0])
    unit = parts[1]

    current_date = datetime.now()

    if 'day' in unit:
        return current_date - timedelta(days=number)
    elif 'hour' in unit:
        return current_date - timedelta(hours=number)
    else:
        return current_date


def extract_job_data(driver, processed_links):
    job_listings = driver.find_elements(By.CSS_SELECTOR, "a.base-card__full-link")

    for job_listing in job_listings:
        job_link = job_listing.get_attribute('href')

        if job_link not in processed_links:

            random_sleep()
            job_listing.click()

            WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "h2.top-card-layout__title"))
            )

            soup = BeautifulSoup(driver.page_source, 'html.parser')

            job_data = {}
                
            # Extracting job title
            title_element = soup.find('h2', {'class': 'top-card-layout__title'})
            job_data['job_title'] = title_element.text.strip() if title_element else None
            
            # Extracting company name
            company_name_element = soup.find('a', {'class': 'topcard__org-name-link'})
            job_data['company_name'] = company_name_element.text.strip() if company_name_element else None

            # Extracting listing details
            ul_element = soup.find('ul', {'class': 'description__job-criteria-list'})
            listing_details = []
            for li in ul_element.find_all('li', {'class': 'description__job-criteria-item'}):
                subheader = li.find('h3', {'class': 'description__job-criteria-subheader'}).text.strip()
                detail = li.find('span', {'class': 'description__job-criteria-text'}).text.strip()
                listing_details.append(f"{subheader}: {detail}")
            job_data['listing_details'] = ', '.join(listing_details)
            
            # Extracting description
            description_element = soup.find('div', {'class': 'description__text'})
            job_data['description'] = description_element.text.strip() if description_element else None

            # Extracting location
            location_element = soup.find('span', {'class': 'topcard__flavor topcard__flavor--bullet'})
            job_data['location'] = location_element.text.strip() if location_element else None

            # Extracting date posted
            posted_date_element = soup.find('span', {'class': 'posted-time-ago__text topcard__flavor--metadata'})
            if posted_date_element:
                post_date_str = posted_date_element.text.strip()
                job_data['date'] = calculate_posted_date(post_date_str)
            else:
                job_data['date'] = datetime.now()

            # Fall back to the URL if the company URL is not found
            linkedin_url = job_listing.get_attribute('href')
            job_data['url'] = linkedin_url

            # Extract company website URL
            try:
                apply_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "button[data-tracking-control-name='public_jobs_apply-link-offsite_sign-up-modal']"))
                )
                random_sleep()
                apply_button.click()

                # Click the exit button to open the company website in a new tab.
                exit_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "button[data-tracking-control-name='public_jobs_apply-link-offsite_sign-up-modal_modal_dismiss']"))
                )
                random_sleep()
                exit_button.click()

                # Switch to the new tab.
                WebDriverWait(driver, 10).until(EC.number_of_windows_to_be(2))  # Ensure the new tab has opened
                driver.switch_to.window(driver.window_handles[-1])

                # Wait until the URL changes from LinkedIn to the company's website
                def url_changes_from_linkedin(driver):
                    return "linkedin.com" not in driver.current_url

                WebDriverWait(driver, 10).until(url_changes_from_linkedin)

                # Assigning the company website URL to the job_data dictionary.
                job_data['url'] = driver.current_url

                # Close the new tab.
                driver.close()

                # Switch back to the main page.
                driver.switch_to.window(driver.window_handles[0])

            except Exception as e:
                print(f"Error while processing job listing {job_link}: {e}")

            yield job_data
            processed_links.add(job_link)

    return processed_links


def scroll_page(driver):
    random_sleep()
    driver.execute_script("window.scrollBy(0, 400);")


def main():

    driver = setup_driver()
    navigate_to_url(driver)
    processed_links = set()

    try:
        batches = 1
        job_batch = []
        for job_data in extract_job_data(driver, processed_links):
            processed_data = clean_and_transform_data(job_data)
            job_batch.append(processed_data)
            print(f"Processing {len(job_batch)} of 10 in batch {batches}...")

            if len(job_batch) >= 10:
                save_processed_data(job_batch)
                batches += 1
                job_batch = []
            
            random_sleep()
            scroll_page(driver)

        if job_batch:
            save_processed_data(job_batch)

    except Exception as e:
        print(f"Error encountered: {e}")

    driver.quit()


if __name__ == "__main__":
    main()
