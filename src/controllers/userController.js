import user from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'seuSegredoSuperSecreto';

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
            res.status(201).json({ message: "Usuário criado com sucesso", usuario: novoUser });
        } catch (erro) {
            if (erro.code === 11000 && erro.keyPattern && erro.keyPattern.nome) {
                res.status(400).json({ message: "Nome de usuário já existe." });
            } else {
                res.status(500).json({ message: `${erro.message} - falha ao cadastrar usuário` });
            }
        }
    }

    static async registerUser(req, res) {
        try {
            const { nome, senha } = req.body;
            const existingUser = await user.findOne({ nome });

            if (existingUser) {
                return res.status(409).json({ message: "Nome de usuário já existe." });
            }

            const newUser = new user({ nome, senha });
            await newUser.save();
            res.status(201).json({ message: "Usuário registrado com sucesso!" });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao registrar usuário` });
        }
    }

    static async loginUser(req, res) {
        try {
            const { nome, senha } = req.body;
            const userEncontrado = await user.findOne({ nome }).select('+senha');

            if (!userEncontrado) {
                return res.status(401).json({ message: "Usuário não encontrado." });
            }

            const senhaCorreta = await bcrypt.compare(senha, userEncontrado.senha);

            if (senhaCorreta) {
                const token = jwt.sign({ userId: userEncontrado._id }, secretKey, { expiresIn: '1h' });
                res.status(200).json({ message: "Login realizado com sucesso!", token });
            } else {
                return res.status(401).json({ message: "Senha incorreta." });
            }
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao fazer login` });
        }
    }

    static async atualizarUser(req, res) {
        try {
            const id = req.params.id;
            await user.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "Usuário atualizado com sucesso" });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na atualização do usuário` });
        }
    }

    static async excluirUser(req, res) {
        try {
            const id = req.params.id;
            await user.findByIdAndDelete(id);
            res.status(200).json({ message: "Usuário excluído com sucesso" });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na exclusão do usuário` });
        }
    }
}

export default UserController;