import "dotenv/config"
import mongoose from "mongoose";

async function conectarNaDatabase() {
    mongoose.connect(process.env.DB_CONEXAO_STRING);

    return mongoose.connection;
}

export default conectarNaDatabase;