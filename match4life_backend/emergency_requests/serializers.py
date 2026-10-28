from rest_framework import serializers
from .models import Emergency_Request, Donor_Request_Match, Medical_Screening
from donors.serializers import DonorSerializer
from hospitals.serializers import HospitalSerializer

class EmergencyRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emergency_Request
        fields = '__all__'

class DonorRequestMatchSerializer(serializers.ModelSerializer):
    donor = DonorSerializer(read_only=True)
    
    class Meta:
        model = Donor_Request_Match
        fields = '__all__'

class MedicalScreeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medical_Screening
        fields = '__all__'
