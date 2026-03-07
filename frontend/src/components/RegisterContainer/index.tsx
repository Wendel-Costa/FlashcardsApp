import type React from 'react'
import styles from './styles.module.css'

type RegisterContainerProps = {
   children: React.ReactNode;
}

export function RegisterContainer({ children }: RegisterContainerProps) {
   return (
      <div className={styles.container}>
         <div className={styles.content}>
            <div className={styles.title}>Registre-se aqui</div>
            {children}
         </div>
      </div>
   )
}