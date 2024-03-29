# Generated by Django 4.1.7 on 2023-05-29 08:21

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bills', '0003_alter_billtransaction_contribution'),
    ]

    operations = [
        migrations.AddField(
            model_name='billtransaction',
            name='participant',
            field=models.ForeignKey(help_text='The participant who paid.', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='halver_transactions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='billtransaction',
            name='recipient',
            field=models.ForeignKey(help_text="The participant who was paid (the bill's creditor).", null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='halver_transactions_recieved', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='billtransaction',
            name='contribution',
            field=models.DecimalField(decimal_places=4, help_text='Bill contribution of the participant (excludes fees).', max_digits=19, validators=[django.core.validators.MinValueValidator(100)]),
        ),
    ]
