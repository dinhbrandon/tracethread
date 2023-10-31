from .base import *  # noqa: F401, F403

import environ
from pathlib import Path
import os
env = environ.Env()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env_file_path = os.path.join(BASE_DIR, ".env.devleopment")

environ.Env.read_env(env_file_path)

DEBUG = True

SECRET_KEY = env("SECRET_KEY")
DATABASE_HOST = env("DATABASE_HOST")
DB_NAME = env("POSTGRES_DATABASES")
DB_USER = env("POSTGRES_USER")
DB_PASSWORD = env("POSTGRES_PASSWORD")

ALLOWED_HOSTS = [
    "localhost",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_ALL_ORIGINS = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": DB_NAME,
        "USER": DB_USER,
        "PASSWORD": DB_PASSWORD,
        "HOST": DATABASE_HOST,  # Using service name of Docker Postgres container
        "PORT": "5432",
    }
}
