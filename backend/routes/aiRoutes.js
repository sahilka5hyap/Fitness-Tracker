const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
// const { OpenAI } = require('openai'); // Uncomment if using OpenAI

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/chat', protect, async (req, res) => {
  const { message } = req.body;
  
  try {
    // 1. Get User Context (Crucial for "Personalized" AI)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userContext = `
      User Profile:
      - Name: ${user.name}
      - Age: ${user.age || 25}
      - Weight: ${user.weight || 70}kg
      - Goal: ${user.fitnessGoal || 'General Health'}
    `;

    // --- OPTION A: REAL AI (Uncomment to use) ---
    /*
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert fitness coach called Vitality AI. Keep answers concise, motivating, and formatted with bullet points." },
        { role: "user", content: `Context: ${userContext}. User Question: ${message}` }
      ],
      model: "gpt-3.5-turbo",
    });
    return res.json({ response: completion.choices[0].message.content });
    */

    // --- OPTION B: SMART LOGIC (Works instantly for Demo) ---
    // This generates specific plans based on keywords without needing an API key
    let aiResponse = "";
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('workout') || lowerMsg.includes('plan')) {
      if (user.fitnessGoal === 'Muscle Gain') {
        aiResponse = `💪 **Hypertrophy Plan for ${user.name}**\n\nBased on your goal to gain muscle, here is today's focus:\n\n**Warm-up:**\n- 5 min Light Jog\n- Arm Circles & Dynamic Stretch\n\n**Main Workout:**\n1. Bench Press: 4 sets x 8-12 reps\n2. Incline Dumbbell Press: 3 sets x 10 reps\n3. Overhead Press: 3 sets x 12 reps\n4. Tricep Dips: 3 sets x Failure\n\n**Cool Down:**\n- 5 min Static Stretching`;
      } else if (user.fitnessGoal === 'Weight Loss') {
        aiResponse = `🔥 **Fat Burn Circuit for ${user.name}**\n\nLet's hit your weight loss goal! Try this HIIT session:\n\n**Circuit (Repeat 4x):**\n1. Jumping Jacks (45s)\n2. Bodyweight Squats (45s)\n3. Mountain Climbers (45s)\n4. High Knees (45s)\n5. Rest (60s)\n\n**Finisher:**\n- 10 min Brisk Walk`;
      } else {
        aiResponse = `🧘 **General Wellness Routine**\n\nTo maintain your health at ${user.weight}kg:\n\n1. 20 min Brisk Walk\n2. 3x15 Bodyweight Squats\n3. 3x10 Pushups\n4. 3x30s Plank`;
      }
    } 
    else if (lowerMsg.includes('meal') || lowerMsg.includes('diet') || lowerMsg.includes('nutrition')) {
       if (user.fitnessGoal === 'Muscle Gain') {
        aiResponse = `🍗 **High Protein Day**\n\n**Breakfast:**\n- 3 Eggs Scrambled\n- Oatmeal with Banana\n\n**Lunch:**\n- Grilled Chicken Breast (200g)\n- Rice & Broccoli\n\n**Dinner:**\n- Salmon or Lean Beef\n- Sweet Potato`;
      } else {
        aiResponse = `🥗 **Balanced Nutrition Plan**\n\n**Breakfast:**\n- Greek Yogurt with Berries\n\n**Lunch:**\n- Quinoa Salad with Chickpeas\n\n**Dinner:**\n- Grilled Fish with Asparagus\n\n*Tip: Drink 3L of water today!*`;
      }
    } 
    else {
      aiResponse = `I see you're interested in fitness! As your AI coach, I can generate a **Workout Plan** or a **Meal Plan** specifically for your goal of *${user.fitnessGoal}*. Just ask!`;
    }

    // Simulate AI "Thinking" delay
    setTimeout(() => {
      res.json({ response: aiResponse });
    }, 1000);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI Service Unavailable" });
  }
});

module.exports = router;