//import "dotenv/config"
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const chaveGemini = process.env.GEMINI_API_KEY;

async function gerarTexto(topico, detalhe, tom) {
    const genAI = new GoogleGenerativeAI(chaveGemini);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let instrucaoTom = '';
    switch (tom) {
        case 'formal':
            instrucaoTom = 'Use uma linguagem formal e profissional.';
            break;
        case 'informal':
            instrucaoTom = 'Use uma linguagem informal e amigável.';
            break;
        case 'conciso':
            instrucaoTom = 'Seja conciso e direto ao ponto.';
            break;
        case 'detalhado':
            instrucaoTom = 'Forneça uma resposta detalhada e abrangente.';
            break;
        default:
            instrucaoTom = 'Mantenha um tom neutro.';
    }

    const prompt = `Crie um texto baseado no formato de flashcards. Se o nível de detalhe for alto, faça um texto detalhado sobre o tópico; se o nível for médio, resuma em apenas 1 parágrafo; se o nível for baixo, resuma em 1 linha. ${instrucaoTom} Nível de detalhe: ${detalhe}. Assunto do flashcard: ${topico}`;

    const result = await model.generateContent(prompt);
    const textoGerado = result.response.text();
    return textoGerado;
}

export default gerarTexto;