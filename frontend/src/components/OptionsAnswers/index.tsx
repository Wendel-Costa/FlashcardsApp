import { AnswerButton } from '../AnswersButton';
import styles from './styles.module.css';

type OptionsAnswersProps = {
   daysWhenWrong: number;
   daysWhenHard: number;
   daysWhenCorrect: number;
   onWrong: () => void;
   onHard: () => void;
   onCorrect: () => void;
   disabled?: boolean;
}

export function OptionsAnswers({
   daysWhenWrong, daysWhenHard, daysWhenCorrect,
   onWrong, onHard, onCorrect, disabled = false,
}: OptionsAnswersProps) {
   return (
      <div className={styles.options}>
         <div onClick={!disabled ? onWrong : undefined} style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
            <AnswerButton type="Errado" days={daysWhenWrong} />
         </div>
         <div onClick={!disabled ? onHard : undefined} style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
            <AnswerButton type="Difícil" days={daysWhenHard} />
         </div>
         <div onClick={!disabled ? onCorrect : undefined} style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
            <AnswerButton type="Correto" days={daysWhenCorrect} />
         </div>
      </div>
   );
}