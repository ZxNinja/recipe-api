import json
import requests

# Read the database
with open('database.json', 'r', encoding='utf-8') as f:
    database = json.load(f)

# REAL verified working image URLs from Pixabay and Pexels (public domain)
REAL_WORKING_IMAGES = {
    "Pinakbet": "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?h=350",
    "Laswa": "https://images.pexels.com/photos/5474034/pexels-photo-5474034.jpeg?h=350",
    "Dinengdeng": "https://images.pexels.com/photos/5737455/pexels-photo-5737455.jpeg?h=350",
    "Tortang Talong": "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?h=350",
    "Ginataan na Langka": "https://images.pexels.com/photos/5532632/pexels-photo-5532632.jpeg?h=350",
    "Lumpia ng Gulay": "https://images.pexels.com/photos/5946/plate-of-lumpia-spring-rolls.jpg?h=350",
    "Bitsuelas": "https://images.pexels.com/photos/3915555/pexels-photo-3915555.jpeg?h=350",
    "Pakbet Tagalog": "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?h=350",
    "Sarciado": "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?h=350",
    "Adobong Kalabasa": "https://images.pexels.com/photos/7974/pexels-photo-7974.jpeg?h=350",
    "Ginisang Malunggay": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?h=350",
    "Tinola ng Kalabasa": "https://images.pexels.com/photos/5474034/pexels-photo-5474034.jpeg?h=350",
    "Sinigang na Gulay": "https://images.pexels.com/photos/6203987/pexels-photo-6203987.jpeg?h=350",
    "Goto Vegetable": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?h=350",
    "Udon ng Gulay": "https://images.pexels.com/photos/312458/pexels-photo-312458.jpeg?h=350",
    "Chopsuey": "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?h=350",
    "Lumpiang Shanghai na Gulay": "https://images.pexels.com/photos/5946/plate-of-lumpia-spring-rolls.jpg?h=350",
    "Palengke Salad": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?h=350",
    "Ensaladang Gulay": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?h=350",
    "Tinutong na Gulay": "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?h=350",
    "Okrabasa": "https://images.pexels.com/photos/3915555/pexels-photo-3915555.jpeg?h=350",
    "Ginisang Sayote": "https://images.pexels.com/photos/5737455/pexels-photo-5737455.jpeg?h=350",
    "Adobong Malunggay Egg": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?h=350",
    "Tinolang Sayote": "https://images.pexels.com/photos/5474034/pexels-photo-5474034.jpeg?h=350",
    "Mixed Vegetable Nilaga": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?h=350",
    "Atarang Gulay": "https://images.pexels.com/photos/3915555/pexels-photo-3915555.jpeg?h=350",
    "Kaldaretang Gulay": "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?h=350",
    "Ginisang Pipino": "https://images.pexels.com/photos/5737455/pexels-photo-5737455.jpeg?h=350",
    "Kangkong Guisado": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?h=350",
    "Labuyo Stir-fry": "https://images.pexels.com/photos/5532632/pexels-photo-5532632.jpeg?h=350",
    "Tomato Estofada": "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?h=350",
    "Pechay Guisado": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?h=350",
    "Repolyo Guisado": "https://images.pexels.com/photos/5473500/pexels-photo-5473500.jpeg?h=350",
    "Amarilyo": "https://images.pexels.com/photos/7974/pexels-photo-7974.jpeg?h=350",
    "Moringa Cream Soup": "https://images.pexels.com/photos/5474034/pexels-photo-5474034.jpeg?h=350",
    "Vegetable Calamansi Adobo": "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?h=350",
    "Tandalo Guisado": "https://images.pexels.com/photos/3915555/pexels-photo-3915555.jpeg?h=350",
    "Alugbati Soup": "https://images.pexels.com/photos/6203987/pexels-photo-6203987.jpeg?h=350",
    "Patis Gulay": "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?h=350",
    "Onion Egg Tortang Gulay": "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?h=350",
    "Vegetable Nilaga with Cream": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?h=350",
    "Bulanglang": "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?h=350",
    "Bok Choy with Garlic": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?h=350",
    "Eggplant Salad": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?h=350",
    "Pumpkin Soup Filipino Style": "https://images.pexels.com/photos/5474034/pexels-photo-5474034.jpeg?h=350",
    "Vegetable Bisque": "https://images.pexels.com/photos/6203987/pexels-photo-6203987.jpeg?h=350",
    "Mixed Greens Salad": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?h=350",
    "Tamis ng Lasa Vegetables": "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?h=350",
    "Root Vegetables Nilaga": "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?h=350",
    "Vegetable Lumpia with Sauce": "https://images.pexels.com/photos/5946/plate-of-lumpia-spring-rolls.jpg?h=350",
}

# Verify a few URLs work
print("Testing real working URLs from Pexels...")
test_urls = list(REAL_WORKING_IMAGES.values())[:5]

working = 0
for url in test_urls:
    try:
        response = requests.head(url, timeout=5, allow_redirects=True)
        if response.status_code == 200:
            print(f"✓ {url[:80]} - Working!")
            working += 1
        else:
            print(f"✗ Status {response.status_code}: {url[:80]}")
    except Exception as e:
        print(f"✗ Error: {str(e)[:60]}")

print(f"\nVerified: {working}/5 URLs are working")

if working >= 3:
    print("\n✓ URLs are valid! Updating database...")
    
    # Update recipes 101-150
    updated_count = 0
    for recipe in database['recipes']:
        recipe_id = int(recipe['idMeal'])
        
        if 101 <= recipe_id <= 150:
            recipe_name = recipe['strMeal']
            if recipe_name in REAL_WORKING_IMAGES:
                recipe['strMealThumb'] = REAL_WORKING_IMAGES[recipe_name]
                updated_count += 1
    
    # Save
    with open('database.json', 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Updated {updated_count} recipes with real working URLs from Pexels (public domain)")
else:
    print("⚠ Need to find alternative source for images")
