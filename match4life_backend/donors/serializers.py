from rest_framework import serializers
from .models import Donor, Donation_History

class DonationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation_History
        fields = '__all__'

class DonorSerializer(serializers.ModelSerializer):
    donations = DonationHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Donor
        fields = '__all__'
