# Generated by Django 4.1.4 on 2023-02-13 13:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bills', '0013_remove_billaction_paystack_plan_and_more'),
        ('financials', '0024_alter_transferrecipient_authorization_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='paystackplan',
            name='action',
            field=models.OneToOneField(default=2, on_delete=django.db.models.deletion.PROTECT, related_name='paystack_plan', to='bills.billaction'),
        ),
        migrations.AddField(
            model_name='paystacksubscription',
            name='action',
            field=models.OneToOneField(default=2, on_delete=django.db.models.deletion.PROTECT, related_name='paystack_subscription', to='bills.billaction'),
        ),
        migrations.AlterField(
            model_name='paystacksubscription',
            name='card',
            field=models.ForeignKey(help_text='NULL means the card used for this transaction has been deleted on Halver. Check full paystack data for card details.', null=True, on_delete=django.db.models.deletion.PROTECT, related_name='paystack_subscriptions', to='financials.usercard'),
        ),
        migrations.AlterField(
            model_name='paystacksubscription',
            name='plan',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='paystack_subscriptions', to='financials.paystackplan'),
        ),
    ]