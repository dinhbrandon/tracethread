"""
ASGI config for tracethread_proj project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

DJANGO_ENV = os.environ.get('DJANGO_ENV')
if DJANGO_ENV == 'production':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tracethread_proj.settings.production")
elif DJANGO_ENV == 'local':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tracethread_proj.settings.local")
else:
    raise ValueError("DJANGO_ENV environment variable must be set to either 'production' or 'local'")


application = get_asgi_application()
