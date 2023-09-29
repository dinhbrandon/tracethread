from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ColumnSerializer, CardSerializer
from .models import Column, Card
from django.shortcuts import get_object_or_404
from querier.models import JobSaved


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
    serializer_class = CardSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # Get JobSaved instances for the logged-in user
            job_saved_ids = JobSaved.objects.filter(user=user).values_list('id', flat=True)
            # Filter cards based on the JobSaved instances
            return Card.objects.filter(job_saved__id__in=job_saved_ids)
        return Card.objects.none()  # Return an empty queryset if the user is not authenticated

    def perform_create(self, serializer):
        # Assuming the JobSaved ID is sent in the request data
        job_saved_id = self.request.data.get('job_saved')
        job_saved = get_object_or_404(JobSaved, id=job_saved_id)
        if self.request.user == job_saved.user:
            serializer.save(job_saved=job_saved)
        else:
            # Handle the case where the user is not authorized to create a card for this JobSaved instance
            raise PermissionDenied("You do not have permission to create a card for this job listing.")


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
        if new_column_id is None:
            return Response({'error': 'new_column_id is required'}, status=400)

        # Retrieve the new column based on the new_column_id
        new_column = get_object_or_404(Column, pk=new_column_id)

        # Update the card's column
        instance.column = new_column
        instance.save()

        # Serialize and return the updated card
        serializer = self.get_serializer(instance)
        return Response(serializer.data)