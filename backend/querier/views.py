from django.shortcuts import render, get_object_or_404
from .models import JobListing, JobSaved
from .serializers import JobListingSerializer, JobSavedSerializer
from rest_framework import generics, authentication, permissions, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from django.core.exceptions import ValidationError
from django.db.models import Q
from functools import reduce
from operator import or_, and_
import json
import ast
import re
import urllib.parse

# This view creates of all saved jobs for a user
#Rename this
class JobSavedList(generics.CreateAPIView):
    serializer_class = JobSavedSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        job_listing_id = self.kwargs.get('pk')  # Get job listing ID from URL kwargs
        job_listing = get_object_or_404(JobListing, id=job_listing_id)
        serializer.save(user=self.request.user, job_listing=job_listing)

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

# Define JobListingViewSet class for handling CRUD operations of Job Listings.
# It inherits from ModelViewSet which provides the implementations
# for various CRUD operations.


class JobListingViewSet(viewsets.ModelViewSet):
    # Specifying the serializer class for this viewset
    serializer_class = JobListingSerializer

    # Overriding the get_queryset method to return all JobListing objects
    def get_queryset(self):
        return JobListing.objects.all()

# Define SearchJobListing class for searching job listings.
# It inherits from ListAPIView which provides the implementation
# for listing a queryset.

class SearchJobListing(generics.ListAPIView):
    # Specifying the serializer, authentication and permission classes
    serializer_class = JobListingSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    # Static method to combine query nodes into a single Q object.
    # The Q object will be used to filter queryset based on the query.
    @staticmethod
    def q_combine(node: ast.AST) -> Q:
        # Handle different types of AST nodes
        if isinstance(node, ast.Module):
            assert len(node.body) == 1 and isinstance(node.body[0], ast.Expr)
            return SearchJobListing.q_combine(node.body[0].value)

        if isinstance(node, ast.BoolOp):
            # Handle AND boolean operation
            if isinstance(node.op, ast.And):
                q = Q()
                for val in node.values:
                    q &= SearchJobListing.q_combine(val)
                return q
            # Handle OR boolean operation
            if isinstance(node.op, ast.Or):
                q = ~Q()
                for val in node.values:
                    q |= SearchJobListing.q_combine(val)
                return q

        if isinstance(node, ast.BinOp):
            # Handle bitwise OR
            if isinstance(node.op, ast.BitOr):
                return SearchJobListing.q_combine(node.left) | SearchJobListing.q_combine(node.right)
            # Handle bitwise AND
            elif isinstance(node.op, ast.BitAnd):
                return SearchJobListing.q_combine(node.left) & SearchJobListing.q_combine(node.right)
            else:
                raise ValueError(f'unsupported operator {type(node.op).__name__}')

        if isinstance(node, ast.UnaryOp):
            # Handle NOT unary operation
            assert isinstance(node.op, ast.Not)
            return ~SearchJobListing.q_combine(node.operand)

        if isinstance(node, ast.Compare):
            # Compile comparison into Q object
            assert isinstance(node.left, ast.Name)
            assert len(node.ops) == 1 and isinstance(node.ops[0], ast.Eq)
            assert len(node.comparators) == 1 and isinstance(node.comparators[0], ast.Constant)
            search_value = str(node.comparators[0].value)
            
            # Check if search_value is empty or just whitespace
            if not search_value.strip():
                raise ParseError("Search value is empty or whitespace only.")

            # Handle exact match
            if search_value.startswith('"') and search_value.endswith('"'):
                exact_value = search_value[1:-1]
                return Q(**{node.left.id + '__icontains': exact_value})

            # Split the search value into words
            words = search_value.split()
            
            # Ensure there's at least one word to search for
            if not words:
                raise ParseError("No valid search terms found in the query.")

            # Build a list of Q objects for each word
            q_objects = [Q(**{node.left.id + '__icontains': word}) for word in words]

            # Start with the first Q object
            combined_q = q_objects[0]

            # Combine all other Q objects using AND
            for q in q_objects[1:]:
                combined_q &= q

            return combined_q


        # Raise error for unexpected AST node type
        raise ValueError('unexpected node {}'.format(type(node).__name__))

    # Static method to compile the query expression into Q object.
    @staticmethod
    def compile_q(expression: str) -> Q:
        # Standardize the expression and parse into AST
        std_expr = (expression.replace("=", "==")
                    .replace("~", " not ")
                    .replace("&", " and ")
                    .replace("|", " or ").lstrip())
        try:
            return SearchJobListing.q_combine(ast.parse(std_expr))
        except SyntaxError as e:
            raise ParseError(f"Invalid query parameter: {e.text} at offset {e.offset}")

    # Overriding get_queryset to filter based on query parameter 'q'
    def get_queryset(self):
        queryset = JobListing.objects.all()
        # Fetch 'q' query parameter from the request
        query_param = self.request.query_params.get('q', None)
        if query_param:
            try:
                # Compile 'q' into Q object and filter the queryset
                q_object = self.compile_q(query_param)
                queryset = queryset.filter(q_object)
            except Exception as e:
                raise ParseError("Invalid query parameter: {}".format(e))
        return queryset
    
