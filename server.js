const express = require('express');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./Models/index');
const userRoutes = require('./Routes/userRoutes');

// Setting up your port
const PORT = process.env.PORT || 8080;

// Assigning the variable app to express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes for the user API
app.use('/api/users', userRoutes);

// Listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));

// Connecting to the database
connectToDatabase();