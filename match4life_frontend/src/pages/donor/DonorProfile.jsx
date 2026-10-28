import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, MapPin } from 'lucide-react';

export default function DonorProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone_number: '', email: '', latitude: '', longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        phone_number: user.phone_number,
        email: user.email,
        latitude: user.latitude || '',
        longitude: user.longitude || ''
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await api.patch(`/donors/${user.id}/`, formData);
      setSuccess('Profile updated successfully! (Changes will be fully reflected on next login)');
    } catch (err) {
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <User color="var(--accent-red)" />
          My Profile
        </h2>
        
        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <p>Name: <strong>{user.first_name} {user.last_name}</strong> <em>(Contact admin to change)</em></p>
          <p>Blood Group: <strong style={{ color: 'var(--accent-red)' }}>{user.blood_group}</strong></p>
        </div>

        {success && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number (WhatsApp)</label>
            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><MapPin size={20} /> Location Information</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Your location is securely used by the ML engine to route emergency requests to the closest donors.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Latitude</label>
                <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Longitude</label>
                <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Saving...' : 'Save Profile Updates'}
          </button>
        </form>
      </div>
    </div>
  );
}
