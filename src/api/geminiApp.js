//import "dotenv/config"
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const chaveGemini = process.env.GEMINI_API_KEY;

async function gerarTexto(topico, detalhe) {
    const genAI = new GoogleGenerativeAI(chaveGemini);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Faça um pequeno resumo de nível ${detalhe} sobre ${topico}`;

    const result = await model.generateContent(prompt);
    const textoGerado = result.response.text();
    return textoGerado;
}

export default gerarTexto;