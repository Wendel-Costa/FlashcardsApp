import { Eye, Pencil, Trash2 } from 'lucide-react'
import styles from './styles.module.css'

type DeckBlockProps = {
   deckName: String
}

export function DeckBlock(props: DeckBlockProps) {
   return (
      <div className={styles.block}>
         <p className={styles.deckName}>{props.deckName}</p>
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