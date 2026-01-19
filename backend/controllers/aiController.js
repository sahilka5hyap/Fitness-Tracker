const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { OpenAI } = require('openai');

// Configure OpenRouter
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

const getAIPlan = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Fetch user data from MongoDB
    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // 2. Construct a personalized prompt using the user's data
    const prompt = `
        As an expert AI Fitness Coach, create a personalized plan for:
        - Goal: ${user.goal || 'General Fitness'}
        - Weight: ${user.weight}kg
        - Height: ${user.height}cm
        - Fitness Level: ${user.fitnessLevel || 'Beginner'}
        
        Provide a 1-day workout and nutrition suggestion.
    `;

    try {
        // 3. Call OpenRouter
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "system", content: "You are a professional AI Fitness & Nutrition Coach." },
                { role: "user", content: prompt }
            ],
        });

        const aiPlan = completion.choices[0].message.content;

        // 4. Send the AI result back to the frontend
        res.status(200).json({
            success: true,
            data: aiPlan
        });

    } catch (error) {
        console.error("OpenRouter Error:", error.message);
        res.status(500);
        throw new Error('AI Generation failed');
    }
});

module.exports = { getAIPlan };