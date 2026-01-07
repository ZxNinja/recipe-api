from ingredient_parser import canonicalize_ingredient, parse_measure
import json
print('canonicalize Chicken ->', canonicalize_ingredient('Chicken'))
print('parse_measure 1 whole chicken ->', parse_measure('1 whole, cut up', 'chicken'))
nut = json.load(open('nutrition_lookup.json'))
price = json.load(open('price_lookup.json'))
print('chicken in nutrition?', 'chicken' in nut)
print('chicken in price?', 'chicken' in price)
print('nutrition entry for chicken:', nut.get('chicken'))
print('price entry for chicken:', price.get('chicken'))
