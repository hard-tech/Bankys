// hooks/useAuth.ts
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO: Code à supprimer
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  // Logique d'authentification
  return { isAuthenticated, user };
};
