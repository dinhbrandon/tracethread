from rest_framework import serializers
from .models import Column, Card
from accounts.serializers import UserSerializer
from querier.serializers import JobListingSerializer


class ColumnSerializer(serializers.ModelSerializer):

    #nested serializer including the User instance associated with the Column instance
    owner = UserSerializer(read_only=True)

    #Specifies the Column model fields to be serialized
    class Meta:
        model = Column
        fields = [
            'id',
            'name',
            'owner',
            'order'
        ]

class CardSerializer(serializers.ModelSerializer):

    #These two are nested serializers associated with the Card instance
    column = ColumnSerializer(read_only=True)
    job_listing = JobListingSerializer(read_only=True)

    #Specifies the Card model fields to be serialized
    class Meta:
        model = Card
        fields = [
            'id',
            'notes',
            'column', 
            'job_listing',
            'job_title',
            'company_name',
            'location', 
            'listing_details',
            'description',
            'url',
            'date'
        ]
        
    def create(self, validated_data):
        # Extract the data you need from the validated_data dictionary
        notes = validated_data.get('notes', '')
        column = validated_data.get('column')
        job_listing = validated_data.get('job_listing')
        
        # Extract data for derived fields
        job_title = validated_data.get('job_title', '')
        company_name = validated_data.get('company_name', '')
        location = validated_data.get('location', '')
        listing_details = validated_data.get('listing_details', '')
        description = validated_data.get('description', '')
        url = validated_data.get('url', '')
        date = validated_data.get('date', None)

        # Create a new Card object
        card = Card.objects.create(
            notes=notes,
            column=column,
            job_listing=job_listing,
            job_title=job_title,
            company_name=company_name,
            location=location,
            listing_details=listing_details,
            description=description,
            url=url,
            date=date,
        )

        return card