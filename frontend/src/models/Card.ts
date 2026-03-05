export interface Card {
   _id: string;
   question: string;
   answer: string;
   tag: string;
   owner: string;
   nextReviewDate: string;
   interval: number;
   easeFactor: number;
   status: 'new' | 'learning' | 'reviewing';
   questionImageUrl: string | null;
   answerImageUrl: string | null;
}
