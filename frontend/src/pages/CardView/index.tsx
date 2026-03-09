import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CardAnswer } from '../../components/CardAnswer';
import { CardQuestion } from '../../components/CardQuestion';
import { CardViewHeader } from '../../components/CardViewHeader';
import { OptionsAnswers } from '../../components/OptionsAnswers';
import { MainTemplate } from '../../templates/MainTemplate';
import { cardService } from '../../services/cardService';
import type { Card } from '../../models/Card';
import { ShowAnswer } from '../../components/ShowAnswer';

export function CardView() {
   const [queue, setQueue] = useState<Card[]>([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isAnswerVisible, setIsAnswerVisible] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [reviewed, setReviewed] = useState(0);
   const [sessionComplete, setSessionComplete] = useState(false);

   const { tag } = useParams<{ tag?: string }>();
   const navigate = useNavigate();

   useEffect(() => {
      async function loadQueue() {
         try {
            const allDue = await cardService.getReviewQueue();
            const filtered = tag
               ? allDue.filter((c) => c.tag === decodeURIComponent(tag))
               : allDue;
            setQueue(filtered);
            if (filtered.length === 0) setSessionComplete(true);
         } catch (err) {
            console.error('Erro ao carregar fila de revisão:', err);
         } finally {
            setIsLoading(false);
         }
      }
      loadQueue();
   }, [tag]);

   const currentCard = queue[currentIndex];

   function getNextInterval(quality: 0 | 3 | 5): number {
      if (!currentCard || quality === 0) return 0;
      if (currentCard.interval === 0 || currentCard.status === 'learning') return 1;
      if (currentCard.interval === 1) return 6;
      return Math.ceil(currentCard.interval * currentCard.easeFactor);
   }

   async function handleReview(quality: 0 | 3 | 5) {
      if (!currentCard || isSubmitting) return;
      setIsSubmitting(true);
      try {
         await cardService.reviewCard(currentCard._id, quality);
         setReviewed((prev) => prev + 1);
         const next = currentIndex + 1;
         if (next >= queue.length) {
            setSessionComplete(true);
         } else {
            setCurrentIndex(next);
            setIsAnswerVisible(false);
         }
      } catch (err) {
         console.error('Erro ao revisar card:', err);
      } finally {
         setIsSubmitting(false);
      }
   }

   if (isLoading) {
      return <MainTemplate><p>Carregando fila de revisão...</p></MainTemplate>;
   }

   if (sessionComplete) {
      return (
         <MainTemplate>
            <div style={{ textAlign: 'center', padding: '4rem' }}>
               <h2>🎉 Sessão completa!</h2>
               <p>Você revisou {reviewed} card{reviewed !== 1 ? 's' : ''}.</p>
               <button onClick={() => navigate('/')}>Voltar para Home</button>
            </div>
         </MainTemplate>
      );
   }

   if (!currentCard) return null;

   return (
      <MainTemplate>
         <CardViewHeader
            deckName={currentCard.tag || 'Revisão Geral'}
            progress={`${currentIndex + 1} / ${queue.length}`}
            onBack={() => navigate('/')}
         />
         <CardQuestion>{currentCard.question}</CardQuestion>

         {!isAnswerVisible ? (
            <ShowAnswer setIsAnswerVisible={setIsAnswerVisible} />
         ) : (
            <>
               <CardAnswer>{currentCard.answer}</CardAnswer>
               <OptionsAnswers
                  daysWhenWrong={0}
                  daysWhenHard={getNextInterval(3)}
                  daysWhenCorrect={getNextInterval(5)}
                  onWrong={() => handleReview(0)}
                  onHard={() => handleReview(3)}
                  onCorrect={() => handleReview(5)}
                  disabled={isSubmitting}
               />
            </>
         )}
      </MainTemplate>
   );
}