# Generated by Django 4.1.7 on 2023-10-03 05:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bills', '0010_alter_billarrear_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='billaction',
            name='status',
            field=models.CharField(choices=[('unregistered', 'Unregistered'), ('pending', 'Pending'), ('overdue', 'Overdue'), ('opted_out', 'Opted out'), ('pending_transfer', 'Pending transfer'), ('failed_transfer', 'Failed transfer'), ('reversed_transfer', 'Reversed transfer'), ('cancelled', 'Cancelled'), ('payment_initialized', 'Payment initialized'), ('completed', 'Completed'), ('ongoing', 'Ongoing'), ('last_payment_failed', 'Last payment failed')], default='pending', max_length=50),
        ),
    ]