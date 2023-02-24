# Generated by Django 4.1.4 on 2023-02-24 08:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0027_paystackplan_complete_paystack_payload_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='paystackplan',
            options={'verbose_name': 'Paystack plan', 'verbose_name_plural': 'Paystack plans'},
        ),
        migrations.AlterModelOptions(
            name='paystacksubscription',
            options={'verbose_name': 'Paystack subscription', 'verbose_name_plural': 'Paystack subscriptions'},
        ),
        migrations.AlterModelOptions(
            name='paystacktransaction',
            options={'verbose_name': 'Paystack transaction', 'verbose_name_plural': 'Paystack transactions'},
        ),
        migrations.AlterModelOptions(
            name='paystacktransfer',
            options={'verbose_name': 'Paystack transfer', 'verbose_name_plural': 'Paystack transfers'},
        ),
        migrations.AlterModelOptions(
            name='transferrecipient',
            options={'verbose_name': 'User transfer recipient', 'verbose_name_plural': 'User transfer recipients'},
        ),
        migrations.AlterModelOptions(
            name='usercard',
            options={'verbose_name': 'User card', 'verbose_name_plural': 'User cards'},
        ),
    ]