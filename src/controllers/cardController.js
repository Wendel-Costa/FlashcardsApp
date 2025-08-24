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
    
    static async generateDeckByAI(req, res) {
        const { topic, tag, count } = req.body;
        const userId = req.userId;

        if (!topic || !tag || !count) {
            return res.status(400).json({ message: "Topic, tag and count are required." });
        }

        try {
            const aiResponseText = await generateDeckWithAI(topic, count);

            // Correção caso a IA não gere os dados da forma correta:
            let newCardsData;
            try {
                const cleanText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
                newCardsData = JSON.parse(cleanText);
            } catch (error) {
                console.error("Erro ao fazer parse do JSON da IA:", aiResponseText);
                return res.status(500).json({ message: "The AI returned a response in an invalid format. Please try again." });
            }
            
            // Salvar os cards:
            const cardsToSave = newCardsData.map(c => ({
                ...c,
                tag: tag,
                owner: userId,
            }));

            const savedCards = await Card.insertMany(cardsToSave);

            const savedCardIds = savedCards.map(c => c._id);
            await User.findByIdAndUpdate(userId, { $push: { cards: { $each: savedCardIds } } });

            res.status(201).json({ message: `${count} cards about '${topic}' created successfully!`, cards: savedCards });

        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to generate deck with AI` });
        }
    }


    static async reviewCard(req, res) {
        try {
            const cardId = req.params.id;
            
            const { quality } = req.body; // Qualidade: 0 (Errou), 3 (Bom), 5 (Fácil)

            const cardToReview = await Card.findById(cardId);

            if (!cardToReview || cardToReview.owner.toString() !== req.userId) {
                return res.status(403).json({ message: "Not authorized to review this card." });
            }

            if (quality < 3) {
                cardToReview.interval = 0;
                cardToReview.status = 'learning';
                cardToReview.nextReviewDate = addMinutes(new Date(), 10); 

            } else {
                let newInterval;
                let newEaseFactor = cardToReview.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)); // cálculo da repetição espaçada

                if (newEaseFactor < 1.3) {
                    newEaseFactor = 1.3;
                } // não pode ser menor que 1.3 (pela regra geral da repetição espaçada)
                
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
            res.status(200).json({ message: "Card reviewed successfully", card: cardToReview });

        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to review card` });
        }
    }

    static async getCards(req, res) {
        try {
            const userId = req.userId; 
            const cardList = await Card.find({ owner: userId }).sort({ _id: -1 });
            res.status(200).json(cardList);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to list cards` });
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
            res.status(500).json({ message: `${error.message} - failed to get review queue` });
        }
    }   

    static async getCardsByUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (req.userId !== userId) {
                return res.status(403).json({ message: "Not authorized to list cards for this user." });
            }

            const userCards = await Card.find({ owner: userId });
            res.status(200).json(userCards);

        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to list user's cards` });
        }
    }

    static async getCardById(req, res) {
        try {
            const id = req.params.id;
            const foundCard = await Card.findById(id);

            if (foundCard && foundCard.owner.toString() !== req.userId) {
                return res.status(403).json({ message: "Not authorized to access this card." });
            }

            res.status(200).json(foundCard);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to request card` });
        }
    }

    static async createCard(req, res) {
        try {
            const userId = req.userId;
            req.body.owner = userId;

            const newCard = await Card.create(req.body);

            await User.findByIdAndUpdate(userId, { $push: { cards: newCard._id } });

            res.status(201).json({ message: "Card created successfully", card: newCard });

        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to create card` });
        }
    }

    static async generateCardByAI(req, res) {
        const { detailLevel, tone } = req.body;
        try {
            const userId = req.userId;
            req.body.owner = userId;

            const aiResponse = await generateText(req.body.question, detailLevel, tone);

            const newCardWithAI = {
                question: req.body.question,
                answer: aiResponse,
                tag: req.body.tag,
                owner: req.body.owner
            };

            const newCard = await Card.create(newCardWithAI);

            await User.findByIdAndUpdate(userId, { $push: { cards: newCard._id } });

            res.status(201).json({ message: 'Card generated by AI successfully', card: newCard });

        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to create card` });
        }
    }

    static async updateCard(req, res) {
        try {
            const id = req.params.id;
            const cardToUpdate = await Card.findById(id);

            if (!cardToUpdate || cardToUpdate.owner.toString() !== req.userId) {
                return res.status(403).json({ message: "Not authorized to update this card." });
            }

            await Card.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "Card updated successfully" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to update card` });
        }
    }

    static async deleteCard(req, res) {
        try {
            const id = req.params.id;
            const deletedCard = await Card.findById(id);

            if (!deletedCard || deletedCard.owner.toString() !== req.userId) {
                return res.status(403).json({ message: "Not authorized to delete this card." });
            }

            await Card.findByIdAndDelete(id);

            const user = await User.findById(req.userId);
            if (user) {
                user.cards.pull(id);
                await user.save();
            }

            res.status(200).json({ message: "Card deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to delete card` });
        }
    }
}

export default CardController;