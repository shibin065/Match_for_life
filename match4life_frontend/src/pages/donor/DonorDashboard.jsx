import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Heart, Activity, Calendar, MapPin } from 'lucide-react';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      fetchMatches();
      fetchHistory();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/matches/');
      // Filter matches where this donor is the target
      const myMatches = res.data.filter(m => m.donor.id === user.id);
      setMatches(myMatches);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/donation-history/');
      // Filter history for this donor
      const myHistory = res.data.filter(h => h.donor === user.id);
      setHistory(myHistory);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRespond = async (matchId, response) => {
    try {
      await api.post(`/matches/${matchId}/respond/`, { response });
      fetchMatches(); // Refresh UI
    } catch (err) {
      console.error("Failed to respond", err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Welcome, {user.first_name}</h1>
          <p>Blood Group: <strong style={{ color: 'var(--accent-red)' }}>{user.blood_group}</strong> | Location: {user.latitude}, {user.longitude}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p>Total Donations: {history.length}</p>
        </div>
      </header>

      {/* GPS Consent Mock Section */}
      <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: '4px solid #f39c12' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={20} /> GPS Location Services Active</h3>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>You have consented to providing your location to Match4Life. This is securely used to match you with nearby hospitals during life-threatening emergencies.</p>
      </div>

      <div className="dashboard-grid">
        <section className="glass-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={24} /> Emergency Requests</h2>
          {matches.length === 0 ? (
            <p>No active requests in your area.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {matches.map(match => (
                <div key={match.id} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <strong>Distance: {parseFloat(match.distance_km).toFixed(1)} km</strong>
                    <span className="status-badge" style={{ background: '#ffebee', color: '#c62828' }}>{match.donor_response}</span>
                  </div>
                  <p>You have been matched via our ML Engine to an emergency request.</p>
                  
                  {match.donor_response === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button className="btn-primary" onClick={() => handleRespond(match.id, 'ACCEPTED')} style={{ flex: 1, padding: '0.5rem' }}>Accept</button>
                      <button className="btn-primary" onClick={() => handleRespond(match.id, 'DECLINED')} style={{ flex: 1, padding: '0.5rem', background: '#ccc', color: '#333' }}>Decline</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={24} /> Donation History</h2>
          {history.length === 0 ? (
            <p>You have no recorded donations yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {history.map(h => (
                <li key={h.id} style={{ padding: '1rem 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{h.location || 'Donation Center'}</strong>
                    <p style={{ fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>{h.notes}</p>
                  </div>
                  <span style={{ color: '#666' }}>{h.donation_date}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
