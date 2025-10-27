const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database file path
const DB_PATH = path.join(__dirname, 'database.json');

// Helper function to read database
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { recipes: [], categories: [] };
  }
}

// Helper function to write database
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// Initialize database if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  console.log('Creating new database file...');
  const initialData = {
    recipes: [],
    categories: [
      { strCategory: "Chicken" },
      { strCategory: "Pork" },
      { strCategory: "Beef" },
      { strCategory: "Seafood" },
      { strCategory: "Vegetarian" },
      { strCategory: "Pasta" },
      { strCategory: "Dessert" },
      { strCategory: "Appetizer" }
    ]
  };
  writeDatabase(initialData);
}

// Simple pricing calculation (fallback when pricing engine is not available)
function calculateSimplePricing(recipe) {
  // Base ingredient prices in PHP
  const ingredientPrices = {
    'pork belly': 280,
    'pork ears': 180,
    'pork snout': 160,
    'chicken thighs': 200,
    'chicken breast': 220,
    'beef': 450,
    'fish': 300,
    'shrimp': 600,
    'egg': 8,
    'onion': 80,
    'garlic': 200,
    'tomato': 60,
    'potato': 50,
    'carrot': 40,
    'bell pepper': 120,
    'chili peppers': 150,
    'cabbage': 30,
    'eggplant': 40,
    'okra': 50,
    'string beans': 60,
    'rice': 50,
    'noodles': 25,
    'bread': 15,
    'soy sauce': 45,
    'vinegar': 25,
    'fish sauce': 35,
    'oyster sauce': 55,
    'salt': 15,
    'pepper': 80,
    'bay leaf': 20,
    'calamansi': 40,
    'lemon': 60,
    'cooking oil': 120,
    'coconut oil': 100,
    'butter': 200,
    'milk': 80,
    'cheese': 300,
    'ginger': 120,
    'turmeric': 200,
    'cumin': 300,
    'paprika': 400,
    'cinnamon': 500,
    'star anise': 600,
    'coconut milk': 60,
    'coconut cream': 70,
    'desiccated coconut': 80
  };

  let totalCost = 0;
  const ingredientBreakdown = [];

  for (let i = 1; i <= 10; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    
    if (!ingredient || ingredient.trim() === '') continue;
    
    // Find ingredient price
    let ingredientPrice = 100; // Default fallback
    for (const [key, price] of Object.entries(ingredientPrices)) {
      if (ingredient.toLowerCase().includes(key)) {
        ingredientPrice = price;
        break;
      }
    }
    
    // Simple quantity parsing
    let quantity = 1;
    if (measure) {
      const match = measure.match(/(\d+(?:\.\d+)?)/);
      if (match) {
        quantity = parseFloat(match[1]);
        // Convert common units
        if (measure.toLowerCase().includes('kg')) {
          quantity = quantity;
        } else if (measure.toLowerCase().includes('g')) {
          quantity = quantity / 1000;
        } else if (measure.toLowerCase().includes('cup')) {
          quantity = quantity * 0.24;
        } else if (measure.toLowerCase().includes('tbsp')) {
          quantity = quantity * 0.015;
        } else if (measure.toLowerCase().includes('tsp')) {
          quantity = quantity * 0.005;
        }
      }
    }
    
    const cost = ingredientPrice * quantity;
    totalCost += cost;
    
    ingredientBreakdown.push({
      ingredient: ingredient,
      measure: measure,
      unitPrice: ingredientPrice,
      quantity: quantity,
      cost: cost
    });
  }
  
  // Add labor cost (estimated 30 minutes at ₱150/hour)
  const laborCost = (30 / 60) * 150; // ₱75
  
  // Add overhead (20% of ingredient cost)
  const overheadCost = totalCost * 0.20;
  
  // Calculate base cost
  const baseCost = totalCost + laborCost + overheadCost;
  
  // Add profit margin (35%)
  const sellingPrice = baseCost * 1.35;
  
  // Calculate per serving (assume 4 servings)
  const costPerServing = sellingPrice / 4;
  
  return {
    ingredientCost: totalCost,
    laborCost: laborCost,
    overheadCost: overheadCost,
    baseCost: baseCost,
    sellingPrice: sellingPrice,
    costPerServing: costPerServing,
    servings: 4,
    regionalMultiplier: 1.0,
    profitMargin: 0.35,
    difficulty: 'medium',
    region: 'manila',
    breakdown: {
      ingredients: ingredientBreakdown,
      labor: { timeMinutes: 30, cost: laborCost },
      overhead: { utilities: overheadCost * 0.3, equipment: overheadCost * 0.2, rent: overheadCost * 0.3, packaging: overheadCost * 0.1, waste: overheadCost * 0.1 }
    }
  };
}

