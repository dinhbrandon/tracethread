# Trace Thread

Trace Thread draws its name from the legendary tale where a thread helped navigate a complex maze, symbolizing the often convoluted journey junior tech professionals embark on during their job search.

## Core Objective

To provide a comprehensive platform for tech job seekers, particularly those at the early stage of their careers. It provides an advanced querying system for a nuanced job database search, robust data visualization to assist in matching roles to skillsets, and a machine learning mechanism to align job listings with applicants' resumes.

## Technologies Used

- **Backend**: Python 3, Django
- **Database**: PostgreSQL
- **Frontend**: TypeScript, React
- **Data Visualization**: Matplotlib, Seaborn
- **Machine Learning**: scikit-learn

## Features

- Advanced job search functionality powered by Python and Django.
- Comprehensive data visualization using Matplotlib and Seaborn to help applicants evaluate the roles aligning with their skills.
- Machine learning component employing scikit-learn tools to match job listings with applicant resumes.

## Setup and Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dinhbrandon/tracethread.git
   ```
2.**Setup Environmental Variables**
  - Fill in the necessary environment variables in the .env file such as NODE_ENV, POSTGRES_USER, POSTGRES_DATABASES, POSTGRES_PASSWORD, and     DATABASE_URL.
    
3. **Build and Run with Docker Compose
   - Ensure Docker is installed on your machine
   - CD into the project's directory where the docker-compose file is located
   - Build your docker containers by running the following:
   ```bash
   docker-compose build
   ```
5. **Setting up the virtual environment and installing dependencies**
   - This should all be automated in the Docker compose file when you build the container for the first time.
   - The file will install the requirements.txt and build containers for each of the services.
   - 
7. **Running the development server***
   - Starting the development server will expose the URLs for the front-end and back-end services
   - You can also find these ports in the docker-compose file in the project directory
   ```bash
   docker-compose up
   ```

