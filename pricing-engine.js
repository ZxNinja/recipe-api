/**
 * Professional Recipe Pricing Engine for Filipino Dishes
 * Implements modern pricing algorithms with ingredient cost calculation,
 * labor costs, overhead, and market factors
 */

class PricingEngine {
  constructor() {
    // Base ingredient prices in PHP (Philippine Peso) - Updated 2024
    this.ingredientPrices = {
      // Proteins
      'pork belly': { price: 280, unit: 'kg', category: 'protein' },
      'pork ears': { price: 180, unit: 'kg', category: 'protein' },
      'pork snout': { price: 160, unit: 'kg', category: 'protein' },
      'chicken thighs': { price: 200, unit: 'kg', category: 'protein' },
      'chicken breast': { price: 220, unit: 'kg', category: 'protein' },
      'beef': { price: 450, unit: 'kg', category: 'protein' },
      'fish': { price: 300, unit: 'kg', category: 'protein' },
      'shrimp': { price: 600, unit: 'kg', category: 'protein' },
      'egg': { price: 8, unit: 'piece', category: 'protein' },
      
      // Vegetables
      'onion': { price: 80, unit: 'kg', category: 'vegetable' },
      'garlic': { price: 200, unit: 'kg', category: 'vegetable' },
      'tomato': { price: 60, unit: 'kg', category: 'vegetable' },
      'potato': { price: 50, unit: 'kg', category: 'vegetable' },
      'carrot': { price: 40, unit: 'kg', category: 'vegetable' },
      'bell pepper': { price: 120, unit: 'kg', category: 'vegetable' },
      'chili peppers': { price: 150, unit: 'kg', category: 'vegetable' },
      'cabbage': { price: 30, unit: 'kg', category: 'vegetable' },
      'eggplant': { price: 40, unit: 'kg', category: 'vegetable' },
      'okra': { price: 50, unit: 'kg', category: 'vegetable' },
      'string beans': { price: 60, unit: 'kg', category: 'vegetable' },
      
      // Staples
      'rice': { price: 50, unit: 'kg', category: 'staple' },
      'noodles': { price: 25, unit: 'pack', category: 'staple' },
      'bread': { price: 15, unit: 'piece', category: 'staple' },
      
      // Condiments & Seasonings
      'soy sauce': { price: 45, unit: 'bottle', category: 'condiment' },
      'vinegar': { price: 25, unit: 'bottle', category: 'condiment' },
      'fish sauce': { price: 35, unit: 'bottle', category: 'condiment' },
      'oyster sauce': { price: 55, unit: 'bottle', category: 'condiment' },
      'salt': { price: 15, unit: 'pack', category: 'condiment' },
      'pepper': { price: 80, unit: 'pack', category: 'condiment' },
      'bay leaf': { price: 20, unit: 'pack', category: 'condiment' },
      'calamansi': { price: 40, unit: 'kg', category: 'condiment' },
      'lemon': { price: 60, unit: 'kg', category: 'condiment' },
      
      // Cooking Oils & Fats
      'cooking oil': { price: 120, unit: 'liter', category: 'oil' },
      'coconut oil': { price: 100, unit: 'liter', category: 'oil' },
      'butter': { price: 200, unit: 'pack', category: 'oil' },
      
      // Dairy
      'milk': { price: 80, unit: 'liter', category: 'dairy' },
      'cheese': { price: 300, unit: 'kg', category: 'dairy' },
      
      // Spices & Herbs
      'ginger': { price: 120, unit: 'kg', category: 'spice' },
      'turmeric': { price: 200, unit: 'kg', category: 'spice' },
      'cumin': { price: 300, unit: 'kg', category: 'spice' },
      'paprika': { price: 400, unit: 'kg', category: 'spice' },
      'cinnamon': { price: 500, unit: 'kg', category: 'spice' },
      'star anise': { price: 600, unit: 'kg', category: 'spice' },
      
      // Coconut Products
      'coconut milk': { price: 60, unit: 'can', category: 'coconut' },
      'coconut cream': { price: 70, unit: 'can', category: 'coconut' },
      'desiccated coconut': { price: 80, unit: 'pack', category: 'coconut' }
    };

    // Labor cost per hour in PHP
    this.laborCostPerHour = 150;
    
    // Overhead factors
    this.overheadFactors = {
      utilities: 0.05,      // 5% of ingredient cost
      equipment: 0.03,      // 3% of ingredient cost
      rent: 0.08,          // 8% of ingredient cost
      packaging: 0.02,     // 2% of ingredient cost
      waste: 0.10          // 10% waste factor
    };

    // Regional price multipliers
    this.regionalMultipliers = {
      'manila': 1.0,
      'cebu': 0.95,
      'davao': 0.90,
      'iloilo': 0.92,
      'baguio': 1.05,
      'general': 0.95
    };

    // Difficulty multipliers for labor cost
    this.difficultyMultipliers = {
      'easy': 1.0,
      'medium': 1.3,
      'hard': 1.6,
      'expert': 2.0
    };

    // Profit margin ranges
    this.profitMargins = {
      'budget': 0.20,      // 20% profit margin
      'standard': 0.35,    // 35% profit margin
      'premium': 0.50,     // 50% profit margin
      'luxury': 0.70       // 70% profit margin
    };
  }

