# Generated by Django 4.0.3 on 2024-04-06 10:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('availability', '0001_initial'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='availability',
            name='unique_availability',
        ),
    ]