import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainTemplate } from '../../templates/MainTemplate';
import { guestService } from '../../services/guestService';
import styles from './styles.module.css';
import { DecksHeader } from '../../components/DecksHeader';

type DetailLevel = 'low' | 'medium' | 'high';
type Tone = 'formal' | 'informal' | 'concise' | 'detailed';

export function GuestCardCreate() {
   const [question, setQuestion] = useState('');
   const [tag, setTag] = useState('');
   const [detailLevel, setDetailLevel] = useState<DetailLevel>('medium');
   const [tone, setTone] = useState<Tone>('formal');
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const [result, setResult] = useState<{ question: string; answer: string } | null>(null);
   const navigate = useNavigate();

   async function handleSubmit(e: FormEvent) {
      e.preventDefault();

      setError('');

      if (!question.trim()) { setError('Digite o tema do card'); return; }
      setIsLoading(true);

      try {
         const response = await guestService.generateCard({ question, tag: tag || 'Geral', detailLevel, tone });
         setResult(response.card);
      } catch (err: any) {
         setError(err.response?.data?.message || 'Erro ao gerar. Tente novamente.');
      } finally { setIsLoading(false); }
   }

   return (
      <MainTemplate>
         <div className={styles.page}>
            <DecksHeader>
               <div className={styles.header}>
                  <h1 className={styles.title}>Gerar Card com IA</h1>

                  <span className={styles.badge}>Modo visitante — card não será salvo</span>
               </div>
            </DecksHeader>
            {!result ? (
               <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.field}>
                     <label>Tema do Card
                        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ex: O que é fotossíntese?" disabled={isLoading} />
                     </label>
                  </div>

                  <div className={styles.field}>
                     <label>Categoria (opcional)
                        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Ex: Biologia" disabled={isLoading} />
                     </label>
                  </div>

                  <div className={styles.field}>
                     <label>Nível de Detalhe
                        <select value={detailLevel} onChange={(e) => setDetailLevel(e.target.value as DetailLevel)} disabled={isLoading}>
                           <option value="low">Baixo</option>
                           <option value="medium">Médio</option>
                           <option value="high">Alto</option>
                        </select>
                     </label>
                  </div>

                  <div className={styles.field}>
                     <label>Tom
                        <select value={tone} onChange={(e) => setTone(e.target.value as Tone)} disabled={isLoading}>
                           <option value="formal">Formal</option>
                           <option value="informal">Informal</option>
                           <option value="concise">Conciso</option>
                           <option value="detailed">Detalhado</option>
                        </select>
                     </label>
                  </div>

                  {error && <p className={styles.error}>{error}</p>}

                  <button type="submit" className={styles.submitButton} disabled={isLoading}>
                     {isLoading ? 'Gerando...' : 'Gerar Card'}
                  </button>
               </form>
            ) : (
               <div className={styles.result}>
                  <div className={styles.resultCard}>
                     <p className={styles.resultLabel}>PERGUNTA</p>

                     <p className={styles.resultQuestion}>{result.question}</p>

                     <hr className={styles.divider} />

                     <p className={styles.resultLabel}>RESPOSTA</p>

                     <p className={styles.resultAnswer}>{result.answer}</p>
                  </div>

                  <div className={styles.resultActions}>
                     <button className={styles.retryButton} onClick={() => setResult(null)}>Gerar Outro</button>
                     <button className={styles.registerButton} onClick={() => navigate('/register')}>Salvar com Conta</button>
                  </div>
               </div>
            )}
         </div>
      </MainTemplate>
   );
}