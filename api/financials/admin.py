from django.contrib import admin

from financials.models import (
    PaystackPlan,
    PaystackPlanFailure,
    PaystackSubscription,
    PaystackTransaction,
    PaystackTransfer,
    TransferRecipient,
    UserCard,
)

# from import_export import resources


admin.site.register(UserCard)
admin.site.register(TransferRecipient)
admin.site.register(PaystackPlan)
admin.site.register(PaystackPlanFailure)
admin.site.register(PaystackSubscription)
admin.site.register(PaystackTransaction)
admin.site.register(PaystackTransfer)


# class PaystackPlanResource(resources.ModelResource):
#     class Meta:
#         model = PaystackPlan


# class PaystackSubscriptionResource(resources.ModelResource):
#     class Meta:
#         model = PaystackSubscription


# class PaystackTransactionResource(resources.ModelResource):
#     class Meta:
#         model = PaystackTransaction


# class PaystackTransferResource(resources.ModelResource):
#     class Meta:
#         model = PaystackTransfer


# class TransferRecipientResource(resources.ModelResource):
#     class Meta:
#         model = TransferRecipient


# class UserCardResource(resources.ModelResource):
#     class Meta:
#         model = UserCard
