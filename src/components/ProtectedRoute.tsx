// frontend/src/components/ProtectedRoute.tsx

import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';
import { AdminNavbar } from './AdminNavbar';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login page.');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>
  <AdminNavbar />
  {children}
  </>;
};

export { ProtectedRoute };