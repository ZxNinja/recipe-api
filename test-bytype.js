const http = require('http');

function testByType(type) {
  http.get(`http://localhost:3000/api/bytype/${type}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const parsed = JSON.parse(data);
      console.log(`\n=== Meals by Type: ${type} ===`);
      console.log(`Count: ${parsed.count}`);
      console.log(`Type: ${parsed.mealType}`);
      if (parsed.meals && parsed.meals.length > 0) {
        console.log(`\nSample (first 5):`);
        parsed.meals.slice(0, 5).forEach(m => {
          console.log(`  • ${m.strMeal} (${m.strMealType})`);
        });
      }
    });
  }).on('error', err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

testByType('main');
setTimeout(() => testByType('side'), 1000);
setTimeout(() => process.exit(0), 2000);
