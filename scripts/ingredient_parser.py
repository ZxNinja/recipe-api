import json
import re
from datetime import datetime

ROOT = ".."
DB_PATH = "../database.json"
NUTR_PATH = "./nutrition_lookup.json"
PRICE_PATH = "./price_lookup.json"

# Basic unit conversions to grams (approx)
UNIT_TO_G = {
    "kg": 1000,
    "g": 1,
    "ml": 1,
    "l": 1000,
    "mg": 0.001,
    "lb": 453.592,
    "oz": 28.3495,
    "tbsp": 15,  # general water-equivalent
    "tbsp(s)": 15,
    "tbs": 15,
    "tsp": 5,
    "cup": 240,
    "cups": 240,
    "piece": None, # depends on ingredient
    "pieces": None,
    "head": None
}

# map common ingredient phrases to canonical keys in nutrition_lookup.json
ING_MAP = {
    "pork hocks/pata": "pork_hock",
    "pork hock": "pork_hock",
    "pork hocks": "pork_hock",
    "pork ears": "pork_ears",
    "pork snout": "pork_snout",
    "pork belly": "pork_belly",
    "garlic": "garlic",
    "bay leaves": "bay_leaf",
    "bay leaf": "bay_leaf",
    "whole peppercorns": "peppercorns",
    "peppercorns": "peppercorns",
    "salt": "salt",
    "vinegar": "vinegar",
    "soy sauce": "soy_sauce",
    "onion": "onion",
    "egg": "egg",
    "shrimp": "shrimp",
    "ground pork": "ground_pork",
    "palabok noodles": "noodles",
    "noodles": "noodles",
}

# additional common mappings
ING_MAP.update({
    "rice": "rice",
    "white rice": "rice",
    "cooked rice": "cooked_rice",
    "coconut milk": "coconut_milk",
    "coconut milk (canned)": "coconut_milk",
    "sugar": "sugar",
    "brown sugar": "sugar",
    "all purpose flour": "flour",
    "flour": "flour",
    "cornstarch": "cornstarch",
    "corn starch": "cornstarch",
    "vegetable oil": "cooking_oil",
    "cooking oil": "cooking_oil",
    "fish sauce": "fish_sauce",
    "banana ketchup": "banana_ketchup",
    "ketchup": "banana_ketchup",
    "chicharon": "chicharon",
    "butter": "butter",
    "milk": "milk",
    "bread": "bread",
    "tomato paste": "tomato_paste",
    "tomato sauce": "tomato_paste",
    "chili peppers": "chili_peppers",
    "chili pepper": "chili_peppers",
    "calamansi": "calamansi",
    "tamarind": "tamarind",
    "tamarind mix": "tamarind",
    "annatto": "annatto",
    "shrimp broth": "shrimp_broth",
    "chicken broth": "chicken_broth",
    "beef broth": "beef_broth",
    "pork broth": "pork_broth",
    "water": "water",
    "bangus": "bangus",
    "whole bangus": "bangus",
    "whole bangus milkfish": "bangus",
    "whole bangus (milkfish)": "bangus",
    "carrots": "carrot",
    "carrot": "carrot",
    "bell pepper": "bell_pepper",
    "bell peppers": "bell_pepper",
    "ginger": "ginger",
    "potatoes": "potato",
    "potato": "potato",
    "corn on the cob": "corn_on_the_cob",
    "corn on the cob (sliced)": "corn_on_the_cob",
    "pechay": "bok_choy",
    "pechay (bok choy)": "bok_choy",
    "bok choy": "bok_choy",
    "mung beans": "mung_beans",
    "mung beans (monggo)": "mung_beans",
    "pork innards": "pork_innards",
    "pork innards/meat": "pork_innards",
    "pork blood": "pork_blood",
    "pork shoulder": "pork_shoulder",
    "beef shank": "beef_shank",
    "beef shank with bone marrow": "beef_shank",
    "pineapple juice": "pineapple_juice",
    "red food coloring": "red_food_coloring",
    "bitter gourd leaves": "bitter_gourd_leaves",
    "tomatoes": "tomato",
    "long green chili (siling haba)": "chili_peppers",
    "green bell pepper": "bell_pepper",
    "eggplant": "eggplant",
    "kangkong": "kangkong",
    "okra": "okra",
    "squash": "squash_kalabasa",
    "squash (kalabasa)": "squash_kalabasa",
    "radish": "radish_labanos",
    "radish (labanos)": "radish_labanos",
    "long beans": "long_beans_sitaw",
    "long beans (sitaw)": "long_beans_sitaw",
    "sitaw": "long_beans_sitaw",
    "hard-boiled eggs": "egg",
    "hard boiled eggs": "egg",
    "hard-boiled_eggs": "egg",
    "quail eggs": "egg",
    "quail eggs (optional)": "egg",
    "quail_eggs_optional": "egg",
    "beef shanks with marrow": "beef_shank",
    "beef_shanks_with_marrow": "beef_shank",
    "large shrimps (sugpo)": "shrimp",
    "large_shrimps_sugpo": "shrimp",
    "large shrimps sugpo": "shrimp",
    "large shrimp sugpo": "shrimp",
})

