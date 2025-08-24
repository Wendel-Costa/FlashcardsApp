//import "dotenv/config"
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const chaveGemini = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(chaveGemini);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function gerarTexto(topico, detalhe, tom) {
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

async function gerarBaralhoComIA(topico, quantidade) {
    const prompt = `
        Gere ${quantidade} flashcards sobre o tópico "${topico}".
        Sua resposta DEVE SER APENAS um array de objetos JSON válido, sem nenhum texto adicional antes ou depois.
        Cada objeto no array deve ter exatamente duas chaves: "pergunta" e "resposta".
        
        Exemplo de formato de saída para um pedido de 2 flashcards sobre "HTML":
        [
            {
                "pergunta": "O que significa a sigla HTML?",
                "resposta": "HTML significa HyperText Markup Language (Linguagem de Marcação de Hipertexto)."
            },
            {
                "pergunta": "Qual a função da tag <body> em um documento HTML?",
                "resposta": "A tag <body> é usada para definir o corpo principal do documento, onde todo o conteúdo visível da página web é colocado."
            }
        ]
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
}


export {gerarTexto, gerarBaralhoComIA};