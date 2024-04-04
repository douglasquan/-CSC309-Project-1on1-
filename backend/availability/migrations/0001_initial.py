# Generated by Django 5.0.3 on 2024-03-29 19:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Availability',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_range', models.DateField(verbose_name='Start Date')),
                ('end_range', models.DateField(verbose_name='End Date')),
            ],
        ),
    ]