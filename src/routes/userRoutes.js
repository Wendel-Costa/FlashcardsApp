import express from "express";
import UserController from "../controllers/userController.js";
import CardController from "../controllers/cardController.js";
import aiLimiter from "../middleware/rateLimiter.js";

const routes = express.Router();

// ROTAS DE VISITANTE
routes.post("/guest/generate-text", aiLimiter, CardController.generateCardByAI);
routes.post("/guest/generate-deck", aiLimiter, CardController.generateDeckByAI);


// ROTAS DE CONTAS
routes.get("/users", UserController.getUsers);
routes.get("/users/:id", UserController.getUserById);
routes.post("/users", UserController.createUser);
routes.post("/register", UserController.registerUser);
routes.post("/login", UserController.loginUser);
routes.put("/users/:id", UserController.updateUser);
routes.delete("/users/:id", UserController.deleteUser);

export default routes;