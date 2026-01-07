import math
from ingredient_parser import parse_measure, canonicalize_ingredient


def approx(a, b, tol=1e-6):
    return abs(a - b) <= tol


def test_fraction_cups():
    assert approx(parse_measure('1/4 cup', 'sugar'), 240 * 0.25)
    assert approx(parse_measure('1/2 cup', 'sugar'), 240 * 0.5)
    assert approx(parse_measure('1 cup', 'sugar'), 240)
    assert approx(parse_measure('1 1/2 cup', 'sugar'), 240 * 1.5)


def test_small_units_and_pieces():
    assert approx(parse_measure('1/2 tsp', 'salt'), 5 * 0.5)
    assert approx(parse_measure('2 cloves', 'garlic'), 2 * 5)
    assert approx(parse_measure('1 head', 'garlic'), 30)
    assert approx(parse_measure('1 kg', 'pork_hock'), 1000)


def test_canonicalize():
    assert canonicalize_ingredient('Pork Ribs/Belly') == 'pork_belly'
    assert canonicalize_ingredient('Palabok Noodles') == 'noodles'
    assert canonicalize_ingredient('White Rice') == 'rice'

def test_whole_chicken():
    # 1 whole chicken should parse to approx 1200g
    assert abs(parse_measure('1 whole, cut up', 'chicken') - 1200) < 1e-6
    assert canonicalize_ingredient('Chicken') == 'chicken'


def test_no_missing_lookups_or_outliers():
    import json
    report = json.load(open('missing_lookup_report.json'))
    assert report.get('missing_nut', {}) == {}
    assert report.get('missing_price', {}) == {}
    assert report.get('outliers', []) == []

