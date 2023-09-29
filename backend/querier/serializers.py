from rest_framework import serializers
from .models import JobListing, JobSaved

# Serializer for Job Listings


class JobListingSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobListing
        # The fields that will be returned in the response
        fields = "__all__"
        

class JobSavedSerializer(serializers.ModelSerializer):

    job_listing = JobListingSerializer()

    class Meta:
        model = JobSaved
        # The fields that will be returned in the response
        fields = "__all__"