# heuristics for 'piece' or vague measures: per-item mass (grams)
PER_ITEM_MASS = {
    "garlic": 5,  # per clove 5g
    "garlic_head": 30,
    "egg": 50,
    "onion": 150,
    "tomato": 100,
    "potato": 150,
    "pork_hock": 1500,
    "chicken": 1200,
    "bangus": 400,
    "eggplant": 150,
    "kangkong": 100
}
PER_ITEM_MASS.setdefault('chicken', 1200)

# per-ingredient unit overrides (unit -> grams) for more accurate conversions
ING_UNIT_OVERRIDES = {
    "bay_leaf": {"piece": 1},
    "peppercorns": {"tbsp": 6, "piece": 0.2},
    "garlic": {"clove": 5},
    "noodles": {"cup": 120}
}


def resolve_overrides(ingredient_key):
    """Return unit overrides for an ingredient key with some fuzzy fallbacks.
    Useful for entries like 'assorted_vegetables_broccoli' which should use the
    generic 'vegetable' overrides when present."""
    if not ingredient_key:
        return {}
    overrides = ING_UNIT_OVERRIDES.get(ingredient_key, {})
    if overrides:
        return overrides
    # fuzzy fallbacks
    if 'vegetable' in ingredient_key or 'vegetables' in ingredient_key or 'kangkong' in ingredient_key or 'greens' in ingredient_key:
        return ING_UNIT_OVERRIDES.get('vegetable', {})
    return {}

# more overrides for commonly ambiguous units
ING_UNIT_OVERRIDES.setdefault('rice', {})
ING_UNIT_OVERRIDES['rice'].update({'cup': 185})
ING_UNIT_OVERRIDES.setdefault('cooked_rice', {})
ING_UNIT_OVERRIDES['cooked_rice'].update({'cup': 200})
ING_UNIT_OVERRIDES.setdefault('coconut_milk', {})
ING_UNIT_OVERRIDES['coconut_milk'].update({'can': 400, 'tbsp': 15})
ING_UNIT_OVERRIDES.setdefault('butter', {})
ING_UNIT_OVERRIDES['butter'].update({'tbsp': 14})
ING_UNIT_OVERRIDES.setdefault('garlic', {})
ING_UNIT_OVERRIDES['garlic'].update({'head': 30})
# sensible default for mixed/assorted vegetables (approx 120g per cup)
ING_UNIT_OVERRIDES.setdefault('vegetable', {})
ING_UNIT_OVERRIDES['vegetable'].update({'cup': 120})
ING_UNIT_OVERRIDES.setdefault('sugar', {})
ING_UNIT_OVERRIDES['sugar'].update({'cup': 200})
ING_UNIT_OVERRIDES.setdefault('flour', {})
ING_UNIT_OVERRIDES['flour'].update({'cup': 120})
ING_UNIT_OVERRIDES.setdefault('cornstarch', {})
ING_UNIT_OVERRIDES['cornstarch'].update({'cup': 128, 'tbsp': 8})
ING_UNIT_OVERRIDES.setdefault('condensed_milk', {})
ING_UNIT_OVERRIDES['condensed_milk'].update({'cup': 306, 'tbsp': 19})
ING_UNIT_OVERRIDES.setdefault('pie_crust', {})
ING_UNIT_OVERRIDES['pie_crust'].update({'sheet': 120})
ING_UNIT_OVERRIDES.setdefault('chicken_wings', {})
ING_UNIT_OVERRIDES['chicken_wings'].update({'piece': 50})


