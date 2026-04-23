import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './common/Loading';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { userInfo, loading } = useAuth();

  if (loading) {
    return <Loading text="Oturum kontrol ediliyor..." />;
  }

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userInfo.user.role)
  ) {
    return <Navigate to="/menu" replace />;
  }

  return children;
};

export default ProtectedRoute;