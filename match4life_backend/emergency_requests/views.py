from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Emergency_Request, Donor_Request_Match, Medical_Screening
from .serializers import EmergencyRequestSerializer, DonorRequestMatchSerializer, MedicalScreeningSerializer
from donors.models import Donor
from ml_model.predictor import predict_donation
from .utils import haversine_distance

class EmergencyRequestViewSet(viewsets.ModelViewSet):
    queryset = Emergency_Request.objects.all()
    serializer_class = EmergencyRequestSerializer

    @action(detail=True, methods=['post'])
    def trigger_matching(self, request, pk=None):
        emergency_request = self.get_object()
        
        # 1. Filter the donors based on blood group compatibility
        compatible_types = [emergency_request.blood_group]
        compatible_donors = Donor.objects.filter(
            blood_group__in=compatible_types, 
            is_active=True
        )
        
        matches_created = []
        MAX_DISTANCE_KM = 50.0  # Optional max distance filter
        
        for donor in compatible_donors:
            # 2. Distance calculation
            dist = haversine_distance(
                emergency_request.hospital.latitude, 
                emergency_request.hospital.longitude,
                donor.latitude, 
                donor.longitude
            )
            
            # Filter donors based on distance
            if dist > MAX_DISTANCE_KM:
                continue
                
            # 3. Apply the Model (Calculate RFT)
            donations = donor.donations.order_by('-donation_date')
            ml_score = None
            if donations.exists():
                from datetime import date
                today = date.today()
                
                latest_donation = donations.first().donation_date
                first_donation = donations.last().donation_date
                
                recency = (today.year - latest_donation.year) * 12 + today.month - latest_donation.month
                time_months = (today.year - first_donation.year) * 12 + today.month - first_donation.month
                frequency = donations.count()
                
                ml_prediction = predict_donation(recency, frequency, time_months)
                ml_score = ml_prediction.get("donation_propensity")
            
            # Create or update match record
            match, created = Donor_Request_Match.objects.update_or_create(
                request=emergency_request,
                donor=donor,
                defaults={
                    'distance_km': dist,
                    'ml_propensity_score': ml_score
                }
            )
            matches_created.append(match)
            
        # 4. Rank the donors: Highest ML Score first, then closest distance
        # Treat None ml_score as 0 for sorting purposes
        matches_created.sort(key=lambda x: (-1 * (x.ml_propensity_score or 0), x.distance_km))
        
        # 5. Send notification message to the most ranked donors (Top 3 for example)
        TOP_N = 3
        top_matches = matches_created[:TOP_N]
        notified_count = 0
        
        for match in top_matches:
            if not match.notification_sent:
                # Mock sending WhatsApp message
                print(f"[WHATSAPP MOCK] Sending emergency request to {match.donor.phone_number} ({match.donor.first_name} {match.donor.last_name})")
                match.notification_sent = True
                match.donor_response = 'PENDING'
                match.save()
                notified_count += 1
        
        return Response(
            {
                "status": "Matching completed successfully.",
                "total_compatible": len(matches_created),
                "notified": notified_count,
                "top_donors": [f"{m.donor.first_name} {m.donor.last_name}" for m in top_matches]
            },
            status=status.HTTP_200_OK
        )

class DonorRequestMatchViewSet(viewsets.ModelViewSet):
    queryset = Donor_Request_Match.objects.all()
    serializer_class = DonorRequestMatchSerializer

    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        match = self.get_object()
        response_status = request.data.get('response')
        
        if response_status not in dict(Donor_Request_Match.RESPONSE_CHOICES):
            return Response({"error": "Invalid response status."}, status=status.HTTP_400_BAD_REQUEST)
            
        match.donor_response = response_status
        match.save()
        
        # If accepted, automatically create a pending medical screening record for the hospital
        if response_status == 'ACCEPTED':
            Medical_Screening.objects.get_or_create(match=match)
            
        return Response({"status": f"Response updated to {response_status}"}, status=status.HTTP_200_OK)


class MedicalScreeningViewSet(viewsets.ModelViewSet):
    queryset = Medical_Screening.objects.all()
    serializer_class = MedicalScreeningSerializer

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        screening = self.get_object()
        screening_status = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if screening_status not in dict(Medical_Screening.SCREENING_STATUS_CHOICES):
            return Response({"error": "Invalid screening status."}, status=status.HTTP_400_BAD_REQUEST)
            
        screening.status = screening_status
        screening.notes = notes
        from django.utils import timezone
        screening.conducted_at = timezone.now()
        screening.save()
        
        # If passed, we might update the request fulfilled units in a fully fleshed out system
        
        return Response({"status": f"Screening updated to {screening_status}"}, status=status.HTTP_200_OK)
