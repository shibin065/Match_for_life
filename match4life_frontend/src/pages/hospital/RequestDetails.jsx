import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Activity, Users, CheckCircle, ShieldAlert } from 'lucide-react';

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const reqRes = await api.get(`/emergency-requests/${id}/`);
      setRequest(reqRes.data);
      
      const matchRes = await api.get('/matches/');
      setMatches(matchRes.data.filter(m => m.request.id === parseInt(id)));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const triggerMatch = async () => {
    setLoading(true);
    try {
      await api.post(`/emergency-requests/${id}/trigger_matching/`);
      fetchData(); // Refresh candidates
    } catch (err) {
      alert('Error triggering match.');
    }
    setLoading(false);
  };

  if (loading) return <div>Loading details...</div>;
  if (!request) return <div>Request not found.</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <button className="btn-primary" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid #ddd', marginBottom: '1rem' }} onClick={() => navigate('/hospital/dashboard')}>
        &larr; Back to Dashboard
      </button>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Request #{request.id} - {request.blood_group}</h2>
          <span className="status-badge" style={{ background: request.status === 'OPEN' ? '#e3f2fd' : '#e8f5e9', color: '#1565c0' }}>{request.status}</span>
        </div>
        <p>Units Required: <strong>{request.units_required}</strong></p>
        <p>Urgency: <strong>{request.urgency}</strong></p>
        <div style={{ marginTop: '1rem' }}>
          <button className="btn-primary" onClick={triggerMatch} disabled={loading || request.status !== 'OPEN'}>
            Find Matches via ML
          </button>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Users /> Candidates ({matches.length})</h3>
        
        <div style={{ background: '#fff3cd', color: '#856404', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} />
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Important:</strong> The "ML Propensity Score" is a behavioral prediction based on past donation frequency. It is <strong>NOT</strong> a medical screening or final eligibility approval.
          </p>
        </div>

        {matches.length === 0 ? (
          <p>No candidates found yet. Click "Find Matches" to run the ML matching engine.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-glass)' }}>
                <th style={{ padding: '1rem 0' }}>Donor</th>
                <th>Distance</th>
                <th>ML Match Score</th>
                <th>Response</th>
                <th>Screening</th>
              </tr>
            </thead>
            <tbody>
              {matches.sort((a,b) => (b.ml_propensity_score || 0) - (a.ml_propensity_score || 0)).map(match => (
                <tr key={match.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '1rem 0' }}>{match.donor.first_name} {match.donor.last_name}</td>
                  <td>{parseFloat(match.distance_km).toFixed(1)} km</td>
                  <td>
                    {match.ml_propensity_score !== null ? 
                      <strong style={{ color: 'var(--accent-red)' }}>{match.ml_propensity_score}%</strong> 
                      : <span style={{ color: '#888' }}>New Donor</span>
                    }
                  </td>
                  <td>
                    <span className="status-badge" style={{ background: match.donor_response === 'ACCEPTED' ? '#e8f5e9' : '#fff', color: match.donor_response === 'ACCEPTED' ? '#2e7d32' : '#333', border: '1px solid #ddd' }}>
                      {match.donor_response}
                    </span>
                  </td>
                  <td>
                    {/* Assuming we would have a screening endpoint to update, we just display the mock outcome for now */}
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Pending Final Check</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
