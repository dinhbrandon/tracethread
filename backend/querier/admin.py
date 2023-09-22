from django.contrib import admin
from .models import JobListing


# Register your models here.


@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_title', 'company_name', 'listing_details', 'description', 'location', 'url', 'date')
    list_display_links = ('id', 'job_title')
    search_fields = ('job_title', 'company_name', 'listing_details', 'description', 'location', 'url', 'date')
    list_per_page = 25
