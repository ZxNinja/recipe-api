import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OLD = ROOT.parent / 'database.json.bak'
NEW = ROOT.parent / 'database.updated.json'


def load(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    try:
        old = load(OLD)
    except Exception:
        # fallback to original database.json if .bak is malformed
        old = load(ROOT.parent / 'database.json')
    new = load(NEW)
    old_map = {r.get('idMeal'): r for r in old.get('recipes', [])}
    changes = []
    for r in new.get('recipes', []):
        mid = r.get('idMeal')
        o = old_map.get(mid, {})
        def val(d, k):
            v = d.get(k)
            return v if isinstance(v, (int, float)) else None
        old_cal = val(o, 'calories') or 0
        new_cal = val(r, 'calories') or 0
        cal_delta = new_cal - old_cal
        price_delta = (val(r, 'price') or 0) - (val(o, 'price') or 0)
        changes.append({'idMeal': mid, 'name': r.get('strMeal'), 'old_cal': old_cal, 'new_cal': new_cal, 'cal_delta': cal_delta, 'old_price': val(o,'price') or 0, 'new_price': val(r,'price') or 0, 'price_delta': price_delta})

    changes.sort(key=lambda x: abs(x['cal_delta']), reverse=True)
    out = ROOT / 'report_changes.json'
    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'summary_count': len(changes), 'top': changes[:50]}, f, ensure_ascii=False, indent=2)
    print(f'Wrote report to {out}')
    # produce a validation sample (top 20 by calorie delta) with full recipe details
    top_ids = [c['idMeal'] for c in changes[:20]]
    new_map = {r.get('idMeal'): r for r in new.get('recipes', [])}
    old_map = {r.get('idMeal'): r for r in old.get('recipes', [])}
    sample = []
    for mid in top_ids:
        sample.append({'idMeal': mid, 'name': new_map.get(mid, {}).get('strMeal'), 'old': old_map.get(mid), 'new': new_map.get(mid)})
    with open(ROOT / 'validation_sample.json', 'w', encoding='utf-8') as f:
        json.dump({'sample': sample}, f, ensure_ascii=False, indent=2)
    print(f'Wrote validation sample to {ROOT / "validation_sample.json"}')


if __name__ == '__main__':
    main()
