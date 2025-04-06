import express from "express";
import userRoutes from "./userRoutes.js";
import cardRoutes from "./cardRoutes.js";

const router = express.Router();

router.get("/", (req, res) => res.status(200).send("App de flashcards 100% atualizado"));

router.use("/users", userRoutes);
router.use("/cards", cardRoutes);

export default router;