  /**
   * Parse ingredient quantity and unit from recipe
   */
  parseIngredientQuantity(measure) {
    if (!measure || measure.trim() === '') return null;
    
    const measureLower = measure.toLowerCase().trim();
    
    // Extract number and unit
    const numberMatch = measureLower.match(/(\d+(?:\.\d+)?)/);
    const number = numberMatch ? parseFloat(numberMatch[1]) : 0;
    
    // Determine unit
    let unit = 'piece';
    if (measureLower.includes('kg') || measureLower.includes('kilogram')) {
      unit = 'kg';
    } else if (measureLower.includes('g') || measureLower.includes('gram')) {
      unit = 'g';
      // Convert grams to kg for calculation
      return { amount: number / 1000, unit: 'kg' };
    } else if (measureLower.includes('liter') || measureLower.includes('l')) {
      unit = 'liter';
    } else if (measureLower.includes('ml') || measureLower.includes('milliliter')) {
      unit = 'ml';
      // Convert ml to liter for calculation
      return { amount: number / 1000, unit: 'liter' };
    } else if (measureLower.includes('cup')) {
      unit = 'cup';
      // Convert cup to liter (approximate)
      return { amount: number * 0.24, unit: 'liter' };
    } else if (measureLower.includes('tbsp') || measureLower.includes('tablespoon')) {
      unit = 'tbsp';
      // Convert tbsp to liter (approximate)
      return { amount: number * 0.015, unit: 'liter' };
    } else if (measureLower.includes('tsp') || measureLower.includes('teaspoon')) {
      unit = 'tsp';
      // Convert tsp to liter (approximate)
      return { amount: number * 0.005, unit: 'liter' };
    } else if (measureLower.includes('piece') || measureLower.includes('pcs')) {
      unit = 'piece';
    } else if (measureLower.includes('bottle')) {
      unit = 'bottle';
    } else if (measureLower.includes('pack')) {
      unit = 'pack';
    } else if (measureLower.includes('can')) {
      unit = 'can';
    }
    
    return { amount: number, unit: unit };
  }

  /**
   * Find ingredient price by name (fuzzy matching)
   */
  findIngredientPrice(ingredientName) {
    if (!ingredientName) return null;
    
    const name = ingredientName.toLowerCase().trim();
    
    // Direct match
    if (this.ingredientPrices[name]) {
      return this.ingredientPrices[name];
    }
    
    // Fuzzy matching for common variations
    for (const [key, value] of Object.entries(this.ingredientPrices)) {
      if (name.includes(key) || key.includes(name)) {
        return value;
      }
    }
    
    // Category-based fallback pricing
    if (name.includes('pork') || name.includes('pig')) {
      return { price: 200, unit: 'kg', category: 'protein' };
    } else if (name.includes('chicken')) {
      return { price: 200, unit: 'kg', category: 'protein' };
    } else if (name.includes('beef')) {
      return { price: 450, unit: 'kg', category: 'protein' };
    } else if (name.includes('fish') || name.includes('salmon') || name.includes('tuna')) {
      return { price: 300, unit: 'kg', category: 'protein' };
    } else if (name.includes('vegetable') || name.includes('veggie')) {
      return { price: 50, unit: 'kg', category: 'vegetable' };
    }
    
    // Default fallback
    return { price: 100, unit: 'kg', category: 'other' };
  }

