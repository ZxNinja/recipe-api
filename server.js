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

// ========== API ENDPOINTS ==========

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