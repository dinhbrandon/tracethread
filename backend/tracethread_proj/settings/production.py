from .base import *  # noqa: F401, F403
import os
import environ
from pathlib import Path
env = environ.Env()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env_file_path = os.path.join(BASE_DIR, ".env.production")

environ.Env.read_env(env_file_path)

DATABASE_HOST = env("DATABASE_HOST")
DB_NAME = env("POSTGRES_DATABASES")
DB_USER = env("POSTGRES_USER")
DB_PASSWORD = env("POSTGRES_PASSWORD")

DEBUG = False

ALLOWED_HOSTS = [
    "www.tracethread.com",
    "api.tracethread.com",
    "tracethread.com",
]

CSRF_TRUSTED_ORIGINS = [
    "https://tracethread.com",
    "https://api.tracethread.com"
]

CORS_ALLOWED_ORIGINS = [
    "https://tracethread.com",
    "https://api.tracethread.com"
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "tracethread",
        "USER": "tracethread",
        "PASSWORD": "tracethread",
        "HOST": DATABASE_HOST,
        "PORT": "5432",
    }
}