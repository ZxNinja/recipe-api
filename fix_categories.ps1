# PowerShell script to add missing grow_glow_category to recipes

# Read the current database
$jsonPath = "c:\Users\johnn\OneDrive\Documents\PlanPlate\recipe-api-main\database.json"
$database = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json

# Get the recipes array
$recipes = $database.recipes

foreach ($recipe in $recipes) {
    if (-not $recipe.PSObject.Properties.Match('grow_glow_category')) {
        # Determine category based on name
        $meal = $recipe.strMeal
        $category = ""
        if ($meal -like "*Family*") {
            if ($meal -like "*Chicken*" -or $meal -like "*Pork*" -or $meal -like "*Beef*" -or $meal -like "*Mechado*" -or $meal -like "*Sinigang*") {
                $category = "grow_main"
            } else {
                $category = "glow_main"
            }
        } elseif ($meal -like "*Side*") {
            if ($meal -like "*Chicken*" -or $meal -like "*Pork*" -or $meal -like "*Beef*" -or $meal -like "*Tocino*") {
                $category = "grow_side"
            } else {
                $category = "glow_side"
            }
        }
        if ($category) {
            $recipe | Add-Member -MemberType NoteProperty -Name 'grow_glow_category' -Value $category
        }
    }
}

# Write back to file
$database | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath

Write-Host "Added missing grow_glow_category to recipes"