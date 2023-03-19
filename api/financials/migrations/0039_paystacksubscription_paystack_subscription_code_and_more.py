# Generated by Django 4.1.4 on 2023-03-12 19:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0038_alter_paystacktransaction_transaction_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='paystacksubscription',
            name='paystack_subscription_code',
            field=models.CharField(default='None', max_length=100),
        ),
        migrations.AlterField(
            model_name='paystacksubscription',
            name='plan',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='paystack_subscription', to='financials.paystackplan'),
        ),
    ]