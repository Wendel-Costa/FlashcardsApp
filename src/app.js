import express from "express";
import connectToDatabase from "./config/dbConnect.js";
import routes from "./routes/index.js";

import cors from "cors";



const connection = await connectToDatabase();

connection.on("error", (error) => {
    console.error("Connection error", error);
})

connection.once("open", () => {
    console.log("Database connection successful");
})

const app = express();

app.use(cors({
    origin: 'https://apiflashcards.vercel.app/'
  }));

routes(app);

export default app;