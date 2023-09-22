from django.shortcuts import render
from functools import reduce
from operator import or_, and_
from .serializers import JobListingSerializer
from rest_framework import generics, authentication, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import PermissionDenied
from django.core.exceptions import ValidationError
from .models import JobListing
from django.db.models import Q
import json

# Create your views here.
# This view creates a new job listing (user access creation)


class PostJobListing(generics.CreateAPIView):
    serializer_class = JobListingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

# This view gets list of all job listings


class JobListingList(generics.ListAPIView):
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

# This view gets details of a single job listing


class JobListingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

# This view edits a job listing (user access editing)


class EditJobListing(generics.UpdateAPIView):
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def perform_update(self, serializer):
        if serializer.instance.posted_by == self.request.user:
            serializer.save(posted_by=self.request.user)
        else:
            raise PermissionDenied("You cannot edit this job listing.")

# This view deletes a job listing (user access deletion)


class DeleteJobListing(generics.DestroyAPIView):
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def perform_destroy(self, instance):
        if instance.posted_by == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied("You cannot delete this job listing.")


# class SearchJobListing(generics.ListAPIView):
#     queryset = JobListing.objects.all()
#     serializer_class = JobListingSerializer
#     authentication_classes = (TokenAuthentication,)
#     permission_classes = (AllowAny,)

#     def get_queryset(self):


#     def get_queryset(self):
#         queryset = JobListing.objects.all()
#         query_params = self.request.query_params
# # This view gets list of all job listings
# # by filtering the queryset based on the query parameters
#         fields_to_query = [
#             'job_title',
#             'company_name',
#             'listing_details',
#             'description',
#             'location',
#             'url',
#         ]
# # This loop checks if the query parameters contain any of the fields
# # and filters the queryset accordingly
#         for field in fields_to_query:
#             contains_value = query_params.get(f'{field}_contains', None)
#             not_contains_value = query_params.get(f'{field}_not_contains', None)
#             contains_any_value = query_params.get(f'{field}_contains_any', None)

# # This condition checks if the query parameters contain any of the fields
#             if contains_value:
#                 kwargs = {f'{field}__icontains': contains_value}
#                 queryset = queryset.filter(**kwargs)

# # This condition checks if the query parameters does not contain any of the fields
#             if not_contains_value:
#                 kwargs = {f'{field}__icontains': not_contains_value}
#                 queryset = queryset.exclude(**kwargs)

# # This condition checks if the query parameters
# # contain a field with multiple values
# # separated by commas for an 'OR' query
# # For example, if the query parameters contain
# # job_title_contains_any=Software Engineer,Data Analyst
# # then the queryset will be filtered to return all job listings
# # that contain either Software Engineer or Data Analyst
#             if contains_any_value:
#                 values = contains_any_value.split(',')
#                 queries = [Q(**{f'{field}__icontains': value}) for value in values]
#                 queryset = queryset.filter(reduce(operator.or_, queries))

#         return queryset


# # An example of a query URL:

#     # http://localhost:8000/querier/search-job-listing/?job_title_contains=Software%20Engineer&company_name_contains=Google&location_contains=New%20York
#     # In this example, the query parameters are:
#     # job_title_contains = Software Engineer, written as Software%20Engineer
#     # company_name_contains = Google, written as Google
#     # location_contains = New York, written as New%20York
#     # The %20 is the URL encoding for a space character