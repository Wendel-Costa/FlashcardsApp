import type React from 'react'
import styles from './styles.module.css'

type LoginContainerProps = {
   children: React.ReactNode;
}

export function LoginContainer({ children }: LoginContainerProps) {
   return (
      <div className={styles.container}>
         <div className={styles.content}>
            <div className={styles.title}>Faça seu login</div>
            {children}
         </div>
      </div>
   )
}