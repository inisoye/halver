from django.contrib import admin

from financials.models import TransferRecipient, UserCard

admin.site.register(UserCard)
admin.site.register(TransferRecipient)
