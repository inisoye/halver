# Generated by Django 4.1.4 on 2022-12-23 17:53

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='phone',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, error_messages={'unique': 'A user with that phone number already exists.'}, max_length=128, region=None, unique=True),
        ),
    ]
