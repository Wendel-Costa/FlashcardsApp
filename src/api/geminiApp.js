//import "dotenv/config"
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const chaveGemini = process.env.GEMINI_API_KEY;

async function gerarTexto(topico, detalhe) {
    const genAI = new GoogleGenerativeAI(chaveGemini);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Crie um texto baseado no formato de flashcards, se o nível de detalhe for alto faça um texto detalhado sobre o tópico, se o nível for médio resuma em apenas 1 paragrafo, se o nível for baixo resuma em 1 linha. Nível de detalhe: ${detalhe}. Assunto do flashcard: ${topico}`;

    const result = await model.generateContent(prompt);
    const textoGerado = result.response.text();
    return textoGerado;
}

export default gerarTexto;