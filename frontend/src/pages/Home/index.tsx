import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/Container';
import { DeckBlock } from '../../components/DeckBlock';
import { DeckBlocksSection } from '../../components/DeckBlocksSection';
import { HomeHeader } from '../../components/HomeHeader';
import { HomeTitle } from '../../components/HomeTitle';
import { MainTemplate } from '../../templates/MainTemplate';
import { ConfirmModal } from '../../components/ConfirmModal';
import { cardService } from '../../services/cardService';
import { useAuth } from '../../contexts/AuthContext';
import type { Card } from '../../models/Card';
import type { Deck } from '../../models/Deck';

export function Home() {
   const [cards, setCards] = useState<Card[]>([]);
   const [reviewQueue, setReviewQueue] = useState<Card[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
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

   async function handleRename(deck: Deck, newName: string) {
      try {
         const ids = deck.cards.map((c) => c._id);
         await cardService.renameDeck(newName, ids);
         setCards((prev) => prev.map((c) => c.tag === deck.tag ? { ...c, tag: newName } : c));
      } catch (err) { console.error(err); }
   }

   function handleDeleteDeck(deck: Deck) {
      setConfirmModal({
         message: `Excluir o deck "${deck.tag}" e todos os seus ${deck.totalCards} cards? Essa ação não pode ser desfeita.`,
         onConfirm: async () => {
            try {
               await cardService.deleteDeck(deck.cards.map((c) => c._id));
               setCards((prev) => prev.filter((c) => c.tag !== deck.tag));
            } catch (err) { console.error(err); }
            setConfirmModal(null);
         },
      });
   }

   return (
      <MainTemplate>
         <HomeHeader />
         <HomeTitle userName={username || ''} />
         {isLoading ? (
            <p style={{ padding: '3rem 5rem' }}>Carregando seus decks...</p>
         ) : decks.length === 0 ? (
            <Container>
               <p>Você ainda não tem cards. Crie seu primeiro!</p>
            </Container>
         ) : (
            <DeckBlocksSection>
               {decks.map((deck) => (
                  <DeckBlock
                     key={deck.tag}
                     deckName={deck.tag}
                     totalCards={deck.totalCards}
                     dueCards={deck.dueCards}
                     onReview={() => navigate(`/review/${encodeURIComponent(deck.tag)}`)}
                     onView={() => navigate(`/deck/${encodeURIComponent(deck.tag)}`)}
                     onRename={(newName) => handleRename(deck, newName)}
                     onDelete={() => handleDeleteDeck(deck)}
                  />
               ))}
            </DeckBlocksSection>
         )}

         {confirmModal && (
            <ConfirmModal
               message={confirmModal.message}
               onConfirm={confirmModal.onConfirm}
               onCancel={() => setConfirmModal(null)}
            />
         )}
      </MainTemplate>
   );
}