import user from "../models/User.js";

class UserController {

    static async listarUsers(req, res) {
        try {
            const listaUsers = await user.find({});
            res.status(200).json(listaUsers);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao listar usuários` });
        }
    }

    static async listarUserPorId(req, res) {
        try {
            const id = req.params.id;
            const userEncontrado = await user.findById(id).populate('cards');
            res.status(200).json(userEncontrado);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na requisição do usuário` });
        }
    }

    static async cadastrarUser(req, res) {
        try {
            const novoUser = await user.create(req.body);
            res.status(201).json({message: "Usuário criado com sucesso", usuario: novoUser});
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao cadastrar usuário` });
        }
    }

    static async atualizarUser(req, res) {
        try {
            const id = req.params.id;
            await user.findByIdAndUpdate(id, req.body);
            res.status(200).json({message: "Usuário atualizado com sucesso"});
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na atualização do usuário` });
        }
    }

    static async excluirUser(req, res) {
        try {
            const id = req.params.id;
            await user.findByIdAndDelete(id);
            res.status(200).json({message: "Usuário excluído com sucesso"});
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na exclusão do usuário` });
        }
    }
}

export default UserController;