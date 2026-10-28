from django.contrib import admin
from django.utils.html import format_html
from .models import Emergency_Request, Donor_Request_Match, Medical_Screening

@admin.register(Emergency_Request)
class EmergencyRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'hospital', 'blood_group', 'units_required', 'urgency_badge', 'status_badge', 'created_at')
    search_fields = ('hospital__name', 'blood_group')
    list_filter = ('urgency', 'status', 'blood_group', 'created_at')
    readonly_fields = ('created_at', 'updated_at')

    def urgency_badge(self, obj):
        if obj.urgency == 'HIGH':
            return format_html('<span class="badge badge-danger">{}</span>', obj.get_urgency_display())
        elif obj.urgency == 'MEDIUM':
            return format_html('<span class="badge badge-warning">{}</span>', obj.get_urgency_display())
        return format_html('<span class="badge badge-info">{}</span>', obj.get_urgency_display())
    urgency_badge.short_description = 'Urgency'

    def status_badge(self, obj):
        if obj.status == 'OPEN':
            return format_html('<span class="badge badge-info">{}</span>', obj.get_status_display())
        elif obj.status == 'FULFILLED':
            return format_html('<span class="badge badge-success">{}</span>', obj.get_status_display())
        return format_html('<span class="badge badge-warning">{}</span>', obj.get_status_display())
    status_badge.short_description = 'Status'

@admin.register(Donor_Request_Match)
class DonorRequestMatchAdmin(admin.ModelAdmin):
    list_display = ('id', 'request', 'donor', 'formatted_ml_score', 'distance_km', 'response_badge', 'notification_sent', 'created_at')
    search_fields = ('request__id', 'donor__first_name', 'donor__last_name', 'donor__email')
    list_filter = ('donor_response', 'notification_sent', 'created_at')
    readonly_fields = ('ml_propensity_score', 'distance_km', 'created_at')

    def formatted_ml_score(self, obj):
        if obj.ml_propensity_score is not None:
            return format_html('<strong>{}%</strong>', obj.ml_propensity_score)
        return '-'
    formatted_ml_score.short_description = 'ML Propensity Score'

    def response_badge(self, obj):
        if obj.donor_response == 'ACCEPTED':
            return format_html('<span class="badge badge-success">Accepted</span>')
        elif obj.donor_response == 'DECLINED':
            return format_html('<span class="badge badge-danger">Declined</span>')
        elif obj.donor_response == 'PENDING':
            return format_html('<span class="badge badge-warning">Pending</span>')
        return format_html('<span class="badge badge-info">No Response</span>')
    response_badge.short_description = 'Donor Response'
    
@admin.register(Medical_Screening)
class MedicalScreeningAdmin(admin.ModelAdmin):
    list_display = ('id', 'match', 'status_badge', 'conducted_at')
    search_fields = ('match__donor__first_name', 'match__donor__last_name')
    list_filter = ('status', 'conducted_at')
    readonly_fields = ('conducted_at',)

    def status_badge(self, obj):
        if obj.status == 'PASSED':
            return format_html('<span class="badge badge-success">Passed</span>')
        elif obj.status == 'FAILED':
            return format_html('<span class="badge badge-danger">Failed</span>')
        return format_html('<span class="badge badge-warning">Pending</span>')
    status_badge.short_description = 'Screening Status'
