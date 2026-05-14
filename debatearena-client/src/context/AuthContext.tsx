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
    dispatch({ type: 'SET_USER', payload: { user, accessToken } });
  }, []);

  const clearAuth = useCallback(() => {
    setAuthToken(null);
    dispatch({ type: 'CLEAR_AUTH' });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  // On mount, try to refresh the token to see if we're already logged in
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.post('/auth/refresh');
        if (response.data && response.data.accessToken) {
          // We got a new access token, now fetch the user profile if not included
          // For now, assume the refresh response might include the user or we fetch it
          const accessToken = response.data.accessToken;
          setAuthToken(accessToken);
          
          // Fetch user profile
          const profileResponse = await api.get('/users/me'); // Assuming this endpoint exists
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
