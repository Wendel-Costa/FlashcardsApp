import user from "../models/User.js";

class UserController {

    static async listarUsers(req, res) {
        try {
            const listaUsers = await user.find({});
            res.status(200).json(listaUsers);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao listar usuário` });
        }
    }
}

export default UserController;