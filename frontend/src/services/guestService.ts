import api from './api';

interface GenerateGuestCardData {
   question: string;
   tag: string;
   detailLevel: 'low' | 'medium' | 'high';
   tone: 'formal' | 'informal' | 'concise' | 'detailed';
}

interface GenerateGuestDeckData {
   topic: string;
   count: number;
}

export const guestService = {
   async generateCard(data: GenerateGuestCardData) {
      const response = await api.post('/users/guest/generate-text', data);
      return response.data as {
         message: string;
         card: { question: string; answer: string; tag: string };
      };
   },

   async generateDeck(data: GenerateGuestDeckData) {
      const response = await api.post('/users/guest/generate-deck', data);
      return response.data as {
         message: string;
         cards: { question: string; answer: string }[];
      };
   },
};
