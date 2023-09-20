from django.urls import path
from . import views

urlpatterns = [
    patj("", views.index)
]