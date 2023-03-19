# Generated by Django 4.1.4 on 2023-03-18 15:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bills', '0028_alter_billtransaction_action'),
    ]

    operations = [
        migrations.AddField(
            model_name='billtransaction',
            name='transaction_type',
            field=models.CharField(choices=[('regular', 'Regular'), ('arrear', 'Arrear')], default='regular', max_length=50),
        ),
        migrations.CreateModel(
            name='BillArrear',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True, verbose_name='Public identifier')),
                ('contribution', models.DecimalField(decimal_places=4, help_text='Bill contribution of participant (excludes fees)', max_digits=19, null=True)),
                ('paystack_transaction_fee', models.DecimalField(decimal_places=4, max_digits=19, null=True)),
                ('paystack_transfer_fee', models.DecimalField(decimal_places=4, max_digits=19, null=True)),
                ('halver_fee', models.DecimalField(decimal_places=4, max_digits=19, null=True)),
                ('total_fee', models.DecimalField(decimal_places=4, max_digits=19, null=True)),
                ('total_payment_due', models.DecimalField(decimal_places=4, help_text='Summation of contribution and total fees. Actual amount to be paid', max_digits=19, null=True)),
                ('bill', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='arrears', to='bills.bill')),
                ('participant', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='arrears', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Bill arrear',
                'verbose_name_plural': 'Bill arrears',
            },
        ),
    ]