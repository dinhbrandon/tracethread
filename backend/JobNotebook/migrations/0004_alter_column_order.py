# Generated by Django 4.2.5 on 2023-09-29 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('JobNotebook', '0003_remove_card_job_listing_card_job_saved'),
    ]

    operations = [
        migrations.AlterField(
            model_name='column',
            name='order',
            field=models.IntegerField(unique=True),
        ),
    ]