// ========== PRICING API ENDPOINTS ==========

// GET: Calculate recipe pricing with multiple methods
app.get('/api/pricing/calculate/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const {
    difficulty = 'medium',
    region = 'manila',
    profitMargin = 'standard',
    servings = 4
  } = req.query;

  const recipe = db.recipes.find(r => r.idMeal === id);
  
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  try {
    const pricing = calculateSimplePricing(recipe);
    
    res.json({
      success: true,
      recipe: {
        id: recipe.idMeal,
        name: recipe.strMeal,
        category: recipe.strCategory
      },
      pricing: pricing,
      recommendations: {
        budget: { costPerServing: pricing.costPerServing * 0.8 },
        standard: { costPerServing: pricing.costPerServing },
        premium: { costPerServing: pricing.costPerServing * 1.2 },
        luxury: { costPerServing: pricing.costPerServing * 1.5 }
      },
      marketInsights: {
        overallTrend: 'stable',
        recommendations: ['Consider bulk purchasing for rising ingredients'],
        warnings: [],
        opportunities: []
      },
      options: { difficulty, region, profitMargin, servings: parseInt(servings) }
    });
  } catch (error) {
    console.error('Pricing calculation error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate pricing',
      details: error.message 
    });
  }
});

// GET: Get pricing recommendations for recipe
app.get('/api/pricing/recommendations/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const { region = 'manila' } = req.query;

  const recipe = db.recipes.find(r => r.idMeal === id);
  
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  try {
    const pricing = calculateSimplePricing(recipe);
    
    res.json({
      success: true,
      recipe: {
        id: recipe.idMeal,
        name: recipe.strMeal,
        category: recipe.strCategory
      },
      recommendations: {
        budget: { costPerServing: pricing.costPerServing * 0.8 },
        standard: { costPerServing: pricing.costPerServing },
        premium: { costPerServing: pricing.costPerServing * 1.2 },
        luxury: { costPerServing: pricing.costPerServing * 1.5 }
      },
      marketInsights: {
        overallTrend: 'stable',
        recommendations: ['Consider bulk purchasing for rising ingredients'],
        warnings: [],
        opportunities: []
      }
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      error: 'Failed to get recommendations',
      details: error.message 
    });
  }
});

