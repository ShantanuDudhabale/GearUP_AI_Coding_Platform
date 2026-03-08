import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/authRoutes.js';    
import connectDB from './Config/database.js';    

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
