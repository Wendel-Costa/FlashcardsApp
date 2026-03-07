import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextData {
   username: string | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   login: (username: string, password: string) => Promise<void>;
   register: (username: string, password: string) => Promise<void>;
   logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [username, setUsername] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const token = localStorage.getItem('@flashcards:token');
      const storedUsername = localStorage.getItem('@flashcards:username');
      if (token && storedUsername) {
         try {
            // Decodifica o payload do JWT sem biblioteca externa
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 > Date.now()) {
               setUsername(storedUsername);
            } else {
               logout();
            }
         } catch {
            logout();
         }
      }
      setIsLoading(false);
   }, []);

   async function login(username: string, password: string) {
      const response = await authService.login({ username, password });
      localStorage.setItem('@flashcards:token', response.token);
      localStorage.setItem('@flashcards:username', username);
      setUsername(username);
   }

   async function register(username: string, password: string) {
      await authService.register({ username, password });
   }

   function logout() {
      localStorage.removeItem('@flashcards:token');
      localStorage.removeItem('@flashcards:username');
      setUsername(null);
   }

   return (
      <AuthContext.Provider value={{ username, isAuthenticated: !!username, isLoading, login, register, logout }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
   return context;
}