require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function connectToDatabase() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Failed to connect to the database:', err);
    }
}

connectToDatabase();

module.exports = { connectToDatabase };