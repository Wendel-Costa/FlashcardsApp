import { useNavigate } from 'react-router-dom';
import { MainTemplate } from '../../templates/MainTemplate';
import styles from './styles.module.css';

export function Guest() {
   const navigate = useNavigate();

   return (
      <MainTemplate>
         <div className={styles.page}>
            <h1 className={styles.title}>Modo Visitante</h1>

            <p className={styles.subtitle}>Explore o app sem criar uma conta. Os cards não serão salvos.</p>

            <div className={styles.cards}>
               <div className={styles.optionCard} onClick={() => navigate('/guest/card')}>
                  <h2>Gerar Card com IA</h2>

                  <p>Crie um flashcard sobre qualquer tema usando inteligência artificial.</p>
               </div>

               <div className={styles.optionCard} onClick={() => navigate('/guest/deck')}>
                  <h2>Gerar Deck com IA</h2>

                  <p>Gere um baralho completo de flashcards automaticamente.</p>
               </div>
            </div>

            <div className={styles.cta}>
               <p>Quer salvar seus cards?</p>

               <div className={styles.ctaButtons}>
                  <button className={styles.primaryButton} onClick={() => navigate('/register')}>Criar Conta</button>
                  <button className={styles.secondaryButton} onClick={() => navigate('/login')}>Já tenho conta</button>
               </div>
            </div>
         </div>
      </MainTemplate>
   );
}