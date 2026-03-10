import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const geminiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

async function generateText(topic, detailLevel, tone) {
   let toneInstruction = '';
   switch (tone) {
      case 'formal':
         toneInstruction = 'Use uma linguagem formal e profissional.';
         break;
      case 'informal':
         toneInstruction = 'Use uma linguagem informal e amigável.';
         break;
      case 'concise':
         toneInstruction = 'Seja conciso e direto ao ponto.';
         break;
      case 'detailed':
         toneInstruction = 'Forneça uma resposta detalhada e abrangente.';
         break;
      default:
         toneInstruction = 'Mantenha um tom neutro.';
   }

   let lengthInstruction = '';
   switch (detailLevel) {
      case 'low':
         lengthInstruction = 'Responda em exatamente 1 linha curta.';
         break;
      case 'medium':
         lengthInstruction = 'Responda em exatamente 1 parágrafo.';
         break;
      case 'high':
         lengthInstruction =
            'Forneça uma resposta detalhada e completa em vários parágrafos.';
         break;
   }

   const prompt = `Você é um assistente que gera respostas para flashcards de estudo. Sua tarefa é gerar APENAS o texto da resposta para o seguinte tema, sem títulos, sem formatação especial, sem prefixos como "Resposta:" ou "Verso:". Escreva diretamente o conteúdo explicativo. ${toneInstruction} ${lengthInstruction} Tema: ${topic}`;

   const result = await model.generateContent(prompt);

   const generatedText = result.response.text();
   return generatedText;
}

async function generateDeckWithAI(topic, count) {
   const prompt = `
        Gere ${count} flashcards sobre o tópico "${topic}".
        Sua resposta DEVE SER APENAS um array de objetos JSON válido, sem nenhum texto adicional antes ou depois.
        Cada objeto no array deve ter exatamente duas chaves: "question" e "answer".
        
        Exemplo de formato de saída para um pedido de 2 flashcards sobre "HTML":
        [
            {
                "question": "O que significa a sigla HTML?",
                "answer": "HTML significa HyperText Markup Language (Linguagem de Marcação de Hipertexto)."
            },
            {
                "question": "Qual a função da tag <body> em um documento HTML?",
                "answer": "A tag <body> é usada para definir o corpo principal do documento, onde todo o conteúdo visível da página web é colocado."
            }
        ]
    `;

   const result = await model.generateContent(prompt);
   return result.response.text();
}

export { generateText, generateDeckWithAI };
