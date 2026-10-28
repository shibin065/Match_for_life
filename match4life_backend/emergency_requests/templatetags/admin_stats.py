from django import template
from donors.models import Donor
from hospitals.models import Hospital
from emergency_requests.models import Emergency_Request, Donor_Request_Match

register = template.Library()

@register.simple_tag
def get_total_donors():
    return Donor.objects.count()

@register.simple_tag
def get_verified_hospitals():
    return Hospital.objects.filter(is_verified=True).count()

@register.simple_tag
def get_active_requests():
    return Emergency_Request.objects.filter(status='OPEN').count()

@register.simple_tag
def get_accepted_matches():
    return Donor_Request_Match.objects.filter(donor_response='ACCEPTED').count()
