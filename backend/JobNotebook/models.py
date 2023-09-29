from django.db import models
from querier.models import JobSaved
from django.contrib.auth.models import User

#For users to organize their cards into columns
class Column(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='columns')
    order = models.IntegerField(unique=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name
    
#For users to move the information around the job notebook
class Card(models.Model):
    job_saved = models.ForeignKey(JobSaved, on_delete=models.SET_NULL, null=True, blank=True, related_name='cards')
    notes = models.TextField()
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name='cards')

    def __str__(self):
        if self.job_saved and self.job_saved.job_listing:
            job = self.job_saved.job_listing
            details = f'{job.job_title} by {job.company_name}'
                    #   f'Listing Details: {job.listing_details}, Description: {job.description}, ' \
                    #   f'Location: {job.location}, URL: {job.url}, Date: {job.date}'
            return details
        else:
            return 'No Job Listing'
