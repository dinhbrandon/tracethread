from django.shortcuts import render
from .serializers import FeedbackSerializer
from .models import Feedback
from rest_framework import generics
from rest_framework.permissions import AllowAny
# Create class based view to create an instance of feedback


class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()
    permission_classes = [AllowAny, ]
