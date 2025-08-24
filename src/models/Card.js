import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    pergunta: { type: String, required: true },
    resposta: { type: String, required: true },
    tag: { type: String },
    dono: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    proximaRevisao: { type: Date, default: () => new Date() },
    intervalo: { type: Number, default: 0 },
    fatorFacilidade: { type: Number, default: 2.5 },
    estado: { type: String, enum: ['novo', 'aprendendo', 'revisando'], default: 'novo' },

    //obs: opção de adicionar imagens no futuro
    perguntaImagemUrl: { type: String, default: null },
    respostaImagemUrl: { type: String, default: null }
}, { versionKey: false });

const card = mongoose.model("cards", cardSchema);

export default card;