import rateLimit from 'express-rate-limit';

const aiLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 10,
    message: {
        message: "Muitas requisições de IA criadas a partir deste IP, por favor, tente novamente após 30 minutos."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default aiLimiter;