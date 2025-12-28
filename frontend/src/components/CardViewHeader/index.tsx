import { ArrowLeft } from 'lucide-react'
import styles from './styles.module.css'

type CardViewHeaderProps = {
   deckName: string
}

export function CardViewHeader({ deckName }: CardViewHeaderProps) {
   return (
      <div className={styles.cardViewHeader}>
         <div className={styles.return}>
            <ArrowLeft />
            Voltar
         </div>
         <div className={styles.deckName}>
            <div className={styles.deckText}>
               {deckName}
            </div>
         </div>
      </div>
   )
}