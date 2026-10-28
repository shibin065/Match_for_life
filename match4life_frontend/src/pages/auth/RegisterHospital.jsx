import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Activity } from 'lucide-react';

export default function RegisterHospital() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', registration_number: '', contact_person: '',
    phone_number: '', email: '', latitude: '', longitude: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/hospitals/', { ...formData, is_verified: false });
      setSuccess('Registration successful! Please wait for Admin verification before logging in.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Activity size={48} color="var(--accent-red)" />
          <h2>Hospital Registration</h2>
          <p>Register your clinic/hospital</p>
        </div>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" name="name" placeholder="Hospital Name" required onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input type="text" name="registration_number" placeholder="Official Registration No." required onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="text" name="contact_person" placeholder="Contact Person" required onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="text" name="phone_number" placeholder="Phone Number" required onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
          <input type="text" name="address" placeholder="Full Address" required onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input type="number" step="any" name="latitude" placeholder="Latitude (e.g. 40.7128)" onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="number" step="any" name="longitude" placeholder="Longitude (e.g. -74.0060)" onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>{loading ? 'Registering...' : 'Register Hospital'}</button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
