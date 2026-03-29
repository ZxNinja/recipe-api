#!/usr/bin/env node

const fs = require('fs');

// Read existing database
const data = JSON.parse(fs.readFileSync('database.json', 'utf8'));
let recipes = data.recipes;

// Get the next ID
let nextId = Math.max(...recipes.map(r => parseInt(r.idMeal))) + 1;

// New recipes to add
const newRecipes = [
  // GROW MAIN DISHES - Main dishes for many people (protein-based)
  {
    idMeal: nextId++,
    strMeal: "Chicken Adobo (Family Size)",
    strMealThumb: "https://i.ytimg.com/vi/McDkGgUFE0s/hq720.jpg",
    strCategory: "Chicken",
    grow_glow_category: "grow_main",
    strArea: "Filipino",
    strInstructions: "1. Marinate chicken in soy sauce, vinegar, garlic, bay leaves, and peppercorns for 30 minutes.\n2. Cook in a large pot until chicken is tender.\n3. Simmer until sauce thickens.\n4. Serve with rice.",
    strIngredient1: "Chicken", strMeasure1: "2 kg",
    strIngredient2: "Soy Sauce", strMeasure2: "1 cup",
    strIngredient3: "Vinegar", strMeasure3: "3/4 cup",
    strIngredient4: "Garlic", strMeasure4: "2 heads",
    strIngredient5: "Bay Leaves", strMeasure5: "4 pieces",
    strIngredient6: "Black Peppercorns", strMeasure6: "2 tsp",
    strIngredient7: "Water", strMeasure7: "1 cup",
    calories: 3200, protein: 280, carbs: 20, fat: 220, price: 450,
    calories_per_serving: 320, price_per_serving: 45
  },
  {
    idMeal: nextId++,
    strMeal: "Pork Sinigang (Family Size)",
    strMealThumb: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfm0IMi2YRIbcDBioEgvloi8dfbvQO8RNeNA&s",
    strCategory: "Pork",
    grow_glow_category: "grow_main",
    strArea: "Filipino",
    strInstructions: "1. Boil pork ribs in water with tomatoes and onions.\n2. Add tamarind soup mix and vegetables.\n3. Simmer until pork is tender.\n4. Season with fish sauce and serve hot.",
    strIngredient1: "Pork Ribs", strMeasure1: "1.5 kg",
    strIngredient2: "Tamarind Soup Mix", strMeasure2: "2 packets",
    strIngredient3: "Tomatoes", strMeasure3: "4 pieces",
    strIngredient4: "Onions", strMeasure4: "3 pieces",
    strIngredient5: "Eggplant", strMeasure5: "3 pieces",
    strIngredient6: "Kangkong", strMeasure6: "1 bunch",
    strIngredient7: "Fish Sauce", strMeasure7: "3 tbsp",
    calories: 2800, protein: 220, carbs: 45, fat: 180, price: 380,
    calories_per_serving: 280, price_per_serving: 38
  },
  {
    idMeal: nextId++,
    strMeal: "Beef Caldereta (Family Size)",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Beef",
    grow_glow_category: "grow_main",
    strArea: "Filipino",
    strInstructions: "1. Sauté garlic, onions, and beef.\n2. Add tomato sauce, liver spread, and broth.\n3. Simmer until beef is tender.\n4. Add potatoes, carrots, and bell peppers.\n5. Serve with rice.",
    strIngredient1: "Beef", strMeasure1: "1.5 kg",
    strIngredient2: "Tomato Sauce", strMeasure2: "2 cups",
    strIngredient3: "Liver Spread", strMeasure3: "1/2 cup",
    strIngredient4: "Potatoes", strMeasure4: "4 pieces",
    strIngredient5: "Carrots", strMeasure5: "4 pieces",
    strIngredient6: "Bell Peppers", strMeasure6: "2 pieces",
    strIngredient7: "Garlic", strMeasure7: "1 head",
    calories: 3500, protein: 250, carbs: 80, fat: 240, price: 520,
    calories_per_serving: 350, price_per_serving: 52
  },
  {
    idMeal: nextId++,
    strMeal: "Fish Tinola (Family Size)",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Seafood",
    grow_glow_category: "grow_main",
    strArea: "Filipino",
    strInstructions: "1. Sauté garlic, onions, and ginger.\n2. Add fish and water.\n3. Simmer until fish is cooked.\n4. Add malunggay leaves.\n5. Season with fish sauce.",
    strIngredient1: "Fish", strMeasure1: "1.5 kg",
    strIngredient2: "Ginger", strMeasure2: "2 thumbs",
    strIngredient3: "Garlic", strMeasure3: "1 head",
    strIngredient4: "Onions", strMeasure4: "2 pieces",
    strIngredient5: "Malunggay Leaves", strMeasure5: "2 cups",
    strIngredient6: "Fish Sauce", strMeasure6: "3 tbsp",
    strIngredient7: "Water", strMeasure7: "8 cups",
    calories: 2200, protein: 280, carbs: 25, fat: 120, price: 420,
    calories_per_serving: 220, price_per_serving: 42
  },
  {
    idMeal: nextId++,
    strMeal: "Chicken Inasal (Family Size)",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Chicken",
    grow_glow_category: "grow_main",
    strArea: "Filipino",
    strInstructions: "1. Marinate chicken in vinegar, garlic, and spices.\n2. Grill until cooked.\n3. Serve with achuete rice and dipping sauce.",
    strIngredient1: "Chicken", strMeasure1: "2 kg",
    strIngredient2: "Vinegar", strMeasure2: "1 cup",
    strIngredient3: "Garlic", strMeasure3: "2 heads",
    strIngredient4: "Ginger", strMeasure4: "1 thumb",
    strIngredient5: "Calamansi", strMeasure5: "10 pieces",
    strIngredient6: "Annatto Seeds", strMeasure6: "2 tbsp",
    strIngredient7: "Lemongrass", strMeasure7: "4 stalks",
    calories: 3100, protein: 290, carbs: 30, fat: 210, price: 480,
    calories_per_serving: 310, price_per_serving: 48
  },

  // GROW SIDE DISHES - Smaller portions of protein-based dishes
  {
    idMeal: nextId++,
    strMeal: "Small Pork Adobo",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Pork",
    grow_glow_category: "grow_side",
    strArea: "Filipino",
    strInstructions: "1. Marinate pork in soy sauce, vinegar, garlic for 15 minutes.\n2. Cook until tender.\n3. Serve as side dish.",
    strIngredient1: "Pork Belly", strMeasure1: "300g",
    strIngredient2: "Soy Sauce", strMeasure2: "2 tbsp",
    strIngredient3: "Vinegar", strMeasure3: "1 tbsp",
    strIngredient4: "Garlic", strMeasure4: "3 cloves",
    strIngredient5: "Bay Leaves", strMeasure5: "1 piece",
    calories: 850, protein: 45, carbs: 5, fat: 70, price: 120,
    calories_per_serving: 425, price_per_serving: 60
  },
  {
    idMeal: nextId++,
    strMeal: "Chicken Tocino (Side Portion)",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Chicken",
    grow_glow_category: "grow_side",
    strArea: "Filipino",
    strInstructions: "1. Marinate chicken in sugar, soy sauce, and spices.\n2. Cook until caramelized.\n3. Serve as side.",
    strIngredient1: "Chicken Thigh", strMeasure1: "250g",
    strIngredient2: "Brown Sugar", strMeasure2: "2 tbsp",
    strIngredient3: "Soy Sauce", strMeasure3: "1 tbsp",
    strIngredient4: "Garlic", strMeasure4: "2 cloves",
    strIngredient5: "Anise Powder", strMeasure5: "1/4 tsp",
    calories: 650, protein: 35, carbs: 25, fat: 45, price: 95,
    calories_per_serving: 325, price_per_serving: 48
  },
  {
    idMeal: nextId++,
    strMeal: "Small Beef Tapa",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Beef",
    grow_glow_category: "grow_side",
    strArea: "Filipino",
    strInstructions: "1. Marinate beef in soy sauce and spices.\n2. Cook until tender.\n3. Fry until crispy.",
    strIngredient1: "Beef", strMeasure1: "200g",
    strIngredient2: "Soy Sauce", strMeasure2: "2 tbsp",
    strIngredient3: "Garlic", strMeasure3: "2 cloves",
    strIngredient4: "Calamansi", strMeasure4: "2 pieces",
    strIngredient5: "Black Pepper", strMeasure5: "1/4 tsp",
    calories: 720, protein: 40, carbs: 8, fat: 55, price: 110,
    calories_per_serving: 360, price_per_serving: 55
  },

  // GLOW MAIN DISHES - Vegetable-based main dishes for many people
  {
    idMeal: nextId++,
    strMeal: "Munggo with Malunggay (Family Size)",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Vegetable",
    grow_glow_category: "glow_main",
    strArea: "Filipino",
    strInstructions: "1. Boil munggo until soft.\n2. Sauté garlic, onions, tomatoes.\n3. Add boiled munggo and broth.\n4. Add malunggay leaves.\n5. Season with bagoong alamang.",
    strIngredient1: "Munggo", strMeasure1: "1 kg",
    strIngredient2: "Malunggay Leaves", strMeasure2: "4 cups",
    strIngredient3: "Garlic", strMeasure3: "1 head",
    strIngredient4: "Onions", strMeasure4: "2 pieces",
    strIngredient5: "Tomatoes", strMeasure5: "3 pieces",
    strIngredient6: "Fish Sauce", strMeasure6: "2 tbsp",
    strIngredient7: "Water", strMeasure7: "10 cups",
    calories: 1800, protein: 120, carbs: 280, fat: 25, price: 180,
    calories_per_serving: 180, price_per_serving: 18
  },
  {
    idMeal: nextId++,
    strMeal: "Tortang Talong (Family Size)",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Vegetable",
    grow_glow_category: "glow_main",
    strArea: "Filipino",
    strInstructions: "1. Grill eggplants until charred.\n2. Peel and flatten.\n3. Dip in egg mixture.\n4. Fry until golden.\n5. Serve with bagoong alamang.",
    strIngredient1: "Eggplant", strMeasure1: "8 pieces",
    strIngredient2: "Eggs", strMeasure2: "6 pieces",
    strIngredient3: "Onions", strMeasure3: "2 pieces",
    strIngredient4: "Tomatoes", strMeasure4: "2 pieces",
    strIngredient5: "Cooking Oil", strMeasure5: "1/2 cup",
    strIngredient6: "Salt", strMeasure6: "1 tsp",
    strIngredient7: "Ground Pepper", strMeasure7: "1/2 tsp",
    calories: 1600, protein: 70, carbs: 120, fat: 110, price: 140,
    calories_per_serving: 160, price_per_serving: 14
  },
  {
    idMeal: nextId++,
    strMeal: "Pinakbet (Family Size)",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Vegetable",
    grow_glow_category: "glow_main",
    strArea: "Filipino",
    strInstructions: "1. Sauté garlic, onions, tomatoes.\n2. Add bitter melon, eggplant, okra, and squash.\n3. Add bagoong alamang.\n4. Simmer until vegetables are tender.",
    strIngredient1: "Bitter Melon", strMeasure1: "2 pieces",
    strIngredient2: "Eggplant", strMeasure2: "4 pieces",
    strIngredient3: "Okra", strMeasure3: "10 pieces",
    strIngredient4: "Calabaza Squash", strMeasure4: "1/2 piece",
    strIngredient5: "Tomatoes", strMeasure5: "3 pieces",
    strIngredient6: "Garlic", strMeasure6: "1 head",
    strIngredient7: "Bagoong Alamang", strMeasure7: "4 tbsp",
    calories: 1200, protein: 60, carbs: 180, fat: 30, price: 160,
    calories_per_serving: 120, price_per_serving: 16
  },
  {
    idMeal: nextId++,
    strMeal: "Chopsuey (Family Size)",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Vegetable",
    grow_glow_category: "glow_main",
    strArea: "Filipino",
    strInstructions: "1. Sauté garlic and onions.\n2. Add cauliflower, broccoli, carrots, and bell peppers.\n3. Add broth and cornstarch.\n4. Simmer until vegetables are tender.",
    strIngredient1: "Cauliflower", strMeasure1: "1 head",
    strIngredient2: "Broccoli", strMeasure2: "1 bunch",
    strIngredient3: "Carrots", strMeasure3: "4 pieces",
    strIngredient4: "Bell Peppers", strMeasure4: "3 pieces",
    strIngredient5: "Garlic", strMeasure5: "1 head",
    strIngredient6: "Onions", strMeasure6: "2 pieces",
    strIngredient7: "Cornstarch", strMeasure7: "2 tbsp",
    calories: 1400, protein: 70, carbs: 220, fat: 35, price: 200,
    calories_per_serving: 140, price_per_serving: 20
  },

  // GLOW SIDE DISHES - Smaller portions of vegetable-based dishes
  {
    idMeal: nextId++,
    strMeal: "Small Munggo",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Vegetable",
    grow_glow_category: "glow_side",
    strArea: "Filipino",
    strInstructions: "1. Boil 300g munggo until soft.\n2. Sauté garlic, onions.\n3. Add munggo and water.\n4. Season lightly.",
    strIngredient1: "Munggo", strMeasure1: "300g",
    strIngredient2: "Garlic", strMeasure2: "2 cloves",
    strIngredient3: "Onions", strMeasure3: "1/2 piece",
    strIngredient4: "Water", strMeasure4: "3 cups",
    strIngredient5: "Fish Sauce", strMeasure5: "1 tsp",
    calories: 450, protein: 30, carbs: 70, fat: 6, price: 45,
    calories_per_serving: 225, price_per_serving: 23
  },
  {
    idMeal: nextId++,
    strMeal: "Small Pinakbet",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Vegetable",
    grow_glow_category: "glow_side",
    strArea: "Filipino",
    strInstructions: "1. Sauté garlic and tomatoes.\n2. Add sliced vegetables.\n3. Add bagoong alamang.\n4. Cook until tender.",
    strIngredient1: "Bitter Melon", strMeasure1: "1/2 piece",
    strIngredient2: "Eggplant", strMeasure2: "1 piece",
    strIngredient3: "Okra", strMeasure3: "3 pieces",
    strIngredient4: "Tomatoes", strMeasure4: "1 piece",
    strIngredient5: "Garlic", strMeasure5: "2 cloves",
    strIngredient6: "Bagoong Alamang", strMeasure6: "1 tbsp",
    calories: 300, protein: 15, carbs: 45, fat: 8, price: 40,
    calories_per_serving: 150, price_per_serving: 20
  },
  {
    idMeal: nextId++,
    strMeal: "Small Chopsuey",
    strMealThumb: "https://i.ytimg.com/vi/example.jpg",
    strCategory: "Vegetable",
    grow_glow_category: "glow_side",
    strArea: "Filipino",
    strInstructions: "1. Sauté garlic and onions.\n2. Add mixed vegetables.\n3. Add water and simmer.\n4. Thicken with cornstarch.",
    strIngredient1: "Cauliflower", strMeasure1: "1 cup",
    strIngredient2: "Broccoli", strMeasure2: "1 cup",
    strIngredient3: "Carrots", strMeasure3: "1 piece",
    strIngredient4: "Garlic", strMeasure4: "2 cloves",
    strIngredient5: "Onions", strMeasure5: "1/2 piece",
    strIngredient6: "Cornstarch", strMeasure6: "1 tsp",
    calories: 350, protein: 18, carbs: 55, fat: 9, price: 50,
    calories_per_serving: 175, price_per_serving: 25
  }
];

