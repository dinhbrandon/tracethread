from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ColumnSerializer, CardSerializer
from .models import Column, Card
from django.shortcuts import get_object_or_404
from querier.models import JobSaved
from django.db import transaction

#Rename ColumnList to account for creating functionality

class ColumnList(generics.ListCreateAPIView):
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Column.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ColumnDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated]


#This is the view for the batch update of columns


class ColumnBatchUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        updated_columns = request.data
 
        with transaction.atomic():
            for index, column_data in enumerate(updated_columns):
                column = get_object_or_404(Column, id=column_data['id'])
                
                column.order = -1 - index
                column.save()

        with transaction.atomic():
            for column_data in updated_columns:
                column = get_object_or_404(Column, id=column_data['id'])
                column.order = column_data['order']
                column.save()

        return Response({"success": True, "message": "Order saved successfully"}, status=200)


#Rename CardList to account for creating functionality
class CardList(generics.ListCreateAPIView):
    serializer_class = CardSerializer

    def get_queryset(self):
        user = self.request.user
        column_id = self.request.query_params.get('column_id', None)
        if user.is_authenticated:
            # Get JobSaved instances for the logged-in user
            # job_saved_ids = JobSaved.objects.filter(user=user).values_list('id', flat=True)
            column_owner = Column.objects.filter(owner=user)
            # Filter cards based on the JobSaved instances
            queryset = Card.objects.filter(column__in=column_owner).order_by('column', 'order')
            # if column_id is not None:
            #     # Filter cards by column_id if provided
            #     queryset = queryset.filter(column__id=column_id)
            return queryset
        return Card.objects.none()  # Return an empty queryset if the user is not authenticated

    def perform_create(self, serializer):
        # Assuming the JobSaved ID is sent in the request data
        job_saved_id = self.request.data.get('job_saved')
        if job_saved_id is not None:
            job_saved = get_object_or_404(JobSaved, id=job_saved_id)
            if self.request.user == job_saved.user:
                serializer.save(job_saved=job_saved)
            else:
                # Handle the case where the user is not authorized to create a card for this JobSaved instance
                raise PermissionDenied("You do not have permission to create a card for this job listing.")
        else:
            serializer.save()


class CardDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        # Retrieve the card to be deleted
        instance = self.get_object()

        # Check if the card is owned by the authenticated user
        if instance.column.owner != self.request.user:
            raise PermissionDenied("You do not have permission to delete this card.")

        # Delete the card
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChangeCardColumnView(generics.UpdateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        # Retrieve the card to be updated
        
        instance = self.get_object()

        # Extract the new column_id from the request data
        new_column_id = request.data.get('new_column_id')
        new_order = request.data.get('order')
        timestamp = request.data.get('timestamp')
        
        if new_column_id is None:
            return Response({'error': 'new_column_id is required'}, status=400)

        # Retrieve the new column based on the new_column_id
        new_column = get_object_or_404(Column, pk=new_column_id)

        # Check if the new column is owned by the authenticated user
        if new_column.owner != self.request.user:
            raise PermissionDenied("You do not have permission to move a card to this column.")

        # Update the card's column and order
        instance.column = new_column
        if new_order is not None:
            instance.order = new_order
        if timestamp:
            instance.timestamp = timestamp

        instance.save()

        # Serialize and return the updated card
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    # delete Card function

