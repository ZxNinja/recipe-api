import json
from pathlib import Path
report = json.load(open('missing_lookup_report.json'))
missing = set(report.get('missing_nut', {}).keys()) | set(report.get('missing_price', {}).keys())
nut = json.load(open('nutrition_lookup.json'))
price = json.load(open('price_lookup.json'))

# heuristics
veg = ['leaf','leaves','bok_choy','pechay','malunggay','kangkong','ampalaya','bitter','sayote','chayote','squash','pumpkin','okra','carrot','corn']
legumes = ['mung','bean','beans','garbanzo','kadyos','lentil']
seafood = ['fish','tilapia','tuna','prawns','shrimp','squid','crab','crabs','stingray','pagi','mud_crab','alimasag']
processed = ['hotdog','sausage','kikiam','vienna','lechon','mang_tomas','sarsa','pangisa','lumpia','siomai','wrappers','spread']

added_n=0
added_p=0
for key in sorted(missing):
    # Skip if already present
    if key in nut and key in price:
        continue
    entry = None
    pentry = None
    # vegetables
    if any(w in key for w in veg) or key.endswith('_leaves') or key.startswith('green'):
        entry = {'name': key.replace('_',' '), 'per_100g': {'calories': 20, 'protein': 1.5, 'carbs': 3.0, 'fat': 0.2}, 'source': 'Estimated placeholder (vegetable)'}
        pentry = {'price_php_per_kg': 60, 'source': 'Estimated placeholder (vegetable)'}
    elif any(w in key for w in legumes):
        entry = {'name': key.replace('_',' '), 'per_100g': {'calories': 330, 'protein': 22.0, 'carbs': 60.0, 'fat': 1.5}, 'source': 'Estimated placeholder (legume)'}
        pentry = {'price_php_per_kg': 120, 'source': 'Estimated placeholder (legume)'}
    elif any(w in key for w in seafood):
        entry = {'name': key.replace('_',' '), 'per_100g': {'calories': 150, 'protein': 20.0, 'carbs': 0.0, 'fat': 5.0}, 'source': 'Estimated placeholder (seafood)'}
        pentry = {'price_php_per_kg': 300, 'source': 'Estimated placeholder (seafood)'}
    elif any(w in key for w in processed):
        entry = {'name': key.replace('_',' '), 'per_100g': {'calories': 300, 'protein': 10.0, 'carbs': 10.0, 'fat': 20.0}, 'source': 'Estimated placeholder (processed food)'}
        pentry = {'price_php_per_kg': 150, 'source': 'Estimated placeholder (processed food)'}
    elif 'sauce' in key or 'paste' in key or 'ketchup' in key or 'mayonnaise' in key or 'mang' in key or 'sarsa' in key:
        entry = {'name': key.replace('_',' '), 'per_100g': {'calories': 120, 'protein': 1.0, 'carbs': 20.0, 'fat': 3.0}, 'source': 'Estimated placeholder (condiment)'}
        pentry = {'price_php_per_kg': 180, 'source': 'Estimated placeholder (condiment)'}
    elif key.endswith('_wrapper') or 'wrapper' in key or 'wrappers' in key:
        entry = {'name': key.replace('_',' '), 'per_100g': {'calories': 300, 'protein': 6.0, 'carbs': 60.0, 'fat': 2.0}, 'source': 'Estimated placeholder (wrapper/dough)'}
        pentry = {'price_php_per_kg': 120, 'source': 'Estimated placeholder (wrapper/dough)'}
    elif 'rice' in key or 'noodle' in key or 'pasta' in key or 'spaghetti' in key:
        entry = {'name': key.replace('_',' '), 'per_100g': {'calories': 350, 'protein': 7.0, 'carbs': 75.0, 'fat': 1.0}, 'source': 'Estimated placeholder (starch)'}
        pentry = {'price_php_per_kg': 120, 'source': 'Estimated placeholder (starch)'}
    else:
        # default generic placeholder
        entry = {'name': key.replace('_',' '), 'per_100g': {'calories': 100, 'protein': 3.0, 'carbs': 10.0, 'fat': 5.0}, 'source': 'Estimated placeholder (generic)'}
        pentry = {'price_php_per_kg': 100, 'source': 'Estimated placeholder (generic)'}
    if key not in nut:
        nut[key] = entry
        added_n += 1
    if key not in price:
        price[key] = pentry
        added_p += 1

open('nutrition_lookup.json','w',encoding='utf-8').write(json.dumps(nut, indent=2))
open('price_lookup.json','w',encoding='utf-8').write(json.dumps(price, indent=2))
print('Added', added_n, 'nutrition placeholders and', added_p, 'price placeholders')
