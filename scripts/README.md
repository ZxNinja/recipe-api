# Recipe data update scripts

This folder contains helper scripts to parse ingredient measures and estimate nutrition and price per recipe.

Files:

- `ingredient_parser.py` - main script to parse `database.json` and write `database.updated.json` with recalculated fields.
- `nutrition_lookup.json` - sample nutrition per 100g mapping (can be extended or replaced by FDC/API lookups).
- `price_lookup.json` - sample local PHP price mapping (per kg or per liter).

Usage:

- Install Python 3.8+
- From `recipe-api-main/scripts` run:
  python ingredient_parser.py

The script writes `database.updated.json` in the `recipe-api-main/` folder with updated recipe fields and a `calculated_at` timestamp.

Notes:

- This is a heuristic script. For production-grade accuracy, expand the `nutrition_lookup.json` mapping to include more ingredients, use official data sources (USDA FDC, local prices), and refine measure-to-grams conversions.
