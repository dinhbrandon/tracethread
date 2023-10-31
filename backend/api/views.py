from django.shortcuts import render
from .serializers import FeedbackSerializer
from .models import Feedback
from rest_framework import generics, status
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


class HealthCheckView(APIView):
    
    def get(self, request, format=None):
        # Check database connectivity
        db_ok = True
        for conn in connections.all():
            try:
                conn.cursor()
            except Exception:
                db_ok = False
                break

        # Check cache connectivity
        cache_ok = cache.set('health_check_key', 'value', timeout=30)

        if db_ok and cache_ok:
            data = {"status": "ok"}
            return Response(data, status=status.HTTP_200_OK)
        else:
            data = {"status": "error"}
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)