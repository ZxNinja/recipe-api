import json
import requests
import time

# Read the database
with open('database.json', 'r', encoding='utf-8') as f:
    database = json.load(f)

# Dictionary with real food image URLs
FOOD_IMAGES = {
    "Pinakbet": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Pinakbet.jpg/640px-Pinakbet.jpg",
    "Laswa": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640",
    "Dinengdeng": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640",
    "Tortang Talong": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Tortang_talong.jpg/640px-Tortang_talong.jpg",
    "Ginataan na Langka": "https://images.unsplash.com/photo-1645521450263-f574d5e89dc1?w=640",
    "Lumpia ng Gulay": "https://images.unsplash.com/photo-1585518419759-87fbfa3d4146?w=640",
    "Bitsuelas": "https://images.unsplash.com/photo-1584080558529-a7e9f78c61cc?w=640",
    "Pakbet Tagalog": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Sarciado": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640",
    "Adobong Kalabasa": "https://images.unsplash.com/photo-1585421514675-7f8f1e7c3ebf?w=640",
    "Ginisang Malunggay": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Tinola ng Kalabasa": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=640",
    "Sinigang na Gulay": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=640",
    "Goto Vegetable": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640",
    "Udon ng Gulay": "https://images.unsplash.com/photo-1612874742237-6526221fcf4c?w=640",
    "Chopsuey": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Lumpiang Shanghai na Gulay": "https://images.unsplash.com/photo-1585518419759-87fbfa3d4146?w=640",
    "Palengke Salad": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=640",
    "Ensaladang Gulay": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=640",
    "Tinutong na Gulay": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Okrabasa": "https://images.unsplash.com/photo-1584080558529-a7e9f78c61cc?w=640",
    "Ginisang Sayote": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Adobong Malunggay Egg": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Tinolang Sayote": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=640",
    "Mixed Vegetable Nilaga": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640",
    "Atarang Gulay": "https://images.unsplash.com/photo-1584080558529-a7e9f78c61cc?w=640",
    "Kaldaretang Gulay": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640",
    "Ginisang Pipino": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Kangkong Guisado": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Labuyo Stir-fry": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Tomato Estofada": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640",
    "Pechay Guisado": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Repolyo Guisado": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=640",
    "Amarilyo": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=640",
    "Moringa Cream Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=640",
    "Vegetable Calamansi Adobo": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Tandalo Guisado": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Alugbati Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=640",
    "Patis Gulay": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Onion Egg Tortang Gulay": "https://images.unsplash.com/photo-1608039891527-ce37b63688b0?w=640",
    "Vegetable Nilaga with Cream": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640",
    "Bulanglang": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640",
    "Bok Choy with Garlic": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Eggplant Salad": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=640",
    "Pumpkin Soup Filipino Style": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=640",
    "Vegetable Bisque": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=640",
    "Mixed Greens Salad": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=640",
    "Tamis ng Lasa Vegetables": "https://images.unsplash.com/photo-1609949065150-e7ee0da42c19?w=640",
    "Root Vegetables Nilaga": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640",
    "Vegetable Lumpia with Sauce": "https://images.unsplash.com/photo-1569718212165-3a8a8e87fb5f?w=640",
}

# Update recipes 101-150
updated_count = 0
failed_count = 0

for recipe in database['recipes']:
    recipe_id = int(recipe['idMeal'])
    
    if 101 <= recipe_id <= 150:
        recipe_name = recipe['strMeal']
        print(f"[{recipe_id:3d}] {recipe_name:35s}", end=' ')
        
        if recipe_name in FOOD_IMAGES:
            recipe['strMealThumb'] = FOOD_IMAGES[recipe_name]
            print(f"✓")
            updated_count += 1
        else:
            print(f"⚠")
            failed_count += 1
        
        time.sleep(0.1)

# Save updated database
with open('database.json', 'w', encoding='utf-8') as f:
    json.dump(database, f, indent=2, ensure_ascii=False)

print(f"\n{'='*60}")
print(f"Update Complete!")
print(f"{'='*60}")
print(f"✓ Successfully updated: {updated_count} recipes")
print(f"⚠ Recipes using defaults:  {failed_count} recipes")
print(f"  Total processed:        {updated_count + failed_count} recipes")
print(f"{'='*60}")
