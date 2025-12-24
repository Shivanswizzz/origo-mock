import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId, email) => {
    try {
      // Fetch extensive profile data
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          college:colleges(name, domain)
        `)
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      // If profile doesn't exist yet (race condition with trigger), fall back to basic user data
      setUser(data || { id: userId, email });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  const signup = async (data) => {
    const { fullName, email, password, collegeDomain } = data;
    
    // Explicitly sign up with metdata that trigger can use
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
            full_name: fullName,
            college_domain: collegeDomain || email.split('@')[1]
        }
      }
    });
    
    if (error) throw error;
    return authData;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
