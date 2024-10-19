const user = require('../Model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const { exec } = require('child_process');
router.use(express.json());

const signup = async (req, res) => {
    const { name, email, password, confirmPassword, age, gender } = req.body;
    if (!name, !email, !password, !confirmPassword) {
        res.status(400).send({ msg: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send({ msg: "Invalid email format" });
    }


    if (password != confirmPassword) {
        return res.status(400).send({ msg: "passwords do not match" });
    }

    try {
        const exist_user = await user.findOne({ email });

        if (exist_user) {
            return res.status(400).send({ msg: "Email already exists" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = new user({ name, email, password: hashedpassword, age: age || undefined, gender: gender || undefined });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.KEY);

        res.status(200).json({ msg: "User Created Successfully", token });

    } catch (err) {
        res.status(500).json(err.message);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ msg: "Invalid email format" });
        }
        const exist_user = await user.findOne({ email });

        if (!exist_user || !await bcrypt.compare(password, exist_user.password)) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: exist_user._id }, process.env.KEY);
        const firstlogin = !exist_user.medicalCondition || exist_user.medicalCondition.length === 0;

        res.status(200).json({ token, firstlogin });

    } catch (err) {
        res.status(500).send(err.message);
    }
}

const image_for_OCR = async (req, res) => {
    const imagePath = path.join(__dirname, '..', req.file.path);
    exec(`python ../../Ingredient-Safety-Analyzer-using-Tesseract-OCR/Ingredient Inspector/main.py ${imagePath}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        res.status(200).json({ extractedText: stdout });
    });
}

module.exports = { signup, login, image_for_OCR };
