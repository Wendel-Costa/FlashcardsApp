import card from "../models/Card.js";
import user from "../models/User.js";
import gerarTexto from "../api/geminiApp.js";

function adicionarDias(data, dias) {
    const resultado = new Date(data);
    resultado.setDate(resultado.getDate() + dias);
    return resultado;
}

function adicionarMinutos(data, minutos) {
    const resultado = new Date(data);
    resultado.setTime(resultado.getTime() + minutos * 60000); // 60000 milissegundos em um minuto
    return resultado;
}

class CardController {
    
    static async revisarCard(req, res) {
        try {
            const cardId = req.params.id;
            
            const { qualidade } = req.body; // Qualidade: 0 (Errou), 3 (Bom), 5 (Fácil)

            const cardParaRevisar = await card.findById(cardId);

            if (!cardParaRevisar || cardParaRevisar.dono.toString() !== req.userId) {
                return res.status(403).json({ message: "Não autorizado a revisar este card." });
            }

            if (qualidade < 3) {
                cardParaRevisar.intervalo = 0;
                cardParaRevisar.estado = 'aprendendo';
                cardParaRevisar.proximaRevisao = adicionarMinutos(new Date(), 10); 

            } else {
                let novoIntervalo;
                let novoFatorFacilidade = cardParaRevisar.fatorFacilidade + (0.1 - (5 - qualidade) * (0.08 + (5 - qualidade) * 0.02)); // cálculo da repetição espaçada

                if (novoFatorFacilidade < 1.3) {
                    novoFatorFacilidade = 1.3;
                } // não pode ser menor que 1.3 (pela regra geral da repetição espaçada)
                
                cardParaRevisar.fatorFacilidade = novoFatorFacilidade;
                
                if (cardParaRevisar.estado === 'aprendendo' || cardParaRevisar.intervalo === 0) {
                    novoIntervalo = 1;
                } else if (cardParaRevisar.intervalo === 1) {
                    novoIntervalo = 6;
                } else {
                    novoIntervalo = Math.ceil(cardParaRevisar.intervalo * cardParaRevisar.fatorFacilidade);
                }
                
                cardParaRevisar.intervalo = novoIntervalo;
                cardParaRevisar.estado = 'revisando';
                cardParaRevisar.proximaRevisao = adicionarDias(new Date(), novoIntervalo);
            }

            await cardParaRevisar.save();
            res.status(200).json({ message: "Card revisado com sucesso", card: cardParaRevisar });

        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao revisar o card` });
        }
    }

    static async listarCards(req, res) {
        try {
            const userId = req.userId; 
            const listaCards = await card.find({ 
                dono: userId,
                proximaRevisao: { $lte: new Date() } // $lte significa menor ou igal à
            });
            res.status(200).json(listaCards);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao listar cards` });
        }
    }

    static async listarCardsPorUsuario(req, res) {
        try {
            const userId = req.params.id;
            const usuario = await user.findById(userId);

            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            if (req.userId !== userId) {
                return res.status(403).json({ message: "Não autorizado a listar cards deste usuário." });
            }

            const cardsDoUsuario = await card.find({ dono: userId });
            res.status(200).json(cardsDoUsuario);

        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao listar cards do usuário` });
        }
    }

    static async listarCardPorId(req, res) {
        try {
            const id = req.params.id;
            const cardEncontrado = await card.findById(id);

            if (cardEncontrado && cardEncontrado.dono.toString() !== req.userId) {
                return res.status(403).json({ message: "Não autorizado a acessar este card." });
            }

            res.status(200).json(cardEncontrado);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na requisição do card` });
        }
    }

    static async cadastrarCard(req, res) {
        try {
            const userId = req.userId;
            req.body.dono = userId;

            const novoCard = await card.create(req.body);

            await user.findByIdAndUpdate(userId, { $push: { cards: novoCard._id } });

            res.status(201).json({ message: "Card criado com sucesso", card: novoCard });

        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao cadastrar card` });
        }
    }

    static async gerarCardPorIA(req, res) {
        const { detalhe, tom } = req.body;
        try {
            const userId = req.userId;
            req.body.dono = userId;

            const respostaIA = await gerarTexto(req.body.pergunta, detalhe, tom);

            const novoCardcomIA = {
                pergunta: req.body.pergunta,
                resposta: respostaIA,
                tag: req.body.tag,
                dono: req.body.dono
            };

            const novoCard = await card.create(novoCardcomIA);

            await user.findByIdAndUpdate(userId, { $push: { cards: novoCard._id } });

            res.status(201).json({ message: 'Card gerado por IA com sucesso', card: novoCard });

        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao cadastrar card` });
        }
    }

    static async atualizarCard(req, res) {
        try {
            const id = req.params.id;
            const cardParaAtualizar = await card.findById(id);

            if (!cardParaAtualizar || cardParaAtualizar.dono.toString() !== req.userId) {
                return res.status(403).json({ message: "Não autorizado a atualizar este card." });
            }

            await card.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "Card atualizado com sucesso" });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na atualização do card` });
        }
    }

    static async excluirCard(req, res) {
        try {
            const id = req.params.id;
            const cardExcluido = await card.findById(id);

            if (!cardExcluido || cardExcluido.dono.toString() !== req.userId) {
                return res.status(403).json({ message: "Não autorizado a excluir este card." });
            }

            await card.findByIdAndDelete(id);

            const usuario = await user.findById(req.userId);
            if (usuario) {
                usuario.cards.pull(id);
                await usuario.save();
            }

            res.status(200).json({ message: "Card excluído com sucesso" });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na exclusão do card` });
        }
    }
}

export default CardController;