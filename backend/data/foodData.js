const foods = [
  // --- PROTEINS ---
  { name: 'Egg (Large)', servingSize: '1 unit', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, category: 'Protein' },
  { name: 'Chicken Breast (Cooked)', servingSize: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'Protein' },
  { name: 'Salmon (Grilled)', servingSize: '100g', calories: 208, protein: 20, carbs: 0, fat: 13, category: 'Protein' },
  { name: 'Tofu (Firm)', servingSize: '100g', calories: 144, protein: 17, carbs: 3, fat: 8, category: 'Protein' },
  { name: 'Protein Shake (Whey)', servingSize: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 1, category: 'Supplement' },
  { name: 'Tuna (Canned)', servingSize: '1 can', calories: 132, protein: 29, carbs: 0, fat: 1, category: 'Protein' },

  // --- CARBOHYDRATES ---
  { name: 'White Rice (Cooked)', servingSize: '100g', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: 'Grain' },
  { name: 'Brown Rice (Cooked)', servingSize: '100g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, category: 'Grain' },
  { name: 'Oats (Raw)', servingSize: '50g', calories: 194, protein: 8.5, carbs: 33, fat: 3.5, category: 'Grain' },
  { name: 'Pasta (Cooked)', servingSize: '100g', calories: 158, protein: 5.8, carbs: 31, fat: 0.9, category: 'Grain' },
  { name: 'Bread (Whole Wheat)', servingSize: '1 slice', calories: 92, protein: 3.9, carbs: 17, fat: 1.1, category: 'Grain' },
  { name: 'Sweet Potato (Baked)', servingSize: '1 medium', calories: 103, protein: 2.3, carbs: 23.6, fat: 0.2, category: 'Vegetable' },
  
  // --- FRUITS ---
  { name: 'Banana', servingSize: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, category: 'Fruit' },
  { name: 'Apple', servingSize: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, category: 'Fruit' },
  { name: 'Orange', servingSize: '1 medium', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, category: 'Fruit' },
  { name: 'Blueberries', servingSize: '1 cup', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, category: 'Fruit' },

  // --- DAIRY ---
  { name: 'Milk (Whole)', servingSize: '1 cup', calories: 149, protein: 8, carbs: 12, fat: 8, category: 'Dairy' },
  { name: 'Greek Yogurt (Plain)', servingSize: '1 cup', calories: 130, protein: 23, carbs: 9, fat: 0, category: 'Dairy' },
  { name: 'Cheese (Cheddar)', servingSize: '1 slice', calories: 113, protein: 7, carbs: 0.4, fat: 9, category: 'Dairy' },
  
  // --- FATS & SNACKS ---
  { name: 'Almonds', servingSize: '30g', calories: 172, protein: 6, carbs: 6, fat: 15, category: 'Fat' },
  { name: 'Peanut Butter', servingSize: '1 tbsp', calories: 94, protein: 4, carbs: 3, fat: 8, category: 'Fat' },
  { name: 'Avocado', servingSize: '1/2 unit', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, category: 'Fat' },
];

module.exports = foods;