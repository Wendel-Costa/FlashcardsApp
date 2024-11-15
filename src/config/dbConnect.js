import "dotenv/config"
import mongoose from "mongoose";

console.log("DB_CONEXAO_STRING:", process.env.DB_CONEXAO_STRING);

async function conectarNaDatabase() {
    try {
        await mongoose.connect(process.env.DB_CONEXAO_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Conectado ao MongoDB!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
    }
    return mongoose.connection;
}

export default conectarNaDatabase;