def parse_measure(measure_text, ingredient_key):
    if not measure_text:
        return 0.0
    measure_text = measure_text.strip().lower()

    # try to find explicit kg/g like "1.5kg" or "300g"
    m = re.search(r"([0-9]*\.?[0-9]+)\s*(kg|g|mg|lb|oz)", measure_text)
    if m:
        val = float(m.group(1))
        unit = m.group(2)
        grams = val * UNIT_TO_G[unit]
        return clamp_grams(measure_text, grams)

    # find numbers with parentheses e.g. '1 piece (approx 1.5kg)'
    m = re.search(r"\(([^)]+)\)", measure_text)
    if m:
        inner = m.group(1)
        gm = parse_measure(inner, ingredient_key)
        if gm:
            return clamp_grams(measure_text, gm)

    # pieces with an explicit number: "2 pieces" or "1 whole, cut up"
    m = re.search(r"([0-9]+)\s*(piece|pieces|head|clove|cloves|whole|pc|pcs|bunch|bunches|stalk|stalks)", measure_text)
    if m:
        count = int(m.group(1))
        unit = m.group(2)
        # try per-item mass lookup
        name = ingredient_key
        # check unit overrides first (with fuzzy fallbacks)
        overrides = resolve_overrides(name)
        # normalize unit names (clove -> clove)
        unit_key = 'clove' if 'clove' in unit else ('piece' if 'piece' in unit or 'head' in unit or 'whole' in unit else unit)
        if unit_key in overrides:
            return clamp_grams(measure_text, count * overrides[unit_key])
        approx_mass = PER_ITEM_MASS.get(name, None)
        if approx_mass:
            return clamp_grams(measure_text, count * approx_mass)
        # default piece mass smaller (for spices/vegetables) to avoid huge parsing errors
        return clamp_grams(measure_text, count * 10)

    # fractions like 1/2 cup or mixed fractions like '1 1/2 cup'
    m = re.search(r"(?:(\d+)\s+)?(\d+)\s*/\s*(\d+)\s*(cup|tbsp|tsp|cups)", measure_text)
    if m:
        whole = int(m.group(1)) if m.group(1) else 0
        num = float(m.group(2))
        den = float(m.group(3))
        unit = m.group(4)
        frac = whole + (num / den)
        overrides = resolve_overrides(ingredient_key)
        key_unit = unit.rstrip('s')
        if unit in overrides:
            grams = frac * overrides[unit]
        elif key_unit in overrides:
            grams = frac * overrides[key_unit]
        else:
            grams = frac * UNIT_TO_G.get(unit, 0)
        return clamp_grams(measure_text, grams)

    # tablespoons/tsp/cup
    for unit in ["tbsp", "tsp", "cup", "cups", "tbsp(s)"]:
        m = re.search(r"([0-9]*\.?[0-9]+)\s*" + re.escape(unit), measure_text)
        if m:
            val = float(m.group(1))
            # check per-ingredient overrides for unit (with fuzzy fallbacks)
            overrides = resolve_overrides(ingredient_key)
            if unit in overrides:
                grams = val * overrides[unit]
            else:
                grams = val * UNIT_TO_G.get(unit, 0)
            return clamp_grams(measure_text, grams)

    # grams only number
    m = re.search(r"^([0-9]+)\s*$", measure_text)
    if m:
        return clamp_grams(measure_text, float(m.group(1)))

    # fractions like 1/2 cup
    m = re.search(r"([0-9]+)\s*/\s*([0-9]+)\s*(cup|tbsp|tsp)", measure_text)
    if m:
        num = float(m.group(2))
        den = float(m.group(3))
        unit = m.group(4)
        frac = num / den
        overrides = resolve_overrides(ingredient_key)
        key_unit = unit.rstrip('s')
        if unit in overrides:
            grams = frac * overrides[unit]
        elif key_unit in overrides:
            grams = frac * overrides[key_unit]
        else:
            grams = frac * UNIT_TO_G.get(unit, 0)
        return clamp_grams(measure_text, grams)

    # for vague terms like 'for dipping sauce' or 'to taste' assume a small contribution
    # oil/frying heuristics: estimate absorbed oil when measure is vague
    if 'deep fry' in measure_text or 'deep-fry' in measure_text or 'deep frying' in measure_text:
        # if ingredient is an oil, assume moderate batch oil absorption
        if ingredient_key and ('oil' in ingredient_key or 'cooking_oil' in ingredient_key or 'vegetable' in ingredient_key):
            return clamp_grams(measure_text, 200.0)
        return clamp_grams(measure_text, 100.0)
    if 'fry' in measure_text and ('for' in measure_text or 'as needed' in measure_text):
        if ingredient_key and ('oil' in ingredient_key or 'cooking_oil' in ingredient_key or 'vegetable' in ingredient_key):
            return clamp_grams(measure_text, 50.0)
    if 'for dipping' in measure_text or 'to taste' in measure_text or 'for dipping sauce' in measure_text:
        return clamp_grams(measure_text, 15.0)

    # fallback: try to extract first number
    m = re.search(r"([0-9]*\.?[0-9]+)", measure_text)
    if m:
        val = float(m.group(1))
        # assume grams
        return clamp_grams(measure_text, val)

    return 0.0


