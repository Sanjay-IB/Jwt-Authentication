const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registering a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Please fill all the fields!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Registration failed!" });
    }
});

// Login an existing user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const passwordMatch = await bcrypt.compare(password, checkUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password!" });
        }

        const token = jwt.sign(
            { id: checkUser._id },
            process.env.JWT_SECRETKEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login failed!" });
    }
});

module.exports = router;