  /**
   * Calculate ingredient cost for a recipe
   */
  calculateIngredientCost(recipe) {
    let totalCost = 0;
    const ingredientBreakdown = [];
    
    for (let i = 1; i <= 10; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      
      if (!ingredient || ingredient.trim() === '') continue;
      
      const quantity = this.parseIngredientQuantity(measure);
      if (!quantity) continue;
      
      const ingredientPrice = this.findIngredientPrice(ingredient);
      if (!ingredientPrice) continue;
      
      // Calculate cost based on unit conversion
      let cost = 0;
      if (ingredientPrice.unit === quantity.unit) {
        cost = ingredientPrice.price * quantity.amount;
      } else if (ingredientPrice.unit === 'kg' && quantity.unit === 'kg') {
        cost = ingredientPrice.price * quantity.amount;
      } else if (ingredientPrice.unit === 'liter' && quantity.unit === 'liter') {
        cost = ingredientPrice.price * quantity.amount;
      } else if (ingredientPrice.unit === 'piece' && quantity.unit === 'piece') {
        cost = ingredientPrice.price * quantity.amount;
      } else {
        // Default calculation
        cost = ingredientPrice.price * quantity.amount * 0.1; // Conservative estimate
      }
      
      totalCost += cost;
      ingredientBreakdown.push({
        ingredient: ingredient,
        measure: measure,
        quantity: quantity,
        unitPrice: ingredientPrice.price,
        unit: ingredientPrice.unit,
        cost: cost,
        category: ingredientPrice.category
      });
    }
    
    return {
      totalCost: totalCost,
      breakdown: ingredientBreakdown
    };
  }

  /**
   * Calculate labor cost based on recipe complexity
   */
  calculateLaborCost(recipe, difficulty = 'medium') {
    // Estimate preparation time based on ingredients and instructions
    let baseTime = 30; // Base 30 minutes
    
    // Add time based on number of ingredients
    const ingredientCount = this.getIngredientCount(recipe);
    baseTime += ingredientCount * 2;
    
    // Add time based on cooking method complexity
    const instructions = recipe.strInstructions || '';
    if (instructions.includes('grill') || instructions.includes('fry')) {
      baseTime += 15;
    }
    if (instructions.includes('simmer') || instructions.includes('boil')) {
      baseTime += 20;
    }
    if (instructions.includes('marinate')) {
      baseTime += 10;
    }
    
    // Apply difficulty multiplier
    const multiplier = this.difficultyMultipliers[difficulty] || 1.0;
    const totalTime = baseTime * multiplier;
    
    return {
      timeMinutes: totalTime,
      cost: (totalTime / 60) * this.laborCostPerHour
    };
  }

  /**
   * Calculate overhead costs
   */
  calculateOverheadCost(ingredientCost) {
    let totalOverhead = 0;
    const breakdown = {};
    
    for (const [factor, percentage] of Object.entries(this.overheadFactors)) {
      const cost = ingredientCost * percentage;
      totalOverhead += cost;
      breakdown[factor] = cost;
    }
    
    return {
      totalCost: totalOverhead,
      breakdown: breakdown
    };
  }

  /**
   * Get ingredient count from recipe
   */
  getIngredientCount(recipe) {
    let count = 0;
    for (let i = 1; i <= 10; i++) {
      if (recipe[`strIngredient${i}`] && recipe[`strIngredient${i}`].trim() !== '') {
        count++;
      }
    }
    return count;
  }

