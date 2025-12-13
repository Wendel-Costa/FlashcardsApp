import { Lightbulb } from 'lucide-react'
import styles from './styles.module.css'

export function Header() {
   return (
      <div className={styles.logo}>
         <a className={styles.logoLink} href='#'>
            <Lightbulb />
            <span>PomoTech</span>
         </a>
      </div>)
}