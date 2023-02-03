# Generated by Django 4.1.4 on 2023-02-03 12:20

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('financials', '0024_alter_transferrecipient_authorization_code'),
        ('bills', '0010_delete_transaction'),
    ]

    operations = [
        migrations.CreateModel(
            name='BillTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='Public identifier')),
                ('contribution', models.DecimalField(decimal_places=4, max_digits=19, verbose_name='Bill contribution of participant (excludes fees)')),
                ('total_payment', models.DecimalField(decimal_places=4, max_digits=19, verbose_name='Total amount paid (includes fees)')),
                ('paystack_transaction_fee', models.DecimalField(decimal_places=4, max_digits=19)),
                ('paystack_transfer_fee', models.DecimalField(decimal_places=4, max_digits=19)),
                ('halver_fee', models.DecimalField(decimal_places=4, max_digits=19)),
                ('total_fee', models.DecimalField(decimal_places=4, max_digits=19)),
                ('bill', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='bills.bill')),
                ('paystack_transaction', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='halver_transaction', to='financials.paystacktransaction')),
                ('paystack_transfer', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='halver_transaction', to='financials.paystacktransfer')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
