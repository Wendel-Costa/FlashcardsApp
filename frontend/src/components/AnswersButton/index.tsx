import styles from './styles.module.css'

type AnswerButtonProps = {
   days: number
   type: "Correto" | "Errado" | "Difícil"
}

export function AnswerButton({ days, type }: AnswerButtonProps) {
   return (
      <div className={styles.button}>
         {type} {days}
      </div>
   )
}