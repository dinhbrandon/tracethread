from .base import *  # noqa: F401, F403

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