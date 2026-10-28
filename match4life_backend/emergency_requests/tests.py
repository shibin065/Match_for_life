from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from donors.models import Donor, Donation_History
from hospitals.models import Hospital
from emergency_requests.models import Emergency_Request, Donor_Request_Match
from datetime import date, timedelta

class MatchingAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.hospital = Hospital.objects.create(
            name="Test Hospital",
            registration_number="REG-100",
            is_verified=True,
            latitude=40.7128,
            longitude=-74.0060,
            email="test@hospital.com",
            phone_number="123"
        )
        
        self.request = Emergency_Request.objects.create(
            hospital=self.hospital,
            blood_group="A+",
            units_required=1,
            urgency="HIGH"
        )
        
        self.donor_valid = Donor.objects.create(
            first_name="Valid", last_name="Donor", blood_group="A+",
            phone_number="111", email="valid@d.com",
            latitude=40.7, longitude=-74.0, is_active=True
        )
        # Add donation history
        Donation_History.objects.create(donor=self.donor_valid, donation_date=date.today() - timedelta(days=60))
        
        self.donor_no_history = Donor.objects.create(
            first_name="No", last_name="History", blood_group="A+",
            phone_number="222", email="nohistory@d.com",
            latitude=40.75, longitude=-74.05, is_active=True
        )
        
        self.donor_incompatible = Donor.objects.create(
            first_name="Incompatible", last_name="Donor", blood_group="B+",
            phone_number="333", email="incomp@d.com",
            latitude=40.7, longitude=-74.0, is_active=True
        )
        
        # Another request for no match test
        self.request_no_match = Emergency_Request.objects.create(
            hospital=self.hospital,
            blood_group="AB-",
            units_required=1
        )

    def test_trigger_matching_success(self):
        response = self.client.post(f'/api/emergency-requests/{self.request.id}/trigger_matching/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that matches were created
        matches = Donor_Request_Match.objects.filter(request=self.request)
        self.assertEqual(matches.count(), 2)  # A+ valid, A+ no history
        
        # Verify valid donor has a propensity score
        valid_match = matches.get(donor=self.donor_valid)
        self.assertIsNotNone(valid_match.ml_propensity_score)
        
        # Verify no-history donor has None for score
        nohistory_match = matches.get(donor=self.donor_no_history)
        self.assertIsNone(nohistory_match.ml_propensity_score)

    def test_trigger_matching_no_compatible(self):
        response = self.client.post(f'/api/emergency-requests/{self.request_no_match.id}/trigger_matching/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        matches = Donor_Request_Match.objects.filter(request=self.request_no_match)
        self.assertEqual(matches.count(), 0)

    def test_donor_response(self):
        # Trigger matching to create match
        self.client.post(f'/api/emergency-requests/{self.request.id}/trigger_matching/')
        match = Donor_Request_Match.objects.filter(request=self.request).first()
        
        # Respond
        response = self.client.post(f'/api/matches/{match.id}/respond/', {'response': 'ACCEPTED'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        match.refresh_from_db()
        self.assertEqual(match.donor_response, 'ACCEPTED')
        
        # Check if medical screening was created
        self.assertTrue(hasattr(match, 'screening'))
