import { CardContainer } from "../CardContainer"
import styles from './styles.module.css'

type CardAnswerProps = {
   children: React.ReactNode
}

export function CardAnswer({ children }: CardAnswerProps) {
   return (
      <CardContainer>
         <div className={styles.answerContainer}>
            <p>RESPOSTA</p>
            <div className={styles.answer}>
               {children}
            </div>
         </div>
      </CardContainer>
   )
}