import { Eye, Pencil, Trash2 } from 'lucide-react'
import styles from './styles.module.css'

type DeckBlockProps = {
   deckName: string;
   totalCards: number;
   dueCards: number;
   onClick: () => void;
}

export function DeckBlock({ deckName, totalCards, dueCards, onClick }: DeckBlockProps) {
   return (
      <div className={styles.block} onClick={onClick}>
         <div className={styles.deckName}>{deckName}</div>
         <div className={styles.cardsRemaining}>{totalCards} {totalCards === 1 ? 'card total' : 'cards totais'}</div>
         {dueCards > 0 && <div className={styles.due}>{dueCards} para revisar</div>}
         <div className={styles.buttonsDiv}>
            <a href="" className={styles.button}>
               <Eye />
            </a>
            <a href="" className={styles.button}>
               <Pencil />
            </a>
            <a href="" className={styles.buttonTrash}>
               <Trash2 />
            </a>
         </div>
      </div>
   )
}