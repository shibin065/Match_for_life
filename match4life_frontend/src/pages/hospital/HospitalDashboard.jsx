import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Heart, Activity, CheckCircle, Search } from 'lucide-react';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/emergency-requests/');
      // Filter requests by this hospital
      const myReqs = res.data.filter(r => r.hospital.id === user.id);
      setRequests(myReqs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const triggerMatch = async (reqId) => {
    setLoading(true);
    try {
      await api.post(`/emergency-requests/${reqId}/trigger_matching/`);
      alert('Matching triggered! Candidates notified.');
      fetchRequests(); // Re-fetch to show new data
    } catch (err) {
      alert('Error triggering match.');
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>{user.name} Dashboard</h1>
        <p>Registration: {user.registration_number} | Status: {user.is_verified ? <span style={{color:'green'}}>Verified</span> : <span style={{color:'red'}}>Pending Verification</span>}</p>
      </header>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}><Activity /> Active Emergency Requests</h2>
          <button className="btn-primary" onClick={() => window.location.href = '/hospital/requests/create'}>+ Create Request</button>
        </div>
        
        {requests.length === 0 ? (
          <p>No active emergency requests.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {requests.map(req => (
              <div key={req.id} style={{ background: '#fdfbfb', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>Blood Group: <span style={{ color: 'var(--accent-red)' }}>{req.blood_group}</span> ({req.units_required} units)</h3>
                  <span className="status-badge" style={{ background: req.status === 'OPEN' ? '#e3f2fd' : '#e8f5e9', color: '#1565c0' }}>{req.status}</span>
                </div>
                <p>Urgency: <strong>{req.urgency}</strong> | Created: {new Date(req.created_at).toLocaleString()}</p>
                
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                  <button 
                    className="btn-primary" 
                    onClick={() => window.location.href = `/hospital/requests/${req.id}`}
                    style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid #ddd' }}
                  >
                    View Details & Candidates &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card">
        <h3><CheckCircle size={20} /> Medical Screenings</h3>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
          Remember: An ML Match is a <strong>Candidate Recommendation</strong> based on historical donation propensity. It is NOT a medical clearance. Final screening remains the hospital's responsibility when the donor arrives.
        </p>
      </div>
    </div>
  );
}
