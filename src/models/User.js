import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    nome: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cards' }]
}, { versionKey: false });

userSchema.pre('save', async function(next) {
    if (this.isModified('senha')) {
        this.senha = await bcrypt.hash(this.senha, 10);
    }
    next();
});

const user = mongoose.model("users", userSchema);

export default user;