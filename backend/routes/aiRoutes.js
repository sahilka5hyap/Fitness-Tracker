const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const { OpenAI } = require('openai');


// Initialize OpenRouter
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY, 
});

const muscleGroupsDB = {
    chest: [
        "💪 **Chest Blaster:**\n1. Bench Press (4 sets x 10 reps)\n2. Incline Dumbbell Press (3 x 12)\n3. Cable Flys (3 x 15)\n4. Pushups (Till Failure)",
        "🔥 **Push Day:**\n1. Weighted Dips (3 x 10)\n2. Dumbbell Pullovers (3 x 12)\n3. Pec Deck Machine (3 x 15)\n4. Decline Pushups (3 x 12)",
        "🏠 **Home Chest:**\n1. Standard Pushups (20 reps)\n2. Wide Grip Pushups (15 reps)\n3. Diamond Pushups (10 reps)\n4. Chair Dips (15 reps)"
    ],
    back: [
        "🦍 **Back Width:**\n1. Pull-ups (3 x Max)\n2. Lat Pulldowns (3 x 12)\n3. Barbell Rows (4 x 8)\n4. Face Pulls (3 x 15)",
        "🐢 **Turtle Shell:**\n1. Deadlifts (3 x 5 - Heavy)\n2. Single Arm Dumbbell Row (3 x 10)\n3. Seated Cable Row (3 x 12)\n4. Shrugs (4 x 15)"
    ],
    legs: [
        "🦵 **Leg Destruction:**\n1. Squats (4 sets x 8 reps)\n2. Leg Press (3 x 12)\n3. Lunges (3 x 10/leg)\n4. Calf Raises (4 x 20)",
        "🏃‍♂️ **Athletic Legs:**\n1. Goblet Squats (3 x 15)\n2. Romanian Deadlifts (3 x 12)\n3. Box Jumps (3 x 10)\n4. Wall Sit (Hold 1 min)"
    ],
    arms: [
        "💪 **Gun Show (Biceps & Triceps):**\n1. Barbell Curls (3 x 12)\n2. Skull Crushers (3 x 12)\n3. Hammer Curls (3 x 12)\n4. Tricep Pushdowns (3 x 15)",
        "👕 **Sleeve Buster:**\n1. Preacher Curls (3 x 12)\n2. Overhead Dumbbell Ext (3 x 12)\n3. Concentration Curls (3 x 15)\n4. Diamond Pushups (Max)"
    ],
    abs: [
        "🍫 **Six Pack Attack:**\n1. Hanging Leg Raises (3 x 12)\n2. Russian Twists (3 x 20)\n3. Plank (Hold 1 min)\n4. Bicycle Crunches (3 x 20)",
        "🔥 **Core Burn:**\n1. Mountain Climbers (40 reps)\n2. Flutter Kicks (30 secs)\n3. Side Plank (45 secs each side)"
    ],
    cardio: [
        "🏃‍♂️ **HIIT Cardio:**\nSprint 30 secs, Walk 30 secs (Repeat 10 mins)",
        "💦 **Sweat Session:**\n10 mins Jump Rope + 50 Burpees + 50 Jumping Jacks",
        "🚶‍♂️ **Steady State:**\n30 mins Incline Walking (Treadmill 12 incline, 3 speed)"
    ]
};

// 2. GENERAL GOAL PLANS (Jab user bas "Workout" mange)
const generalWorkoutsDB = {
    "Weight Loss": [
        "🔥 **Full Body Burn:** 20 Burpees, 30 Mountain Climbers, 1 min Plank, 50 Jumping Jacks (Circuit x 3)",
        "⚡ **Fat Melter:** 15 min Jogging -> 20 Lunges -> 20 Squat Jumps -> 15 Pushups"
    ],
    "Muscle Gain": [
        "🏋️ **Upper Body Power:** Bench Press, Rows, Overhead Press, Pullups (All 3 sets x 8-12 reps)",
        "🏋️ **Lower Body Power:** Squats, Deadlifts, Leg Press, Lunges (Heavy Weights)"
    ],
    "General Health": [
        "🧘‍♂️ **Yoga Flow:** 5 Surya Namaskars + 10 min Meditation + Stretching",
        "🤸 **Daily Move:** 20 Squats, 10 Pushups, 30 sec Plank, 15 min Brisk Walk"
    ]
};

