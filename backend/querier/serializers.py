from rest_framework import serializers
from .models import JobListing, JobSaved

# Serializer for Job Listings


class JobListingSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobListing
        # The fields that will be returned in the response
        fields = [
            "id",
            "job_title",
            "company_name",
            "listing_details",
            "description",
            "location",
            "url",
            "interested_users",
            "date",
            "posted_by",
        ]

class JobSavedSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobSaved
        # The fields that will be returned in the response
        fields = [
            "user",
            "job_listing",
            "date_saved",
        ]