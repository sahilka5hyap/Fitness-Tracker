const exercises = [
  // --- CHEST ---
  { name: 'Bench Press (Barbell)', category: 'Strength', muscleGroup: 'Chest', equipment: 'Barbell' },
  { name: 'Push Ups', category: 'Strength', muscleGroup: 'Chest', equipment: 'Bodyweight' },
  { name: 'Chest Fly (Dumbbell)', category: 'Strength', muscleGroup: 'Chest', equipment: 'Dumbbell' },
  
  // --- BACK ---
  { name: 'Pull Ups', category: 'Strength', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { name: 'Deadlift', category: 'Strength', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Lat Pulldown', category: 'Strength', muscleGroup: 'Back', equipment: 'Machine' },
  
  // --- LEGS ---
  { name: 'Squat (Barbell)', category: 'Strength', muscleGroup: 'Legs', equipment: 'Barbell' },
  { name: 'Lunges', category: 'Strength', muscleGroup: 'Legs', equipment: 'Bodyweight' },
  { name: 'Leg Press', category: 'Strength', muscleGroup: 'Legs', equipment: 'Machine' },

  // --- SHOULDERS ---
  { name: 'Overhead Press', category: 'Strength', muscleGroup: 'Shoulders', equipment: 'Barbell' },
  { name: 'Lateral Raise', category: 'Strength', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },

  // --- ARMS ---
  { name: 'Bicep Curl (Dumbbell)', category: 'Strength', muscleGroup: 'Arms', equipment: 'Dumbbell' },
  { name: 'Tricep Dip', category: 'Strength', muscleGroup: 'Arms', equipment: 'Bodyweight' },

  // --- CARDIO ---
  { name: 'Running', category: 'Cardio', muscleGroup: 'Full Body', equipment: 'None' },
  { name: 'Cycling', category: 'Cardio', muscleGroup: 'Legs', equipment: 'Machine' },
  { name: 'Jump Rope', category: 'Cardio', muscleGroup: 'Full Body', equipment: 'Rope' }
];

module.exports = exercises;