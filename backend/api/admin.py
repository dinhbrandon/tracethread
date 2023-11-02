from django.contrib import admin
from django.utils.html import format_html
from .models import Feedback, ScriptExecution
from django.urls import path
from django.http import HttpResponse
from decouple import Config, RepositoryEnv
import os
import subprocess
from rest_framework.authtoken.models import Token


def get_env_file_path():
    django_env = os.environ.get('DJANGO_ENV')
    if django_env == 'production':
        return '.env.production'
    else:  # default to local
        return '.env.development'


def get_api_base_url():

    env_file_path = get_env_file_path()
    config = Config(RepositoryEnv(env_file_path))
    return config('API_BASE_URL')


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('url', 'feedback', 'display_screenshot', 'date', 'screenshot')
    list_per_page = 25

    def display_screenshot(self, obj):
        if obj.screenshot:
            return format_html('<a href="{}" target="_blank"><img src="{}" width="100" height="100" /></a>', obj.screenshot.url, obj.screenshot.url)
        return "No Screenshot"
    display_screenshot.short_description = 'Screenshot Preview'


@admin.register(ScriptExecution)
class ScriptExecutionAdmin(admin.ModelAdmin):
    change_list_template = 'admin/script_execution.html'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('run_script/', self.run_script),
        ]
        return custom_urls + urls

    def run_script(self, request):
        script_path = "/app/scripts/data-pipeline/populate_database.py"
        
        # Get the user's token. Assuming you're using django-rest-framework's Token model
        user_token, created = Token.objects.get_or_create(user=request.user)

        env = os.environ.copy()
        env["USER_TOKEN"] = user_token.key
        env["API_BASE_URL"] = get_api_base_url()

        subprocess.run(['python3', script_path], env=env)
        
        self.message_user(request, "Script Executed Successfully")
        return HttpResponse("Script Executed Successfully")




