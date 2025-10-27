/**
 * Market Data Service for Real-time Ingredient Pricing
 * Tracks market fluctuations and regional price variations
 */

const axios = require('axios');

class MarketDataService {
  constructor() {
    this.marketData = {
      lastUpdated: new Date(),
      regions: {
        'manila': { multiplier: 1.0, lastUpdate: new Date() },
        'cebu': { multiplier: 0.95, lastUpdate: new Date() },
        'davao': { multiplier: 0.90, lastUpdate: new Date() },
        'iloilo': { multiplier: 0.92, lastUpdate: new Date() },
        'baguio': { multiplier: 1.05, lastUpdate: new Date() },
        'general': { multiplier: 0.95, lastUpdate: new Date() }
      },
      seasonalFactors: {
        'rice': { current: 1.0, peak: 1.2, low: 0.8 },
        'vegetables': { current: 1.0, peak: 1.3, low: 0.7 },
        'fish': { current: 1.0, peak: 1.4, low: 0.6 },
        'pork': { current: 1.0, peak: 1.1, low: 0.9 },
        'chicken': { current: 1.0, peak: 1.15, low: 0.85 }
      },
      trendData: {}
    };

    // Market data sources (you can integrate with real APIs)
    this.dataSources = {
      // Example: Department of Agriculture Philippines
      da: {
        baseUrl: 'https://api.da.gov.ph',
        endpoints: {
          prices: '/market-prices',
          trends: '/price-trends'
        }
      },
      // Example: Local market APIs
      localMarkets: {
        baseUrl: 'https://api.localmarkets.ph',
        endpoints: {
          prices: '/ingredient-prices',
          regions: '/regional-prices'
        }
      }
    };
  }

  /**
   * Update market prices from external sources
   */
  async updateMarketPrices() {
    try {
      // Simulate API calls to real market data sources
      const marketPrices = await this.fetchMarketPrices();
      const regionalData = await this.fetchRegionalData();
      const trendData = await this.fetchTrendData();

      this.marketData.lastUpdated = new Date();
      this.marketData.regions = regionalData;
      this.marketData.trendData = trendData;

      return {
        success: true,
        message: 'Market prices updated successfully',
        data: {
          prices: marketPrices,
          regions: regionalData,
          trends: trendData
        }
      };
    } catch (error) {
      console.error('Error updating market prices:', error);
      return {
        success: false,
        message: 'Failed to update market prices',
        error: error.message
      };
    }
  }

  /**
   * Fetch market prices from external APIs
   */
  async fetchMarketPrices() {
    // In a real implementation, you would call actual APIs
    // For now, we'll simulate with realistic data
    
    const simulatedPrices = {
      'rice': { price: 52, unit: 'kg', trend: 'stable', change: 0.02 },
      'pork belly': { price: 285, unit: 'kg', trend: 'rising', change: 0.05 },
      'chicken thighs': { price: 205, unit: 'kg', trend: 'stable', change: 0.01 },
      'onion': { price: 85, unit: 'kg', trend: 'falling', change: -0.08 },
      'garlic': { price: 210, unit: 'kg', trend: 'rising', change: 0.12 },
      'tomato': { price: 65, unit: 'kg', trend: 'stable', change: 0.03 },
      'cooking oil': { price: 125, unit: 'liter', trend: 'rising', change: 0.04 },
      'soy sauce': { price: 47, unit: 'bottle', trend: 'stable', change: 0.01 },
      'vinegar': { price: 26, unit: 'bottle', trend: 'stable', change: 0.00 },
      'fish sauce': { price: 37, unit: 'bottle', trend: 'rising', change: 0.06 }
    };

    return simulatedPrices;
  }

