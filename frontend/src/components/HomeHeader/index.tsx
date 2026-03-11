import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';
import { DefaultHeader } from '../DefaultHeader';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export function HomeHeader() {
   const { logout } = useAuth();
   const navigate = useNavigate();
   const [menuOpen, setMenuOpen] = useState(false);

   function handleLogout() {
      logout();
      navigate('/login');
   }


   return (
      <DefaultHeader>
         <div className={styles.homeHeader}>
            <button onClick={() => navigate('/review')} className={styles.buttonCard}>Revisar Tudo</button>
            <button onClick={() => navigate('/create-card')} className={styles.buttonCard}>Criar Card</button>
            <button onClick={() => navigate('/create-deck')} className={styles.buttonCardAI}>Gerar Deck IA</button>
            <button onClick={handleLogout} className={styles.buttonOut}>Sair</button>
         </div>

         <div className={styles.mobileMenuButton}>
            <button onClick={() => setMenuOpen(!menuOpen)}>
               <Menu />
            </button>
         </div>

         {menuOpen && (
            <div className={styles.mobileMenu}>
               <button onClick={() => navigate('/review')} className={styles.buttonCard}>Revisar Tudo</button>
               <button onClick={() => navigate('/create-card')} className={styles.buttonCard}>Criar Card</button>
               <button onClick={() => navigate('/create-deck')} className={styles.buttonCardAI}>Gerar Deck IA</button>
               <button onClick={handleLogout} className={styles.buttonOut}>Sair</button>
            </div>
         )}
      </DefaultHeader>
   )
}