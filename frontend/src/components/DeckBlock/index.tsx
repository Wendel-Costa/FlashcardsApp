import { useState } from 'react';
import { Eye, Pencil, Trash2, Check, X } from 'lucide-react';
import styles from './styles.module.css';

type DeckBlockProps = {
   deckName: string;
   totalCards: number;
   dueCards: number;
   onReview: () => void;
   onView: () => void;
   onRename: (newName: string) => Promise<void>;
   onDelete: () => void;
}

export function DeckBlock({ deckName, totalCards, dueCards, onReview, onView, onRename, onDelete }: DeckBlockProps) {
   const [isRenaming, setIsRenaming] = useState(false);
   const [newName, setNewName] = useState(deckName);

   async function handleRenameConfirm(e: React.MouseEvent) {
      e.stopPropagation();
      if (newName.trim() && newName.trim() !== deckName) {
         await onRename(newName.trim());
      }
      setIsRenaming(false);
   }

   function handleRenameCancel(e: React.MouseEvent) {
      e.stopPropagation();
      setNewName(deckName);
      setIsRenaming(false);
   }

   return (
      <div className={styles.block} onClick={!isRenaming ? onReview : undefined}>
         {isRenaming ? (
            <div className={styles.renameArea} onClick={(e) => e.stopPropagation()}>
               <input
                  className={styles.renameInput}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') handleRenameConfirm(e as any);
                     if (e.key === 'Escape') handleRenameCancel(e as any);
                  }}
                  autoFocus
               />
               <div className={styles.renameActions}>
                  <button className={styles.confirmButton} onClick={handleRenameConfirm}><Check /></button>
                  <button className={styles.cancelButton} onClick={handleRenameCancel}><X /></button>
               </div>
            </div>
         ) : (
            <div className={styles.deckName}>{deckName}</div>
         )}

         <div className={styles.cardsRemaining}>
            {totalCards} {totalCards === 1 ? 'card total' : 'cards totais'}
         </div>
         {dueCards > 0 && <div className={styles.due}>{dueCards} para revisar</div>}

         <div className={styles.buttonsDiv}>
            <button className={styles.button} title="Ver cards" onClick={(e) => { e.stopPropagation(); onView(); }}>
               <Eye />
            </button>
            <button className={styles.button} title="Renomear deck" onClick={(e) => { e.stopPropagation(); setIsRenaming(true); }}>
               <Pencil />
            </button>
            <button className={styles.buttonTrash} title="Excluir deck" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
               <Trash2 />
            </button>
         </div>
      </div>
   );
}