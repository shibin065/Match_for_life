import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Activity } from 'lucide-react';

export default function RegisterDonor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', blood_group: 'A+',
    phone_number: '', email: '', latitude: '', longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/donors/', { ...formData, is_active: true });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Activity size={48} color="var(--accent-red)" />
          <h2>Donor Registration</h2>
          <p>Join the Match4Life network</p>
        </div>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input type="text" name="first_name" placeholder="First Name" required onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="text" name="last_name" placeholder="Last Name" required onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
          <select name="blood_group" onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
          <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="text" name="phone_number" placeholder="Phone Number (WhatsApp)" required onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input type="number" step="any" name="latitude" placeholder="Latitude (e.g. 40.7128)" onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="number" step="any" name="longitude" placeholder="Longitude (e.g. -74.0060)" onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>{loading ? 'Registering...' : 'Register as Donor'}</button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
