import json
from ingredient_parser import canonicalize_ingredient
from pathlib import Path
js = json.load(open('..\\database.updated.json'))
nut = json.load(open('nutrition_lookup.json'))
price = json.load(open('price_lookup.json'))
missing_nut = {}
missing_price = {}
outliers = []
for r in js.get('recipes',[]):
    for i in range(1,21):
        ing = r.get(f'strIngredient{i}','')
        meas = r.get(f'strMeasure{i}','')
        if not ing or not ing.strip():
            continue
        key = canonicalize_ingredient(ing)
        if key not in nut:
            missing_nut.setdefault(key, set()).add(ing)
        if key not in price:
            missing_price.setdefault(key, set()).add(ing)
    # outlier checks
    cps = r.get('calories_per_serving')
    pps = r.get('price_per_serving')
    if cps is not None and (cps < 50 or cps > 2500):
        outliers.append({'id': r.get('idMeal'), 'name': r.get('strMeal'), 'cal_per_serv': cps, 'price_per_serv': pps})

print('Missing nutrition keys:', len(missing_nut))
print('Missing price keys:', len(missing_price))
print('Outliers (calories_per_serving <50 or >2500):', len(outliers))

open('missing_lookup_report.json','w',encoding='utf-8').write(json.dumps({'missing_nut':{k:list(v) for k,v in missing_nut.items()}, 'missing_price':{k:list(v) for k,v in missing_price.items()}, 'outliers': outliers}, indent=2))
print('Wrote missing_lookup_report.json')
