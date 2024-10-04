import express from "express";

const app = express();

app.get("/", (req,res) => {
    res.status(200).send("App de flashcards 100% atualizado");
});

export default app;