  /**
   * Fetch regional price variations
   */
  async fetchRegionalData() {
    // Simulate regional price variations
    const baseMultipliers = {
      'manila': 1.0,
      'cebu': 0.95,
      'davao': 0.90,
      'iloilo': 0.92,
      'baguio': 1.05,
      'general': 0.95
    };

    const regionalData = {};
    for (const [region, multiplier] of Object.entries(baseMultipliers)) {
      regionalData[region] = {
        multiplier: multiplier + (Math.random() - 0.5) * 0.1, // Add some variation
        lastUpdate: new Date(),
        factors: {
          transportation: multiplier > 1.0 ? 1.1 : 0.9,
          demand: multiplier > 1.0 ? 1.05 : 0.95,
          supply: multiplier > 1.0 ? 0.95 : 1.05
        }
      };
    }

    return regionalData;
  }

  /**
   * Fetch price trend data
   */
  async fetchTrendData() {
    // Simulate trend data for the last 30 days
    const trends = {};
    const ingredients = ['rice', 'pork belly', 'chicken thighs', 'onion', 'garlic', 'tomato'];
    
    ingredients.forEach(ingredient => {
      const basePrice = this.getBasePrice(ingredient);
      const dailyPrices = [];
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simulate price fluctuations
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const price = basePrice * (1 + variation);
        
        dailyPrices.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(price * 100) / 100,
          volume: Math.floor(Math.random() * 1000) + 500
        });
      }
      
