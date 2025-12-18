import styles from './styles.module.css'

type HomeTitleProps = {
   userName: String
}

export function HomeTitle({ userName }: HomeTitleProps) {
   return (
      <div className={styles.content}>
         <h1 className={styles.title}>Meus Baralhos</h1>
         <p className={styles.name}>Bem vindo {userName}!</p>
      </div>
   )
}