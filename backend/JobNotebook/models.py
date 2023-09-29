from django.db import models
from querier.models import JobListing
from django.contrib.auth.models import User


class Column(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='columns')
    order = models.IntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name
    

class Card(models.Model):
    job_listing = models.ForeignKey(JobListing, on_delete=models.SET_NULL, null=True, blank=True, related_name='cards')
    notes = models.TextField()
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name='cards')
    # # Snapshot fields
    # job_title = models.CharField(max_length=255)
    # company_name = models.CharField(max_length=255)
    # location = models.CharField(max_length=255)
    # listing_details = models.CharField(max_length=255)
    # description = models.CharField(max_length=255)
    # url = models.URLField(max_length=255)
    # interested_users = models.ManyToManyField(User, related_name='cards')
    # date = models.DateTimeField()

    # def save_snapshot(self, job_listing):
    #     self.job_title = job_listing.job_title
    #     self.company_name = job_listing.company_name
    #     self.location = job_listing.location
    #     self.listing_details = job_listing.listing_details
    #     self.description = job_listing.description
    #     self.url = job_listing.url
    #     self.date = job_listing.date
    #     self.save()

    def __str__(self):
        return str(self.job_title)