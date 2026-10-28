from django.db import models
from donors.models import Donor
from hospitals.models import Hospital

class Emergency_Request(models.Model):
    URGENCY_CHOICES = [
        ('HIGH', 'High (Immediate)'),
        ('MEDIUM', 'Medium (Within 24 hours)'),
        ('LOW', 'Low (Routine)'),
    ]
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('FULFILLED', 'Fulfilled'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='requests')
    blood_group = models.CharField(max_length=3, choices=Donor.BLOOD_GROUP_CHOICES)
    units_required = models.PositiveIntegerField(default=1)
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='HIGH')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='OPEN')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.hospital.name} - {self.blood_group} ({self.units_required} units)"


class Donor_Request_Match(models.Model):
    RESPONSE_CHOICES = [
        ('PENDING', 'Pending Response'),
        ('ACCEPTED', 'Accepted'),
        ('DECLINED', 'Declined'),
        ('NO_RESPONSE', 'No Response'),
    ]

    request = models.ForeignKey(Emergency_Request, on_delete=models.CASCADE, related_name='matches')
    donor = models.ForeignKey(Donor, on_delete=models.CASCADE, related_name='matches')
    distance_km = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    ml_propensity_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True) # 0 to 100
    notification_sent = models.BooleanField(default=False)
    donor_response = models.CharField(max_length=20, choices=RESPONSE_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Match: {self.donor} for Request #{self.request.id}"


class Medical_Screening(models.Model):
    SCREENING_STATUS_CHOICES = [
        ('PASSED', 'Passed'),
        ('FAILED', 'Failed'),
        ('PENDING', 'Pending'),
    ]
    match = models.OneToOneField(Donor_Request_Match, on_delete=models.CASCADE, related_name='screening')
    status = models.CharField(max_length=15, choices=SCREENING_STATUS_CHOICES, default='PENDING')
    notes = models.TextField(null=True, blank=True)
    conducted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Screening for Match #{self.match.id} - {self.status}"
