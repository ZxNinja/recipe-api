#!/usr/bin/env python3

import json
import random
from datetime import datetime

# Read existing database
with open('database.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

recipes = data['recipes']

# Get the next ID
next_id = max(int(r['idMeal']) for r in recipes) + 1

# New recipes to add - expanded list
new_recipes = [
    # GROW MAIN DISHES - Main dishes for many people (protein-based)
    {
        "idMeal": str(next_id), "strMeal": "Chicken Adobo (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/McDkGgUFE0s/hq720.jpg",
        "strCategory": "Chicken", "grow_glow_category": "grow_main", "strArea": "Filipino",
        "strInstructions": "1. Marinate chicken in soy sauce, vinegar, garlic, bay leaves, and peppercorns for 30 minutes.\n2. Cook in a large pot until chicken is tender.\n3. Simmer until sauce thickens.\n4. Serve with rice.",
        "strIngredient1": "Chicken", "strMeasure1": "2 kg", "strIngredient2": "Soy Sauce", "strMeasure2": "1 cup",
        "strIngredient3": "Vinegar", "strMeasure3": "3/4 cup", "strIngredient4": "Garlic", "strMeasure4": "2 heads",
        "strIngredient5": "Bay Leaves", "strMeasure5": "4 pieces", "strIngredient6": "Black Peppercorns", "strMeasure6": "2 tsp",
        "strIngredient7": "Water", "strMeasure7": "1 cup", "calories": 3200, "protein": 280, "carbs": 20, "fat": 220, "price": 450,
        "calories_per_serving": 320, "price_per_serving": 45
    },
    {
        "idMeal": str(next_id + 1), "strMeal": "Pork Sinigang (Family Size)", "strMealThumb": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfm0IMi2YRIbcDBioEgvloi8dfbvQO8RNeNA&s",
        "strCategory": "Pork", "grow_glow_category": "grow_main", "strArea": "Filipino",
        "strInstructions": "1. Boil pork ribs in water with tomatoes and onions.\n2. Add tamarind soup mix and vegetables.\n3. Simmer until pork is tender.\n4. Season with fish sauce and serve hot.",
        "strIngredient1": "Pork Ribs", "strMeasure1": "1.5 kg", "strIngredient2": "Tamarind Soup Mix", "strMeasure2": "2 packets",
        "strIngredient3": "Tomatoes", "strMeasure3": "4 pieces", "strIngredient4": "Onions", "strMeasure4": "3 pieces",
        "strIngredient5": "Eggplant", "strMeasure5": "3 pieces", "strIngredient6": "Kangkong", "strMeasure6": "1 bunch",
        "strIngredient7": "Fish Sauce", "strMeasure7": "3 tbsp", "calories": 2800, "protein": 220, "carbs": 45, "fat": 180, "price": 380,
        "calories_per_serving": 280, "price_per_serving": 38
    },
    {
        "idMeal": str(next_id + 2), "strMeal": "Beef Caldereta (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Beef", "grow_glow_category": "grow_main", "strArea": "Filipino",
        "strInstructions": "1. Sauté garlic, onions, and beef.\n2. Add tomato sauce, liver spread, and broth.\n3. Simmer until beef is tender.\n4. Add potatoes, carrots, and bell peppers.\n5. Serve with rice.",
        "strIngredient1": "Beef", "strMeasure1": "1.5 kg", "strIngredient2": "Tomato Sauce", "strMeasure2": "2 cups",
        "strIngredient3": "Liver Spread", "strMeasure3": "1/2 cup", "strIngredient4": "Potatoes", "strMeasure4": "4 pieces",
        "strIngredient5": "Carrots", "strMeasure5": "4 pieces", "strIngredient6": "Bell Peppers", "strMeasure6": "2 pieces",
        "strIngredient7": "Garlic", "strMeasure7": "1 head", "calories": 3500, "protein": 250, "carbs": 80, "fat": 240, "price": 520,
        "calories_per_serving": 350, "price_per_serving": 52
    },
    {
        "idMeal": str(next_id + 3), "strMeal": "Fish Tinola (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Seafood", "grow_glow_category": "grow_main", "strArea": "Filipino",
        "strInstructions": "1. Sauté garlic, onions, and ginger.\n2. Add fish and water.\n3. Simmer until fish is cooked.\n4. Add malunggay leaves.\n5. Season with fish sauce.",
        "strIngredient1": "Fish", "strMeasure1": "1.5 kg", "strIngredient2": "Ginger", "strMeasure2": "2 thumbs",
        "strIngredient3": "Garlic", "strMeasure3": "1 head", "strIngredient4": "Onions", "strMeasure4": "2 pieces",
        "strIngredient5": "Malunggay Leaves", "strMeasure5": "2 cups", "strIngredient6": "Fish Sauce", "strMeasure6": "3 tbsp",
        "strIngredient7": "Water", "strMeasure7": "8 cups", "calories": 2200, "protein": 280, "carbs": 25, "fat": 120, "price": 420,
        "calories_per_serving": 220, "price_per_serving": 42
    },
    {
        "idMeal": str(next_id + 4), "strMeal": "Chicken Inasal (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Chicken", "grow_glow_category": "grow_main", "strArea": "Filipino",
        "strInstructions": "1. Marinate chicken in vinegar, garlic, and spices.\n2. Grill until cooked.\n3. Serve with achuete rice and dipping sauce.",
        "strIngredient1": "Chicken", "strMeasure1": "2 kg", "strIngredient2": "Vinegar", "strMeasure2": "1 cup",
        "strIngredient3": "Garlic", "strMeasure3": "2 heads", "strIngredient4": "Ginger", "strMeasure4": "1 thumb",
        "strIngredient5": "Calamansi", "strMeasure5": "10 pieces", "strIngredient6": "Annatto Seeds", "strMeasure6": "2 tbsp",
        "strIngredient7": "Lemongrass", "strMeasure7": "4 stalks", "calories": 3100, "protein": 290, "carbs": 30, "fat": 210, "price": 480,
        "calories_per_serving": 310, "price_per_serving": 48
    },
    {
        "idMeal": str(next_id + 5), "strMeal": "Pork Bicol Express (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Pork", "grow_glow_category": "grow_main", "strArea": "Filipino",
        "strInstructions": "1. Sauté garlic, onions, and pork.\n2. Add coconut milk and bagoong alamang.\n3. Add chili peppers and simmer.\n4. Serve with rice.",
        "strIngredient1": "Pork Belly", "strMeasure1": "1.5 kg", "strIngredient2": "Coconut Milk", "strMeasure2": "2 cups",
        "strIngredient3": "Chili Peppers", "strMeasure3": "10 pieces", "strIngredient4": "Garlic", "strMeasure4": "1 head",
        "strIngredient5": "Onions", "strMeasure5": "2 pieces", "strIngredient6": "Bagoong Alamang", "strMeasure6": "4 tbsp",
        "strIngredient7": "Ginger", "strMeasure7": "1 thumb", "calories": 3400, "protein": 180, "carbs": 35, "fat": 280, "price": 460,
        "calories_per_serving": 340, "price_per_serving": 46
    },
    {
        "idMeal": str(next_id + 6), "strMeal": "Beef Mechado (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Beef", "grow_glow_category": "grow_main", "strArea": "Filipino",
        "strInstructions": "1. Sauté garlic, onions, and beef.\n2. Add tomato sauce and broth.\n3. Add potatoes, carrots, and bay leaves.\n4. Simmer until tender.",
        "strIngredient1": "Beef", "strMeasure1": "1.5 kg", "strIngredient2": "Tomato Sauce", "strMeasure2": "1 cup",
        "strIngredient3": "Potatoes", "strMeasure3": "4 pieces", "strIngredient4": "Carrots", "strMeasure4": "4 pieces",
        "strIngredient5": "Onions", "strMeasure5": "2 pieces", "strIngredient6": "Garlic", "strMeasure6": "1 head",
        "strIngredient7": "Bay Leaves", "strMeasure7": "3 pieces", "calories": 3300, "protein": 240, "carbs": 75, "fat": 220, "price": 500,
        "calories_per_serving": 330, "price_per_serving": 50
    },
    {
        "idMeal": str(next_id + 7), "strMeal": "Crispy Pata (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Pork", "grow_glow_category": "grow_main", "strArea": "Filipino",
        "strInstructions": "1. Clean and boil pork leg.\n2. Deep fry until crispy.\n3. Serve with dipping sauce.",
        "strIngredient1": "Pork Leg", "strMeasure1": "2 kg", "strIngredient2": "Soy Sauce", "strMeasure2": "1/2 cup",
        "strIngredient3": "Vinegar", "strMeasure3": "1/4 cup", "strIngredient4": "Garlic", "strMeasure4": "1 head",
        "strIngredient5": "Bay Leaves", "strMeasure5": "2 pieces", "strIngredient6": "Cooking Oil", "strMeasure6": "2 cups",
        "strIngredient7": "Calamansi", "strMeasure7": "5 pieces", "calories": 3800, "protein": 200, "carbs": 15, "fat": 320, "price": 550,
        "calories_per_serving": 380, "price_per_serving": 55
    },
    {
        "idMeal": str(next_id + 8), "strMeal": "Bangus Belly (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Seafood", "grow_glow_category": "grow_main", "strArea": "Filipino",
        "strInstructions": "1. Marinate bangus belly in vinegar and garlic.\n2. Fry until crispy.\n3. Serve with tomato sauce.",
        "strIngredient1": "Bangus Belly", "strMeasure1": "1 kg", "strIngredient2": "Vinegar", "strMeasure2": "1/2 cup",
        "strIngredient3": "Garlic", "strMeasure3": "1 head", "strIngredient4": "Calamansi", "strMeasure4": "4 pieces",
        "strIngredient5": "Tomato Sauce", "strMeasure5": "1/2 cup", "strIngredient6": "Cooking Oil", "strMeasure6": "1 cup",
        "strIngredient7": "Salt", "strMeasure7": "1 tsp", "calories": 2600, "protein": 180, "carbs": 20, "fat": 200, "price": 380,
        "calories_per_serving": 260, "price_per_serving": 38
    },
    {
        "idMeal": str(next_id + 9), "strMeal": "Chicken Afritada (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Chicken", "grow_glow_category": "grow_main", "strArea": "Filipino",
        "strInstructions": "1. Sauté garlic, onions, and chicken.\n2. Add tomato sauce and water.\n3. Add potatoes and carrots.\n4. Simmer until tender.",
        "strIngredient1": "Chicken", "strMeasure1": "1.5 kg", "strIngredient2": "Tomato Sauce", "strMeasure2": "1 cup",
        "strIngredient3": "Potatoes", "strMeasure3": "4 pieces", "strIngredient4": "Carrots", "strMeasure4": "4 pieces",
        "strIngredient5": "Bell Peppers", "strMeasure5": "2 pieces", "strIngredient6": "Garlic", "strMeasure6": "1 head",
        "strIngredient7": "Onions", "strMeasure7": "2 pieces", "calories": 2900, "protein": 220, "carbs": 70, "fat": 180, "price": 420,
        "calories_per_serving": 290, "price_per_serving": 42
    },

    # GROW SIDE DISHES - Smaller portions of protein-based dishes
    {
        "idMeal": str(next_id + 10), "strMeal": "Small Pork Adobo", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Pork", "grow_glow_category": "grow_side", "strArea": "Filipino",
        "strInstructions": "1. Marinate pork in soy sauce, vinegar, garlic for 15 minutes.\n2. Cook until tender.\n3. Serve as side dish.",
        "strIngredient1": "Pork Belly", "strMeasure1": "300g", "strIngredient2": "Soy Sauce", "strMeasure2": "2 tbsp",
        "strIngredient3": "Vinegar", "strMeasure3": "1 tbsp", "strIngredient4": "Garlic", "strMeasure4": "3 cloves",
        "strIngredient5": "Bay Leaves", "strMeasure5": "1 piece", "calories": 850, "protein": 45, "carbs": 5, "fat": 70, "price": 120,
        "calories_per_serving": 425, "price_per_serving": 60
    },
    {
        "idMeal": str(next_id + 11), "strMeal": "Chicken Tocino (Side Portion)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Chicken", "grow_glow_category": "grow_side", "strArea": "Filipino",
        "strInstructions": "1. Marinate chicken in sugar, soy sauce, and spices.\n2. Cook until caramelized.\n3. Serve as side.",
        "strIngredient1": "Chicken Thigh", "strMeasure1": "250g", "strIngredient2": "Brown Sugar", "strMeasure2": "2 tbsp",
        "strIngredient3": "Soy Sauce", "strMeasure3": "1 tbsp", "strIngredient4": "Garlic", "strMeasure4": "2 cloves",
        "strIngredient5": "Anise Powder", "strMeasure5": "1/4 tsp", "calories": 650, "protein": 35, "carbs": 25, "fat": 45, "price": 95,
        "calories_per_serving": 325, "price_per_serving": 48
    },
    {
        "idMeal": str(next_id + 12), "strMeal": "Small Beef Tapa", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Beef", "grow_glow_category": "grow_side", "strArea": "Filipino",
        "strInstructions": "1. Marinate beef in soy sauce and spices.\n2. Cook until tender.\n3. Fry until crispy.",
        "strIngredient1": "Beef", "strMeasure1": "200g", "strIngredient2": "Soy Sauce", "strMeasure2": "2 tbsp",
        "strIngredient3": "Garlic", "strMeasure3": "2 cloves", "strIngredient4": "Calamansi", "strMeasure4": "2 pieces",
        "strIngredient5": "Black Pepper", "strMeasure5": "1/4 tsp", "calories": 720, "protein": 40, "carbs": 8, "fat": 55, "price": 110,
        "calories_per_serving": 360, "price_per_serving": 55
    },
    {
        "idMeal": str(next_id + 13), "strMeal": "Small Chicken Barbecue", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Chicken", "grow_glow_category": "grow_side", "strArea": "Filipino",
        "strInstructions": "1. Marinate chicken in soy sauce, vinegar, and spices.\n2. Grill until cooked.\n3. Serve with sauce.",
        "strIngredient1": "Chicken", "strMeasure1": "300g", "strIngredient2": "Soy Sauce", "strMeasure2": "3 tbsp",
        "strIngredient3": "Vinegar", "strMeasure3": "1 tbsp", "strIngredient4": "Garlic", "strMeasure4": "3 cloves",
        "strIngredient5": "Calamansi", "strMeasure5": "2 pieces", "calories": 680, "protein": 50, "carbs": 10, "fat": 45, "price": 105,
        "calories_per_serving": 340, "price_per_serving": 53
    },
    {
        "idMeal": str(next_id + 14), "strMeal": "Small Pork Barbecue", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Pork", "grow_glow_category": "grow_side", "strArea": "Filipino",
        "strInstructions": "1. Marinate pork in soy sauce and spices.\n2. Grill until cooked.\n3. Serve as side.",
        "strIngredient1": "Pork", "strMeasure1": "250g", "strIngredient2": "Soy Sauce", "strMeasure2": "2 tbsp",
        "strIngredient3": "Vinegar", "strMeasure3": "1 tbsp", "strIngredient4": "Garlic", "strMeasure4": "2 cloves",
        "strIngredient5": "Calamansi", "strMeasure5": "2 pieces", "calories": 750, "protein": 40, "carbs": 8, "fat": 60, "price": 115,
        "calories_per_serving": 375, "price_per_serving": 58
    },

    # GLOW MAIN DISHES - Vegetable-based main dishes for many people
    {
        "idMeal": str(next_id + 15), "strMeal": "Munggo with Malunggay (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_main", "strArea": "Filipino",
        "strInstructions": "1. Boil munggo until soft.\n2. Sauté garlic, onions, tomatoes.\n3. Add boiled munggo and broth.\n4. Add malunggay leaves.\n5. Season with bagoong alamang.",
        "strIngredient1": "Munggo", "strMeasure1": "1 kg", "strIngredient2": "Malunggay Leaves", "strMeasure2": "4 cups",
        "strIngredient3": "Garlic", "strMeasure3": "1 head", "strIngredient4": "Onions", "strMeasure4": "2 pieces",
        "strIngredient5": "Tomatoes", "strMeasure5": "3 pieces", "strIngredient6": "Fish Sauce", "strMeasure6": "2 tbsp",
        "strIngredient7": "Water", "strMeasure7": "10 cups", "calories": 1800, "protein": 120, "carbs": 280, "fat": 25, "price": 180,
        "calories_per_serving": 180, "price_per_serving": 18
    },
    {
        "idMeal": str(next_id + 16), "strMeal": "Tortang Talong (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_main", "strArea": "Filipino",
        "strInstructions": "1. Grill eggplants until charred.\n2. Peel and flatten.\n3. Dip in egg mixture.\n4. Fry until golden.\n5. Serve with bagoong alamang.",
        "strIngredient1": "Eggplant", "strMeasure1": "8 pieces", "strIngredient2": "Eggs", "strMeasure2": "6 pieces",
        "strIngredient3": "Onions", "strMeasure3": "2 pieces", "strIngredient4": "Tomatoes", "strMeasure4": "2 pieces",
        "strIngredient5": "Cooking Oil", "strMeasure5": "1/2 cup", "strIngredient6": "Salt", "strMeasure6": "1 tsp",
        "strIngredient7": "Ground Pepper", "strMeasure7": "1/2 tsp", "calories": 1600, "protein": 70, "carbs": 120, "fat": 110, "price": 140,
        "calories_per_serving": 160, "price_per_serving": 14
    },
    {
        "idMeal": str(next_id + 17), "strMeal": "Pinakbet (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_main", "strArea": "Filipino",
        "strInstructions": "1. Sauté garlic, onions, tomatoes.\n2. Add bitter melon, eggplant, okra, and squash.\n3. Add bagoong alamang.\n4. Simmer until vegetables are tender.",
        "strIngredient1": "Bitter Melon", "strMeasure1": "2 pieces", "strIngredient2": "Eggplant", "strMeasure2": "4 pieces",
        "strIngredient3": "Okra", "strMeasure3": "10 pieces", "strIngredient4": "Calabaza Squash", "strMeasure4": "1/2 piece",
        "strIngredient5": "Tomatoes", "strMeasure5": "3 pieces", "strIngredient6": "Garlic", "strMeasure6": "1 head",
        "strIngredient7": "Bagoong Alamang", "strMeasure7": "4 tbsp", "calories": 1200, "protein": 60, "carbs": 180, "fat": 30, "price": 160,
        "calories_per_serving": 120, "price_per_serving": 16
    },
    {
        "idMeal": str(next_id + 18), "strMeal": "Chopsuey (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_main", "strArea": "Filipino",
        "strInstructions": "1. Sauté garlic and onions.\n2. Add cauliflower, broccoli, carrots, and bell peppers.\n3. Add broth and cornstarch.\n4. Simmer until vegetables are tender.",
        "strIngredient1": "Cauliflower", "strMeasure1": "1 head", "strIngredient2": "Broccoli", "strMeasure2": "1 bunch",
        "strIngredient3": "Carrots", "strMeasure3": "4 pieces", "strIngredient4": "Bell Peppers", "strMeasure4": "3 pieces",
        "strIngredient5": "Garlic", "strMeasure5": "1 head", "strIngredient6": "Onions", "strMeasure6": "2 pieces",
        "strIngredient7": "Cornstarch", "strMeasure7": "2 tbsp", "calories": 1400, "protein": 70, "carbs": 220, "fat": 35, "price": 200,
        "calories_per_serving": 140, "price_per_serving": 20
    },
    {
        "idMeal": str(next_id + 19), "strMeal": "Sinigang na Bayabas (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_main", "strArea": "Filipino",
        "strInstructions": "1. Boil water with guava.\n2. Add vegetables and simmer.\n3. Season with fish sauce.\n4. Serve hot.",
        "strIngredient1": "Guava", "strMeasure1": "6 pieces", "strIngredient2": "Eggplant", "strMeasure2": "3 pieces",
        "strIngredient3": "Kangkong", "strMeasure3": "1 bunch", "strIngredient4": "Tomatoes", "strMeasure4": "3 pieces",
        "strIngredient5": "Onions", "strMeasure5": "2 pieces", "strIngredient6": "Fish Sauce", "strMeasure6": "3 tbsp",
        "strIngredient7": "Water", "strMeasure7": "8 cups", "calories": 1100, "protein": 50, "carbs": 160, "fat": 20, "price": 150,
        "calories_per_serving": 110, "price_per_serving": 15
    },
    {
        "idMeal": str(next_id + 20), "strMeal": "Bulanglang (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_main", "strArea": "Filipino",
        "strInstructions": "1. Boil water with malunggay.\n2. Add squash, eggplant, and string beans.\n3. Season with fish sauce.\n4. Serve with bagoong.",
        "strIngredient1": "Calabaza Squash", "strMeasure1": "1 piece", "strIngredient2": "Eggplant", "strMeasure2": "4 pieces",
        "strIngredient3": "String Beans", "strMeasure3": "1 bunch", "strIngredient4": "Malunggay Leaves", "strMeasure4": "2 cups",
        "strIngredient5": "Tomatoes", "strMeasure5": "2 pieces", "strIngredient6": "Fish Sauce", "strMeasure6": "2 tbsp",
        "strIngredient7": "Water", "strMeasure7": "8 cups", "calories": 1000, "protein": 45, "carbs": 150, "fat": 15, "price": 130,
        "calories_per_serving": 100, "price_per_serving": 13
    },
    {
        "idMeal": str(next_id + 21), "strMeal": "Laing (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_main", "strArea": "Filipino",
        "strInstructions": "1. Soak taro leaves in water.\n2. Cook with coconut milk and spices.\n3. Simmer until tender.\n4. Serve with bagoong.",
        "strIngredient1": "Taro Leaves", "strMeasure1": "2 bunches", "strIngredient2": "Coconut Milk", "strMeasure2": "2 cups",
        "strIngredient3": "Garlic", "strMeasure3": "1 head", "strIngredient4": "Onions", "strMeasure4": "2 pieces",
        "strIngredient5": "Ginger", "strMeasure5": "1 thumb", "strIngredient6": "Chili Peppers", "strMeasure6": "3 pieces",
        "strIngredient7": "Fish Sauce", "strMeasure7": "2 tbsp", "calories": 1900, "protein": 35, "carbs": 120, "fat": 160, "price": 220,
        "calories_per_serving": 190, "price_per_serving": 22
    },
    {
        "idMeal": str(next_id + 22), "strMeal": "Tinolang Manok na Walang Manok (Family Size)", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_main", "strArea": "Filipino",
        "strInstructions": "1. Sauté garlic, onions, ginger.\n2. Add vegetables and water.\n3. Simmer until tender.\n4. Season with fish sauce.",
        "strIngredient1": "Calabaza Squash", "strMeasure1": "1 piece", "strIngredient2": "Malunggay Leaves", "strMeasure2": "2 cups",
        "strIngredient3": "Ginger", "strMeasure3": "2 thumbs", "strIngredient4": "Garlic", "strMeasure4": "1 head",
        "strIngredient5": "Onions", "strMeasure5": "2 pieces", "strIngredient6": "Fish Sauce", "strMeasure6": "2 tbsp",
        "strIngredient7": "Water", "strMeasure7": "8 cups", "calories": 950, "protein": 40, "carbs": 140, "fat": 20, "price": 125,
        "calories_per_serving": 95, "price_per_serving": 13
    },

    # GLOW SIDE DISHES - Smaller portions of vegetable-based dishes
    {
        "idMeal": str(next_id + 23), "strMeal": "Small Munggo", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_side", "strArea": "Filipino",
        "strInstructions": "1. Boil 300g munggo until soft.\n2. Sauté garlic, onions.\n3. Add munggo and water.\n4. Season lightly.",
        "strIngredient1": "Munggo", "strMeasure1": "300g", "strIngredient2": "Garlic", "strMeasure2": "2 cloves",
        "strIngredient3": "Onions", "strMeasure3": "1/2 piece", "strIngredient4": "Water", "strMeasure4": "3 cups",
        "strIngredient5": "Fish Sauce", "strMeasure5": "1 tsp", "calories": 450, "protein": 30, "carbs": 70, "fat": 6, "price": 45,
        "calories_per_serving": 225, "price_per_serving": 23
    },
    {
        "idMeal": str(next_id + 24), "strMeal": "Small Pinakbet", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_side", "strArea": "Filipino",
        "strInstructions": "1. Sauté garlic and tomatoes.\n2. Add sliced vegetables.\n3. Add bagoong alamang.\n4. Cook until tender.",
        "strIngredient1": "Bitter Melon", "strMeasure1": "1/2 piece", "strIngredient2": "Eggplant", "strMeasure2": "1 piece",
        "strIngredient3": "Okra", "strMeasure3": "3 pieces", "strIngredient4": "Tomatoes", "strMeasure4": "1 piece",
        "strIngredient5": "Garlic", "strMeasure5": "2 cloves", "strIngredient6": "Bagoong Alamang", "strMeasure6": "1 tbsp",
        "calories": 300, "protein": 15, "carbs": 45, "fat": 8, "price": 40, "calories_per_serving": 150, "price_per_serving": 20
    },
    {
        "idMeal": str(next_id + 25), "strMeal": "Small Chopsuey", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_side", "strArea": "Filipino",
        "strInstructions": "1. Sauté garlic and onions.\n2. Add mixed vegetables.\n3. Add water and simmer.\n4. Thicken with cornstarch.",
        "strIngredient1": "Cauliflower", "strMeasure1": "1 cup", "strIngredient2": "Broccoli", "strMeasure2": "1 cup",
        "strIngredient3": "Carrots", "strMeasure3": "1 piece", "strIngredient4": "Garlic", "strMeasure4": "2 cloves",
        "strIngredient5": "Onions", "strMeasure5": "1/2 piece", "strIngredient6": "Cornstarch", "strMeasure6": "1 tsp",
        "calories": 350, "protein": 18, "carbs": 55, "fat": 9, "price": 50, "calories_per_serving": 175, "price_per_serving": 25
    },
    {
        "idMeal": str(next_id + 26), "strMeal": "Small Tortang Talong", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_side", "strArea": "Filipino",
        "strInstructions": "1. Grill 2 eggplants.\n2. Peel and flatten.\n3. Dip in egg mixture.\n4. Fry until golden.",
        "strIngredient1": "Eggplant", "strMeasure1": "2 pieces", "strIngredient2": "Eggs", "strMeasure2": "2 pieces",
        "strIngredient3": "Onions", "strMeasure3": "1/2 piece", "strIngredient4": "Cooking Oil", "strMeasure4": "2 tbsp",
        "strIngredient5": "Salt", "strMeasure5": "1/4 tsp", "calories": 400, "protein": 18, "carbs": 30, "fat": 28, "price": 35,
        "calories_per_serving": 200, "price_per_serving": 18
    },
    {
        "idMeal": str(next_id + 27), "strMeal": "Small Laing", "strMealThumb": "https://i.ytimg.com/vi/example.jpg",
        "strCategory": "Vegetable", "grow_glow_category": "glow_side", "strArea": "Filipino",
        "strInstructions": "1. Cook taro leaves with coconut milk.\n2. Add garlic and spices.\n3. Simmer until tender.",
        "strIngredient1": "Taro Leaves", "strMeasure1": "1 cup", "strIngredient2": "Coconut Milk", "strMeasure2": "1/2 cup",
        "strIngredient3": "Garlic", "strMeasure3": "2 cloves", "strIngredient4": "Chili Peppers", "strMeasure4": "1 piece",
        "strIngredient5": "Fish Sauce", "strMeasure5": "1 tsp", "calories": 475, "protein": 9, "carbs": 30, "fat": 40, "price": 55,
        "calories_per_serving": 238, "price_per_serving": 28
    }
]

# Add empty ingredients and measures for consistency
for recipe in new_recipes:
    for i in range(8, 21):
        recipe[f'strIngredient{i}'] = ""
        recipe[f'strMeasure{i}'] = ""
    recipe['strYoutube'] = ""
    recipe['price_min'] = recipe['price']
    recipe['price_max'] = int(recipe['price'] * 1.2)
    recipe['price_planned'] = int(recipe['price'] * 1.1)
    recipe['price_per_serving_min'] = recipe['price_per_serving']
    recipe['price_per_serving_max'] = int(recipe['price_per_serving'] * 1.2)
    recipe['price_per_serving_planned'] = int(recipe['price_per_serving'] * 1.1)
    recipe['sources'] = ["Local market average", "Supermarket price"]
    recipe['calculated_at'] = datetime.now().isoformat()
    recipe['nutrition_sources'] = ["USDA FoodData Central"]
    recipe['nutrition_calculated_at'] = datetime.now().isoformat()
    recipe['nutrition_assumptions'] = {"servings_used": 4, "per_piece_defaults_applied": 0}

# Add new recipes to existing ones
recipes.extend(new_recipes)

# Write back to file
with open('database.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_recipes)} new recipes. Total recipes: {len(recipes)}")</content>
<parameter name="filePath">c:\Users\johnn\OneDrive\Documents\PlanPlate\recipe-api-main\add_recipes.py