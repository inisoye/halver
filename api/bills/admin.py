from django.contrib import admin

from bills.models import Bill, BillAction, BillTransaction, BillUnregisteredParticipant

admin.site.register(Bill)
admin.site.register(BillUnregisteredParticipant)
admin.site.register(BillAction)
admin.site.register(BillTransaction)
