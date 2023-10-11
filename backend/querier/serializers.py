from rest_framework import serializers
from .models import JobListing, JobSaved, SavedSearchParameters
from django.contrib.auth.models import User

# Serializer for Job Listings


class JobListingSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobListing
        # The fields that will be returned in the response
        fields = "__all__"
        

class JobSavedSerializer(serializers.ModelSerializer):
    # This is a nested serializer that will return the job listing details
    # It is read only because we don't want to be able to edit the job listing details from this serializer
    job_listing = JobListingSerializer(read_only=True)

    class Meta:
        model = JobSaved
        fields = "__all__"
        # These are extra keyword arguments that can be passed to the serializer
        # Here we are saying that the job listing and user fields are not required
        extra_kwargs = {
            'job_listing': {'required': False, 'write_only': True},
            'user': {'required': False, 'write_only': True},
        }


class SavedSearchParametersSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = SavedSearchParameters
        fields = "__all__"
