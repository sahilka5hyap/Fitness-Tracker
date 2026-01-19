// Ye hamara "Offline Brain" hai
const exerciseDB = {
    weight_loss: [
        { name: "Burpees", duration: "10 mins", intensity: "High" },
        { name: "Jump Rope", duration: "15 mins", intensity: "High" },
        { name: "Mountain Climbers", duration: "3 sets x 20 reps", intensity: "Medium" },
        { name: "High Knees", duration: "5 mins", intensity: "Medium" },
        { name: "Squat Jumps", duration: "3 sets x 15 reps", intensity: "High" },
        { name: "Plank", duration: "3 sets x 60 sec", intensity: "Low" },
        { name: "Russian Twists", duration: "3 sets x 20 reps", intensity: "Medium" }
    ],
    muscle_gain: [
        { name: "Pushups", duration: "4 sets x 12 reps", intensity: "Medium" },
        { name: "Pull-ups", duration: "3 sets x 8 reps", intensity: "High" },
        { name: "Dumbbell Squats", duration: "4 sets x 10 reps", intensity: "High" },
        { name: "Bench Press", duration: "3 sets x 8 reps", intensity: "High" },
        { name: "Deadlifts", duration: "3 sets x 5 reps", intensity: "Very High" },
        { name: "Bicep Curls", duration: "3 sets x 12 reps", intensity: "Low" },
        { name: "Shoulder Press", duration: "3 sets x 10 reps", intensity: "Medium" }
    ],
    maintenance: [
        { name: "Jogging", duration: "20 mins", intensity: "Low" },
        { name: "Yoga (Surya Namaskar)", duration: "10 rounds", intensity: "Low" },
        { name: "Bodyweight Squats", duration: "3 sets x 15 reps", intensity: "Medium" }
    ]
};

const dietDB = {
    weight_loss: [
        "Oats with water and berries",
        "Boiled Egg Whites (4) + Apple",
        "Grilled Chicken Salad with Lemon Dressing",
        "Moong Dal Khichdi (Less Oil)",
        "Green Tea + 5 Almonds",
        "Vegetable Soup with Black Pepper"
    ],
    muscle_gain: [
        "Banana Shake with Peanut Butter",
        "Chicken Breast with Rice and Broccoli",
        "Paneer Bhurji with 2 Roti",
        "Whey Protein Shake",
        "Soya Chunks Curry with Rice",
        "Omelette (3 Eggs) with Toast"
    ]
};

// Motivation Quotes (Random)
const quotes = [
    "No Pain, No Gain!",
    "Sweat is just fat crying.",
    "Your only limit is you.",
    "Don't stop when you're tired, stop when you're done."
];
module.exports = { workouts, diets, tips };
//module.exports = { exerciseDB, dietDB, quotes };