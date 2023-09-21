from django.urls import path
from .views import ColumnList, ColumnDetail, CardList, CardDetail

urlpatterns = [
    path('columns/', ColumnList.as_view(), name='column_list'),
    path('columns/<int:pk>/', ColumnDetail.as_view(), name='column_detail'),
    path('cards/', CardList.as_view(), name='card-list'),
    path('cards/<int:pk>/', CardDetail.as_view(), name='card_detail'),
]