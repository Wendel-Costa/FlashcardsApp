import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainTemplate } from '../../templates/MainTemplate';
import { cardService } from '../../services/cardService';
import styles from './styles.module.css';
import { ArrowLeft } from 'lucide-react';

type Mode = 'manual' | 'ai';
type DetailLevel = 'low' | 'medium' | 'high';
type Tone = 'formal' | 'informal' | 'concise' | 'detailed';

export function CreateCard() {
   const [mode, setMode] = useState<Mode>('manual');
   const [question, setQuestion] = useState('');
   const [answer, setAnswer] = useState('');
   const [tag, setTag] = useState('');
   const [detailLevel, setDetailLevel] = useState<DetailLevel>('medium');
   const [tone, setTone] = useState<Tone>('formal');
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const navigate = useNavigate();

   async function handleManualSubmit(e: FormEvent) {
      e.preventDefault();
      setError('');

      if (!question.trim() || !answer.trim() || !tag.trim()) { setError('Preencha todos os campos'); return; }
      setIsLoading(true);

      try {
         await cardService.createCard({ question, answer, tag });
         setSuccess('Card criado com sucesso!');
         setTimeout(() => navigate('/'), 1500);
      } catch (err: any) {
         console.log(err);
         setError('Erro ao criar card');
      } finally { setIsLoading(false); }
   }

   async function handleAISubmit(e: FormEvent) {
      e.preventDefault();
      setError('');

      if (!question.trim() || !tag.trim()) { setError('Preencha o tema e o baralho'); return; }
      setIsLoading(true);

      try {
         await cardService.generateCardByAI({ question, tag, detailLevel, tone });
         setSuccess('Card gerado e salvo com sucesso!');
         setTimeout(() => navigate('/'), 1500);
      } catch (err: any) {
         setError(err.response?.data?.message || 'Erro ao gerar card com IA');
      } finally { setIsLoading(false); }
   }

   return (
      <MainTemplate>
         <div className={styles.page}>
            <div className={styles.header}>
               <button className={styles.back} onClick={() => navigate('/')}><ArrowLeft /> Voltar</button>

               <h1 className={styles.title}>Criar Card</h1>
            </div>

            <div className={styles.tabs}>
               <button className={`${styles.tab} ${mode === 'manual' ? styles.tabActive : ''}`} onClick={() => setMode('manual')}>Manual</button>
               <button className={`${styles.tab} ${mode === 'ai' ? styles.tabActive : ''}`} onClick={() => setMode('ai')}>Gerar com IA</button>
            </div>

            {mode === 'manual' ? (
               <form className={styles.form} onSubmit={handleManualSubmit}>
                  <div className={styles.field}><label>Pergunta<input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Digite a pergunta" disabled={isLoading} /></label></div>
                  <div className={styles.field}><label>Resposta<textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Digite a resposta" disabled={isLoading} rows={4} /></label></div>
                  <div className={styles.field}><label>Baralho<input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Ex: Matemática" disabled={isLoading} /></label></div>

                  {error && <p className={styles.error}>{error}</p>}

                  {success && <p className={styles.success}>{success}</p>}

                  <button type="submit" className={styles.submitButton} disabled={isLoading}>{isLoading ? 'Criando...' : 'Criar Card'}</button>
               </form>
            ) : (
               <form className={styles.form} onSubmit={handleAISubmit}>
                  <div className={styles.field}><label>Tema / Pergunta<input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ex: O que é fotossíntese?" disabled={isLoading} /></label></div>
                  <div className={styles.field}><label>Baralho<input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Ex: Biologia" disabled={isLoading} /></label></div>
                  <div className={styles.field}><label>Nível de Detalhe
                     <select value={detailLevel} onChange={(e) => setDetailLevel(e.target.value as DetailLevel)} disabled={isLoading}>
                        <option value="low">Baixo (1 linha)</option>
                        <option value="medium">Médio (1 parágrafo)</option>
                        <option value="high">Alto (detalhado)</option>
                     </select>
                  </label></div>

                  <div className={styles.field}><label>Tom
                     <select value={tone} onChange={(e) => setTone(e.target.value as Tone)} disabled={isLoading}>
                        <option value="formal">Formal</option>
                        <option value="informal">Informal</option>
                        <option value="concise">Conciso</option>
                        <option value="detailed">Detalhado</option>
                     </select>
                  </label></div>

                  {error && <p className={styles.error}>{error}</p>}

                  {success && <p className={styles.success}>{success}</p>}

                  <button type="submit" className={styles.submitButton} disabled={isLoading}>{isLoading ? 'Gerando...' : 'Gerar resposta'}</button>
               </form>
            )}
         </div>
      </MainTemplate>
   );
}