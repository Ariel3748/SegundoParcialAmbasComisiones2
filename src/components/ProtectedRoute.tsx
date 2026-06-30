import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Cargando sesión...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
