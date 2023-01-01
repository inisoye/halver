# Generated by Django 4.1.4 on 2023-01-01 11:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('financials', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transferrecipient',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transfer_recipients', to=settings.AUTH_USER_MODEL),
        ),
    ]
