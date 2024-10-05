import express from "express";
import UserController from "../controllers/userController.js";

const routes = express.Router();

routes.get("/users", UserController.listarUsers);
routes.get("/users/:id", UserController.listarUserPorId);
routes.post("/users", UserController.cadastrarUser);
routes.put("/users/:id", UserController.atualizarUser);
routes.delete("/users/:id", UserController.excluirUser);

export default routes;