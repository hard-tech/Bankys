import axios from 'axios';
import { endpoints } from './api/endpoints';

const BASE_URL = import.meta.env.VITE_API_URL;

export const apiService = {
  async get(endpoint: string) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${BASE_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
