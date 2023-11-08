# Generated by Django 4.2.5 on 2023-10-24 21:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(max_length=2000)),
                ('feedback', models.TextField()),
                ('screenshot', models.ImageField(blank=True, null=True, upload_to='feedback')),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
