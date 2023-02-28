# Generated by Django 4.1.4 on 2023-02-28 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bills', '0016_alter_billunregisteredparticipant_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bill',
            name='interval',
            field=models.CharField(choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly'), ('quarterly', 'Quarterly'), ('biannually', 'Biannually'), ('annually', 'Annually'), ('none', 'None')], default='none', max_length=50),
        ),
        migrations.AlterField(
            model_name='bill',
            name='is_discreet',
            field=models.BooleanField(default=False, help_text='Are transactions and actions hidden from non-creditor, non-creator participants'),
        ),
        migrations.AlterField(
            model_name='bill',
            name='total_amount_due',
            field=models.DecimalField(decimal_places=4, help_text='Total amount to be paid', max_digits=19),
        ),
        migrations.AlterField(
            model_name='bill',
            name='total_amount_paid',
            field=models.DecimalField(decimal_places=4, default=0, help_text='Total amount already paid', max_digits=19),
        ),
        migrations.AlterField(
            model_name='billaction',
            name='contribution',
            field=models.DecimalField(decimal_places=4, help_text='Bill contribution of participant (excludes fees)', max_digits=19, null=True),
        ),
        migrations.AlterField(
            model_name='billaction',
            name='total_payment_due',
            field=models.DecimalField(decimal_places=4, help_text='Summation of contribution and total fees. Actual amount to be paid', max_digits=19, null=True),
        ),
        migrations.AlterField(
            model_name='billtransaction',
            name='contribution',
            field=models.DecimalField(decimal_places=4, help_text='Bill contribution of participant (excludes fees)', max_digits=19),
        ),
        migrations.AlterField(
            model_name='billtransaction',
            name='total_payment',
            field=models.DecimalField(decimal_places=4, help_text='Total amount paid (includes fees)', max_digits=19),
        ),
        migrations.AlterField(
            model_name='billunregisteredparticipant',
            name='contribution',
            field=models.DecimalField(decimal_places=4, help_text='Bill contribution of unregistered participant', max_digits=19),
        ),
    ]
