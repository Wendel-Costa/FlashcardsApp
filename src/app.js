import express from "express";
import conectarNaDatabase from "./config/dbConnect.js";
import routes from "./routes/index.js";

import cors from "cors"; // Importa o pacote CORS



const conexao = await conectarNaDatabase();

conexao.on("error", (erro) => {
    console.error("Erro de conexão", erro);
})

conexao.once("open", () => {
    console.log("Conexão com o banco feita com sucesso");
})

const app = express();

app.use(cors());


routes(app);

export default app;
