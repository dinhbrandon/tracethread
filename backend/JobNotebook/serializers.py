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
    class Meta:
        model = Card
        fields = '__all__'