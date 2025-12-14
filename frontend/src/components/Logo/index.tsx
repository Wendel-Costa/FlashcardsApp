import styles from './styles.module.css'

export function Logo() {
   return (
      <div className={styles.header}>
         <div className={styles.logo}>
            <a className={styles.logoLink} href='#'>
               <span>FlashApp</span>
            </a>
         </div>
      </div>)
}