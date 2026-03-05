import type { Card } from './Card';

export interface Deck {
   tag: string;
   cards: Card[];
   totalCards: number;
   dueCards: number;
}
