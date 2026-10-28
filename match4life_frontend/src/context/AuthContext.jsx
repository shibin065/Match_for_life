import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'donor' or 'hospital'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted login
    const storedUser = localStorage.getItem('match4life_user');
    const storedType = localStorage.getItem('match4life_userType');
    
    if (storedUser && storedType && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
        setUserType(storedType);
      } catch (e) {
        localStorage.removeItem('match4life_user');
        localStorage.removeItem('match4life_userType');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, type) => {
    try {
      // Simulate authentication by fetching users and matching email
      // Since backend doesn't have passwords/tokens yet, this is a prototype auth
      const endpoint = type === 'donor' ? 'donors' : 'hospitals';
      const res = await api.get(`/${endpoint}/`);
      
      const matchedUser = res.data.find(u => u.email === email);
      
      if (matchedUser) {
        setUser(matchedUser);
        setUserType(type);
        localStorage.setItem('match4life_user', JSON.stringify(matchedUser));
        localStorage.setItem('match4life_userType', type);
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials or user not found' };
      }
    } catch (err) {
      return { success: false, message: 'Server error during login' };
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('match4life_user');
    localStorage.removeItem('match4life_userType');
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
