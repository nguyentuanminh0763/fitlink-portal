import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

export default function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
