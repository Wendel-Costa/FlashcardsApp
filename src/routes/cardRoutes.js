import express from "express";
import CardController from "../controllers/cardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", CardController.getCards);
/*routes.get("/cards/user/:id", CardController.listarCardsPorUsuario);*/
router.get("/:id", CardController.getCardById);
router.post("/", CardController.createCard);
router.post("/generate-text", CardController.generateCardByAI);
router.post("/generate-deck", CardController.generateDeckByAI);
router.post("/:id/review", CardController.reviewCard);
router.put("/:id", CardController.updateCard);
router.delete("/:id", CardController.deleteCard);

export default router;