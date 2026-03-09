import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainTemplate } from '../../templates/MainTemplate';
import { cardService } from '../../services/cardService';
import type { Card } from '../../models/Card';
import styles from './styles.module.css';
import { ArrowLeft } from 'lucide-react';

export function CreateDeck() {
   const [topic, setTopic] = useState('');
   const [tag, setTag] = useState('');
   const [count, setCount] = useState(5);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const [generatedCards, setGeneratedCards] = useState<Card[]>([]);
   const navigate = useNavigate();

   async function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setError('');

      if (!topic.trim() || !tag.trim()) { setError('Preencha o tópico e o nome do baralho'); return; }

      if (count < 1 || count > 20) { setError('Quantidade deve ser entre 1 e 20'); return; }

      setIsLoading(true);

      try {
         const response = await cardService.generateDeckByAI({ topic, tag, count });
         setGeneratedCards(response.cards);
      } catch (err: any) {
         console.log(err);
         setError('Erro ao gerar deck');
      } finally { setIsLoading(false); }
   }

   if (generatedCards.length > 0) {
      return (
         <MainTemplate>
            <div className={styles.resultPage}>
               <h2 className={styles.successTitle}> {generatedCards.length} cards criados no baralho "{tag}"!</h2>

               <div className={styles.cardsList}>
                  {generatedCards.map((card, i) => (
                     <div key={card._id || i} className={styles.cardPreview}>
                        <p><strong>P:</strong> {card.question}</p>
                        <p><strong>R:</strong> {card.answer}</p>
                     </div>
                  ))}
               </div>

               <div className={styles.actions}>
                  <button className={`${styles.actionButton} ${styles.actionPrimary}`} onClick={() => navigate(`/deck/${encodeURIComponent(tag)}`)}>Ver Baralho</button>
                  <button className={`${styles.actionButton} ${styles.actionSecondary}`} onClick={() => { setGeneratedCards([]); setTopic(''); setTag(''); setCount(5); }}>Criar Outro</button>
                  <button className={`${styles.actionButton} ${styles.actionSecondary}`} onClick={() => navigate('/')}>Ir para Home</button>
               </div>
            </div>
         </MainTemplate>
      );
   }

   return (
      <MainTemplate>
         <div className={styles.page}>
            <div className={styles.header}>
               <button className={styles.back} onClick={() => navigate('/')}><ArrowLeft /> Voltar</button>

               <h1 className={styles.title}>Criar Deck com IA</h1>
            </div>

            <p className={styles.subtitle}>Gere um baralho completo automaticamente sobre qualquer tema.</p>

            <form className={styles.form} onSubmit={handleSubmit}>
               <div className={styles.field}><label>Tópico<input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: Capitais do mundo, Tabela periódica..." disabled={isLoading} /></label></div>
               <div className={styles.field}><label>Nome do Baralho<input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Ex: Geografia" disabled={isLoading} /></label></div>
               <div className={styles.field}><label>Quantidade de Cards (1–20)<input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} min={1} max={20} disabled={isLoading} /></label></div>

               {error && <p className={styles.error}>{error}</p>}

               <button type="submit" className={styles.submitButton} disabled={isLoading}>{isLoading ? 'Gerando deck...' : 'Gerar Deck'}</button>
            </form>
         </div>
      </MainTemplate>
   );
}