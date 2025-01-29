import { LoginCredentials, RegisterCredentials, User } from '../../type/auth.types';
import api from '../api/axios.config';
import { endpoints } from '../api/endpoints';


export const authService = {
  async login(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await api.post(endpoints.auth.login, credentials);
      const { token } = response.data;
      window.localStorage.setItem('token', token);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error); // Rejette la promesse avec l'erreur
    }
  },

  async register(credentials: RegisterCredentials): Promise<void> {
    try {
      await api.post(endpoints.auth.register, credentials);
      return Promise.resolve(); // Résout la promesse
    } catch (error) {
      return Promise.reject(error); // Rejette la promesse avec l'erreur
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
      
      const response = await api.get(endpoints.auth.me);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};