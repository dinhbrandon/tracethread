from django.urls import path
from .views import FeedbackCreateView, FeedbackListView, FeedbackUpvoteView, CommentsCreateView, CommentsListView, CommentsUpvoteView

urlpatterns = [
    path('submit-feedback/', FeedbackCreateView.as_view()),
    path('list-feedback/', FeedbackListView.as_view()),
    path('upvote-feedback/<int:pk>/', FeedbackUpvoteView.as_view()),
    path('submit-comments/<int:feedback>/', CommentsCreateView.as_view()),
    path('list-comments/<int:pk>/', CommentsListView.as_view()),
    path('upvote-comments/<int:pk>/', CommentsUpvoteView.as_view()),
]
