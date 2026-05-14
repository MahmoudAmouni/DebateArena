import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { api, setAuthToken } from '../api/apiClient';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'SET_USER'; payload: { user: User; accessToken: string } }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isLoading: false,
      };
    case 'CLEAR_AUTH':
      return {
        ...state,
        user: null,
        accessToken: null,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  setUser: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setUser = useCallback((user: User, accessToken: string) => {
    setAuthToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
    dispatch({ type: 'SET_USER', payload: { user, accessToken } });
  }, []);

  const clearAuth = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem('accessToken');
    dispatch({ type: 'CLEAR_AUTH' });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  // On mount, try to restore session or refresh
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('accessToken');
      
      if (savedToken) {
        setAuthToken(savedToken);
        try {
          const profileResponse = await api.get('/users/me');
          if (profileResponse.data) {
            setUser(profileResponse.data, savedToken);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn('Session restoration failed, trying refresh...');
        }
      }

      try {
        const response = await api.post('/auth/refresh');
        if (response.data && response.data.accessToken) {
          const accessToken = response.data.accessToken;
          setAuthToken(accessToken);
          localStorage.setItem('accessToken', accessToken);
          
          const profileResponse = await api.get('/users/me');
          if (profileResponse.data) {
            setUser(profileResponse.data, accessToken);
          } else {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, clearAuth, setLoading]);

  return (
    <AuthContext.Provider value={{ ...state, setUser, clearAuth, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
