import express from "express";
import connectDatabase from "./src/config/dbConnect.js";
import routes from "./src/routes/index.js";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const port = process.env.PORT || 3000;

connectDatabase();

app.listen(port, () => {
    console.log(`servidor escutando na porta ${port}`);
});