import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userInfo, loading } = useAuth();

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userInfo.user.role !== 'admin') {
    return <Navigate to="/menu" replace />;
  }

  return children;
};

export default ProtectedRoute;