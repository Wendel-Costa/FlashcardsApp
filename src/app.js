import express from "express";
import conectarNaDatabase from "./config/dbConnect.js";
import routes from "./routes/index.js";

import cors from "cors";



const conexao = await conectarNaDatabase();

conexao.on("error", (erro) => {
    console.error("Erro de conexão", erro);
})

conexao.once("open", () => {
    console.log("Conexão com o banco feita com sucesso");
})

const app = express();

app.use(cors({
    origin: 'https://apiflashcards.vercel.app/'
  }));

routes(app);

export default app;
