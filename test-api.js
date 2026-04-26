const http = require('http');

function testAPI() {
  http.get('http://localhost:3000/api/recipes?page=1&limit=2', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const parsed = JSON.parse(data);
      console.log('API Response:');
      console.log(JSON.stringify(parsed, null, 2));
      console.log('\nFirst meal:');
      console.log(JSON.stringify(parsed.meals[0], null, 2));
      process.exit(0);
    });
  }).on('error', err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

// Wait for server to be ready
setTimeout(testAPI, 1000);
