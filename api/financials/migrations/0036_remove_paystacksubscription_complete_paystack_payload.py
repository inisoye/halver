# Generated by Django 4.1.4 on 2023-03-10 16:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0035_alter_paystackplan_uuid_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='paystacksubscription',
            name='complete_paystack_payload',
        ),
    ]
