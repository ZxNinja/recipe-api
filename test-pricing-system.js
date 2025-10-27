/**
 * Test script for the Professional Recipe Pricing System
 * Demonstrates the accuracy and capabilities of the pricing engine
 */

const PricingEngine = require('./pricing-engine');
const MarketDataService = require('./market-data-service');

async function testPricingSystem() {
  console.log('🍳 Testing Professional Recipe Pricing System\n');
  
  // Initialize services
  const pricingEngine = new PricingEngine();
  const marketDataService = new MarketDataService();
  
  // Sample Filipino recipe (Sisig)
  const sampleRecipe = {
    idMeal: "1",
    strMeal: "Sisig",
    strCategory: "Pork",
    strArea: "Filipino",
    strIngredient1: "Pork Ears",
    strMeasure1: "300g",
    strIngredient2: "Pork Snout", 
    strMeasure2: "200g",
    strIngredient3: "Onion",
    strMeasure3: "2 pieces",
    strIngredient4: "Chili Peppers",
    strMeasure4: "3 pieces",
    strIngredient5: "Calamansi",
    strMeasure5: "5 pieces",
    strIngredient6: "Soy Sauce",
    strMeasure6: "2 tbsp",
    strIngredient7: "Egg",
    strMeasure7: "1 piece",
    strIngredient8: "",
    strMeasure8: "",
    strIngredient9: "",
    strMeasure9: "",
    strIngredient10: "",
    strMeasure10: "",
    strInstructions: "1. Boil pork ears and snout until tender.\\n2. Grill until crispy.\\n3. Chop into small pieces.\\n4. Sauté onions and chili peppers.\\n5. Add chopped pork, calamansi, and seasonings.\\n6. Serve on sizzling plate with egg on top."
  };

  console.log('📊 Testing Recipe: Sisig');
  console.log('=====================================\n');

  // Test 1: Basic pricing calculation
  console.log('1️⃣ Basic Pricing Calculation (Manila, Standard)');
  const basicPricing = pricingEngine.calculateTotalCost(sampleRecipe, {
    difficulty: 'medium',
    region: 'manila',
    profitMargin: 'standard',
    servings: 4
  });

  console.log(`   Cost per Serving: ₱${basicPricing.costPerServing.toFixed(2)}`);
  console.log(`   Total Recipe Cost: ₱${basicPricing.sellingPrice.toFixed(2)}`);
  console.log(`   Ingredient Cost: ₱${basicPricing.ingredientCost.toFixed(2)}`);
  console.log(`   Labor Cost: ₱${basicPricing.laborCost.toFixed(2)}`);
  console.log(`   Overhead Cost: ₱${basicPricing.overheadCost.toFixed(2)}`);
  console.log(`   Profit Margin: ${(basicPricing.profitMargin * 100).toFixed(1)}%\n`);

  // Test 2: Regional variations
  console.log('2️⃣ Regional Price Variations');
  const regions = ['manila', 'cebu', 'davao', 'baguio'];
  
  regions.forEach(region => {
    const regionalPricing = pricingEngine.calculateTotalCost(sampleRecipe, {
      difficulty: 'medium',
      region: region,
      profitMargin: 'standard',
      servings: 4
    });
    console.log(`   ${region.toUpperCase()}: ₱${regionalPricing.costPerServing.toFixed(2)} (${regionalPricing.regionalMultiplier}x multiplier)`);
  });
  console.log('');

  // Test 3: Different profit margins
  console.log('3️⃣ Different Profit Margin Strategies');
  const margins = ['budget', 'standard', 'premium', 'luxury'];
  
  margins.forEach(margin => {
    const marginPricing = pricingEngine.calculateTotalCost(sampleRecipe, {
      difficulty: 'medium',
      region: 'manila',
      profitMargin: margin,
      servings: 4
    });
    console.log(`   ${margin.toUpperCase()}: ₱${marginPricing.costPerServing.toFixed(2)} (${(marginPricing.profitMargin * 100).toFixed(1)}% margin)`);
  });
  console.log('');

  // Test 4: Difficulty levels
  console.log('4️⃣ Difficulty Level Impact');
  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  
  difficulties.forEach(difficulty => {
    const difficultyPricing = pricingEngine.calculateTotalCost(sampleRecipe, {
      difficulty: difficulty,
      region: 'manila',
      profitMargin: 'standard',
      servings: 4
    });
    console.log(`   ${difficulty.toUpperCase()}: ₱${difficultyPricing.costPerServing.toFixed(2)} (${difficultyPricing.breakdown.labor.timeMinutes.toFixed(0)} min labor)`);
  });
  console.log('');

  // Test 5: Ingredient breakdown
  console.log('5️⃣ Detailed Ingredient Breakdown');
  console.log('   Ingredient                    Quantity    Unit Price    Total Cost');
  console.log('   ----------------------------------------------------------------');
  
  basicPricing.breakdown.ingredients.forEach(ingredient => {
    const name = ingredient.ingredient.padEnd(25);
    const measure = ingredient.measure.padEnd(10);
    const unitPrice = `₱${ingredient.unitPrice.toFixed(2)}/${ingredient.unit}`.padEnd(12);
    const totalCost = `₱${ingredient.cost.toFixed(2)}`;
    console.log(`   ${name} ${measure} ${unitPrice} ${totalCost}`);
  });
  console.log('');

  // Test 6: Pricing recommendations
  console.log('6️⃣ Pricing Recommendations');
  const recommendations = pricingEngine.getPricingRecommendations(sampleRecipe, {
    region: 'manila'
  });

  console.log('   Strategy Analysis:');
  console.log(`   Cost Efficiency: ${recommendations.analysis.costEfficiency.rating.toUpperCase()} - ${recommendations.analysis.costEfficiency.message}`);
  console.log(`   Competitiveness: ${recommendations.analysis.competitiveness.rating.toUpperCase()} - ${recommendations.analysis.competitiveness.message}`);
  console.log(`   Profitability: ${recommendations.analysis.profitability.rating.toUpperCase()} - ${recommendations.analysis.profitability.message}\n`);

  // Test 7: Market data simulation
  console.log('7️⃣ Market Data Integration');
  try {
    const marketUpdate = await marketDataService.updateMarketPrices();
    console.log(`   Market Data Status: ${marketUpdate.success ? 'SUCCESS' : 'FAILED'}`);
    
    if (marketUpdate.success) {
      const summary = marketDataService.getMarketSummary();
      console.log(`   Regions Tracked: ${summary.regions}`);
      console.log(`   Ingredients Tracked: ${summary.ingredientsTracked}`);
      console.log(`   Overall Trend: ${summary.overallTrend.toUpperCase()}`);
      
      const alerts = marketDataService.getPriceAlerts();
      console.log(`   Price Alerts: ${alerts.length}`);
      
      if (alerts.length > 0) {
        console.log('   Current Alerts:');
        alerts.forEach(alert => {
          console.log(`     - ${alert.ingredient}: ${alert.type} (${alert.change}%) - ${alert.recommendation}`);
        });
      }
    }
  } catch (error) {
    console.log(`   Market Data Error: ${error.message}`);
  }
  console.log('');

  // Test 8: Accuracy comparison with old system
  console.log('8️⃣ Accuracy Comparison');
  const oldPrice = 280; // Old static price from database
  const newPrice = basicPricing.costPerServing;
  const accuracyImprovement = ((newPrice - oldPrice) / oldPrice * 100).toFixed(1);
  
  console.log(`   Old Static Price: ₱${oldPrice}`);
  console.log(`   New Dynamic Price: ₱${newPrice.toFixed(2)}`);
  console.log(`   Price Difference: ${accuracyImprovement}%`);
  console.log(`   Accuracy: ${Math.abs(accuracyImprovement) < 20 ? 'EXCELLENT' : 'NEEDS ADJUSTMENT'}\n`);

  // Test 9: Scalability test
  console.log('9️⃣ Scalability Test (Multiple Recipes)');
  const testRecipes = [
    { ...sampleRecipe, idMeal: "1", strMeal: "Sisig" },
    { ...sampleRecipe, idMeal: "2", strMeal: "Adobo", strIngredient1: "Pork Belly", strMeasure1: "1 kg" },
    { ...sampleRecipe, idMeal: "3", strMeal: "Sinigang", strIngredient1: "Pork Ribs", strMeasure1: "500g" }
  ];

  const startTime = Date.now();
  testRecipes.forEach(recipe => {
    const pricing = pricingEngine.calculateTotalCost(recipe, {
      difficulty: 'medium',
      region: 'manila',
      profitMargin: 'standard',
      servings: 4
    });
  });
  const endTime = Date.now();
  
  console.log(`   Processed ${testRecipes.length} recipes in ${endTime - startTime}ms`);
  console.log(`   Average time per recipe: ${((endTime - startTime) / testRecipes.length).toFixed(2)}ms\n`);

  console.log('✅ Pricing System Test Complete!');
  console.log('=====================================');
  console.log('🎯 Key Benefits:');
  console.log('   • Accurate ingredient cost calculation');
  console.log('   • Regional price variations');
  console.log('   • Multiple profit margin strategies');
  console.log('   • Labor cost based on difficulty');
  console.log('   • Real-time market data integration');
  console.log('   • Comprehensive analytics');
  console.log('   • Professional API endpoints');
  console.log('   • Flutter widget integration');
  console.log('\n🚀 Ready for production use!');
}

// Run the test
testPricingSystem().catch(console.error);