  /**
   * Calculate total recipe cost
   */
  calculateTotalCost(recipe, options = {}) {
    const {
      difficulty = 'medium',
      region = 'manila',
      profitMargin = 'standard',
      servings = 4
    } = options;
    
    // Calculate ingredient cost
    const ingredientCost = this.calculateIngredientCost(recipe);
    
    // Calculate labor cost
    const laborCost = this.calculateLaborCost(recipe, difficulty);
    
    // Calculate overhead cost
    const overheadCost = this.calculateOverheadCost(ingredientCost.totalCost);
    
    // Apply regional multiplier
    const regionalMultiplier = this.regionalMultipliers[region] || 1.0;
    
    // Calculate base cost
    const baseCost = (ingredientCost.totalCost + laborCost.cost + overheadCost.totalCost) * regionalMultiplier;
    
    // Apply profit margin
    const margin = this.profitMargins[profitMargin] || 0.35;
    const sellingPrice = baseCost * (1 + margin);
    
    // Calculate per serving cost
    const costPerServing = sellingPrice / servings;
    
    return {
      ingredientCost: ingredientCost.totalCost,
      laborCost: laborCost.cost,
      overheadCost: overheadCost.totalCost,
      baseCost: baseCost,
      sellingPrice: sellingPrice,
      costPerServing: costPerServing,
      servings: servings,
      regionalMultiplier: regionalMultiplier,
      profitMargin: margin,
      difficulty: difficulty,
      region: region,
      breakdown: {
        ingredients: ingredientCost.breakdown,
        labor: laborCost,
        overhead: overheadCost.breakdown
      }
    };
  }

  /**
   * Update ingredient prices (for market fluctuations)
   */
  updateIngredientPrice(ingredientName, newPrice, unit = 'kg') {
    const name = ingredientName.toLowerCase().trim();
    this.ingredientPrices[name] = {
      price: newPrice,
      unit: unit,
      category: this.ingredientPrices[name]?.category || 'other'
    };
  }

  /**
   * Get pricing recommendations
   */
  getPricingRecommendations(recipe, options = {}) {
    const baseCalculation = this.calculateTotalCost(recipe, options);
    
    const recommendations = {
      budget: this.calculateTotalCost(recipe, { ...options, profitMargin: 'budget' }),
      standard: this.calculateTotalCost(recipe, { ...options, profitMargin: 'standard' }),
      premium: this.calculateTotalCost(recipe, { ...options, profitMargin: 'premium' }),
      luxury: this.calculateTotalCost(recipe, { ...options, profitMargin: 'luxury' })
    };
    
    return {
      base: baseCalculation,
      recommendations: recommendations,
      analysis: {
        costEfficiency: this.analyzeCostEfficiency(baseCalculation),
        competitiveness: this.analyzeCompetitiveness(baseCalculation),
        profitability: this.analyzeProfitability(baseCalculation)
      }
    };
  }

  /**
   * Analyze cost efficiency
   */
  analyzeCostEfficiency(costData) {
    const ingredientRatio = costData.ingredientCost / costData.baseCost;
    const laborRatio = costData.laborCost / costData.baseCost;
    
    if (ingredientRatio > 0.6) {
      return { rating: 'high', message: 'High ingredient cost - consider bulk purchasing' };
    } else if (laborRatio > 0.3) {
      return { rating: 'medium', message: 'High labor cost - consider process optimization' };
    } else {
      return { rating: 'good', message: 'Good cost efficiency' };
    }
  }

  /**
   * Analyze competitiveness
   */
  analyzeCompetitiveness(costData) {
    const pricePerServing = costData.costPerServing;
    
    if (pricePerServing < 50) {
      return { rating: 'budget', message: 'Budget-friendly pricing' };
    } else if (pricePerServing < 100) {
      return { rating: 'standard', message: 'Standard market pricing' };
    } else if (pricePerServing < 200) {
      return { rating: 'premium', message: 'Premium pricing' };
    } else {
      return { rating: 'luxury', message: 'Luxury pricing' };
    }
  }

  /**
   * Analyze profitability
   */
  analyzeProfitability(costData) {
    const profitMargin = costData.profitMargin;
    
    if (profitMargin < 0.2) {
      return { rating: 'low', message: 'Low profit margin - consider price adjustment' };
    } else if (profitMargin < 0.35) {
      return { rating: 'moderate', message: 'Moderate profit margin' };
    } else if (profitMargin < 0.5) {
      return { rating: 'good', message: 'Good profit margin' };
    } else {
      return { rating: 'excellent', message: 'Excellent profit margin' };
    }
  }
}

module.exports = PricingEngine;
