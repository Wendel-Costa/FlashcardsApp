import styles from './styles.module.css'

type OptionsAnswersProps = {
   DaysWhenGood: number,
   DaysWhenBad: number
}

export function OptionsAnswers({ DaysWhenBad, DaysWhenGood }: OptionsAnswersProps) {
   return (
      <div className={styles.options}>
         {DaysWhenBad} {DaysWhenGood}
      </div>
   )
}