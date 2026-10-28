from django.contrib import admin
from .models import Donor, Donation_History

@admin.register(Donor)
class DonorAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'phone_number', 'blood_group', 'is_active', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone_number')
    list_filter = ('blood_group', 'is_active', 'created_at')
    readonly_fields = ('created_at',)

@admin.register(Donation_History)
class DonationHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'donor', 'donation_date', 'location')
    search_fields = ('donor__first_name', 'donor__last_name', 'donor__email', 'location')
    list_filter = ('donation_date',)
