import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db.js"; // Ensure the correct path and extension

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5011; // Use PORT from .env or default to 5011
app.listen(PORT, () => {
    console.log(`Server is running on localhost ${PORT}`);
});
