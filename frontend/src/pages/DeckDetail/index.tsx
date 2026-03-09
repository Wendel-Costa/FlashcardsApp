import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainTemplate } from '../../templates/MainTemplate';
import { cardService } from '../../services/cardService';
import type { Card } from '../../models/Card';
import styles from './styles.module.css';
import { DecksHeader } from '../../components/DecksHeader';

export function DeckDetail() {
   const [cards, setCards] = useState<Card[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [editingCard, setEditingCard] = useState<Card | null>(null);
   const [editQuestion, setEditQuestion] = useState('');
   const [editAnswer, setEditAnswer] = useState('');
   const { tag } = useParams<{ tag: string }>();
   const navigate = useNavigate();
   const deckName = tag ? decodeURIComponent(tag) : '';

   useEffect(() => {
      async function fetch() {
         try {
            const all = await cardService.getCards();
            setCards(all.filter(c => c.tag === deckName));
         } catch (err) {
            console.error(err);
         } finally {
            setIsLoading(false);
         }
      }

      fetch();
   }, [deckName]);

   async function handleDelete(id: string) {
      if (!window.confirm('Deseja excluir este card?')) return;

      try {
         await cardService.deleteCard(id);
         setCards(prev => prev.filter(c => c._id !== id));
      } catch (err) {
         console.error(err);
      }
   }

   function startEditing(card: Card) {
      setEditingCard(card);
      setEditQuestion(card.question);
      setEditAnswer(card.answer);
   }

   async function handleSaveEdit() {
      if (!editingCard) return;

      try {
         await cardService.updateCard(editingCard._id, {
            question: editQuestion,
            answer: editAnswer,
         });

         setCards(prev =>
            prev.map(c =>
               c._id === editingCard._id
                  ? { ...c, question: editQuestion, answer: editAnswer }
                  : c,
            ),
         );
         setEditingCard(null);
      } catch (err) {
         console.error(err);
      }
   }

   const dueCount = cards.filter(
      c => new Date(c.nextReviewDate) <= new Date(),
   ).length;

   return (
      <MainTemplate>
         <div className={styles.page}>
            <DecksHeader>
               <div className={styles.pageHeader}>
                  <h1 className={styles.title}>
                     {deckName} ({cards.length} cards)
                  </h1>

                  <div className={styles.headerActions}>
                     {dueCount > 0 && (
                        <button
                           className={styles.reviewButton}
                           onClick={() => navigate(`/review/${tag}`)}
                        >
                           Revisar ({dueCount})
                        </button>
                     )}

                     <button
                        className={styles.addButton}
                        onClick={() => navigate('/create-card')}
                     >
                        Adicionar Card
                     </button>
                  </div>
               </div>
            </DecksHeader>

            {isLoading ? (
               <p>Carregando...</p>
            ) : cards.length === 0 ? (
               <p className={styles.empty}>Nenhum card neste baralho ainda.</p>
            ) : (
               <div>
                  {cards.map(card => (
                     <div key={card._id} className={styles.cardItem}>
                        {editingCard?._id === card._id ? (
                           <div className={styles.editForm}>
                              <input
                                 className={styles.editInput}
                                 value={editQuestion}
                                 onChange={e => setEditQuestion(e.target.value)}
                              />
                              <textarea
                                 className={styles.editInput}
                                 value={editAnswer}
                                 onChange={e => setEditAnswer(e.target.value)}
                                 rows={3}
                              />
                              <div className={styles.cardActions}>
                                 <button
                                    className={styles.saveButton}
                                    onClick={handleSaveEdit}
                                 >
                                    Salvar
                                 </button>
                                 <button
                                    className={styles.cancelButton}
                                    onClick={() => setEditingCard(null)}
                                 >
                                    Cancelar
                                 </button>
                              </div>
                           </div>
                        ) : (
                           <>
                              <div className={styles.cardText}>
                                 <p>
                                    <strong>P:</strong> {card.question}
                                 </p>
                                 <p>
                                    <strong>R:</strong> {card.answer}
                                 </p>
                              </div>
                              <p className={styles.cardMeta}>
                                 Status: {card.status} &nbsp;|&nbsp;{' '}
                                 {new Date(card.nextReviewDate) <=
                                    new Date() ? (
                                    <span className={styles.due}>
                                       Pronto para revisar
                                    </span>
                                 ) : (
                                    `Próxima revisão: ${new Date(card.nextReviewDate).toLocaleDateString('pt-BR')}`
                                 )}
                              </p>
                              <div className={styles.cardActions}>
                                 <button
                                    className={styles.editButton}
                                    onClick={() => startEditing(card)}
                                 >
                                    Editar
                                 </button>
                                 <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(card._id)}
                                 >
                                    Excluir
                                 </button>
                              </div>
                           </>
                        )}
                     </div>
                  ))}
               </div>
            )}
         </div>
      </MainTemplate>
   );
}
