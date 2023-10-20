from django.urls import path
from .views import ColumnList, ColumnDetail, CardList, CardDetail, ChangeCardColumnView, ColumnBatchUpdate
urlpatterns = [
    path('columns', ColumnList.as_view(), name='column-list'),
    path('columns/<int:pk>', ColumnDetail.as_view(), name='column-detail'),
    path('cards', CardList.as_view(), name='card-list'),
    path('cards/<int:pk>', CardDetail.as_view(), name='card-detail'),
    path('delete-card/<int:pk>', CardDetail.as_view(), name='card-delete'),
    path('cards/<int:pk>/change-column', ChangeCardColumnView.as_view(), name='change-card-column'),
    path('columns/batch_update', ColumnBatchUpdate.as_view(), name='column-batch-update'),
]