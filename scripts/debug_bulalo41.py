import json
import ingredient_parser as ip

db = json.load(open('../database.updated.json'))
nutr = json.load(open('nutrition_lookup.json'))
price = json.load(open('price_lookup.json'))

for r in db.get('recipes', []):
    if r.get('idMeal') == '41':
        print('Recipe', r.get('strMeal'))
        total_kcal = 0
        total_price = 0
        for i in range(1, 21):
            ing = r.get(f'strIngredient{i}', '')
            meas = r.get(f'strMeasure{i}', '')
            if not ing or not meas or not ing.strip():
                continue
            key = ip.canonicalize_ingredient(ing)
            grams = ip.parse_measure(meas, key)
            per100 = nutr.get(key, {}).get('per_100g', {})
            kcal = grams * per100.get('calories', 0) / 100.0
            pinfo = price.get(key, {})
            pr = 0
            if 'price_php_per_kg' in pinfo:
                pr = grams * (pinfo['price_php_per_kg'] / 1000.0)
            elif 'price_php_per_liter' in pinfo:
                pr = grams * (pinfo['price_php_per_liter'] / 1000.0)
            print(f" - {ing} | {meas} | key={key} | grams={grams} | kcal={kcal:.1f} | price={pr:.2f} | per100={per100} | price_info={pinfo}")
            total_kcal += kcal
            total_price += pr
        print('Computed total kcal', round(total_kcal), 'price', round(total_price))
        print('Stored calories', r.get('calories'), 'price', r.get('price'), 'cal/serv', r.get('calories_per_serving'), 'price/serv', r.get('price_per_serving'))
        break