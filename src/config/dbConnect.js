import "dotenv/config"
import mongoose from "mongoose";

async function conectarNaDatabase() {
    try {
        await mongoose.connect(process.env.DB_CONEXAO_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado ao MongoDB!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
    }
    return mongoose.connection;
}

export default conectarNaDatabase;