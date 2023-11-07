from django.db import models
from django.contrib.auth.models import User

# Allow commenting on Feedback instances, and also upvotes on comments - comments would have a foreign key to the Feedback instance
# Feedback should be able to have multiple comments, and comments should be able to have upvotes that can be incremented


class Upvote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    feedback = models.ForeignKey('Feedback', on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey('Comments', on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        unique_together = (('user', 'feedback'), ('user', 'comment'))


class Comments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    feedback = models.ForeignKey('Feedback', on_delete=models.CASCADE)
    comment = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    @property
    def upvotes_count(self):
        return Upvote.objects.filter(comment=self).count()

    def __str__(self):
        return self.comment


class Feedback(models.Model):
    url = models.URLField(max_length=2000)
    feedback = models.TextField()
    screenshot = models.ImageField(upload_to='feedback', null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    @property
    def comments(self):
        return Comments.objects.filter(feedback=self)
    
    @property
    def upvotes_count(self):
        return Upvote.objects.filter(feedback=self).count()

    def __str__(self):
        return self.url


class ScriptExecution(models.Model):
    class Meta:
        verbose_name_plural = "Script Execution"