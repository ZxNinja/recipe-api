import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
NUTR = ROOT / 'nutrition_lookup.json'
BREAK = ROOT / 'breakdown_report.json'
OUT = ROOT / 'suspicious_nutrition.json'

THRESH_CAL = 200


def load(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    nutr = load(NUTR)
    br = load(BREAK)
    bad = []
    for k, v in nutr.items():
        per = v.get('per_100g', {})
        cal = per.get('calories', 0)
        prot = per.get('protein', 0)
        # flag heuristics: too high calories for vegetables/placeholders, or source contains placeholder
        source = v.get('source','').lower()
        if 'placeholder' in source or cal > THRESH_CAL or prot > 50:
            bad.append({'key': k, 'calories': cal, 'protein': prot, 'carbs': per.get('carbs'), 'fat': per.get('fat'), 'source': v.get('source','')})

    # correlate with breakdown to find where used
    used = {}
    for case in br.get('cases', []):
        for item in case['breakdown']['items']:
            key = item.get('key')
            if key in nutr:
                if key not in used:
                    used[key] = 0
                used[key] += abs(item.get('kcal',0))

    # attach usage counts
    for b in bad:
        b['used_total_kcal_in_breakdown'] = used.get(b['key'], 0)

    # sort by usage
    bad.sort(key=lambda x: x.get('used_total_kcal_in_breakdown',0), reverse=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump({'suspicious': bad}, f, ensure_ascii=False, indent=2)
    print(f'Wrote suspicious list to {OUT}')

if __name__ == '__main__':
    main()
