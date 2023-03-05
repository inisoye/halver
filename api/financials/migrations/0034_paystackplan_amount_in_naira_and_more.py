# Generated by Django 4.1.4 on 2023-03-04 15:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0033_alter_paystacktransaction_transaction_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='paystackplan',
            name='amount_in_naira',
            field=models.DecimalField(blank=True, decimal_places=4, max_digits=19, null=True),
        ),
        migrations.AddField(
            model_name='paystacktransaction',
            name='amount_in_naira',
            field=models.DecimalField(blank=True, decimal_places=4, max_digits=19, null=True),
        ),
        migrations.AddField(
            model_name='paystacktransfer',
            name='amount_in_naira',
            field=models.DecimalField(blank=True, decimal_places=4, max_digits=19, null=True),
        ),
        migrations.AlterField(
            model_name='paystacktransaction',
            name='amount',
            field=models.DecimalField(decimal_places=4, help_text='Amount returned by Paystack, in Kobo (or other subunit)', max_digits=19, verbose_name='Amount in Kobo or other subunit'),
        ),
        migrations.AlterField(
            model_name='paystacktransfer',
            name='amount',
            field=models.DecimalField(decimal_places=4, help_text='Amount returned by Paystack, in Kobo (or other subunit)', max_digits=19, verbose_name='Amount in Kobo or other subunit'),
        ),
    ]