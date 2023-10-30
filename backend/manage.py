#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv


def main():
    """Run administrative tasks."""
    # Check the DJANGO_ENV environment variable to determine which settings file to use
    DJANGO_ENV = os.environ.get('DJANGO_ENV', 'production')  # default to local if not set

    if DJANGO_ENV == 'production':
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tracethread_proj.settings.production")
        dotenv_path = Path(__file__).resolve().parent.parent.parent / '.env.production'
        load_dotenv(dotenv_path=dotenv_path)
        print("This is the production environment")
    else:
        dotenv_path = Path(__file__).resolve().parent.parent.parent.parent / '.env'
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tracethread_proj.settings.local")
        print("This is the local environment")

    load_dotenv(dotenv_path=dotenv_path)

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
