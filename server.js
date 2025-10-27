const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const PricingEngine = require('./pricing-engine');
const MarketDataService = require('./market-data-service');

// Initialize pricing services
const pricingEngine = new PricingEngine();
const marketDataService = new MarketDataService();

// Initialize market data
marketDataService.updateMarketPrices().then(result => {
  console.log('Market data initialized:', result.success ? 'Success' : 'Failed');
}).catch(error => {
  console.error('Failed to initialize market data:', error);
});

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
    const pricingOptions = {
      difficulty,
      region,
      profitMargin,
      servings: parseInt(servings)
    };

    const pricing = pricingEngine.calculateTotalCost(recipe, pricingOptions);
    const recommendations = pricingEngine.getPricingRecommendations(recipe, pricingOptions);
    const marketInsights = marketDataService.getMarketInsights(
      Object.values(recipe).filter(v => typeof v === 'string' && v.includes('ingredient'))
    );

    res.json({
      success: true,
      recipe: {
        id: recipe.idMeal,
        name: recipe.strMeal,
        category: recipe.strCategory
      },
      pricing: pricing,
      recommendations: recommendations,
      marketInsights: marketInsights,
      options: pricingOptions
    });
  } catch (error) {
    console.error('Pricing calculation error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate pricing',
      details: error.message 
    });
  }
});

// POST: Calculate pricing for multiple recipes
app.post('/api/pricing/bulk-calculate', (req, res) => {
  const db = readDatabase();
  const { recipeIds, options = {} } = req.body;

  if (!Array.isArray(recipeIds)) {
    return res.status(400).json({ error: 'recipeIds must be an array' });
  }

  const results = [];
  const errors = [];

  recipeIds.forEach(id => {
    const recipe = db.recipes.find(r => r.idMeal === id);
    if (recipe) {
      try {
        const pricing = pricingEngine.calculateTotalCost(recipe, options);
        results.push({
          recipeId: id,
          recipeName: recipe.strMeal,
          pricing: pricing
        });
      } catch (error) {
        errors.push({
          recipeId: id,
          error: error.message
        });
      }
    } else {
      errors.push({
        recipeId: id,
        error: 'Recipe not found'
      });
    }
  });

  res.json({
    success: true,
    results: results,
    errors: errors,
    summary: {
      total: recipeIds.length,
      successful: results.length,
      failed: errors.length
    }
  });
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
    const recommendations = pricingEngine.getPricingRecommendations(recipe, { region });
    const marketInsights = marketDataService.getMarketInsights(
      Object.values(recipe).filter(v => typeof v === 'string' && v.includes('ingredient'))
    );

    res.json({
      success: true,
      recipe: {
        id: recipe.idMeal,
        name: recipe.strMeal,
        category: recipe.strCategory
      },
      recommendations: recommendations,
      marketInsights: marketInsights
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
    const summary = marketDataService.getMarketSummary();
    const alerts = marketDataService.getPriceAlerts();
    const trends = marketDataService.marketData.trendData;

    res.json({
      success: true,
      summary: summary,
      alerts: alerts,
      trends: trends,
      lastUpdated: marketDataService.marketData.lastUpdated
    });
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({ 
      error: 'Failed to get market data',
      details: error.message 
    });
  }
});

// POST: Update market prices
app.post('/api/pricing/update-market', (req, res) => {
  marketDataService.updateMarketPrices()
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.error('Market update error:', error);
      res.status(500).json({ 
        error: 'Failed to update market data',
        details: error.message 
      });
    });
});

// GET: Get ingredient prices
app.get('/api/pricing/ingredients', (req, res) => {
  try {
    const { category, search } = req.query;
    let ingredients = pricingEngine.ingredientPrices;

    // Filter by category if specified
    if (category) {
      ingredients = Object.fromEntries(
        Object.entries(ingredients).filter(([_, data]) => data.category === category)
      );
    }

    // Search by name if specified
    if (search) {
      const searchLower = search.toLowerCase();
      ingredients = Object.fromEntries(
        Object.entries(ingredients).filter(([name, _]) => 
          name.toLowerCase().includes(searchLower)
        )
      );
    }

    res.json({
      success: true,
      ingredients: ingredients,
      categories: [...new Set(Object.values(pricingEngine.ingredientPrices).map(i => i.category))]
    });
  } catch (error) {
    console.error('Ingredients error:', error);
    res.status(500).json({ 
      error: 'Failed to get ingredients',
      details: error.message 
    });
  }
});

