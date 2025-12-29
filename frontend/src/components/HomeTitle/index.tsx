import styles from './styles.module.css'

type HomeTitleProps = {
   userName: String
}

export function HomeTitle({ userName }: HomeTitleProps) {
   return (
      <div className={styles.content}>
         <h1 className={styles.title}>Meus Baralhos</h1>
         <div className={styles.name}>Bem vindo {userName}!</div>
      </div>
   )
}