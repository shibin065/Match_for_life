import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Activity } from 'lucide-react';

export default function CreateRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    blood_group: 'A+', units_required: 1, urgency: 'NORMAL'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/emergency-requests/', { 
        ...formData, 
        hospital: user.id 
      });
      navigate('/hospital/dashboard');
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to create request');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <Activity color="var(--accent-red)" />
          Create Emergency Request
        </h2>
        
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Required Blood Group</label>
            <select name="blood_group" onChange={handleChange} value={formData.blood_group} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Units Required</label>
            <input type="number" min="1" name="units_required" value={formData.units_required} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Urgency Level</label>
            <select name="urgency" onChange={handleChange} value={formData.urgency} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High (Within 24 Hours)</option>
              <option value="CRITICAL">Critical (Immediate)</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>{loading ? 'Creating...' : 'Submit Request'}</button>
            <button type="button" onClick={() => navigate('/hospital/dashboard')} className="btn-primary" style={{ background: '#ccc', color: '#333' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
