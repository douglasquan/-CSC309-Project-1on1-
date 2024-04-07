# Generated by Django 4.0.3 on 2024-04-05 05:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_duration',
            field=models.IntegerField(choices=[(30, '30 minutes'), (60, '60 minutes'), (90, '90 minutes'), (120, '120 minutes'), (150, '150 minutes'), (180, '180 minutes')]),
        ),
    ]