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

Note: Web scraping may involve legal and ethical considerations. Ensure you have permission and are in compliance with LinkedIn's terms of service and any applicable laws.
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

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
path_to_chromedriver = os.environ['CHROMEDRIVER_PATH']
service = Service(executable_path=path_to_chromedriver)
driver = webdriver.Chrome(service=service, options=options)

time.sleep(10)

page_num = 1
url = 'https://www.linkedin.com/jobs/search?keywords=Software%20Engineer&location=United%20States&geoId=103644278&f_TPR=r604800&position=1&pageNum=0'
driver.get(url)
time.sleep(2)

while True:

    data = []
    scrollable_element = driver.find_element(By.CLASS_NAME, 'jobs-search-results-list')
    last_height = driver.execute_script('return arguments[0].scrollHeight', scrollable_element)

    while True:
        driver.execute_script('arguments[0].scrollBy(0, 400);', scrollable_element)
        time.sleep(0.15) 
        new_height = driver.execute_script('return arguments[0].scrollHeight', scrollable_element)
        if new_height == last_height:
            break
        last_height = new_height

    time.sleep(0.2)

    soup = BeautifulSoup(driver.page_source, 'html.parser')

    job_postings = soup.find_all('li', {'class': 'jobs-search-results__list-item'})
 
    for job_posting in job_postings:
        # Extract job details here

        job_link = job_posting.find('a', class_='job-card-list__title')
        if job_link:
            job_link_element = driver.find_element(By.CSS_SELECTOR, f'a[href="{job_link["href"]}"]')
            driver.execute_script("arguments[0].click();", job_link_element)
            time.sleep(0.20)
            
            driver.switch_to.window(driver.window_handles[-1])

            time.sleep(0.20)

            soup = BeautifulSoup(driver.page_source, 'html.parser')
            job_description_element = soup.find('div', id='job-details')

            try:
                high_level_details = soup.find('li', class_='jobs-unified-top-card__job-insight').get_text().strip()
                job_description_span = job_description_element.find('span')
                job_description = ""
                for tag in job_description_span.find_all(['p', 'li']):
                    job_description += tag.get_text(strip=True) + " "
            except AttributeError:
                job_description = None

        try:
            job_title = job_posting.find('a', class_='job-card-list__title').get_text().strip()
        except AttributeError:
            job_title = None

        try:
            company_name = job_posting.find('span', class_='job-card-container__primary-description').get_text().strip()
        except AttributeError:
            company_name = None

        try:
            job_insight = job_posting.find('div', class_='job-card-container__job-insight-text').get_text().strip()
        except AttributeError:
            job_insight = None

        try:
            location = job_posting.find('li', class_='job-card-container__metadata-item').get_text().strip()
        except AttributeError:
            location = None

        company_url_element = job_posting.find('a', class_='job-card-container__link')
        company_url = company_url_element['href'] if company_url_element else None

        data.append({
            'Job Title': job_title,
            'Company Name': company_name,
            'High Level Details': high_level_details,
            'Job Description': job_description,
            'Location': location,
            'Job Insight': job_insight,
            'Company URL': f"https://www.linkedin.com{company_url}"
        })

    # Save the data to a JSON file
    with open(f'linkedin_jobs_{page_num}.json', 'w') as file:
        json.dump(data, file, indent=4)

    try:
        # Find the button for the next page
        next_page_button = driver.find_element(By.CSS_SELECTOR, f'button[aria-label="Page {page_num + 1}"]')
        driver.execute_script("arguments[0].click();", next_page_button)
        time.sleep(2)
        page_num += 1
    except Exception as e:
        print("Failed to click next page button: ", e)
        break


driver.quit()
