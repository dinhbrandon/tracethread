from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ColumnSerializer, CardSerializer
from .models import Column, Card
from django.shortcuts import get_object_or_404
from querier.models import JobListing


class ColumnList(generics.ListCreateAPIView):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ColumnDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated]


class CardList(generics.ListCreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Extract the derived fields from the request data if available
        job_title = self.request.data.get('job_title')
        company_name = self.request.data.get('company_name')
        location = self.request.data.get('location')
        listing_details = self.request.data.get('listing_details')
        description = self.request.data.get('description')
        url = self.request.data.get('url')
        date = self.request.data.get('date')
        #retrieves the column object based on ID to specify the card to a specific column
        column_id = self.request.data.get('column')
        # retrieves corresponding 'JobListing' object based on ID to specify the card to a specific job listing
        job_listing_id = self.request.data.get('job_listing')


        #Making sure the related objects exist
        column = Column.objects.get(pk=column_id)
        job_listing = get_object_or_404(JobListing, pk=job_listing_id)

        # Create the Card instance, passing the derived fields if available
        serializer.save(
            column=column,
            job_listing=job_listing,
            column__owner=self.request.user,
            job_title=job_title,
            company_name=company_name,
            location=location,
            listing_details=listing_details,
            description=description,
            url=url,
            date=date
        )


class CardDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]


class ChangeCardColumnView(generics.UpdateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        # Retrieve the card to be updated
        instance = self.get_object()

        # Extract the new column_id from the request data
        new_column_id = request.data.get('new_column_id')

        # Retrieve the new column based on the new_column_id
        new_column = get_object_or_404(Column, pk=new_column_id)

        # Update the card's column
        instance.column = new_column
        instance.save()

        # Serialize and return the updated card
        serializer = self.get_serializer(instance)
        return Response(serializer.data)