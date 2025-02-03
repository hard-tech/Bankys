import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth/auth.service';
import { User } from '../type/auth.types';
import { Account } from '../type/common.types';
import api from '../services/api/axios.config';
import { endpoints } from '../services/api/endpoints';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  isLoading: boolean;  // Ajout de isLoading
  user: User | null;
  accounts: Account[] | null;
  refreshAccounts: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);  // Nouvel état isLoading
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  const fetchAccounts = async () => {
    setIsLoading(true);  // Début du chargement
    try {
      const response = await api.get(endpoints.accounts.getAll);
      setAccounts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des comptes:", error);
    } finally {
      setIsLoading(false);  // Fin du chargement
    }
  };

  const refreshAccounts = async () => {
    await fetchAccounts();
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setIsLoading(true);  // Début du chargement
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      if (currentUser) {
        await fetchAccounts();
      }
      setLoading(false);
      setIsLoading(false);  // Fin du chargement
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, isLoading, user, accounts, refreshAccounts }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};