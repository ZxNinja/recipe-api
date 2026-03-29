# PowerShell script to add new recipes to database.json

# Read the current database
$jsonPath = "c:\Users\johnn\OneDrive\Documents\PlanPlate\recipe-api-main\database.json"
$database = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json

# Get the recipes array
$recipes = [System.Collections.ArrayList]$database.recipes

# Find the next idMeal
$lastId = ($recipes | Select-Object -ExpandProperty idMeal | Measure-Object -Maximum).Maximum
$nextId = [int]$lastId + 1

# Define categories and templates
$categories = @(
    @{
        name = "grow_main"
        templates = @(
            @{
                baseName = "Chicken Adobo Family"
                ingredients = @("Chicken", "Soy Sauce", "Vinegar", "Garlic", "Bay Leaves")
                calories = 2500
                protein = 180
                carbs = 20
                fat = 150
                price = 500
                servings = 8
            },
            @{
                baseName = "Pork Sinigang Family"
                ingredients = @("Pork Ribs", "Tamarind", "Tomatoes", "Onion", "Kangkong")
                calories = 2200
                protein = 160
                carbs = 40
                fat = 140
                price = 450
                servings = 8
            },
            @{
                baseName = "Beef Mechado Family"
                ingredients = @("Beef", "Tomato Sauce", "Potatoes", "Carrots", "Bay Leaves")
                calories = 2400
                protein = 170
                carbs = 50
                fat = 160
                price = 550
                servings = 8
            }
        )
    },
    @{
        name = "grow_side"
        templates = @(
            @{
                baseName = "Chicken Adobo Side"
                ingredients = @("Chicken Thigh", "Soy Sauce", "Vinegar", "Garlic")
                calories = 800
                protein = 60
                carbs = 10
                fat = 50
                price = 150
                servings = 2
            },
            @{
                baseName = "Pork Tocino Side"
                ingredients = @("Pork Belly", "Brown Sugar", "Salt", "Garlic")
                calories = 900
                protein = 50
                carbs = 30
                fat = 70
                price = 180
                servings = 2
            }
        )
    },
    @{
        name = "glow_main"
        templates = @(
            @{
                baseName = "Vegetable Tinola Family"
                ingredients = @("Squash", "Malunggay", "Ginger", "Fish Sauce", "Water")
                calories = 1200
                protein = 30
                carbs = 150
                fat = 20
                price = 200
                servings = 8
            },
            @{
                baseName = "Pinakbet Family"
                ingredients = @("Eggplant", "Bitter Gourd", "Squash", "Shrimp Paste", "Tomatoes")
                calories = 1000
                protein = 25
                carbs = 120
                fat = 15
                price = 180
                servings = 8
            }
        )
    },
    @{
        name = "glow_side"
        templates = @(
            @{
                baseName = "Pinakbet Side"
                ingredients = @("Eggplant", "Bitter Gourd", "Squash", "Shrimp Paste")
                calories = 400
                protein = 15
                carbs = 50
                fat = 10
                price = 80
                servings = 2
            },
            @{
                baseName = "Ginisang Ampalaya Side"
                ingredients = @("Bitter Gourd", "Egg", "Tomatoes", "Onion")
                calories = 350
                protein = 20
                carbs = 25
                fat = 15
                price = 70
                servings = 2
            }
        )
    }
)

$newRecipes = @()

foreach ($category in $categories) {
    $catName = $category.name
    $templates = $category.templates
    $recipesPerTemplate = 15  # 30 total per category, 2 templates * 15 = 30, but adjust

    foreach ($template in $templates) {
        for ($i = 1; $i -le $recipesPerTemplate; $i++) {
            $recipe = @{
                idMeal = $nextId++
                strMeal = "$($template.baseName) $i"
                strMealThumb = "https://example.com/$($template.baseName.ToLower().Replace(' ', '-'))-$i.jpg"
                strCategory = if ($catName -like "*grow*") { "Protein" } else { "Vegetable" }
                strArea = "Filipino"
                strInstructions = "1. Prepare ingredients. 2. Cook according to traditional method. 3. Serve hot."
                strIngredient1 = $template.ingredients[0]
                strMeasure1 = "Appropriate amount"
                strIngredient2 = $template.ingredients[1]
                strMeasure2 = "Appropriate amount"
                strIngredient3 = $template.ingredients[2]
                strMeasure3 = "Appropriate amount"
                strIngredient4 = $template.ingredients[3]
                strMeasure4 = "Appropriate amount"
                strIngredient5 = $template.ingredients[4]
                strMeasure5 = "Appropriate amount"
                strIngredient6 = ""
                strMeasure6 = ""
                strIngredient7 = ""
                strMeasure7 = ""
                strIngredient8 = ""
                strMeasure8 = ""
                strIngredient9 = ""
                strMeasure9 = ""
                strIngredient10 = ""
                strMeasure10 = ""
                strYoutube = "https://www.youtube.com/watch?v=example$i"
                calories = $template.calories
                protein = $template.protein
                carbs = $template.carbs
                fat = $template.fat
                price = $template.price
                calories_per_serving = [math]::Round($template.calories / $template.servings)
                price_per_serving = [math]::Round($template.price / $template.servings)
                sources = @("Local market", "Supermarket")
                calculated_at = "2026-01-15T00:00:00.000000Z"
                price_min = $template.price - 50
                price_max = $template.price + 50
                price_planned = $template.price
                price_per_serving_min = [math]::Round(($template.price - 50) / $template.servings)
                price_per_serving_max = [math]::Round(($template.price + 50) / $template.servings)
                price_per_serving_planned = [math]::Round($template.price / $template.servings)
                nutrition_sources = @("USDA", "NutritionValue")
                nutrition_calculated_at = "2026-01-15T00:00:00.000000Z"
                nutrition_assumptions = @{
                    servings_used = $template.servings
                    per_piece_defaults_applied = 0
                }
                grow_glow_category = $catName
            }
            $newRecipes += $recipe
        }
    }
}

# Add new recipes to the recipes array
$recipes.AddRange($newRecipes)

# Update the database
$database.recipes = $recipes

# Write back to file
$database | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath

Write-Host "Added $($newRecipes.Count) new recipes to database.json"