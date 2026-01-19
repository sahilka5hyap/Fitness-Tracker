const { exerciseDB, dietDB, quotes } = require('../data/staticDb');

// Helper function: Array me se 'n' random items pick karna
const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const generateSmartPlan = (user) => {
    let goal = user.goal || 'maintenance'; // Default to maintenance
    let strategy = "";

    // 1. BMI Calculation & Logic
    // BMI Logic add kar sakte hain agar user.height aur weight available ho
    if (user.weight && user.height) {
        const heightInMeters = user.height / 100;
        const bmi = user.weight / (heightInMeters * heightInMeters);
        
        if (bmi > 25 && goal === 'maintain') {
             goal = 'weight_loss'; // AI overrides goal based on health
             strategy = "Your BMI is high, so I switched you to a Fat Loss Focus plan.";
        }
    }

    // 2. Data Fetching based on Goal
    const availableExercises = exerciseDB[goal] || exerciseDB['maintenance'];
    const availableDiet = dietDB[goal] || dietDB['muscle_gain']; // Default fallback

    // 3. Randomization (Yahan magic hota hai - Har baar alag 3 exercises)
    const todaysWorkout = getRandomItems(availableExercises, 4); 
    const todaysDiet = getRandomItems(availableDiet, 3);
    const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // 4. Final Response Object
    return {
        goal_detected: goal,
        ai_note: strategy || `Based on your goal: ${goal.toUpperCase()}`,
        motivation: todaysQuote,
        workout_plan: todaysWorkout,
        diet_suggestions: todaysDiet
    };
};

module.exports = { generateSmartPlan };