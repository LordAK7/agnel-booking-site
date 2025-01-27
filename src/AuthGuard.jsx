import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AuthGuard; 