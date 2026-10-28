from django.contrib import admin
from .models import Hospital

from django.utils.html import format_html

@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'registration_number', 'email', 'phone_number', 'status_badge', 'is_verified', 'created_at')
    search_fields = ('name', 'registration_number', 'email', 'contact_person')
    list_filter = ('is_verified', 'created_at')
    list_editable = ('is_verified',)
    readonly_fields = ('created_at',)

    def status_badge(self, obj):
        if obj.is_verified:
            return format_html('<span class="badge badge-success">Verified</span>')
        return format_html('<span class="badge badge-warning">Pending</span>')
    status_badge.short_description = 'Status'
