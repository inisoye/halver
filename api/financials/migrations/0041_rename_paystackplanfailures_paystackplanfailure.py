# Generated by Django 4.1.4 on 2023-03-15 11:25

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bills', '0028_alter_billtransaction_action'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('financials', '0040_alter_paystacksubscription_paystack_subscription_code'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='PaystackPlanFailures',
            new_name='PaystackPlanFailure',
        ),
    ]
