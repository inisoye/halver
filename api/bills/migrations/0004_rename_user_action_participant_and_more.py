# Generated by Django 4.1.4 on 2023-01-20 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bills', '0003_rename_due_date_bill_deadline'),
    ]

    operations = [
        migrations.RenameField(
            model_name='action',
            old_name='user',
            new_name='participant',
        ),
        migrations.RenameField(
            model_name='bill',
            old_name='collector',
            new_name='creditor',
        ),
        migrations.RenameField(
            model_name='transaction',
            old_name='user',
            new_name='participant',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='status',
        ),
        migrations.AddField(
            model_name='bill',
            name='interval',
            field=models.CharField(choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly'), ('biannually', 'Biannually'), ('annually', 'Annually'), ('none', 'None')], default='none', max_length=50),
        ),
        migrations.AlterField(
            model_name='action',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('overdue', 'Overdue'), ('declined', 'Declined'), ('pending_transfer', 'Pending Transfer'), ('completed', 'Completed'), ('ongoing', 'Ongoing'), ('cancelled', 'Cancelled')], default='pending', max_length=50),
        ),
    ]
