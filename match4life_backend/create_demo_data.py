import os
import django
import sys
from datetime import date, timedelta

sys.path.append('C:\\Users\\bibin\\Desktop\\project ap\\match4life_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from donors.models import Donor, Donation_History
from hospitals.models import Hospital
from emergency_requests.models import Emergency_Request

def create_demo_data():
    print("Creating Demo Hospital...")
    hospital, created = Hospital.objects.update_or_create(
        email='demo.hospital@match4life.com',
        defaults={
            'name': 'City General Demo Hospital',
            'registration_number': 'DEMO-HOSP-1234',
            'is_verified': True,
            'contact_person': 'Dr. Sarah Jenkins',
            'phone_number': '+1-555-0199',
            'address': '123 Medical Parkway, City Center',
            'latitude': 40.7128,
            'longitude': -74.0060
        }
    )

    print("Creating Demo Donor...")
    donor, created = Donor.objects.update_or_create(
        email='demo.donor@match4life.com',
        defaults={
            'first_name': 'Michael',
            'last_name': 'Demo',
            'blood_group': 'O+',
            'phone_number': '+1-555-0100',
            'latitude': 40.7150, # very close to hospital
            'longitude': -74.0100,
            'is_active': True
        }
    )

    print("Clearing old demo history...")
    Donation_History.objects.filter(donor=donor).delete()

    print("Creating Realistic Donation History for RFT (Recency, Frequency, Time)...")
    # Let's create a profile with a decent propensity score.
    # 5 donations total (Frequency = 5)
    # Most recent was 2 months ago (Recency = 2)
    # First was 24 months ago (Time = 24)
    today = date.today()
    history_dates = [
        today - timedelta(days=60),   # 2 months
        today - timedelta(days=120),  # 4 months
        today - timedelta(days=365),  # 12 months
        today - timedelta(days=500),  # 16 months
        today - timedelta(days=730),  # 24 months
    ]

    for d in history_dates:
        Donation_History.objects.create(
            donor=donor,
            donation_date=d,
            location='Red Cross Main Center',
            notes='Routine whole blood donation.'
        )

    print("Demo data creation complete!")

if __name__ == '__main__':
    create_demo_data()
