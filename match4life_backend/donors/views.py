from rest_framework import viewsets
from .models import Donor, Donation_History
from .serializers import DonorSerializer, DonationHistorySerializer

class DonorViewSet(viewsets.ModelViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer

class DonationHistoryViewSet(viewsets.ModelViewSet):
    queryset = Donation_History.objects.all()
    serializer_class = DonationHistorySerializer
