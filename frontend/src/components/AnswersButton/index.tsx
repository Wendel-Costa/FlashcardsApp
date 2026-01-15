import styles from './styles.module.css'

type AnswerButtonProps = {
   days: number
   type: "Correto" | "Errado" | "Difícil"
}

export function AnswerButton({ days, type }: AnswerButtonProps) {
   return (
      <div className={styles.button}>
         <div className={styles.text}>
            <span className={styles.type}>{type}</span>
            <span className={styles.days}>{days}dias</span>
         </div>
      </div>

   )
}