// 3. DIET PLANS (Goal Based)
const dietsDB = {
    "Weight Loss": [
        "🥗 **Low Carb:**\nBreakfast: Omelette (3 whites)\nLunch: Grilled Chicken Salad\nDinner: Boiled Dal/Soup (No Rice)",
        "🥬 **Green Detox:**\nBreakfast: Green Smoothie\nLunch: Quinoa + Veggies\nDinner: Stir-fry Tofu/Paneer"
    ],
    "Muscle Gain": [
        "🍗 **High Protein:**\nBreakfast: Oatmeal + Whey\nLunch: Chicken Breast + Rice + Broccoli\nDinner: 4 Eggs + Sweet Potato",
        "💪 **Bulk Mode:**\nBreakfast: 4 Eggs + Toast + Peanut Butter\nLunch: Roti + Paneer/Chicken Curry\nDinner: Fish + Rice"
    ],
    "General Health": [
        "🍎 **Balanced Indian:**\nBreakfast: Poha/Upma\nLunch: 2 Roti + Sabzi + Dal\nDinner: Light Khichdi + Salad",
        "🥣 **Simple Clean:**\nBreakfast: Muesli + Milk\nLunch: Sandwich (Whole wheat)\nDinner: Soup + Salad"
    ]
};

const tipsDB = [
    "💧 Hydration: Drink 500ml water immediately after waking up.",
    "😴 Recovery: Muscles grow when you sleep, not when you lift. Get 7-8 hours.",
    "🥗 Nutrition: Eat protein within 30 mins post-workout.",
    "🧘 Focus: Mind-muscle connection is more important than heavy weight."
];

router.post('/chat', protect, async (req, res) => {
    try {
        const { message } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(401).json({ response: "User not found." });

        const goal = user.fitnessGoal || 'General Health';
        const text = message ? message.toLowerCase() : "";
        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
        
        let botReply = "";

        // 1. QUICK KEYWORD CHECK (Saves API Credits)
        if (text.includes('chest') || text.includes('pecs')) {
            botReply = pickRandom(muscleGroupsDB.chest);
        }
        else if (text.includes('back') || text.includes('wings')) {
            botReply = pickRandom(muscleGroupsDB.back);
        }
        else if (text.includes('leg') || text.includes('squat')) {
            botReply = pickRandom(muscleGroupsDB.legs);
        }
        else if (text.includes('arm') || text.includes('bicep') || text.includes('tricep')) {
            botReply = pickRandom(muscleGroupsDB.arms);
        }
        else if (text.includes('abs') || text.includes('core')) {
            botReply = pickRandom(muscleGroupsDB.abs);
        }
        else if (text.includes('cardio') || text.includes('stamina')) {
            botReply = pickRandom(muscleGroupsDB.cardio);
        }
        
        // 2. OPENROUTER AI FALLBACK (For complex or unknown queries)
        if (!botReply) {
            const completion = await openai.chat.completions.create({
                model: "google/gemini-2.0-flash-001",
                messages: [
                    { 
                        role: "system", 
                        content: `You are a professional AI Fitness Coach for ${user.name}. 
                        Current Goal: ${goal}. 
                        Weight: ${user.weight}kg, Height: ${user.height}cm.
                        If the user asks for a workout or diet, use these metrics to be specific. 
                        Keep responses concise and motivating.` 
                    },
                    { role: "user", content: message }
                ],
            });
            botReply = completion.choices[0].message.content;
        }

        // Add a random tip only to hardcoded responses to keep AI responses clean
        const finalResponse = text.includes('chest') || text.includes('back') || text.includes('leg') 
            ? `${botReply}\n\n💡 **Pro Tip:** ${pickRandom(tipsDB)}` 
            : botReply;

        res.json({ response: finalResponse });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ response: "AI is offline. Please try again later." });
    }
});

module.exports = router;