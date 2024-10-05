import express from "express";
import conectarNaDatabase from "./config/dbConnect.js";

// testando conexao
import user from "./models/User.js";

const conexao = await conectarNaDatabase();

conexao.on("error", (erro) => {
    console.error("Erro de conexão", erro);
})

conexao.once("open", () => {
    console.log("Conexão com o banco feita com sucesso");
})

const app = express();

app.get("/", (req,res) => {
    res.status(200).send("App de flashcards 100% atualizado!");
});

app.get("/users", async (req,res) => {
    const listaUsers = await user.find({});
    res.status(200).json(listaUsers);
});

export default app;
