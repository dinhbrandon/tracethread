from django.urls import path
from .views import ColumnList, ColumnDetail, CardList, CardDetail, ChangeCardColumnView

urlpatterns = [
    path('columns', ColumnList.as_view(), name='column-list'),
    path('columns/<int:pk>', ColumnDetail.as_view(), name='column-detail'),
    path('cards', CardList.as_view(), name='card-list'),
    path('cards/<int:pk>', CardDetail.as_view(), name='card-detail'),
    path('cards/<int:pk>/change-column', ChangeCardColumnView.as_view(), name='change-card-column'),
]