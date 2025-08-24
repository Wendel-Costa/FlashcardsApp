import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cards' }]
}, { versionKey: false });

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model("users", userSchema);

export default User;