// Add empty ingredients and measures for consistency
newRecipes.forEach(recipe => {
  for (let i = 8; i <= 20; i++) {
    recipe[`strIngredient${i}`] = "";
    recipe[`strMeasure${i}`] = "";
  }
  recipe.strYoutube = "";
  recipe.price_min = recipe.price;
  recipe.price_max = Math.round(recipe.price * 1.2);
  recipe.price_planned = Math.round(recipe.price * 1.1);
  recipe.price_per_serving_min = recipe.price_per_serving;
  recipe.price_per_serving_max = Math.round(recipe.price_per_serving * 1.2);
  recipe.price_per_serving_planned = Math.round(recipe.price_per_serving * 1.1);
  recipe.sources = ["Local market average", "Supermarket price"];
  recipe.calculated_at = new Date().toISOString();
  recipe.nutrition_sources = ["USDA FoodData Central"];
  recipe.nutrition_calculated_at = new Date().toISOString();
  recipe.nutrition_assumptions = { servings_used: 4, per_piece_defaults_applied: 0 };
});

// Add new recipes to existing ones
recipes.push(...newRecipes);

// Write back to file
fs.writeFileSync('database.json', JSON.stringify(data, null, 2));

console.log(`Added ${newRecipes.length} new recipes. Total recipes: ${recipes.length}`);</content>
<parameter name="filePath">c:\Users\johnn\OneDrive\Documents\PlanPlate\recipe-api-main\add_recipes.js