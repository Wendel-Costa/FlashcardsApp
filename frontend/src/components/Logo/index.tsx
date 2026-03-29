import styles from './styles.module.css'
import logo from '../../assets/logo.svg'

export function Logo() {
   return (
      <div className={styles.header}>
         <div className={styles.logo}>
            <img src={logo} alt="Logo" />
            <span>FlashApp</span>
         </div>
      </div>)
}