from django.contrib import admin

from financials.models import (
    PaystackPlan,
    PaystackSubscription,
    PaystackTransaction,
    PaystackTransfer,
    TransferRecipient,
    UserCard,
)

admin.site.register(UserCard)
admin.site.register(TransferRecipient)
admin.site.register(PaystackPlan)
admin.site.register(PaystackSubscription)
admin.site.register(PaystackTransaction)
admin.site.register(PaystackTransfer)
