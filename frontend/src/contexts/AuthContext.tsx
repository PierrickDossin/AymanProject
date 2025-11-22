import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  socialSignIn: (provider: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => { },
  signUp: async () => { },
  socialSignIn: async () => { },
  signOut: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user } = await api.login(email, password);
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const signUp = async (data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const { user } = await api.signup(data);
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const socialSignIn = async (provider: string) => {
    const { user } = await api.socialLogin(provider);
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, socialSignIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
