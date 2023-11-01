from django.contrib import admin
from django.utils.html import format_html
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('url', 'feedback', 'display_screenshot', 'date', 'screenshot')
    list_per_page = 25

    def display_screenshot(self, obj):
        if obj.screenshot:
            return format_html('<a href="{}" target="_blank"><img src="{}" width="100" height="100" /></a>', obj.screenshot.url, obj.screenshot.url)
        return "No Screenshot"
    display_screenshot.short_description = 'Screenshot Preview'
