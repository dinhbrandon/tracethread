# Generated by Django 4.2.5 on 2023-10-24 21:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feedback',
            name='url',
            field=models.URLField(max_length=2000),
        ),
    ]
