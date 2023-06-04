# Generated by Django 4.1.7 on 2023-06-02 02:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0003_paystacktransaction_financials__paystac_aebe4e_idx'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paystackplan',
            name='created',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='paystackplanfailure',
            name='created',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='paystacksubscription',
            name='created',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='paystacktransaction',
            name='created',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='paystacktransfer',
            name='created',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='transferrecipient',
            name='created',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='usercard',
            name='created',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
    ]