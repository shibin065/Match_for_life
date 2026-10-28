import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User } from 'lucide-react';

export default function Layout({ children }) {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ background: '#fff', borderBottom: '1px solid var(--border-glass)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
          <Heart color="var(--accent-red)" fill="var(--accent-red)" />
          Match4Life
        </Link>

        {user ? (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {userType === 'donor' && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/donor/dashboard" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Dashboard</Link>
                <Link to="/donor/profile" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>My Profile</Link>
              </div>
            )}
            
            {userType === 'hospital' && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/hospital/dashboard" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Dashboard</Link>
                <Link to="/hospital/requests/create" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Create Request</Link>
              </div>
            )}

            <div style={{ borderLeft: '1px solid #ddd', height: '24px' }}></div>

            <span style={{ fontWeight: 500 }}>
              <User size={16} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
              {user.first_name || user.name}
            </span>
            <button onClick={handleLogout} className="btn-primary" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Login</Link>
          </div>
        )}
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
