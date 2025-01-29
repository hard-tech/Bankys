// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { constants } from '../utils/constants';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Affiche un indicateur de chargement pendant la vérification
  }

  if (!isAuthenticated) {
    return <Navigate to={constants.ROUTES.LOGIN} replace />;
  }

  return (
    <div className='w-full flex items-center'>
      <Outlet />
    </div>
  );
};

export default PrivateRoute;