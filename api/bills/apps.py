from django.apps import AppConfig


class BillsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "bills"
    verbose_name = "Management of bills, actions and transactions"
