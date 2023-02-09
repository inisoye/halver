import uuid

from django.conf import settings
from django.db import models


class AbstractTimeStampedUUIDModel(models.Model):
    """
    An abstract base class model that provides
    self-updating "created", "modified" and "uuid" fields.
    """

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    uuid = models.UUIDField(
        unique=True,
        editable=False,
        default=uuid.uuid4,
        verbose_name="Public identifier",
    )

    class Meta:
        abstract = True


class AbstractCurrencyModel(models.Model):
    """
    An abstract base class model that provides
    currency fields. Used especially for bills.
    """

    currency_name = models.CharField(
        max_length=100,
        default=settings.DEFAULT_CURRENCY_NAME,
    )
    currency_symbol = models.CharField(
        max_length=10,
        default=settings.DEFAULT_CURRENCY_SYMBOL,
    )
    currency_code = models.CharField(
        max_length=3,
        default=settings.DEFAULT_CURRENCY_CODE,
    )

    class Meta:
        abstract = True
