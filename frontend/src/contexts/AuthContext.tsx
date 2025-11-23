import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username,
          firstName: session.user.user_metadata?.firstName || session.user.user_metadata?.first_name,
          lastName: session.user.user_metadata?.lastName || session.user.user_metadata?.last_name,
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username,
          firstName: session.user.user_metadata?.firstName || session.user.user_metadata?.first_name,
          lastName: session.user.user_metadata?.lastName || session.user.user_metadata?.last_name,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username,
        firstName: data.user.user_metadata?.firstName,
        lastName: data.user.user_metadata?.lastName,
      });
    }
  };

  const signUp = async (data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
    });

    if (error) throw error;

    if (authData.user) {
      setUser({
        id: authData.user.id,
        email: authData.user.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    }
  };

  const socialSignIn = async (provider: string) => {
    // This is now handled directly in the Login/SignUp components
    // This function is kept for compatibility
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, socialSignIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