def clamp_grams(measure_text, grams):
    """Sanity-clamp parsed grams for small-volume units to avoid implausible values.
    Also logs suspicious cases to a lightweight warn file for review."""
    mt = measure_text.lower()
    # clamp rules (conservative): cup <= 1000 g, tbsp <= 200 g, tsp <= 50 g
    if 'cup' in mt and grams > 1000:
        grams = 1000.0
    if 'tbsp' in mt and grams > 200:
        grams = 200.0
    if 'tsp' in mt and grams > 50:
        grams = 50.0
    # if still implausible (very large for small units) - append to a log for manual review
    if any(u in mt for u in ['cup', 'tbsp', 'tsp']) and grams > 500:
        try:
            with open('suspicious_parse_warnings.log', 'a', encoding='utf-8') as wf:
                wf.write(f"Suspicious parse: {measure_text} -> {grams}\n")
        except Exception:
            pass
    return grams


def canonicalize_ingredient(name):
    if not name:
        return None
    raw = name.strip().lower()
    raw = re.sub(r"[^a-z0-9 /-]", "", raw)
    # direct map
    if raw in ING_MAP:
        return ING_MAP[raw]
    # try to match by splitting on slashes (e.g., 'Pork Ribs/Belly') and parts
    parts = [p.strip() for p in raw.split('/') if p.strip()]
    for p in parts:
        if p in ING_MAP:
            return ING_MAP[p]
    # handle broth/stock specially (avoid mapping 'shrimp broth' -> 'shrimp')
    if 'broth' in raw or 'stock' in raw:
        # try exact broth keys first
        for k in ING_MAP.keys():
            if 'broth' in k and k in raw:
                return ING_MAP[k]
        # common combined terms
        if 'shrimp' in raw:
            return 'shrimp_broth'
        if 'chicken' in raw:
            return 'chicken_broth'
        if 'beef' in raw:
            return 'beef_broth'
        if 'pork' in raw:
            return 'pork_broth'
        return 'water'
    # handle fragmented phrases like 'pork ribs/belly' -> map to pork_belly
    if 'pork' in raw and 'belly' in raw:
        return ING_MAP.get('pork belly', 'pork_belly')
    if 'pork' in raw and 'rib' in raw:
        return ING_MAP.get('pork belly', 'pork_belly')
    # try contains on full raw but match whole words and prefer longer keys to avoid short-key collisions (e.g., 'egg' in 'eggplant')
    for k in sorted(ING_MAP.keys(), key=lambda x: -len(x)):
        if re.search(r'\b' + re.escape(k) + r'\b', raw):
            return ING_MAP[k]
    # try singular/plural normalization
    raw = raw.replace('pieces', 'piece')
    raw = raw.replace('whole ', '')
    raw = raw.replace('fresh ', '')
    # fallback: replace spaces with underscore
    key = raw.replace(' ', '_')
    return key


