import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/Container';
import { DeckBlock } from '../../components/DeckBlock';
import { DeckBlocksSection } from '../../components/DeckBlocksSection';
import { HomeHeader } from '../../components/HomeHeader';
import { HomeTitle } from '../../components/HomeTitle';
import { MainTemplate } from '../../templates/MainTemplate';
import { cardService } from '../../services/cardService';
import { useAuth } from '../../contexts/AuthContext';
import type { Card } from '../../models/Card';
import type { Deck } from '../../models/Deck';

export function Home() {
   const [cards, setCards] = useState<Card[]>([]);
   const [reviewQueue, setReviewQueue] = useState<Card[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const { username } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      async function fetchData() {
         try {
            const [allCards, queue] = await Promise.all([
               cardService.getCards(),
               cardService.getReviewQueue(),
            ]);
            setCards(allCards);
            setReviewQueue(queue);
         } catch (error) {
            console.error('Erro ao buscar cards:', error);
         } finally {
            setIsLoading(false);
         }
      }
      fetchData();
   }, []);

   // Agrupa cards por tag para formar os "decks"
   const decks = useMemo<Deck[]>(() => {
      const grouped: Record<string, Card[]> = {};
      cards.forEach((card) => {
         const tag = card.tag || 'Sem categoria';
         if (!grouped[tag]) grouped[tag] = [];
         grouped[tag].push(card);
      });
      const dueByTag: Record<string, number> = {};
      reviewQueue.forEach((card) => {
         const tag = card.tag || 'Sem categoria';
         dueByTag[tag] = (dueByTag[tag] || 0) + 1;
      });
      return Object.entries(grouped).map(([tag, tagCards]) => ({
         tag,
         cards: tagCards,
         totalCards: tagCards.length,
         dueCards: dueByTag[tag] || 0,
      }));
   }, [cards, reviewQueue]);

   return (
      <MainTemplate>
         <HomeHeader />
         <HomeTitle userName={username || ''} />
         {isLoading ? (
            <p>Carregando seus decks...</p>
         ) : decks.length === 0 ? (
            <Container>
               <p>Você ainda não tem cards.</p>
               <button onClick={() => navigate('/create-card')}>Criar Card Manual</button>
               <button onClick={() => navigate('/create-deck')}>Criar Deck com IA</button>
            </Container>
         ) : (
            <DeckBlocksSection>
               {decks.map((deck) => (
                  <DeckBlock
                     key={deck.tag}
                     deckName={deck.tag}
                     totalCards={deck.totalCards}
                     dueCards={deck.dueCards}
                     onClick={() => navigate(`/deck/${encodeURIComponent(deck.tag)}`)}
                  />
               ))}
            </DeckBlocksSection>
         )}
      </MainTemplate>
   );
}