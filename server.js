import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // ALWAYS FIRST

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


// Initialize Gemini AFTER dotenv
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
    try {

        const userMessage = req.body.message;

        if (!userMessage) {
            return res.json({ reply: "Please ask a question." });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const result = await model.generateContent(userMessage);

        const reply = result.response.text();

        res.json({ reply });

    } catch (error) {

        console.error("Gemini Error:", error);

        res.status(500).json({
            reply: "AI server error."
        });
    }
});
app.use(express.static("public"));
app.listen(3000, () => {
    console.log("Server running on port 3000 🚀");
});