def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    print('Loading lookups...')
    nutr = load_json(NUTR_PATH)
    price = load_json(PRICE_PATH)

    db = load_json(DB_PATH)
    recipes = db.get('recipes', [])
    updated = []

    for r in recipes:
        total = {'calories': 0.0, 'protein': 0.0, 'carbs': 0.0, 'fat': 0.0}
        total_price = 0.0
        used_keys = set()
        # loop through ingredient entries (strIngredient1..20 assumed)
        for i in range(1, 21):
            ing = r.get(f'strIngredient{i}', '')
            meas = r.get(f'strMeasure{i}', '')
            if not ing or not meas or ing.strip() == '':
                continue
            key = canonicalize_ingredient(ing)
            grams = parse_measure(meas, key)
            if grams <= 0:
                # try per piece recognition
                grams = parse_measure(meas, key)
            # get nutrition per 100g
            nut_key = key
            if nut_key in nutr:
                per100 = nutr[nut_key]['per_100g']
                total['calories'] += grams * per100.get('calories', 0) / 100.0
                total['protein'] += grams * per100.get('protein', 0) / 100.0
                total['carbs'] += grams * per100.get('carbs', 0) / 100.0
                total['fat'] += grams * per100.get('fat', 0) / 100.0
                used_keys.add(nut_key)
            else:
                # unknown ingredient: skip or estimate small
                # here we skip but log
                pass

            # get price
            # price map uses per_kg or per_liter
            p = price.get(nut_key, None)
            if p:
                if 'price_php_per_kg' in p:
                    price_per_g = p['price_php_per_kg'] / 1000.0
                    total_price += grams * price_per_g
                    used_keys.add(nut_key)
                elif 'price_php_per_liter' in p:
                    # assume 1 liter ~ 1000 g for liquid
                    price_per_g = p['price_php_per_liter'] / 1000.0
                    total_price += grams * price_per_g
                    used_keys.add(nut_key)

        # compute servings and per-serving values
        servings = r.get('servings') or r.get('yield') or 4
        try:
            servings = int(servings)
        except Exception:
            servings = 4

        calc_cal = round(total['calories'])
        calc_pro = round(total['protein'])
        calc_carb = round(total['carbs'])
        calc_fat = round(total['fat'])
        calc_price = round(total_price)
        calc_cal_per_serv = round(calc_cal / servings) if servings else calc_cal
        calc_price_per_serv = round(calc_price / servings) if servings else calc_price

        # compute difference check with existing values
        changed = False
        diffs = {}
        for field, calc_val in (('calories', calc_cal), ('protein', calc_pro), ('carbs', calc_carb), ('fat', calc_fat), ('price', calc_price), ('calories_per_serving', calc_cal_per_serv), ('price_per_serving', calc_price_per_serv)):
            old = r.get(field, None)
            if old is None or abs((old - calc_val) if old is not None else calc_val) > max(5, 0.2 * (old or 1)):
                diffs[field] = {'old': old, 'new': calc_val}
                r[field] = calc_val
                changed = True

        if changed:
            r.setdefault('sources', [])
            # gather relevant sources used (only for ingredients actually present)
            used_sources = set()
            for k in used_keys:
                if k in nutr:
                    used_sources.add(nutr[k]['source'])
                if k in price:
                    used_sources.add(price[k].get('source',''))
            r['sources'] = list(used_sources)
            r['calculated_at'] = datetime.utcnow().isoformat() + 'Z'
            updated.append({'idMeal': r.get('idMeal'), 'diffs': diffs})

    # write an updated file
    out_path = '../database.updated.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print(f'Updated {len(updated)} recipes. Wrote {out_path}')
    if updated:
        print('Sample updates:')
        for u in updated[:10]:
            print(u)

if __name__ == '__main__':
    main()
