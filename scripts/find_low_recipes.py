import json
from pathlib import Path
p = Path('..') / 'database.updated.json'
js = json.load(p.open())
low = []
for r in js.get('recipes', []):
    cal = r.get('calories', 0)
    pr = r.get('price', 0)
    if cal < 50 or pr < 10:
        low.append({
            'id': r.get('idMeal'),
            'name': r.get('strMeal'),
            'calories': cal,
            'price': pr,
            'servings': r.get('servings'),
            'ingredients': [(r.get(f'strIngredient{i}'), r.get(f'strMeasure{i}')) for i in range(1, 11)]
        })

print(f'Found {len(low)} low-count recipes (cal<50 or price<10)')
for b in low:
    print('\n', b['id'], b['name'], 'cal', b['calories'], 'price', b['price'], 'servings', b['servings'])
    for ing,me in b['ingredients']:
        if ing and ing.strip():
            print('  -', ing, '|', me)
