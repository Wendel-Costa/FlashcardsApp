import { Logo } from '../Logo'
import styles from './styles.module.css'

type DefaultHeaderProps = {
   children: React.ReactNode
}

export function DefaultHeader({ children }: DefaultHeaderProps) {
   return (
      <div className={styles.defaultHeader}>
         <Logo />

         {children}
      </div>
   )
}