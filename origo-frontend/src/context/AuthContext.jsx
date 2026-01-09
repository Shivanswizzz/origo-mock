import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MOCK_USER } from '../data/mockData';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // HARDCODED DEMO: Start unauthenticated to show Landing Page
    setIsLoading(false);

    // Bypassing real auth listener for demo
    return () => {};
  }, []);

  const fetchProfile = async (userId, email) => {
    // HARDCODED DEMO: Always return mock user
    setUser(MOCK_USER);
    setIsLoading(false);
  };

  const login = async (email, password) => {
    // HARDCODED DEMO: Simulate success
    return new Promise((resolve) => {
      setTimeout(() => {
        setSession({ user: { id: MOCK_USER.id, email } });
        setUser(MOCK_USER);
        resolve({ user: MOCK_USER });
      }, 1000);
    });
  };

  const signup = async (data) => {
    // HARDCODED DEMO: Simulate success
    return new Promise((resolve) => {
      setTimeout(() => {
        setSession({ user: { id: MOCK_USER.id, email: data.email } });
        setUser({ ...MOCK_USER, full_name: data.fullName, email: data.email });
        resolve({ user: MOCK_USER });
      }, 1000);
    });
  };

  const logout = async () => {
    // HARDCODED DEMO: Just clear state
    setUser(null);
    setSession(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
