import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    tag: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    nextReviewDate: { type: Date, default: () => new Date() },
    interval: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    status: { type: String, enum: ['new', 'learning', 'reviewing'], default: 'new' },

    //obs: opção de adicionar imagens no futuro
    questionImageUrl: { type: String, default: null },
    answerImageUrl: { type: String, default: null }
}, { versionKey: false });

const Card = mongoose.model("cards", cardSchema);

export default Card;