import type { Card } from '../models/Card';
import api from './api';

interface CreateCardData {
   question: string;
   answer: string;
   tag: string;
}

interface GenerateCardByAIData {
   question: string;
   tag: string;
   detailLevel: 'low' | 'medium' | 'high';
   tone: 'formal' | 'informal' | 'concise' | 'detailed';
}

interface GenerateDeckByAIData {
   topic: string;
   tag: string;
   count: number;
}

export const cardService = {
   async getCards(): Promise<Card[]> {
      const response = await api.get('/cards');
      return response.data;
   },

   async getReviewQueue(): Promise<Card[]> {
      const response = await api.get('/cards/review-queue');
      return response.data;
   },

   async getCardById(id: string): Promise<Card> {
      const response = await api.get(`/cards/${id}`);
      return response.data;
   },

   async createCard(
      data: CreateCardData,
   ): Promise<{ message: string; card: Card }> {
      const response = await api.post('/cards', data);
      return response.data;
   },

   async generateCardByAI(
      data: GenerateCardByAIData,
   ): Promise<{ message: string; card: Card }> {
      const response = await api.post('/cards/generate-text', data);
      return response.data;
   },

   async generateDeckByAI(
      data: GenerateDeckByAIData,
   ): Promise<{ message: string; cards: Card[] }> {
      const response = await api.post('/cards/generate-deck', data);
      return response.data;
   },

   async reviewCard(
      id: string,
      quality: 0 | 3 | 5,
   ): Promise<{ message: string; card: Card }> {
      const response = await api.post(`/cards/${id}/review`, { quality });
      return response.data;
   },

   async updateCard(
      id: string,
      data: Partial<CreateCardData>,
   ): Promise<{ message: string }> {
      const response = await api.put(`/cards/${id}`, data);
      return response.data;
   },

   async deleteCard(id: string): Promise<{ message: string }> {
      const response = await api.delete(`/cards/${id}`);
      return response.data;
   },
};
