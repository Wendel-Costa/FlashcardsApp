import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

export function RegisterForm() {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const { register } = useAuth();
   const navigate = useNavigate();

   async function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setError('');
      if (!username.trim() || !password.trim()) {
         setError('Preencha todos os campos');
         return;
      }

      if (password !== confirmPassword) {
         setError('As senhas não coincidem');
         return;
      }

      if (password.length < 6) {
         setError('A senha deve ter pelo menos 6 caracteres');
         return;
      }

      setIsLoading(true);

      try {
         await register(username, password);
         navigate('/login');
      } catch (err: any) {
         setError(err.response?.data?.message || 'Erro ao criar conta');
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
               placeholder="Escolha um nome de usuário" disabled={isLoading} />
         </div>

         <div className={styles.field}>
            <label htmlFor="password">Senha</label>

            <input id="password" type="password" value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Crie uma senha (min. 6 caracteres)" disabled={isLoading} />
         </div>
         <div className={styles.field}>
            <label htmlFor="confirm">Confirmar Senha</label>

            <input id="confirm" type="password" value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               placeholder="Repita a senha" disabled={isLoading} />
         </div>

         {error && <p className={styles.error}>{error}</p>}

         <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
         </button>

         <p className={styles.link}>Já tem conta? <Link to="/login">Fazer login</Link></p>
      </form>
   );
}