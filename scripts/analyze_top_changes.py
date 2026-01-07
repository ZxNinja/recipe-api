import json
from pathlib import Path
from ingredient_parser import canonicalize_ingredient, parse_measure

ROOT = Path(__file__).resolve().parent
NEW = ROOT.parent / 'database.updated.json'
NUTR = ROOT / 'nutrition_lookup.json'
PRICE = ROOT / 'price_lookup.json'
REPORT = ROOT / 'report_changes.json'


def load(p):
    with open(p, 'r', encoding='utf-8') as f:
        return json.load(f)


def analyze_recipe(r, nutr, price):
    contributions = []
    for i in range(1, 21):
        ing = r.get(f'strIngredient{i}', '')
        meas = r.get(f'strMeasure{i}', '')
        if not ing or not meas:
            continue
        key = canonicalize_ingredient(ing)
        grams = parse_measure(meas, key)
        nut = nutr.get(key, {}).get('per_100g', {})
        cal = grams * nut.get('calories', 0) / 100.0
        # price
        p = price.get(key, {})
        price_amt = 0
        if 'price_php_per_kg' in p:
            price_amt = grams * p['price_php_per_kg'] / 1000.0
        elif 'price_php_per_liter' in p:
            price_amt = grams * p['price_php_per_liter'] / 1000.0
        contributions.append({'ingredient': ing, 'key': key, 'measure': meas, 'grams': grams, 'calories': cal, 'price': price_amt})
    contributions.sort(key=lambda x: x['calories'], reverse=True)
    return contributions


def main():
    new = load(NEW)
    nutr = load(NUTR)
    price = load(PRICE)
    report = load(REPORT)
    top = report.get('top', [])[:10]
    for t in top:
        mid = t['idMeal']
        r = next((x for x in new.get('recipes', []) if x.get('idMeal') == mid), None)
        if not r:
            continue
        print(f"\n==== {mid} - {r.get('strMeal')} ====")
        print(f"Old cal: {t['old_cal']}, New cal: {t['new_cal']}, Delta: {t['cal_delta']}")
        contribs = analyze_recipe(r, nutr, price)
        print("Top calorie contributors:")
        for c in contribs[:6]:
            print(f" - {c['ingredient']} ({c['measure']}) -> {round(c['grams'])} g, {round(c['calories'])} kcal, price {round(c['price'])} PHP")


if __name__ == '__main__':
    main()
