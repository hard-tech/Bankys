import { LoginCredentials, RegisterCredentials, User } from '../../type/auth.types';
import api from '../api/axios.config';


export const authService = {
  async login(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;
      window.localStorage.setItem('token', token);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error); // Rejette la promesse avec l'erreur
    }
  },

  async register(credentials: RegisterCredentials): Promise<void> {
    try {
      await api.post('/auth/register', credentials);
      return Promise.resolve(); // Résout la promesse
    } catch (error) {
      return Promise.reject(error); // Rejette la promesse avec l'erreur
    }
  },

  async logout() {
    try {
      localStorage.removeItem('token');
      window.location.reload();
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