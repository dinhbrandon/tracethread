from django.urls import path
from .views import FeedbackCreateView, HealthCheckView
from django.views.generic import TemplateView

urlpatterns = [
    path('submit-feedback/', FeedbackCreateView.as_view()),
    path('health_check/', HealthCheckView.as_view(), name='health_check'),
    path('health_check.html', TemplateView.as_view(template_name="health_check.html"), name='health_check_html'),
]
