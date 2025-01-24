// Importing modules
const express = require("express");
const { PrismaClient } = require("@prisma/client");

// Initializing Prisma Client
const prisma = new PrismaClient();

// Function to check if name or email already exist in the database
// this is to avoid having two users with the same name and email
const saveUser = async (req, res, next) => {
    try {
        // Search the database to see if user exists
        const name = await prisma.user.findUnique({
            where: {
                name: req.body.name,
            },
        });

        // If name exists in the database respond with a status of 409
        if (name) {
            return res.status(409).send("name is already taken");
        }

        // Checking if email already exists
        const emailcheck = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        // If email exists in the database respond with a status of 409
        if (emailcheck) {
            return res.status(409).send("Authentication failed");
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Error checking user:', err);
        res.status(500).send("Internal server error");
    }
};

module.exports = { saveUser };