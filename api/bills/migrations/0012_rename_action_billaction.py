# Generated by Django 4.1.4 on 2023-02-03 12:27

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0024_alter_transferrecipient_authorization_code'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bills', '0011_billtransaction'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Action',
            new_name='BillAction',
        ),
    ]