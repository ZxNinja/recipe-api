const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚡ ULTRA-OPTIMIZED DATABASE LAYER
let DB = [];
let CATEGORIES = [];
let RECIPE_MAP = {};
let CATEGORY_MAP = {};
let PRECOMPILED_CATEGORIES = '';
let CACHE_SIZE = 0;

function loadDatabase() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'database.json'), 'utf8');
    const parsed = JSON.parse(data);
    DB = parsed.recipes || [];
    CATEGORIES = parsed.categories || [];
    
    // Build O(1) lookup maps for instant access
    RECIPE_MAP = {};
    CATEGORY_MAP = {};
    
    DB.forEach(recipe => {
      RECIPE_MAP[recipe.idMeal] = recipe;
      const cat = recipe.strCategory;
      if (cat) {
        if (!CATEGORY_MAP[cat]) CATEGORY_MAP[cat] = [];
        CATEGORY_MAP[cat].push(recipe);
      }
    });
    
    CACHE_SIZE = Buffer.byteLength(JSON.stringify(DB));
    PRECOMPILED_CATEGORIES = JSON.stringify({ categories: CATEGORIES });
    
    console.log(`✅ Ready: ${DB.length} recipes`);
  } catch (e) {
    console.error('❌ DB error:', e);
    DB = [];
  }
}

loadDatabase();

// ⚡ MINIMAL MIDDLEWARE
app.disable('x-powered-by');
app.use(cors({ origin: '*', methods: ['GET'] }));

// Ultra-fast response helper with compression
const sendJSON = (res, data) => {
  const json = JSON.stringify(data);
  const acceptGzip = res.req.headers['accept-encoding']?.includes('gzip');
  
  if (acceptGzip) {
    res.setHeader('Content-Encoding', 'gzip');
    zlib.gzip(json, (err, buffer) => {
      if (!err) {
        res.setHeader('Content-Length', buffer.length);
        res.end(buffer);
      } else {
        res.end(json);
      }
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', Buffer.byteLength(json));
    res.end(json);
  }
};

// ⚡ LIGHTNING FAST ENDPOINTS

// Get paginated recipes
app.get('/api/recipes', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
  const start = (page - 1) * limit;
  
  const meals = DB.slice(start, start + limit).map(r => ({
    idMeal: r.idMeal,
    strMeal: r.strMeal,
    strMealThumb: r.strMealThumb,
    strCategory: r.strCategory,
    good_for: r.good_for,
    price_planned: r.price_planned
  }));
  
  sendJSON(res, {
    count: meals.length,
    page,
    total: DB.length,
    meals
  });
});

// Get recipe by ID
app.get('/api/recipes/:id', (req, res) => {
  sendJSON(res, { meals: RECIPE_MAP[req.params.id] ? [RECIPE_MAP[req.params.id]] : null });
});

// Legacy lookup
app.get('/api/lookup', (req, res) => {
  sendJSON(res, { meals: RECIPE_MAP[req.query.i] ? [RECIPE_MAP[req.query.i]] : null });
});

// Search recipes
app.get('/api/search', (req, res) => {
  const q = (req.query.s || '').toLowerCase().trim();
  if (!q) return sendJSON(res, { meals: null });
  
  const results = DB.filter(r => r.strMeal.toLowerCase().includes(q))
    .slice(0, 20)
    .map(r => ({
      idMeal: r.idMeal,
      strMeal: r.strMeal,
      strMealThumb: r.strMealThumb,
      strCategory: r.strCategory,
      good_for: r.good_for
    }));
  
  sendJSON(res, { meals: results.length > 0 ? results : null });
});

// Filter by category
app.get('/api/filter', (req, res) => {
  const category = req.query.c?.trim();
  if (!category) return sendJSON(res, { error: 'Category required' });
  
  const recipes = CATEGORY_MAP[category] || [];
  const meals = recipes.slice(0, 100).map(r => ({
    idMeal: r.idMeal,
    strMeal: r.strMeal,
    strMealThumb: r.strMealThumb,
    strCategory: r.strCategory,
    good_for: r.good_for
  }));
  
  sendJSON(res, { meals: meals.length > 0 ? meals : null });
});

// Get categories (pre-compiled for max speed)
app.get('/api/categories', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(PRECOMPILED_CATEGORIES);
});

// Health check
app.get('/api/health', (req, res) => {
  sendJSON(res, {
    status: 'OK',
    recipes: DB.length,
    categories: CATEGORIES.length,
    uptime: Math.floor(process.uptime()),
    memory: `${(CACHE_SIZE / 1024 / 1024).toFixed(2)}MB`
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 🚀 START
app.listen(PORT, () => {
  console.log(`\n⚡ Recipe API v3.0`);
  console.log(`📦 ${DB.length} recipes | 🏷️  ${CATEGORIES.length} categories`);
  console.log(`🚀 Port: ${PORT}\n`);
});