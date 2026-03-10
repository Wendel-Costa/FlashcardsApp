import Card from "../models/Card.js";
import User from "../models/User.js";
import { generateText, generateDeckWithAI } from "../api/geminiApp.js";

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addMinutes(date, minutes) {
    const result = new Date(date);
    result.setTime(result.getTime() + minutes * 60000);
    return result;
}

class CardController {
    
    static async generateGuestCardByAI(req, res) {
        const { question, tag, detailLevel, tone } = req.body;
        try {
            const aiResponse = await generateText(question, detailLevel, tone);
            const newCard = {
                question: question,
                answer: aiResponse,
                tag: tag,
            };
            res.status(201).json({ message: 'Card de visitante gerado com sucesso', card: newCard });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao gerar card de visitante` });
        }
    }

    static async generateGuestDeckByAI(req, res) {
        const { topic, count } = req.body;
        try {
            const aiResponseText = await generateDeckWithAI(topic, count);
            let newCardsData;
            try {
                const cleanText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
                newCardsData = JSON.parse(cleanText);
            } catch (error) {
                return res.status(500).json({ message: "A IA retornou uma resposta em um formato inválido." });
            }
            res.status(201).json({ message: `${count} cards de visitante criados com sucesso!`, cards: newCardsData });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao gerar baralho de visitante` });
        }
    }



    static async generateDeckByAI(req, res) {
        const { topic, tag, count } = req.body;
        const userId = req.userId;

        if (!topic || !tag || !count) {
            return res.status(400).json({ message: "Tópico, baralho e quantidade são obrigatórios" });
        }

        try {
            const aiResponseText = await generateDeckWithAI(topic, count);

            let newCardsData;
            try {
                const cleanText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
                newCardsData = JSON.parse(cleanText);
            } catch (error) {
                console.error("Erro ao fazer parse do JSON da IA:", aiResponseText);
                return res.status(500).json({ message: "A IA retornou uma resposta em um formato inválido. Tente novamente." });
            }
            
            // Salvar os cards:
            const cardsToSave = newCardsData.map(c => ({
                question: c.question,
                answer: c.answer,
                tag: tag,
                owner: userId,
            }));

            const savedCards = await Card.insertMany(cardsToSave);

            const savedCardIds = savedCards.map(c => c._id);
            await User.findByIdAndUpdate(userId, { $push: { cards: { $each: savedCardIds } } });

            res.status(201).json({ message: `${count} cards sobre '${topic}' criados com sucesso!`, cards: savedCards });

        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha ao gerar baralho` });
        }
    }


    static async reviewCard(req, res) {
        try {
            const cardId = req.params.id;
            
            const { quality } = req.body; // Qualidade: 0 (Errou), 3 (Bom), 5 (Fácil)

            const cardToReview = await Card.findById(cardId);

            if (!cardToReview || cardToReview.owner.toString() !== req.userId) {
                return res.status(403).json({ message: "Não autorizado a revisar este card." });
            }

            if (quality < 3) {
                cardToReview.interval = 0;
                cardToReview.status = 'learning';
                cardToReview.nextReviewDate = addMinutes(new Date(), 10); 

            } else {
                let newInterval;
                let newEaseFactor = cardToReview.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

                if (newEaseFactor < 1.3) {
                    newEaseFactor = 1.3;
                }
                
                cardToReview.easeFactor = newEaseFactor;
                
                if (cardToReview.status === 'learning' || cardToReview.interval === 0) {
                    newInterval = 1;
                } else if (cardToReview.interval === 1) {
                    newInterval = 6;
                } else {
                    newInterval = Math.ceil(cardToReview.interval * cardToReview.easeFactor);
                }
                
                cardToReview.interval = newInterval;
                cardToReview.status = 'reviewing';
                cardToReview.nextReviewDate = addDays(new Date(), newInterval);
            }

            await cardToReview.save();
            res.status(200).json({ message: "Card revisado com sucesso", card: cardToReview });

        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha ao revisar o card` });
        }
    }
    
    static async getCards(req, res) {
        try {
            const userId = req.userId; 
            const cardList = await Card.find({ owner: userId }).sort({ _id: -1 });
            res.status(200).json(cardList);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha ao listar os cards` });
        }
    }
    
    static async getReviewQueue(req, res) {
        try {
            const userId = req.userId;
            const reviewList = await Card.find({ 
                owner: userId,
                nextReviewDate: { $lte: new Date() }
            });
            res.status(200).json(reviewList);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha ao buscar a fila de revisão` });
        }
    }

    static async getCardById(req, res) {
        try {
            const id = req.params.id;
            const foundCard = await Card.findById(id);

            if (foundCard && foundCard.owner.toString() !== req.userId) {
                return res.status(403).json({ message: "Não autorizado a acessar este card" });
            }

            res.status(200).json(foundCard);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha na requisição do card` });
        }
    }

    static async createCard(req, res) {
        try {
            const userId = req.userId;
            const { question, answer, tag } = req.body;
            const newCard = await Card.create({ question, answer, tag, owner: userId });

            await User.findByIdAndUpdate(userId, { $push: { cards: newCard._id } });

            res.status(201).json({ message: "Card criado com sucesso", card: newCard });

        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha ao criar o card` });
        }
    }

    static async generateCardByAI(req, res) {
        const { detailLevel, tone, question, tag } = req.body;
        try {
            const userId = req.userId;
            
            const aiResponse = await generateText(question, detailLevel, tone);

            const newCardWithAI = {
                question: question,
                answer: aiResponse,
                tag: tag,
                owner: userId
            };

            const newCard = await Card.create(newCardWithAI);

            await User.findByIdAndUpdate(userId, { $push: { cards: newCard._id } });

            res.status(201).json({ message: 'Card gerado com sucesso!', card: newCard });

        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha ao criar o card` });
        }
    }

    static async updateCard(req, res) {
        try {
            const id = req.params.id;
            const cardToUpdate = await Card.findById(id);

            if (!cardToUpdate || cardToUpdate.owner.toString() !== req.userId) {
                return res.status(403).json({ message: "Não autorizado a atualizar este card" });
            }

            await Card.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "Card atualizado com sucesso" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha ao atualizar card` });
        }
    }

    static async deleteCard(req, res) {
        try {
            const id = req.params.id;
            const deletedCard = await Card.findById(id);

            if (!deletedCard || deletedCard.owner.toString() !== req.userId) {
                return res.status(403).json({ message: "Não autorizado a excluir este card" });
            }

            await Card.findByIdAndDelete(id);

            const user = await User.findById(req.userId);
            if (user) {
                user.cards.pull(id);
                await user.save();
            }

            res.status(200).json({ message: "Card excluído com sucesso" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao excluir card` });
        }
    }
}

export default CardController;