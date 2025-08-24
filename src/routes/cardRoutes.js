import express from "express";
import CardController from "../controllers/cardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", CardController.listarCards);
/*routes.get("/cards/user/:id", CardController.listarCardsPorUsuario);*/
router.get("/:id", CardController.listarCardPorId);
router.post("/", CardController.cadastrarCard);
router.post("/gerartexto", CardController.gerarCardPorIA);
router.post("/gerarbaralho", CardController.gerarBaralhoPorIA);
router.post("/:id/revisar", CardController.revisarCard);
router.put("/:id", CardController.atualizarCard);
router.delete("/:id", CardController.excluirCard);

export default router;