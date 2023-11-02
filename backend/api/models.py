from django.db import models


class Feedback(models.Model):
    url = models.URLField(max_length=2000)
    feedback = models.TextField()
    screenshot = models.ImageField(upload_to='feedback', null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url


class ScriptExecution(models.Model):
    class Meta:
        verbose_name_plural = "Script Execution"