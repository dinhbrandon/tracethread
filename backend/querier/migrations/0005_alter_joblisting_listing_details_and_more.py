# Generated by Django 4.2.5 on 2023-10-06 22:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('querier', '0004_alter_joblisting_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='joblisting',
            name='listing_details',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='joblisting',
            name='url',
            field=models.URLField(max_length=2000),
        ),
    ]
