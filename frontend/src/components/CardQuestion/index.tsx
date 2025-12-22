import { CardContainer } from '../CardContainer'
import styles from './styles.module.css'

type CardQuestionProps = {
   children: React.ReactNode
}

export function CardQuestion({ children }: CardQuestionProps) {
   return (
      <CardContainer>
         <div className={styles.questionContainer}>
            <p>PERGUNTA</p>
            <div className={styles.question}>
               {children}
            </div>
         </div>
      </CardContainer>
   )
}