import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (role === 'admin') {
      try {
        const { default: api } = await import('../../services/api');
        const response = await api.post('/admin-login/', {
          username: email,
          password: password
        });
        
        if (response.data.success) {
          window.location.href = 'http://127.0.0.1:8000/admin/';
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Admin login failed');
        setLoading(false);
      }
      return;
    }

    const result = await login(email, role);
    if (result.success) {
      navigate(`/${role}/dashboard`);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Activity size={48} color="var(--accent-red)" />
          <h2 style={{ marginTop: '1rem' }}>Welcome Back</h2>
          <p>Sign in to Match4Life</p>
        </div>

        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>I am a...</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="donor">Blood Donor</option>
              <option value="hospital">Hospital / Clinic</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              {role === 'admin' ? 'Username' : 'Email Address'}
            </label>
            <input 
              type={role === 'admin' ? 'text' : 'email'} 
              required
              placeholder={role === 'admin' ? "e.g. demo_admin" : "e.g. contact@citygeneral.com"}
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your secure password"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
            <p style={{ marginBottom: '0.5rem' }}>Don't have an account?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link to="/register/donor">Register as Donor</Link>
              <Link to="/register/hospital">Register Hospital</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
