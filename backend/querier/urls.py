from django.urls import path
from .views import (
    PostJobListing,
    JobListingList,
    JobListingDetail,
    DeleteJobListing,
    EditJobListing,
    # SearchJobListing
)

urlpatterns = [
    path("post-job-listing", PostJobListing.as_view()),
    path("job-listings", JobListingList.as_view()),
    path("job-listing/<int:pk>", JobListingDetail.as_view()),
    path("edit-job-listing/<int:pk>", EditJobListing.as_view()),
    path("delete-job-listing/<int:pk>", DeleteJobListing.as_view()),
    # path("search-job-listing/", SearchJobListing.as_view()),
]