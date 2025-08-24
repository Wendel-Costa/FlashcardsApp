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
            res.status(500).json({ message: `${error.message} - failed to list users` });
        }
    }

    static async getUserById(req, res) {
        try {
            const id = req.params.id;
            const foundUser = await User.findById(id).populate('cards');
            res.status(200).json(foundUser);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to request user` });
        }
    }

    static async createUser(req, res) {
        try {
            const newUser = await User.create(req.body);
            res.status(201).json({ message: "User created successfully", user: newUser });
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
                res.status(400).json({ message: "Username already exists." });
            } else {
                res.status(500).json({ message: `${error.message} - failed to create user` });
            }
        }
    }

    static async registerUser(req, res) {
        try {
            const { username, password } = req.body;
            const existingUser = await User.findOne({ username });

            if (existingUser) {
                return res.status(409).json({ message: "Username already exists." });
            }

            const newUser = new User({ username, password });
            await newUser.save();
            res.status(201).json({ message: "User registered successfully!" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to register user` });
        }
    }

    static async loginUser(req, res) {
        try {
            const { username, password } = req.body;
            const foundUser = await User.findOne({ username }).select('+password');

            if (!foundUser) {
                return res.status(401).json({ message: "User not found." });
            }

            const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

            if (isPasswordCorrect) {
                const token = jwt.sign({ userId: foundUser._id }, secretKey, { expiresIn: '1h' });
                res.status(200).json({ message: "Login successful!", token });
            } else {
                return res.status(401).json({ message: "Incorrect password." });
            }
        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to login` });
        }
    }

    static async updateUser(req, res) {
        try {
            const id = req.params.id;
            await User.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to update user` });
        }
    }

    static async deleteUser(req, res) {
        try {
            const id = req.params.id;
            await User.findByIdAndDelete(id);
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - failed to delete user` });
        }
    }
}

export default UserController;