      trends[ingredient] = {
        dailyPrices: dailyPrices,
        trend: this.calculateTrend(dailyPrices),
        volatility: this.calculateVolatility(dailyPrices),
        forecast: this.generateForecast(dailyPrices)
      };
    });

    return trends;
  }

  /**
   * Get base price for ingredient
   */
  getBasePrice(ingredient) {
    const basePrices = {
      'rice': 50,
      'pork belly': 280,
      'chicken thighs': 200,
      'onion': 80,
      'garlic': 200,
      'tomato': 60
    };
    return basePrices[ingredient] || 100;
  }

  /**
   * Calculate price trend
   */
  calculateTrend(dailyPrices) {
    if (dailyPrices.length < 2) return 'stable';
    
    const firstPrice = dailyPrices[0].price;
    const lastPrice = dailyPrices[dailyPrices.length - 1].price;
    const change = (lastPrice - firstPrice) / firstPrice;
    
    if (change > 0.05) return 'rising';
    if (change < -0.05) return 'falling';
    return 'stable';
  }

  /**
   * Calculate price volatility
   */
  calculateVolatility(dailyPrices) {
    if (dailyPrices.length < 2) return 0;
    
    const prices = dailyPrices.map(d => d.price);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    
    return Math.sqrt(variance) / mean; // Coefficient of variation
  }

  /**
   * Generate price forecast
   */
  generateForecast(dailyPrices) {
    if (dailyPrices.length < 7) return null;
    
    const recentPrices = dailyPrices.slice(-7).map(d => d.price);
    const trend = this.calculateTrend(dailyPrices);
    
    const lastPrice = recentPrices[recentPrices.length - 1];
    let forecast = lastPrice;
    
    // Simple forecast based on trend
    if (trend === 'rising') {
      forecast = lastPrice * 1.02; // 2% increase
    } else if (trend === 'falling') {
      forecast = lastPrice * 0.98; // 2% decrease
    }
    
    return {
      nextWeek: Math.round(forecast * 100) / 100,
      nextMonth: Math.round(forecast * (trend === 'rising' ? 1.05 : 0.95) * 100) / 100,
      confidence: Math.max(0.6, 1 - this.calculateVolatility(dailyPrices))
    };
  }

  /**
   * Get current market multiplier for region
   */
  getRegionalMultiplier(region) {
    const regionData = this.marketData.regions[region];
    return regionData ? regionData.multiplier : 1.0;
  }

  /**
   * Get seasonal factor for ingredient
   */
  getSeasonalFactor(ingredient, category) {
    const seasonalData = this.marketData.seasonalFactors[category];
    if (seasonalData) {
      return seasonalData.current;
    }
    
    // Default seasonal factors based on ingredient type
    const month = new Date().getMonth();
    const season = this.getSeason(month);
    
    const seasonalFactors = {
      'rice': { spring: 1.0, summer: 1.1, autumn: 0.9, winter: 1.0 },
      'vegetables': { spring: 0.8, summer: 1.2, autumn: 1.0, winter: 1.3 },
      'fish': { spring: 1.0, summer: 1.3, autumn: 1.1, winter: 0.8 },
      'pork': { spring: 1.0, summer: 1.05, autumn: 1.0, winter: 1.1 },
      'chicken': { spring: 1.0, summer: 1.1, autumn: 1.0, winter: 1.05 }
    };
    
    const factors = seasonalFactors[category] || { spring: 1.0, summer: 1.0, autumn: 1.0, winter: 1.0 };
    return factors[season] || 1.0;
  }

  /**
   * Get current season
   */
  getSeason(month) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  /**
   * Get market insights for pricing decisions
   */
  getMarketInsights(ingredients) {
    const insights = {
      overallTrend: 'stable',
      recommendations: [],
      warnings: [],
      opportunities: []
    };

    // Analyze each ingredient
    ingredients.forEach(ingredient => {
      const trend = this.marketData.trendData[ingredient];
      if (trend) {
        if (trend.trend === 'rising') {
          insights.warnings.push(`${ingredient} prices are rising - consider bulk purchasing`);
        } else if (trend.trend === 'falling') {
          insights.opportunities.push(`${ingredient} prices are falling - good time to buy`);
        }
        
        if (trend.volatility > 0.15) {
          insights.warnings.push(`${ingredient} has high price volatility - monitor closely`);
        }
      }
    });

    // Overall trend analysis
    const trends = Object.values(this.marketData.trendData).map(t => t.trend);
    const risingCount = trends.filter(t => t === 'rising').length;
    const fallingCount = trends.filter(t => t === 'falling').length;
    
    if (risingCount > fallingCount) {
      insights.overallTrend = 'rising';
      insights.recommendations.push('Consider increasing prices to maintain margins');
    } else if (fallingCount > risingCount) {
      insights.overallTrend = 'falling';
      insights.recommendations.push('Market prices are favorable - consider promotional pricing');
    }

    return insights;
  }

  /**
   * Get price alerts for significant changes
   */
  getPriceAlerts() {
    const alerts = [];
    
    Object.entries(this.marketData.trendData).forEach(([ingredient, data]) => {
      if (data.forecast && data.forecast.confidence > 0.7) {
        const change = (data.forecast.nextWeek - data.dailyPrices[data.dailyPrices.length - 1].price) / 
                      data.dailyPrices[data.dailyPrices.length - 1].price;
        
        if (Math.abs(change) > 0.1) { // 10% change threshold
          alerts.push({
            ingredient: ingredient,
            type: change > 0 ? 'price_increase' : 'price_decrease',
            change: Math.round(change * 100),
            forecast: data.forecast.nextWeek,
            confidence: data.forecast.confidence,
            recommendation: change > 0 ? 'Consider bulk purchasing' : 'Good time to buy'
          });
        }
      }
    });

    return alerts;
  }

  /**
   * Update seasonal factors based on current date
   */
  updateSeasonalFactors() {
    const month = new Date().getMonth();
    const season = this.getSeason(month);
    
    // Update seasonal factors based on current season
    Object.keys(this.marketData.seasonalFactors).forEach(category => {
      const factors = this.marketData.seasonalFactors[category];
      factors.current = factors[season] || 1.0;
    });
  }

  /**
   * Get market data summary
   */
  getMarketSummary() {
    return {
      lastUpdated: this.marketData.lastUpdated,
      regions: Object.keys(this.marketData.regions).length,
      ingredientsTracked: Object.keys(this.marketData.trendData).length,
      alerts: this.getPriceAlerts().length,
      overallTrend: this.getMarketInsights([]).overallTrend
    };
  }
}

module.exports = MarketDataService;
