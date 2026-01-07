# PR: Recalculate Nutrition and Prices (automated)

## Summary

- Recomputed per-recipe nutrition (calories, protein, carbs, fat) and price (PHP) using ingredient-level parsing and lookups. Outputs are in `database.updated.json` (now applied to `database.json`).

## What changed

- Replaced `database.json` with recalculated values derived from ingredient measures. Original backed up as `database.json.bak`.
- Added heuristics for parsing measures (fractions, mixed fractions, ml/l, piece counts).
- Added per-ingredient overrides and density estimates for accurate unit conversions (e.g., cups for rice, coconut milk can sizes, vegetables). Implemented fuzzy fallbacks for mixed/assorted vegetables.
- Added heuristics for oil absorption ("for deep frying" → 200g) and other vague measures.
- Added `calories_per_serving`, `price_per_serving`, `servings` and `sources` to recipes.
- Generated validation artifacts: `scripts/report_changes.json`, `scripts/validation_sample.json`, and `scripts/flagged_measures.json`.

## Validation & Limitations

- Manual spot-check performed on top changed recipes (see `scripts/validation_sample.json`).
- Remaining heuristics are conservative; some measures like "to taste" are estimated small (15g). Deep-fry oil absorbed is estimated (200g) — can be tuned if desired.
- Lookups use local Philippine PHP price approximations and per-100g nutrition values (USDA/other sources noted in `scripts/nutrition_lookup.json`).

## How to review

1. Inspect `scripts/validation_sample.json` for recipe-level diffs and rationale.
2. Check `scripts/report_changes.json` for the largest deltas.
3. If you want alternate heuristics (e.g., reduce oil absorption to 100g), edit `scripts/ingredient_parser.py` and re-run `python scripts/ingredient_parser.py`.

## Next steps (optional)

- Expand processed-food lookups (e.g., specific sauces, sausages) to eliminate zero-valued items.
- Add more unit tests for edge cases discovered during spot-check.

## Notes

- This update preserves the original DB as `database.json.bak`. If you prefer not to replace `database.json`, we can instead store `database.updated.json` as a separate file and open a PR that recommends swapping files during deployment.

## Contact

I prepared this PR draft and included validation artifacts. Let me know if you'd like me to open the PR on GitHub (requires push/remote access) or if you'd prefer to review changes locally first.
