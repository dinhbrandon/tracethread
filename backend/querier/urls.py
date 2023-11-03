from django.urls import path
from .views import (
    PostJobListing,
    JobListingList,
    JobListingDetail,
    DeleteJobListing,
    EditJobListing,
    SearchJobListing,
    JobSavedList,
    DeleteJobSaved,
    SavedSearchParametersListCreate,
    SavedSearchParametersDetail,
    BatchJobListing
)

urlpatterns = [
    path("post-job-listing", PostJobListing.as_view()),
    path("job-listings", JobListingList.as_view()),
    path("job-listing/<int:pk>", JobListingDetail.as_view()),
    path("edit-job-listing/<int:pk>", EditJobListing.as_view()),
    path("delete-job-listing/<int:pk>", DeleteJobListing.as_view()),
    path("search-job-listing/", SearchJobListing.as_view()),
    path("jobsaved/<int:pk>", JobSavedList.as_view()),
    path("delete-jobsaved/<int:pk>", DeleteJobSaved.as_view()),
    path("saved-search-parameters", SavedSearchParametersListCreate.as_view()),
    path("saved-search-parameters/<int:pk>", SavedSearchParametersDetail.as_view()),
    path("batch-post-job-listings", BatchJobListing.as_view()),
]