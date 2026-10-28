import os
import django
from datetime import date, timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from donors.models import Donor, Donation_History
from hospitals.models import Hospital
from emergency_requests.models import Emergency_Request

def populate():
    print("Clearing old data...")
    Donation_History.objects.all().delete()
    Donor.objects.all().delete()
    Hospital.objects.all().delete()
    Emergency_Request.objects.all().delete()

    print("Creating Hospitals...")
    h1 = Hospital.objects.create(
        name="City General Hospital",
        registration_number="REG-1001",
        is_verified=True,
        contact_person="Dr. Smith",
        phone_number="555-0100",
        email="contact@citygeneral.com",
        latitude=40.7128,
        longitude=-74.0060,
        address="123 Health Ave, NY"
    )
    
    h2 = Hospital.objects.create(
        name="Mercy Medical Center",
        registration_number="REG-1002",
        is_verified=True,
        contact_person="Dr. Jane Doe",
        phone_number="555-0200",
        email="info@mercymedical.com",
        latitude=40.7306,
        longitude=-73.9352,
        address="456 Care St, NY"
    )

    print("Creating Donors and Donation History...")
    blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    first_names = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava', 'Robert', 'Isabella']
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']

    donors = []
    # Create 20 donors around NY area
    for i in range(20):
        lat = 40.7 + random.uniform(-0.1, 0.1)
        lon = -74.0 + random.uniform(-0.1, 0.1)
        donor = Donor.objects.create(
            first_name=random.choice(first_names),
            last_name=random.choice(last_names),
            blood_group=random.choice(blood_groups),
            phone_number=f"555-10{i:02d}",
            email=f"donor{i}@example.com",
            latitude=lat,
            longitude=lon,
            is_active=True
        )
        donors.append(donor)

        # Generate some donation history for ML model logic
        # Some donors donate frequently, some rarely
        num_donations = random.randint(0, 5)
        today = date.today()
        
        for j in range(num_donations):
            # Spread donations over the last 36 months
            months_ago = random.randint(1, 36)
            donation_date = today - timedelta(days=30*months_ago)
            Donation_History.objects.create(
                donor=donor,
                donation_date=donation_date,
                location=random.choice(["Red Cross", "City General Hospital", "Blood Drive"]),
                notes="Standard donation"
            )

    print("Creating an Emergency Request for matching test...")
    req = Emergency_Request.objects.create(
        hospital=h1,
        blood_group=random.choice(['O+', 'A+']), # Common types
        units_required=2,
        urgency="HIGH",
        status="OPEN"
    )

    print("Database successfully populated with dummy data!")
    print(f"Total Hospitals: {Hospital.objects.count()}")
    print(f"Total Donors: {Donor.objects.count()}")
    print(f"Total Donations: {Donation_History.objects.count()}")
    print(f"Emergency Request ID {req.id} created for {req.blood_group}.")

if __name__ == '__main__':
    populate()
