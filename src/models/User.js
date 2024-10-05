import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type:mongoose.Schema.Types.ObjectId },
    nome: {type: String, required: true},
    senha: {type: String, required: true},
    cards: [{type: mongoose.Schema.Types.ObjectId, ref: 'cards'}]
}, {versionKey: false});

const user = mongoose.model("users", userSchema);

export default user;