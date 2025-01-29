// src/components/PrivateRoute.tsx
import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = () => {
  // const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <div>
        <nav>
            {/* Navigation bar */}
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/logout">Logout</Link>
        </nav>

        <Outlet />
    </div>
  );
};

export default PrivateRoute;