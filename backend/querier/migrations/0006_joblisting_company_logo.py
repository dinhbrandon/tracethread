# Generated by Django 4.2.5 on 2023-10-09 20:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('querier', '0005_alter_joblisting_listing_details_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='joblisting',
            name='company_logo',
            field=models.URLField(blank=True, max_length=2000, null=True),
        ),
    ]
