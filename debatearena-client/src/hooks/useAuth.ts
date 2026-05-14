import { useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { api } from '../api/apiClient';
import { connectSocket, disconnectSocket } from '../socket/socket';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuth = () => {
  const { user, accessToken, isLoading, setUser, clearAuth } = useAuthContext();
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, accessToken: token } = response.data;
      
      setUser(userData, token);
      connectSocket(token);
      
      toast.success(`Welcome back, ${userData.username}!`);
      navigate('/home');
    } catch (error: any) {
      const message = error.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      throw error;
    }
  }, [setUser, navigate]);

  const register = useCallback(async (data: any) => {
    try {
      const response = await api.post('/auth/register', data);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
      return response.data;
    } catch (error: any) {
      const message = error.message || 'Registration failed.';
      toast.error(message);
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuth();
      disconnectSocket();
      navigate('/');
      toast.info('Logged out successfully.');
    }
  }, [clearAuth, navigate]);

  const updateProfile = useCallback(async (data: { username?: string; bio?: string; avatarUrl?: string }) => {
    try {
      const response = await api.patch('/users/me', data);
      const updatedUser = response.data.data;
      setUser(updatedUser, accessToken); // Update context with same token
      toast.success('Profile updated successfully!');
      return updatedUser;
    } catch (error: any) {
      const message = error.message || 'Failed to update profile.';
      toast.error(message);
      throw error;
    }
  }, [accessToken, setUser]);

  return {
    user,
    accessToken,
    isLoggedIn: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };
};