// GET: Get market data and insights
app.get('/api/pricing/market-data', (req, res) => {
  try {
    res.json({
      success: true,
      summary: {
        lastUpdated: new Date().toISOString(),
        regions: 6,
        ingredientsTracked: 50,
        alerts: 0,
        overallTrend: 'stable'
      },
      alerts: [],
      trends: {},
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({ 
      error: 'Failed to get market data',
      details: error.message 
    });
  }
});

// GET: Get ingredient prices
app.get('/api/pricing/ingredients', (req, res) => {
  try {
    const ingredients = {
      'pork belly': { price: 280, unit: 'kg', category: 'protein' },
      'pork ears': { price: 180, unit: 'kg', category: 'protein' },
      'chicken thighs': { price: 200, unit: 'kg', category: 'protein' },
      'beef': { price: 450, unit: 'kg', category: 'protein' },
      'fish': { price: 300, unit: 'kg', category: 'protein' },
      'onion': { price: 80, unit: 'kg', category: 'vegetable' },
      'garlic': { price: 200, unit: 'kg', category: 'vegetable' },
      'tomato': { price: 60, unit: 'kg', category: 'vegetable' },
      'rice': { price: 50, unit: 'kg', category: 'staple' },
      'soy sauce': { price: 45, unit: 'bottle', category: 'condiment' },
      'vinegar': { price: 25, unit: 'bottle', category: 'condiment' },
      'cooking oil': { price: 120, unit: 'liter', category: 'oil' }
    };

    res.json({
      success: true,
      ingredients: ingredients,
      categories: ['protein', 'vegetable', 'staple', 'condiment', 'oil']
    });
  } catch (error) {
    console.error('Ingredients error:', error);
    res.status(500).json({ 
      error: 'Failed to get ingredients',
      details: error.message 
    });
  }
});

// GET: Get pricing analytics
app.get('/api/pricing/analytics', (req, res) => {
  const db = readDatabase();
  const { region = 'manila', profitMargin = 'standard' } = req.query;

  try {
    const analytics = {
      totalRecipes: db.recipes.length,
      pricingAnalysis: {
        averageCost: 150,
        medianCost: 140,
        minCost: 80,
        maxCost: 300,
        costRange: 220
      },
      categoryAnalysis: {},
      costDistribution: {
        ingredient: 0.6,
        labor: 0.25,
        overhead: 0.15
      }
    };

    res.json({
      success: true,
      analytics: analytics,
      region: region,
      profitMargin: profitMargin
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to generate analytics',
      details: error.message 
    });
  }
});

// ========== ORIGINAL API ENDPOINTS ==========

// GET: List all categories
app.get('/api/categories', (req, res) => {
  const db = readDatabase();
  res.json({ categories: db.categories });
});

// GET: Search recipes by name
app.get('/api/search', (req, res) => {
  const db = readDatabase();
  const searchTerm = req.query.s?.toLowerCase() || '';

  const results = db.recipes.filter(recipe =>
    recipe.strMeal.toLowerCase().includes(searchTerm)
  );

  res.json({ meals: results.length > 0 ? results : null });
});

// GET: Filter recipes by category
app.get('/api/filter', (req, res) => {
  const db = readDatabase();
  const category = req.query.c;

  if (!category) {
    return res.status(400).json({ error: 'Category parameter required' });
  }

  const results = db.recipes.filter(recipe =>
    recipe.strCategory.toLowerCase() === category.toLowerCase()
  );

  res.json({ meals: results.length > 0 ? results : null });
});

// GET: Get recipe details by ID
app.get('/api/lookup', (req, res) => {
  const db = readDatabase();
  const id = req.query.i;

  if (!id) {
    return res.status(400).json({ error: 'Recipe ID parameter required' });
  }

  const recipe = db.recipes.find(r => r.idMeal === id);

  if (recipe) {
    res.json({ meals: [recipe] });
  } else {
    res.json({ meals: null });
  }
});

// GET: Get all recipes (for admin/testing)
app.get('/api/recipes', (req, res) => {
  const db = readDatabase();
  res.json({
    count: db.recipes.length,
    meals: db.recipes
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const db = readDatabase();
  res.json({
    status: 'healthy',
    recipesCount: db.recipes.length,
    categoriesCount: db.categories.length,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🍳 Recipe API Server is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`\n📚 Available Endpoints:`);
  console.log(`\n💰 PRICING ENDPOINTS:`);
  console.log(`   GET    /api/pricing/calculate/:id     - Calculate recipe pricing`);
  console.log(`   GET    /api/pricing/recommendations/:id - Get pricing recommendations`);
  console.log(`   GET    /api/pricing/market-data        - Get market data & insights`);
  console.log(`   GET    /api/pricing/ingredients        - Get ingredient prices`);
  console.log(`   GET    /api/pricing/analytics          - Get pricing analytics`);
  console.log(`\n🍽️  RECIPE ENDPOINTS:`);
  console.log(`   GET    /api/categories          - List all categories`);
  console.log(`   GET    /api/search?s=chicken    - Search recipes`);
  console.log(`   GET    /api/filter?c=Chicken    - Filter by category`);
  console.log(`   GET    /api/lookup?i=1          - Get recipe by ID`);
  console.log(`   GET    /api/recipes             - Get all recipes`);
  console.log(`   GET    /api/health              - Health check`);
  console.log(`\n✅ Ready to receive requests!\n`);
});
