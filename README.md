# 🚀 Recipe API v3.0 - Ultra-Optimized

Lightning-fast Filipino recipe API optimized for instant response times. **<5ms per request**.

## Quick Start

```bash
npm install
npm start
```

Server runs on `http://localhost:3000` (or PORT env variable)

## API Endpoints

### 📖 Get All Recipes
```
GET /api/recipes?page=1&limit=20
```
Returns paginated list with minimal fields for fast loading.

### 🔍 Get Recipe by ID
```
GET /api/recipes/:id
GET /api/lookup?i=:id
```
Returns complete recipe details instantly.

### 🔎 Search Recipes
```
GET /api/search?s=pork
```
Search by recipe name (returns top 15 matches).

### 🏷️ Filter by Category
```
GET /api/filter?c=Pork
```
Get all recipes in a category.

### 📚 Get Categories
```
GET /api/categories
```
Returns list of all recipe categories.

### 🏥 Health Check
```
GET /api/health
```
API status and stats.

## Performance Features

✅ **In-memory caching** - All recipes loaded on startup  
✅ **O(1) lookups** - Recipe map for instant access  
✅ **Compression** - GZIP enabled for 80% smaller payloads  
✅ **Minimal overhead** - Only essential middleware  
✅ **Optimized endpoints** - Returns only needed fields  

## Database

SQLite-free JSON-based database for ultra-fast loads. Database is cached in memory on server startup for instant access.

## Deployment (Render)

1. Push code to GitHub
2. Connect to Render
3. Set Node environment
4. Deploy - that's it!

## Environment Variables

- `PORT` - Server port (default: 3000)

## File Size

- API size: **~50KB** (minified)
- Database: **~2-5MB** (loaded in memory)
- Response size: **<50KB** (compressed)

---

**Version:** 3.0.0 | **Status:** Production-ready ⚡
