#!/usr/bin/env node
/**
 * Classify recipes into main dishes and side dishes
 */

const fs = require('fs');
const path = require('path');

const SIDE_DISH_PATTERNS = [
    /rice\b/i, /salad\b/i, /soup\b/i, /broth\b/i, /vegetable/i, /veggie/i,
    /sauce\b/i, /seasoning/i, /dip\b/i, /spread\b/i, /jelly/i, /jam/i,
    /pickle/i, /fermented/i, /bread\b/i, /toast\b/i, /pastry/i, /cake\b/i,
    /dessert/i, /smoothie/i, /juice/i, /drink\b/i, /beverage/i, /cocktail/i,
    /beans/i, /lentils/i, /legumes/i, /sprouts/i, /shoots/i, /greens/i,
    /hash\b/i, /mash\b/i, /fries\b/i, /chips\b/i, /croquette/i,
    /condiment/i, /relish/i, /chutney/i, /compote/i,
];

function countIngredients(recipe) {
    let count = 0;
    for (let i = 1; i <= 20; i++) {
        const ing = (recipe[`strIngredient${i}`] || '').trim();
        if (ing) count++;
    }
    return count;
}

function classifyRecipe(recipe) {
    const mealName = (recipe.strMeal || '').toLowerCase();
    const instructions = (recipe.strInstructions || '').toLowerCase();
    const ingredientCount = countIngredients(recipe);
    
    // Get all ingredients
    let ingredientsStr = '';
    for (let i = 1; i <= 20; i++) {
        const ing = (recipe[`strIngredient${i}`] || '').toLowerCase();
        if (ing) ingredientsStr += ' ' + ing;
    }
    
    // STRONG MAIN INDICATORS (even if other patterns match)
    const mainKeywords = ['adobo', 'sisig', 'tinola', 'sinigang', 'puchero', 'mechado',
        'afritada', 'menudo', 'bistek', 'kari-kari', 'lapu-lapu', 'sinigang',
        'dinuguan', 'kaldereta', 'ragu', 'curry', 'stew', 'braise', 'roast',
        'chicken', 'beef', 'pork', 'fish', 'duck', 'lamb', 'shrimp', 'crab', 'meat'];
    
    const hasMainKeyword = mainKeywords.some(kw => mealName.includes(kw) || ingredientsStr.includes(kw));
    
    // STRONG SIDE INDICATORS
    const sideKeywords = ['rice\b', 'salad\b', 'soup\b', 'juice', 'smoothie', 'dessert',
        'bread\b', 'cake\b', 'pastry', 'drink', 'beverage', 'sauce\b'];
    const hasSideKeyword = sideKeywords.some(kw => new RegExp(kw, 'i').test(mealName));
    
    // If it has strong side keyword in the NAME (not ingredients), it's a side
    if (hasSideKeyword) {
        return 'side';
    }
    
    // If it has main keyword, it's a main dish
    if (hasMainKeyword && ingredientCount >= 4) {
        return 'main';
    }
    
    // Check side patterns (less restrictive)
    const sideMatchName = SIDE_DISH_PATTERNS.some(p => p.test(mealName));
    if (sideMatchName && !hasMainKeyword) {
        return 'side';
    }
    
    // Default: more ingredients = main dish
    if (ingredientCount >= 7) {
        return 'main';
    }
    
    // If has complex instructions, probably main
    if (instructions.length > 200 && ingredientCount >= 5) {
        return 'main';
    }
    
    return 'side';
}

function main() {
    try {
        const dbPath = path.join(__dirname, 'database.json');
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        
        let mainCount = 0;
        let sideCount = 0;
        const recipes = data.recipes || [];
        
        recipes.forEach(recipe => {
            const mealType = classifyRecipe(recipe);
            recipe.strMealType = mealType;
            
            if (mealType === 'main') mainCount++;
            else sideCount++;
        });
        
        // Save updated database
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
        
        console.log('✅ Classification complete!');
        console.log(`📊 Results:`);
        console.log(`   🍖 Main dishes: ${mainCount}`);
        console.log(`   🥗 Side dishes: ${sideCount}`);
        console.log(`   ✨ Total: ${mainCount + sideCount}`);
        console.log(`\n📝 Sample classifications:`);
        
        recipes.slice(0, 15).forEach(recipe => {
            console.log(`   • ${recipe.strMeal}: ${recipe.strMealType}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
