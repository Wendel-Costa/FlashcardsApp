//import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
   const { isAuthenticated, isLoading } = useAuth();
   if (!isLoading) return <div className={styles.loading}>Carregando...</div>;
   if (!isAuthenticated) return 'oi' //return <Navigate to="/login" replace />; ainda irei impementar o sistema de routes
   return <>{children}</>;
}