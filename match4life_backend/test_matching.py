import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from emergency_requests.models import Emergency_Request, Donor_Request_Match
from donors.models import Donor
from ml_model.predictor import predict_donation
from emergency_requests.utils import haversine_distance
from datetime import date

def test_matching_logic():
    print("--- Starting Match Logic Test ---")
    
    # 1. Get the first emergency request
    req = Emergency_Request.objects.first()
    if not req:
        print("No emergency requests found.")
        return
        
    print(f"Emergency Request: {req.blood_group}, {req.units_required} units needed at {req.hospital.name}")
    print(f"Hospital Location: {req.hospital.latitude}, {req.hospital.longitude}")
    
    # Clear previous matches
    Donor_Request_Match.objects.filter(request=req).delete()
    
    # 2. Find compatible donors (exact match for prototype)
    compatible_donors = Donor.objects.filter(blood_group=req.blood_group, is_active=True)
    print(f"\nFound {compatible_donors.count()} compatible donors for {req.blood_group} blood type.")
    
    today = date.today()
    results = []
    
    for donor in compatible_donors:
        # Calculate distance
        dist = haversine_distance(
            req.hospital.latitude, req.hospital.longitude,
            donor.latitude, donor.longitude
        )
        
        # Calculate RFT features
        donations = donor.donations.order_by('-donation_date')
        freq = donations.count()
        recency = None
        time_months = None
        ml_score = None
        
        if freq > 0:
            latest = donations.first().donation_date
            first = donations.last().donation_date
            
            recency = (today.year - latest.year) * 12 + today.month - latest.month
            time_months = (today.year - first.year) * 12 + today.month - first.month
            
            # Use ML Model
            prediction = predict_donation(recency, freq, time_months)
            ml_score = prediction.get("donation_propensity")
        
        # Save Match
        match = Donor_Request_Match.objects.create(
            request=req, donor=donor, distance_km=dist, ml_propensity_score=ml_score
        )
        
        results.append({
            "donor": f"{donor.first_name} {donor.last_name}",
            "distance": round(dist, 2),
            "freq": freq,
            "recency": recency,
            "time": time_months,
            "ml_score": ml_score
        })
        
    # Sort results by ML Score descending, then distance ascending
    # Treat None ml_score as 0 for sorting
    results.sort(key=lambda x: (-1 * (x['ml_score'] or 0), x['distance']))
    
    print("\n--- Match Results (Ranked by ML Propensity Score) ---")
    print(f"{'Donor Name':<20} | {'Distance (km)':<15} | {'Recency (m)':<15} | {'Frequency':<10} | {'Time (m)':<10} | {'ML Propensity (%)':<15}")
    print("-" * 95)
    
    for r in results:
        score_str = f"{r['ml_score']}%" if r['ml_score'] is not None else "N/A (No history)"
        recency_str = str(r['recency']) if r['recency'] is not None else "N/A"
        time_str = str(r['time']) if r['time'] is not None else "N/A"
        
        print(f"{r['donor']:<20} | {r['distance']:<15} | {recency_str:<15} | {r['freq']:<10} | {time_str:<10} | {score_str:<15}")

if __name__ == '__main__':
    test_matching_logic()
