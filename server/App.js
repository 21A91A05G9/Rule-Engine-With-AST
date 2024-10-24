import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db.js"; 
import ruleRoutes from './routes/ruleRoute.js';

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
connectDB();
app.use('/api/rules', ruleRoutes);

// Start server
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5011
app.listen(PORT, () => {
    console.log(`Server is running on localhost ${PORT}`);
});
