import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const geminiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const prompt = `Crie um texto baseado no formato de flashcards. Se o nível de detalhe for alto, faça um texto detalhado sobre o tópico; se o nível for médio, resuma em apenas 1 parágrafo; se o nível for baixo, resuma em 1 linha. ${toneInstruction} Nível de detalhe: ${detailLevel}. Assunto do flashcard: ${topic}`;

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