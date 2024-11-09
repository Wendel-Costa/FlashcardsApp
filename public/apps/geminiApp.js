import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({path:'../../.env'});

const chaveGemini = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(chaveGemini);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Conte uma história sobre árvores";

const result = await model.generateContent(prompt);
console.log(result.response.text());