const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require("cors")


// Import Routes
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Use Routes
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Error Handling Middleware
const { errorHandler } = require('./auth');
app.use(errorHandler);

const corsOptions = {
    //client/Frontend application URL
    // Allow requests from this origin (The client's URL) the origin is in array form if there are multiple origins.
    origin: ['http://localhost:3000', 'https://blog-post-client-sand.vercel.app'],
    // Allow only specified headers // optional only if you want to restrict the headers
    //allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,
    // Allow only specified HTTP methods // optional only if you want to restrict the methods
    // methods: ['GET', 'POST']
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Database Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))


app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);


if (require.main === module) {
    // "process.env.PORT || 3000" will use the environment variable if it is available OR will used port 3000 if none is defined
    // This syntax will allow flexibility when using the application locally or as a hosted application
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`);
    })
}

module.exports = { app, mongoose };
