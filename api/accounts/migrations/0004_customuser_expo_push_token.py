# Generated by Django 4.1.7 on 2023-09-18 03:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_customuser_email_alter_customuser_first_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='expo_push_token',
            field=models.CharField(blank=True, error_messages={'unique': 'This token already exists for a different user.'}, max_length=70, null=True, unique=True),
        ),
    ]