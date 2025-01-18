import express from "express";
import users from "./userRoutes.js";
import cards from "./cardRoutes.js";

const routes = (app) => {
    app.route("/").get((req,res) => res.status(200).send("App de flahscards 100% atualizado"))

    app.use("/api", express.json(), users, cards);
}

export default routes;