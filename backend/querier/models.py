from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
import dateutil.parser


class JobListing(models.Model):
    id = models.AutoField(primary_key=True)
    job_title = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)
    listing_details = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=100)
    url = models.URLField(max_length=100)
    interested_users = models.ManyToManyField(User, related_name='saved_jobs', through='JobSaved')
    date = models.CharField(max_length=20, null=True, blank=True)
    posted_by = models.ForeignKey(User, null=True, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.date:
            self.date = datetime.now().strftime('%m/%d/%Y %I:%M%p')
        elif '-' in self.date:
            self.date = dateutil.parser.parse(self.date).strftime('%m/%d/%Y %I:%M%p')

    def __str__(self):
        return f'{self.job_title} at {self.company_name}'
    

class JobSaved(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_listing = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    date_saved = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'job_listing')

    def __str__(self):
        return f'{self.job_listing.job_title} at {self.job_listing.company_name}'