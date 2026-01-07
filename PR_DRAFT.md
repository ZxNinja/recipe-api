Title: Recompute nutrition & prices for recipes (automated)

## Summary

This PR replaces `database.json` with recalculated nutrition and price values based on ingredient-level parsing and local PHP price estimates. It includes parsing heuristics, unit overrides, and validation artifacts.

Files of interest

- `database.json` (updated)
- `database.updated.json` (backup/staging)
- `scripts/ingredient_parser.py` (parsing logic and heuristics)
- `scripts/nutrition_lookup.json` (nutrition per 100g)
- `scripts/price_lookup.json` (price per kg/liter in PHP)
- `scripts/report_changes.json` (summary of changes)
- `scripts/validation_sample.json` (top-changed recipes with old/new)
- `scripts/flagged_measures.json` (suspicious measures; currently empty)

Notes for reviewers

- The parser uses conservative heuristics and logs suspicious parses. See `scripts/PR_NOTE.md` for methodology and assumptions.
- I could not push the branch to GitHub from this environment (remote access not available). To push and open the PR locally run:

  git push -u origin fix/nutrition-prices-20260107

Follow-up

- If you'd like, I can open the PR for you (requires repository remote access) or provide the patch/branch bundle to apply elsewhere.
