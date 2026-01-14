import { AnswerButton } from '../AnswersButton'
import styles from './styles.module.css'

type OptionsAnswersProps = {
   daysWhenCorrect: number,
   daysWhenWrong: number,
   daysWhenHard: number
}

export function OptionsAnswers({ daysWhenWrong, daysWhenCorrect, daysWhenHard }: OptionsAnswersProps) {
   return (
      <div className={styles.options}>
         <AnswerButton days={daysWhenCorrect} type='Correto' />
      </div>
   )
}