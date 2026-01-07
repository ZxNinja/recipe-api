# Validation report — top-changed recipes

Date: 2026-01-07

Summary:

- Ran the parser and generated a validation sample for the top 20 recipes by calorie delta.
- Found several parsing anomalies where small measures (e.g., "1/4 cup", "2 tbsp") were parsed into implausibly large gram quantities (e.g., 960 g for 1/4 cup sugar).

Key findings and recommended fixes:

1. Fraction parsing and unexpected large gram values

- Example: `Buko Pie` — `Sugar (1/4 cup)` parsed as **960 g** (-> 3715 kcal) instead of ~60 g. Similar issues appear for `cornstarch`, `soy sauce`, `coconut milk` in several recipes.
- Likely causes: ambiguous fraction parsing or overlap with other regexes; unit normalization issues in specific measures.
- Recommended action: add unit tests (already added) to assert correct behavior for `1/4 cup`, `1/2 cup`, `1 1/2 cup`, etc.; add a clamping/sanity-check to `parse_measure` (e.g., if parsed grams > 1000 for a cup/tbsp/tsp measure, flag for review or re-parse with stricter regex).

2. Ingredients with missing nutrition/price lookups

- Several ingredients (e.g., "Pie Crust", "Young Coconut Strips (Buko)", "Shrimp Broth") lack direct mapping or price entries; parser assigns zero or small defaults.
- Recommended action: expand `nutrition_lookup.json` / `price_lookup.json` for processed items and common local terms, or add smart fallbacks (e.g., assume pie crust ~120 kcal/100g and pie crust mass per sheet).

3. Servings / yields

- Many recipes don't include a `servings` field; code used default 4. For accuracy, consider inferring servings from the recipe type or adding a per-recipe `servings` override.

Next steps I will take (unless you prefer otherwise):

- Run the unit tests and fix any failing parsing cases (focus: cup/tablespoon fraction handling) ✔
- Implement a heuristic clamp for implausible grams parsed from small measures (and emit a log/warning entry so we can review flagged recipes) ✔
- Expand lookups for a few processed items found in the validation sample (pie crust, condensed milk, shrimp broth) ✔
- Re-run the parser and re-generate the validation sample to confirm improvements ✔

Progress since fixes:

- Implemented ingredient-specific cup/tbsp densities for sugar, flour, cornstarch, condensed milk, and pie crust.
- Added a conservative `clamp_grams` helper to limit implausible unit parses and log suspicious cases.
- Added unit tests (`scripts/test_parser_unit.py`) and they pass locally.
- Flagged suspicious measures have been reduced to 1 non-broth item after excluding expected broth/water volumes (see `scripts/flagged_measures.json`).

Recommended next actions (I'll proceed unless you tell me otherwise):

1. Manual spot-check the `scripts/validation_sample.json` top 20 recipes and make any per-recipe corrections (e.g., special-case piece masses or unclear measures).
2. Add a few more nutrition entries for processed items if found during spot-check.
3. Prepare a PR that replaces `database.json` with `database.updated.json`, include `validation_sample.json` and `report_changes.json`, and document methodology and top diffs in the PR description.

If you'd like, I can open a branch and prepare the PR draft now and wait for your review before pushing/creating the PR.
