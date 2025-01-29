// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideBar from './SideBar';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Affiche un indicateur de chargement pendant la vérification
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
        <SideBar />
        <Outlet />
    </div>
  );
};

export default PrivateRoute;