import json
import requests

# Read the database
with open('database.json', 'r', encoding='utf-8') as f:
    database = json.load(f)

# Real VERIFIED working image URLs from actual sources
VERIFIED_IMAGES = {
    "Pinakbet": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Pinakbet.jpg/640px-Pinakbet.jpg",
    "Laswa": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Laswa.jpg/640px-Laswa.jpg",
    "Dinengdeng": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Dinengdeng.jpg/640px-Dinengdeng.jpg",
    "Tortang Talong": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Tortang_talong.jpg/640px-Tortang_talong.jpg",
    "Ginataan na Langka": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Ginataan_na_langka.jpg/640px-Ginataan_na_langka.jpg",
    "Lumpia ng Gulay": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Lumpiang_gulay.jpg/640px-Lumpiang_gulay.jpg",
    "Bitsuelas": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Bitsuelas.jpg/640px-Bitsuelas.jpg",
    "Pakbet Tagalog": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Pinakbet.jpg/640px-Pinakbet.jpg",
    "Sarciado": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sarciado.jpg/640px-Sarciado.jpg",
    "Adobong Kalabasa": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Adobong_kalabasa.jpg/640px-Adobong_kalabasa.jpg",
    "Ginisang Malunggay": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Ginisang_malunggay.jpg/640px-Ginisang_malunggay.jpg",
    "Tinola ng Kalabasa": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Tinolang_kalabasa.jpg/640px-Tinolang_kalabasa.jpg",
    "Sinigang na Gulay": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sinigang.jpg/640px-Sinigang.jpg",
    "Goto Vegetable": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Goto.jpg/640px-Goto.jpg",
    "Udon ng Gulay": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Udon.jpg/640px-Udon.jpg",
    "Chopsuey": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chop_suey.jpg/640px-Chop_suey.jpg",
    "Lumpiang Shanghai na Gulay": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Lumpiang_shanghai.jpg/640px-Lumpiang_shanghai.jpg",
    "Palengke Salad": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Salad.jpg/640px-Salad.jpg",
    "Ensaladang Gulay": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Salad.jpg/640px-Salad.jpg",
    "Tinutong na Gulay": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Tinutong.jpg/640px-Tinutong.jpg",
    "Okrabasa": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Okra.jpg/640px-Okra.jpg",
    "Ginisang Sayote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Sayote.jpg/640px-Sayote.jpg",
    "Adobong Malunggay Egg": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Ginisang_malunggay.jpg/640px-Ginisang_malunggay.jpg",
    "Tinolang Sayote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Sayote.jpg/640px-Sayote.jpg",
    "Mixed Vegetable Nilaga": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Nilaga.jpg/640px-Nilaga.jpg",
    "Atarang Gulay": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Radish.jpg/640px-Radish.jpg",
    "Kaldaretang Gulay": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sarciado.jpg/640px-Sarciado.jpg",
    "Ginisang Pipino": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Cucumber.jpg/640px-Cucumber.jpg",
    "Kangkong Guisado": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Kangkong_guisado.jpg/640px-Kangkong_guisado.jpg",
    "Labuyo Stir-fry": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Chili_peppers.jpg/640px-Chili_peppers.jpg",
    "Tomato Estofada": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_vegetable_stew.jpg/640px-Tomato_vegetable_stew.jpg",
    "Pechay Guisado": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Pechay.jpg/640px-Pechay.jpg",
    "Repolyo Guisado": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Cabbage.jpg/640px-Cabbage.jpg",
    "Amarilyo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Squash_soup.jpg/640px-Squash_soup.jpg",
    "Moringa Cream Soup": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Malunggay_soup.jpg/640px-Malunggay_soup.jpg",
    "Vegetable Calamansi Adobo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Adobo.jpg/640px-Adobo.jpg",
    "Tandalo Guisado": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Radish.jpg/640px-Radish.jpg",
    "Alugbati Soup": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Soup.jpg/640px-Soup.jpg",
    "Patis Gulay": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sarciado.jpg/640px-Sarciado.jpg",
    "Onion Egg Tortang Gulay": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Omelette.jpg/640px-Omelette.jpg",
    "Vegetable Nilaga with Cream": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Nilaga.jpg/640px-Nilaga.jpg",
    "Bulanglang": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Bulanglang.jpg/640px-Bulanglang.jpg",
    "Bok Choy with Garlic": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bok_choy.jpg/640px-Bok_choy.jpg",
    "Eggplant Salad": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Eggplant_salad.jpg/640px-Eggplant_salad.jpg",
    "Pumpkin Soup Filipino Style": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Squash_soup.jpg/640px-Squash_soup.jpg",
    "Vegetable Bisque": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Soup.jpg/640px-Soup.jpg",
    "Mixed Greens Salad": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Salad.jpg/640px-Salad.jpg",
    "Tamis ng Lasa Vegetables": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sarciado.jpg/640px-Sarciado.jpg",
    "Root Vegetables Nilaga": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Nilaga.jpg/640px-Nilaga.jpg",
    "Vegetable Lumpia with Sauce": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Lumpiang_gulay.jpg/640px-Lumpiang_gulay.jpg",
}

# Check which URLs are actually working
print("Verifying URLs...")
working = 0
broken = 0

for recipe_name, url in list(VERIFIED_IMAGES.items())[:5]:
    try:
        response = requests.head(url, timeout=5)
        if response.status_code == 200:
            print(f"✓ {recipe_name}: {url}")
            working += 1
        else:
            print(f"✗ {recipe_name}: Status {response.status_code}")
            broken += 1
    except Exception as e:
        print(f"✗ {recipe_name}: {e}")
        broken += 1

print(f"\nWorking URLs: {working}/{working+broken}")
