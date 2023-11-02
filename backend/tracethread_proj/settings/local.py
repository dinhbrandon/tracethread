from .base import *  # noqa: F401, F403

env_file_path = os.path.join(BASE_DIR, ".env.devleopment")

environ.Env.read_env(env_file_path)

DEBUG = True

SECRET_KEY = env("SECRET_KEY")
DATABASE_HOST = env("DATABASE_HOST")
DB_NAME = env("POSTGRES_DATABASES")
DB_USER = env("POSTGRES_USER")
DB_PASSWORD = env("POSTGRES_PASSWORD")



#AWS S3 Bucket Config
AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
AWS_S3_REGION_NAME = env("AWS_S3_REGION_NAME")
# AWS_DEFAULT_ACL = 'public-read'
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'


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
