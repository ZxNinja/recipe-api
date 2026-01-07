import json
from pathlib import Path
import ingredient_parser as ip

ROOT = Path(__file__).resolve().parent
NEW = ROOT.parent / 'database.updated.json'
OLD = ROOT.parent / 'database.json.bak'
NUTR = ROOT / 'nutrition_lookup.json'
PRICE = ROOT / 'price_lookup.json'

THRESH_CAL = 200
THRESH_PRICE = 20


def load(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def breakdown_recipe(r, nutr, price):
    items = []
    total_cals = 0.0
    total_price = 0.0
    for i in range(1, 21):
        ing = r.get(f'strIngredient{i}', '')
        meas = r.get(f'strMeasure{i}', '')
        if not ing or not meas or ing.strip() == '':
            continue
        key = ip.canonicalize_ingredient(ing)
        grams = ip.parse_measure(meas, key)
        per100 = nutr.get(key, {}).get('per_100g', {})
        kcal = grams * per100.get('calories', 0) / 100.0
        pr = 0.0
        pinfo = price.get(key, {})
        if 'price_php_per_kg' in pinfo:
            pr = grams * (pinfo['price_php_per_kg'] / 1000.0)
        elif 'price_php_per_liter' in pinfo:
            pr = grams * (pinfo['price_php_per_liter'] / 1000.0)
        items.append({'ingredient': ing, 'key': key, 'measure': meas, 'grams': grams, 'kcal': round(kcal,1), 'price': round(pr,2), 'per100': per100, 'price_info': pinfo})
        total_cals += kcal
        total_price += pr
    return {'items': items, 'total_calories': round(total_cals), 'total_price': round(total_price)}


def main():
    new = load(NEW)
    try:
        old = load(OLD)
    except Exception:
        old = load(ROOT.parent / 'database.json')
    nutr = load(NUTR)
    price = load(PRICE)

    old_map = {r.get('idMeal'): r for r in old.get('recipes', [])}
    report = {'cases': []}
    for r in new.get('recipes', []):
        mid = r.get('idMeal')
        o = old_map.get(mid, {})
        def val(d, k):
            v = d.get(k)
            return v if isinstance(v, (int, float)) else 0
        old_cal = val(o, 'calories')
        new_cal = val(r, 'calories')
        cal_delta = abs(new_cal - old_cal)
        old_price = val(o, 'price')
        new_price = val(r, 'price')
        price_delta = abs(new_price - old_price)
        if cal_delta >= THRESH_CAL or price_delta >= THRESH_PRICE:
            br = breakdown_recipe(r, nutr, price)
            report['cases'].append({'idMeal': mid, 'name': r.get('strMeal'), 'old_cal': old_cal, 'new_cal': new_cal, 'cal_delta': cal_delta, 'old_price': old_price, 'new_price': new_price, 'price_delta': price_delta, 'breakdown': br})

    out = ROOT / 'breakdown_report.json'
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f'Wrote breakdown to {out}')


if __name__ == '__main__':
    main()
