import express from 'express';
import { groq, model } from '../config/groq.js';

const router = express.Router();

/**
 * GENERATION USING GROQ
 */
async function generateAIContent(prompt) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful study assistant. Provide clear, concise, and educational responses."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: model,
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error("Groq Generation Error:", error.message);
        throw new Error("AI service (Groq) failed to generate content.");
    }
}

// Summarize Notes
router.post('/summarize', async (req, res) => {
    try {
        const { noteContent } = req.body;
        if (!noteContent) return res.status(400).json({ error: "Note content is required" });
        const prompt = `Summarize these study notes concisely for a student:\n\n${noteContent}`;
        const summary = await generateAIContent(prompt);
        res.json({ summary });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Explain Concept
router.post('/explain', async (req, res) => {
    try {
        const { selectedText } = req.body;
        if (!selectedText) return res.status(400).json({ error: "Text to explain is required" });
        const prompt = `Explain this concept in simple terms for a student:\n\n${selectedText}`;
        const explanation = await generateAIContent(prompt);
        res.json({ explanation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate Quiz
router.post('/quiz', async (req, res) => {
    try {
        const { noteContent } = req.body;
        if (!noteContent) return res.status(400).json({ error: "Note content is required" });
        const prompt = `Based on these study notes, generate 5 multiple-choice questions with answers:\n\n${noteContent}\n\nFormat each question as:\nQ: [Question]\nA) [Option A]\nB) [Option B]\nC) [Option C]\nD) [Option D]\nCorrect Answer: [Letter]`;
        const quiz = await generateAIContent(prompt);
        res.json({ quiz });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enhance Notes
router.post('/enhance', async (req, res) => {
    try {
        const { noteContent } = req.body;
        if (!noteContent) return res.status(400).json({ error: "Note content is required" });
        const prompt = `Improve and enhance these study notes by fixing grammar, expanding key points, and making them more comprehensive:\n\n${noteContent}`;
        const enhancedNotes = await generateAIContent(prompt);
        res.json({ enhancedNotes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Study Tips
router.post('/study-tips', async (req, res) => {
    try {
        const { noteContent, subject } = req.body;
        if (!noteContent) return res.status(400).json({ error: "Note content is required" });
        const prompt = `Based on these study notes${subject ? ` about ${subject}` : ''}, provide personalized study tips and recommendations:\n\n${noteContent}`;
        const studyTips = await generateAIContent(prompt);
        res.json({ studyTips });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

