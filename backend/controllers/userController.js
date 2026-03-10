import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'seuSegredoSuperSecreto';

class UserController {

    static async getUsers(req, res) {
        try {
            const userList = await User.find({});
            res.status(200).json(userList);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao listar usuários` });
        }
    }

    static async getUserById(req, res) {
        try {
            const id = req.params.id;
            const foundUser = await User.findById(id).populate('cards');
            res.status(200).json(foundUser);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - usuário não encontrado` });
        }
    }

    static async createUser(req, res) {
        try {
            const newUser = await User.create(req.body);
            res.status(201).json({ message: "Usuário criado com sucesso", user: newUser });
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
                res.status(400).json({ message: "Já existe um usuário com esse nome" });
            } else {
                res.status(500).json({ message: `${error.message} - falha ao criar usuário` });
            }
        }
    }

    static async registerUser(req, res) {
        try {
            const { username, password } = req.body;
            const existingUser = await User.findOne({ username });

            if (existingUser) {
                return res.status(409).json({ message: "Já existe um usuário com esse nome" });
            }

            const newUser = new User({ username, password });
            await newUser.save();
            res.status(201).json({ message: "Usuário criado com sucesso" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao criar usuário` });
        }
    }

    static async loginUser(req, res) {
        try {
            const { username, password } = req.body;
            const foundUser = await User.findOne({ username }).select('+password');

            if (!foundUser) {
                return res.status(401).json({ message: "Usuário não encontrado" });
            }

            const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

            if (isPasswordCorrect) {
                const token = jwt.sign({ userId: foundUser._id }, secretKey, { expiresIn: '1h' });
                res.status(200).json({ message: "Login realizado com sucesso", token });
            } else {
                return res.status(401).json({ message: "Senha incorreta" });
            }
        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha no login` });
        }
    }

    static async updateUser(req, res) {
        try {
            const id = req.params.id;
            await User.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "Usuário atualizado com sucesso" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha ao atualizar usuário` });
        }
    }

    static async deleteUser(req, res) {
        try {
            const id = req.params.id;
            await User.findByIdAndDelete(id);
            res.status(200).json({ message: "Usuário excluído" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - Falha ao excluir usuário` });
        }
    }
}

export default UserController;