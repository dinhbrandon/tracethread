from django.contrib import admin
from .models import Card, Column


@admin.register(Column)
class ColumnAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'order')
    list_per_page = 25


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('job_saved', 'notes', 'column')
    list_per_page = 25
