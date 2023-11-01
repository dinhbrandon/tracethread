from django.shortcuts import render
from .serializers import FeedbackSerializer
from .models import Feedback
from rest_framework import generics
from django.http import HttpResponse
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.db import connections
from django.core.cache import cache
from rest_framework.response import Response
# Create class based view to create an instance of feedback


class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()
    permission_classes = [AllowAny, ]


class HealthCheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == '/health':
            return HttpResponse('ok')
        return self.get_response(request)