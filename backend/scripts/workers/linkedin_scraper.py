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
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import time
import json
import os

# if testing locally
from dotenv import load_dotenv
load_dotenv()

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
path_to_chromedriver = os.environ['CHROMEDRIVER_PATH']
service = Service(executable_path=path_to_chromedriver)
driver = webdriver.Chrome(service=service, options=options)


url = 'https://www.linkedin.com/jobs/search?keywords=Software%20Engineer&location=United%20States&geoId=103644278&f_TPR=r604800&position=1&pageNum=0'
driver.get(url)
time.sleep(3)

processed_links = set()
newly_processed = True
all_jobs_data = []

while newly_processed:
    newly_processed = False
    job_listings = driver.find_elements(By.CSS_SELECTOR, "a.base-card__full-link")

    for job_listing in job_listings:
        job_link = job_listing.get_attribute('href')

        if job_link not in processed_links:
            job_listing.click()
            time.sleep(2)

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

            # Extract company website URL
            try:
                apply_button = driver.find_element(By.CSS_SELECTOR, "button[data-tracking-control-name='public_jobs_apply-link-offsite_sign-up-modal']")
                apply_button.click()
                time.sleep(2)

                # Click the exit button to open the company website in a new tab.
                exit_button = driver.find_element(By.CSS_SELECTOR, "button[data-tracking-control-name='public_jobs_apply-link-offsite_sign-up-modal_modal_dismiss']")
                exit_button.click()
                time.sleep(2)

                # Switch to the new tab.
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(3)

                # Assigning the company website URL to the job_data dictionary.
                job_data['url'] = driver.current_url
                print(job_data)

                # Close the new tab.
                driver.close()

                # Switch back to the main page.
                driver.switch_to.window(driver.window_handles[0])

            except Exception as e:
                print(f"Error while processing job listing {job_link}: {e}")

            all_jobs_data.append(job_data)
            processed_links.add(job_link)
            newly_processed = True
    
    driver.execute_script("window.scrollBy(0, 400);")
    time.sleep(2)
#         break

driver.quit()







