const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();
const secretKey = process.env.SECRET_KEY;

// Signing a user up
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).send('All fields are required');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Saving the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Generate token with the user's id and the secretKey in the env file
        const token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: '1d',
        });

        // If user details are captured successfully
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send('Error registering user');
    }
};

// Logging in a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if all required fields are provided
        if (!email || !password) {
            return res.status(400).send('All fields are required');
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        // Generate token
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, secretKey, {
            expiresIn: '1d',
        }, { algorithm: 'HS256' });

        // Send response
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            // user: {
            //     name: user.name,
            //     email: user.email,
            // },
            user: {
                id: user.id,
            },
            token,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Error logging in user');
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                name: true,
                email: true,
            },
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).send('Error getting users');
    }
};

module.exports = { signup, login, getUsers };