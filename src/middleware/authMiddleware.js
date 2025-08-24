// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'seuSegredoSuperSecreto';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found.' });
        }

        req.userId = decoded.userId; // Adiciona o ID do usuário ao objeto?
        next(); // Permite que a requisição continue para a próxima função (rota)
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

export default authMiddleware;