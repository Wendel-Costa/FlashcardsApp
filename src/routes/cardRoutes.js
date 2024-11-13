import express from "express";
import CardController from "../controllers/cardController.js";

const routes = express.Router();

routes.get("/cards", CardController.listarCards);
routes.get("/cards/user/:id", CardController.listarCardsPorUsuario);
routes.get("/cards/:id", CardController.listarCardPorId);
routes.post("/cards", CardController.cadastrarCard);
routes.post("/cards/gerartexto", CardController.gerarCardPorIA);
routes.put("/cards/:id", CardController.atualizarCard);
routes.delete("/cards/:id", CardController.excluirCard);

export default routes;