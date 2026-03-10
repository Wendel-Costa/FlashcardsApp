import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainTemplate } from '../../templates/MainTemplate';
import { guestService } from '../../services/guestService';
import styles from './styles.module.css';
import { DecksHeader } from '../../components/DecksHeader';

interface GeneratedCard { question: string; answer: string; }

export function GuestDeckCreate() {
   const [topic, setTopic] = useState('');
   const [count, setCount] = useState(5);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const [cards, setCards] = useState<GeneratedCard[]>([]);
   const [flipped, setFlipped] = useState<Set<number>>(new Set());
   const navigate = useNavigate();

   async function handleSubmit(e: FormEvent) {
      e.preventDefault();

      setError('');

      if (!topic.trim()) { setError('Digite o tópico'); return; }
      setIsLoading(true);

      try {
         const response = await guestService.generateDeck({ topic, count });
         setCards(response.cards);
         setFlipped(new Set());
      } catch (err: any) {
         setError(err.response?.data?.message || 'Erro ao gerar. Tente novamente.');
      } finally { setIsLoading(false); }
   }

   function toggleFlip(i: number) {
      setFlipped((prev) => {
         const next = new Set(prev);
         next.has(i) ? next.delete(i) : next.add(i);
         return next;
      });
   }

   return (
      <MainTemplate>
         <div className={styles.page}>
            <DecksHeader>
               <div className={styles.header}>
                  <h1 className={styles.title}>Gerar Deck com IA</h1>

                  <span className={styles.badge}>Modo visitante — cards não serão salvos</span>
               </div>
            </DecksHeader>

            {cards.length === 0 ? (
               <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.field}>
                     <label>Tópico
                        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: Capitais da América do Sul" disabled={isLoading} />
                     </label>
                  </div>
                  <div className={styles.field}>
                     <label>Quantidade (1–10)
                        <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} min={1} max={10} disabled={isLoading} />
                     </label>
                  </div>
                  {error && <p className={styles.error}>{error}</p>}
                  <button type="submit" className={styles.submitButton} disabled={isLoading}>
                     {isLoading ? 'Gerando deck...' : 'Gerar Deck'}
                  </button>
               </form>
            ) : (
               <>
                  <h2 className={styles.resultTitle}>{cards.length} cards sobre "{topic}"</h2>
                  <p className={styles.hint}>Clique em um card para ver a resposta</p>
                  <div className={styles.grid}>
                     {cards.map((card, i) => (
                        <div
                           key={i}
                           className={`${styles.flashcard} ${flipped.has(i) ? styles.flashcardFlipped : ''}`}
                           onClick={() => toggleFlip(i)}
                        >
                           <p className={styles.flashcardLabel}>{flipped.has(i) ? 'RESPOSTA' : 'PERGUNTA'}</p>
                           <p className={styles.flashcardText}>{flipped.has(i) ? card.answer : card.question}</p>
                        </div>
                     ))}
                  </div>
                  <div className={styles.actions}>
                     <button className={styles.retryButton} onClick={() => { setCards([]); setTopic(''); }}>Gerar Novo Deck</button>
                     <button className={styles.registerButton} onClick={() => navigate('/register')}>Salvar com Conta</button>
                  </div>
               </>
            )}
         </div>
      </MainTemplate>
   );
}