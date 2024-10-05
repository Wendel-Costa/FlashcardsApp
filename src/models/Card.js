import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    id: { type:mongoose.Schema.Types.ObjectId },
    pergunta: {type: String, required: true},
    resposta: {type: String, required: true},
    tag: { type: String },
    dono: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true}
}, {versionKey: false});

const card = mongoose.model("cards", cardSchema);

export default card;