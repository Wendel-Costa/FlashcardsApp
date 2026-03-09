import type React from 'react'
import styles from './styles.module.css'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

type DecksHeaderProps = {
   children: React.ReactNode,
}

export function DecksHeader({ children }: DecksHeaderProps) {
   const navigate = useNavigate();

   return (
      <div className={styles.header}>
         <button className={styles.back} onClick={() => navigate('/')}><ArrowLeft /> Voltar</button>

         {children}
      </div>
   )
}