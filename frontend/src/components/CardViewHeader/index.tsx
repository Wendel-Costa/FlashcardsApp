import { ArrowLeft } from 'lucide-react';
import styles from './styles.module.css';

type CardViewHeaderProps = {
   deckName: string;
   progress: string;
   onBack: () => void;
}

export function CardViewHeader({ deckName, progress, onBack }: CardViewHeaderProps) {
   return (
      <div className={styles.header}>
         <button onClick={onBack} className={styles.back}><ArrowLeft /> Voltar</button>
         <div className={styles.title}>{deckName}</div>
         <span className={styles.progress}>{progress}</span>
      </div>
   );
}