require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./controllers/auth');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes); 

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
