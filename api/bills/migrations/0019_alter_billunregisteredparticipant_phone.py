# Generated by Django 4.1.4 on 2023-03-01 09:31

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('bills', '0018_remove_billunregisteredparticipant_bill_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='billunregisteredparticipant',
            name='phone',
            field=phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None),
        ),
    ]