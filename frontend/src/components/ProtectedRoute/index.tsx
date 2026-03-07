//import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
   const { isAuthenticated, isLoading } = useAuth();
   if (isLoading) return <div className={styles.loading}>Carregando...</div>;
   if (!isAuthenticated) return <div>oi</div>;//return <Navigate to="/login" replace />; deixarei assim por enquanto
   return <>{children}</>;
}