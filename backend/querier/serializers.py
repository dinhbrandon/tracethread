from rest_framework import serializers
from .models import JobListing

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
            "date",
            "posted_by",
        ]
