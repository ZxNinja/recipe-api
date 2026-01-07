import json
from ingredient_parser import canonicalize_ingredient
js=json.load(open('..\\database.updated.json'))
bad_ids = ['42','50','76','78','85','98']
for r in js['recipes']:
    if r.get('idMeal') in bad_ids:
        print('\nRecipe', r.get('idMeal'), r.get('strMeal'))
        for i in range(1,11):
            ing = r.get(f'strIngredient{i}')
            if ing and ing.strip():
                key = canonicalize_ingredient(ing)
                print(' ', ing, '->', key)
                # check presence in lookups
                nutr = json.load(open('nutrition_lookup.json'))
                price = json.load(open('price_lookup.json'))
                print('    in nutr?', key in nutr, 'in price?', key in price)
