from django.urls import path
from .views import FeedbackCreateView

urlpatterns = [
    path('submit-feedback/', FeedbackCreateView.as_view()),

]
