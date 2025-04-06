// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import user from '../models/User.js';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'seuSegredoSuperSecreto';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Não autorizado: Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secretKey);
        const usuario = await user.findById(decoded.userId);

        if (!usuario) {
            return res.status(401).json({ message: 'Não autorizado: Usuário não encontrado.' });
        }

        req.userId = decoded.userId; // Adiciona o ID do usuário ao objeto de requisição
        next(); // Permite que a requisição continue para a próxima função (rota)
    } catch (error) {
        return res.status(401).json({ message: 'Não autorizado: Token inválido.' });
    }
};

export default authMiddleware;