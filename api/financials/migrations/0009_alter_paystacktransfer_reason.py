# Generated by Django 4.1.7 on 2023-07-17 05:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0008_alter_paystacktransfer_transfer_outcome'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paystacktransfer',
            name='reason',
            field=models.TextField(null=True),
        ),
    ]