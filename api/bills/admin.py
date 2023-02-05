from django.contrib import admin

from bills.models import Bill, BillAction, BillTransaction

admin.site.register(Bill)
admin.site.register(BillAction)
admin.site.register(BillTransaction)
