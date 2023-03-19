# Generated by Django 4.1.4 on 2023-03-19 06:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bills', '0030_billarrear_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='billarrear',
            name='action',
            field=models.ForeignKey(default=20, on_delete=django.db.models.deletion.PROTECT, related_name='arrears', to='bills.billaction'),
        ),
        migrations.AddField(
            model_name='billtransaction',
            name='arrear',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='halver_transaction', to='bills.billarrear'),
        ),
        migrations.AlterField(
            model_name='billaction',
            name='status',
            field=models.CharField(choices=[('unregistered', 'Unregistered'), ('pending', 'Pending'), ('overdue', 'Overdue'), ('opted_out', 'Opted out'), ('pending_transfer', 'Pending transfer'), ('cancelled', 'Cancelled'), ('completed', 'Completed'), ('ongoing', 'Ongoing'), ('last_payment_failed', 'Last payment failed')], default='pending', max_length=50),
        ),
        migrations.AlterField(
            model_name='billarrear',
            name='status',
            field=models.CharField(choices=[('overdue', 'Overdue'), ('forgiven', 'Forgiven'), ('pending_transfer', 'Pending transfer'), ('completed', 'Completed')], default='overdue', max_length=50),
        ),
    ]