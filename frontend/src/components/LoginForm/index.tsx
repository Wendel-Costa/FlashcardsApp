import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

export function LoginForm() {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const { login } = useAuth();
   const navigate = useNavigate();

   async function handleSubmit(event: FormEvent) {
      event.preventDefault();
      setError('');
      if (!username.trim() || !password.trim()) {
         setError('Preencha todos os campos');
         return;
      }
      setIsLoading(true);
      try {
         await login(username, password);
         navigate('/');
      } catch (err: any) {
         setError(err.response?.data?.message || 'Erro ao fazer login');
      } finally {
         setIsLoading(false);
      }
   }

   return (
      <form className={styles.form} onSubmit={handleSubmit}>
         <div className={styles.field}>
            <label htmlFor="username">Usuário</label>

            <input id="username" type="text" value={username}
               onChange={(e) => setUsername(e.target.value)}
               placeholder="Seu usuário" disabled={isLoading} />
         </div>

         <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <input id="password" type="password" value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Sua senha" disabled={isLoading} />
         </div>

         {error && <div className={styles.error}>{error}</div>}

         <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
         </button>

         <div className={styles.links}>
            <p className={styles.link}>Não tem conta? <Link to="/register">Cadastre-se</Link></p>

            <p className={styles.link}>Só explorar? <Link to="/guest">Modo Visitante</Link></p>
         </div>
      </form>
   );
}