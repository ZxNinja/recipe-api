import json
from pathlib import Path
from ingredient_parser import parse_measure, canonicalize_ingredient

ROOT = Path(__file__).resolve().parent
NEW = ROOT.parent / 'database.updated.json'


def load(p):
    with open(p, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    db = load(NEW)
    flagged = []
    IGNORE = ['water', 'broth', 'stock', 'sauce']
    for r in db.get('recipes', []):
        for i in range(1, 21):
            ing = r.get(f'strIngredient{i}', '')
            meas = r.get(f'strMeasure{i}', '')
            if not ing or not meas:
                continue
            key = canonicalize_ingredient(ing)
            grams = parse_measure(meas, key)
            # skip expected large water/broth entries
            if any(x in ing.lower() for x in IGNORE):
                continue
            # flag if grams are implausibly large for small-volume units
            if grams > 500 and any(u in meas.lower() for u in ['cup', 'tbsp', 'tsp', 'cups']):
                flagged.append({'idMeal': r.get('idMeal'), 'name': r.get('strMeal'), 'ingredient': ing, 'measure': meas, 'grams': grams})
            # flag if a single ingredient contributes >1000 kcal
            # (derive by looking up nutrition if available)
    out = ROOT / 'flagged_measures.json'
    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'flagged': flagged}, f, ensure_ascii=False, indent=2)
    print(f'Wrote {out} with {len(flagged)} flagged entries')


if __name__ == '__main__':
    main()
