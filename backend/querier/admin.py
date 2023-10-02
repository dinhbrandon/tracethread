from django.contrib import admin
from .models import JobListing, JobSaved


# Register your models here.


@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_title', 'company_name', 'listing_details', 'description', 'location', 'url', 'date')
    list_display_links = ('id', 'job_title')
    search_fields = ('job_title', 'company_name', 'listing_details', 'description', 'location', 'url', 'date')
    list_per_page = 25


@admin.register(JobSaved)
class JobSavedAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_listing', 'date_saved')
    # list_display_links = ('id', 'job_title')
    list_per_page = 25