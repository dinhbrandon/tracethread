from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import ColumnSerializer, CardSerializer
from .models import Column, Card

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
        serializer.save(column__owner=self.request.user)

class CardDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]