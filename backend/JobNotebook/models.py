from django.db import models
from querier.models import JobSaved
from django.contrib.auth.models import User
from django.utils import timezone

#For users to organize their cards into columns
class Column(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='columns')
    order = models.IntegerField()

    class Meta:
        ordering = ['order']
        unique_together = ['owner', 'order']

    def __str__(self):
        return self.name
    
#For users to move the information around the job notebook


class Card(models.Model):
    job_saved = models.ForeignKey(JobSaved, on_delete=models.SET_NULL, null=True, blank=True, related_name='cards')
    notes = models.TextField(max_length=2000, null=True, blank=True)
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name='cards')
    order = models.PositiveIntegerField(default=0)
    timestamp = models.DateTimeField(default=timezone.now)
    job_title = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)
    company_logo = models.URLField(max_length=2000, null=True, blank=True)
    listing_details = models.CharField(max_length=500, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    url = models.URLField(max_length=2000, null=True, blank=True)

    def __str__(self):
        if self.job_saved and self.job_saved.job_listing:
            job = self.job_saved.job_listing
            details = f'{job.job_title} by {job.company_name}'
            return details
        else:
            return 'No Job Listing'
