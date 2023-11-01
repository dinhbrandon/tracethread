from .base import *  # noqa: F401, F403
import os
import environ
from pathlib import Path
from utils.aws_secrets import get_secret
env = environ.Env()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env_file_path = os.path.join(BASE_DIR, ".env")

environ.Env.read_env(env_file_path)

SECRET_KEY = get_secret()
DATABASE_HOST = env("DATABASE_HOST")
DB_NAME = env("POSTGRES_DATABASES")
DB_USER = env("POSTGRES_USER")
DB_PASSWORD = env("POSTGRES_PASSWORD")

DEBUG = False

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'assets'),  # or 'project_static' or whatever you renamed it to
]
STATIC_ROOT = os.path.join(BASE_DIR, 'static')


ALLOWED_HOSTS = [
    "www.tracethread.com",
    "api.tracethread.com",
    "tracethread.com",
]

CSRF_TRUSTED_ORIGINS = [
    "https://tracethread.com",
    "https://api.tracethread.com",
    "https://www.tracethread.com",
]

CORS_ALLOWED_ORIGINS = [
    "https://tracethread.com",
    "https://api.tracethread.com",
    "https://www.tracethread.com",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": DB_NAME,
        "USER": DB_USER,
        "PASSWORD": DB_PASSWORD,
        "HOST": DATABASE_HOST,
        "PORT": "5432",
    }
}