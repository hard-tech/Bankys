
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LoginCredentials, RegisterCredentials, User } from '../../type/auth.types';
import api from '../api/axios.config';


export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      useLocalStorage('token', token);
      return user;
    } catch (error) {
      throw error;
    }
  },

  async register(credentials: RegisterCredentials) {
    try {
      const response = await api.post('/auth/register', credentials);
      const { token, user } = response.data;
      useLocalStorage('token', token);
      return user;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};