// PUT: Update ingredient price
app.put('/api/pricing/ingredients/:name', (req, res) => {
  const { name } = req.params;
  const { price, unit } = req.body;

  if (!price || isNaN(price)) {
    return res.status(400).json({ error: 'Valid price is required' });
  }

  try {
    pricingEngine.updateIngredientPrice(name, parseFloat(price), unit);
    
    res.json({
      success: true,
      message: `Updated price for ${name}`,
      ingredient: {
        name: name,
        price: parseFloat(price),
        unit: unit || 'kg'
      }
    });
  } catch (error) {
    console.error('Update ingredient error:', error);
    res.status(500).json({ 
      error: 'Failed to update ingredient price',
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
      pricingAnalysis: {},
      categoryAnalysis: {},
      costDistribution: {
        ingredient: 0,
        labor: 0,
        overhead: 0
      }
    };

    // Analyze pricing for all recipes
    db.recipes.forEach(recipe => {
      const pricing = pricingEngine.calculateTotalCost(recipe, { region, profitMargin });
      
      // Category analysis
      const category = recipe.strCategory;
      if (!analytics.categoryAnalysis[category]) {
        analytics.categoryAnalysis[category] = {
          count: 0,
          totalCost: 0,
          averageCost: 0,
          minCost: Infinity,
          maxCost: 0
        };
      }
      
      const catAnalysis = analytics.categoryAnalysis[category];
      catAnalysis.count++;
      catAnalysis.totalCost += pricing.costPerServing;
      catAnalysis.minCost = Math.min(catAnalysis.minCost, pricing.costPerServing);
      catAnalysis.maxCost = Math.max(catAnalysis.maxCost, pricing.costPerServing);
      
      // Cost distribution
      analytics.costDistribution.ingredient += pricing.ingredientCost;
      analytics.costDistribution.labor += pricing.laborCost;
      analytics.costDistribution.overhead += pricing.overheadCost;
    });

    // Calculate averages
    Object.keys(analytics.categoryAnalysis).forEach(category => {
      const catAnalysis = analytics.categoryAnalysis[category];
      catAnalysis.averageCost = catAnalysis.totalCost / catAnalysis.count;
    });

    // Overall pricing analysis
    const allCosts = db.recipes.map(recipe => 
      pricingEngine.calculateTotalCost(recipe, { region, profitMargin }).costPerServing
    );
    
    analytics.pricingAnalysis = {
      averageCost: allCosts.reduce((a, b) => a + b, 0) / allCosts.length,
      medianCost: allCosts.sort((a, b) => a - b)[Math.floor(allCosts.length / 2)],
      minCost: Math.min(...allCosts),
      maxCost: Math.max(...allCosts),
      costRange: Math.max(...allCosts) - Math.min(...allCosts)
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

// POST: Bulk import recipes from JSON file
app.post('/api/recipes/bulk', (req, res) => {
  const db = readDatabase();
  const newRecipes = req.body.recipes;

  if (!Array.isArray(newRecipes)) {
    return res.status(400).json({ error: 'Expected an array of recipes' });
  }

  let addedCount = 0;
  const maxId = db.recipes.length > 0
    ? Math.max(...db.recipes.map(r => parseInt(r.idMeal)))
    : 0;

  newRecipes.forEach((recipe, index) => {
    recipe.idMeal = (maxId + index + 1).toString();
    recipe.calories = recipe.calories || 0;
    recipe.protein = recipe.protein || 0;
    recipe.carbs = recipe.carbs || 0;
    recipe.fat = recipe.fat || 0;
    recipe.price = recipe.price || 0;

    db.recipes.push(recipe);
    addedCount++;
  });

  if (writeDatabase(db)) {
    res.status(201).json({
      success: true,
      message: `${addedCount} recipes imported successfully`,
      count: addedCount
    });
  } else {
    res.status(500).json({ error: 'Failed to save recipes' });
  }
});

// GET: Get recipe statistics
app.get('/api/stats', (req, res) => {
  const db = readDatabase();

  const stats = {
    totalRecipes: db.recipes.length,
    totalCategories: db.categories.length,
    averagePrice: (db.recipes.reduce((sum, r) => sum + (r.price || 0), 0) / db.recipes.length).toFixed(2),
    averageCalories: (db.recipes.reduce((sum, r) => sum + (r.calories || 0), 0) / db.recipes.length).toFixed(0),
    categoryCounts: {},
    priceRange: {
      min: Math.min(...db.recipes.map(r => r.price || 0)),
      max: Math.max(...db.recipes.map(r => r.price || 0))
    }
  };

  db.recipes.forEach(recipe => {
    const cat = recipe.strCategory;
    stats.categoryCounts[cat] = (stats.categoryCounts[cat] || 0) + 1;
  });

  res.json(stats);
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

// POST: Add new recipe
app.post('/api/recipes', (req, res) => {
  const db = readDatabase();
  const newRecipe = req.body;

  // Generate new ID
  const maxId = db.recipes.length > 0
    ? Math.max(...db.recipes.map(r => parseInt(r.idMeal)))
    : 0;
  newRecipe.idMeal = (maxId + 1).toString();

  // Add default nutrition if not provided
  newRecipe.calories = newRecipe.calories || 0;
  newRecipe.protein = newRecipe.protein || 0;
  newRecipe.carbs = newRecipe.carbs || 0;
  newRecipe.fat = newRecipe.fat || 0;
  newRecipe.price = newRecipe.price || 0;

  // Ensure all ingredient slots (1-10) exist
  for (let i = 1; i <= 10; i++) {
    if (!newRecipe[`strIngredient${i}`]) {
      newRecipe[`strIngredient${i}`] = "";
      newRecipe[`strMeasure${i}`] = "";
    }
  }

  db.recipes.push(newRecipe);

  if (writeDatabase(db)) {
    res.status(201).json({
      success: true,
      message: 'Recipe added successfully',
      recipe: newRecipe
    });
  } else {
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// PUT: Update existing recipe
app.put('/api/recipes/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const updatedData = req.body;

  const index = db.recipes.findIndex(r => r.idMeal === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  db.recipes[index] = { ...db.recipes[index], ...updatedData, idMeal: id };

  if (writeDatabase(db)) {
    res.json({
      success: true,
      message: 'Recipe updated successfully',
      recipe: db.recipes[index]
    });
  } else {
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// DELETE: Remove recipe
app.delete('/api/recipes/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;

  const index = db.recipes.findIndex(r => r.idMeal === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  db.recipes.splice(index, 1);

  if (writeDatabase(db)) {
    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } else {
    res.status(500).json({ error: 'Failed to delete recipe' });
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

// POST: Add new category
app.post('/api/categories', (req, res) => {
  const db = readDatabase();
  const newCategory = req.body;

  if (!newCategory.strCategory) {
    return res.status(400).json({ error: 'Category name required' });
  }

  // Check if category already exists
  const exists = db.categories.some(cat =>
    cat.strCategory.toLowerCase() === newCategory.strCategory.toLowerCase()
  );

  if (exists) {
    return res.status(400).json({ error: 'Category already exists' });
  }

  db.categories.push({ strCategory: newCategory.strCategory });

  if (writeDatabase(db)) {
    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      category: newCategory
    });
  } else {
    res.status(500).json({ error: 'Failed to add category' });
  }
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
  console.log(`   POST   /api/pricing/bulk-calculate     - Bulk pricing calculation`);
  console.log(`   GET    /api/pricing/recommendations/:id - Get pricing recommendations`);
  console.log(`   GET    /api/pricing/market-data        - Get market data & insights`);
  console.log(`   POST   /api/pricing/update-market      - Update market prices`);
  console.log(`   GET    /api/pricing/ingredients        - Get ingredient prices`);
  console.log(`   PUT    /api/pricing/ingredients/:name   - Update ingredient price`);
  console.log(`   GET    /api/pricing/analytics          - Get pricing analytics`);
  console.log(`\n🍽️  RECIPE ENDPOINTS:`);
  console.log(`   GET    /api/categories          - List all categories`);
  console.log(`   GET    /api/search?s=chicken    - Search recipes`);
  console.log(`   GET    /api/filter?c=Chicken    - Filter by category`);
  console.log(`   GET    /api/lookup?i=1          - Get recipe by ID`);
  console.log(`   POST   /api/recipes             - Add new recipe`);
  console.log(`   PUT    /api/recipes/:id         - Update recipe`);
  console.log(`   DELETE /api/recipes/:id         - Delete recipe`);
  console.log(`   GET    /api/recipes             - Get all recipes`);
  console.log(`   POST   /api/categories          - Add new category`);
  console.log(`   GET    /api/health              - Health check`);
  console.log(`\n✅ Ready to receive requests!\n`);
});