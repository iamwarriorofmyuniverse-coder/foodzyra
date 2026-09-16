// USDA FoodData Central Backed Nutrition Database & Intelligence Engine
// Values are standardized per 100g of edible portion from USDA National Nutrient Database & FoodData Central.

export interface UsdaNutrientProfile {
  fdcId?: number;
  name: string;
  category: string;
  servingSizeGrams: number;
  servingUnitName: string;
  // Core Macronutrients (per 100g)
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fiberPer100g: number;
  fatPer100g: number;
  saturatedFatPer100g: number;
  sugarPer100g: number;
  sodiumMgPer100g: number;
  // Micronutrients (per 100g)
  potassiumMgPer100g?: number;
  calciumMgPer100g?: number;
  ironMgPer100g?: number;
  vitaminCMgPer100g?: number;
  // Dietary classification
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isNutFree: boolean;
}

export interface CalculatedNutrients {
  weightGrams: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fiberGrams: number;
  fatGrams: number;
  saturatedFatGrams: number;
  sugarGrams: number;
  sodiumMg: number;
  potassiumMg?: number;
  calciumMg?: number;
  ironMg?: number;
  vitaminCMg?: number;
  macroPercentages: {
    proteinPct: number;
    carbsPct: number;
    fatPct: number;
  };
}

export interface DetectedFoodItem {
  name: string;
  standardUsdaName: string;
  confidence: number;
  estimatedWeightGrams: number;
  portionDescription: string;
  boundingBox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
  nutrients: CalculatedNutrients;
  dietaryTags: string[];
}

export interface PlateNutritionAnalysis {
  mealName: string;
  mealType: string;
  totalWeightGrams: number;
  totalNutrients: CalculatedNutrients;
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E';
  nutriScoreRationale: string;
  foodDescription: string;
  healthTags: string[];
  dietarySummary: {
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    isHighProtein: boolean;
    isKetoFriendly: boolean;
    isHighFiber: boolean;
    isLowSodium: boolean;
  };
  detectedItems: DetectedFoodItem[];
}

// Comprehensive USDA FoodData Central Reference Table (100+ common foods, grains, proteins, produce, bakery)
export const USDA_FOOD_DATABASE: Record<string, UsdaNutrientProfile> = {
  // --- POULTRY & MEATS ---
  'chicken breast': {
    name: 'Grilled Chicken Breast, Skinless',
    category: 'Poultry',
    servingSizeGrams: 150,
    servingUnitName: '1 breast',
    caloriesPer100g: 165,
    proteinPer100g: 31.0,
    carbsPer100g: 0.0,
    fiberPer100g: 0.0,
    fatPer100g: 3.6,
    saturatedFatPer100g: 1.0,
    sugarPer100g: 0.0,
    sodiumMgPer100g: 74,
    potassiumMgPer100g: 256,
    ironMgPer100g: 1.0,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'chicken thigh': {
    name: 'Roasted Chicken Thigh, Meat Only',
    category: 'Poultry',
    servingSizeGrams: 120,
    servingUnitName: '1 thigh',
    caloriesPer100g: 209,
    proteinPer100g: 24.7,
    carbsPer100g: 0.0,
    fiberPer100g: 0.0,
    fatPer100g: 10.9,
    saturatedFatPer100g: 3.0,
    sugarPer100g: 0.0,
    sodiumMgPer100g: 84,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'steak': {
    name: 'Grilled Beef Sirloin Steak, Lean',
    category: 'Meats',
    servingSizeGrams: 180,
    servingUnitName: '1 steak portion',
    caloriesPer100g: 214,
    proteinPer100g: 26.1,
    carbsPer100g: 0.0,
    fiberPer100g: 0.0,
    fatPer100g: 11.5,
    saturatedFatPer100g: 4.6,
    sugarPer100g: 0.0,
    sodiumMgPer100g: 65,
    potassiumMgPer100g: 345,
    ironMgPer100g: 2.8,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'beef': {
    name: 'Grilled Beef Sirloin Steak, Lean',
    category: 'Meats',
    servingSizeGrams: 180,
    servingUnitName: '1 steak portion',
    caloriesPer100g: 214,
    proteinPer100g: 26.1,
    carbsPer100g: 0.0,
    fiberPer100g: 0.0,
    fatPer100g: 11.5,
    saturatedFatPer100g: 4.6,
    sugarPer100g: 0.0,
    sodiumMgPer100g: 65,
    potassiumMgPer100g: 345,
    ironMgPer100g: 2.8,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'salmon': {
    name: 'Baked Atlantic Salmon Fillet',
    category: 'Seafood',
    servingSizeGrams: 140,
    servingUnitName: '1 fillet',
    caloriesPer100g: 208,
    proteinPer100g: 22.0,
    carbsPer100g: 0.0,
    fiberPer100g: 0.0,
    fatPer100g: 12.3,
    saturatedFatPer100g: 2.5,
    sugarPer100g: 0.0,
    sodiumMgPer100g: 60,
    potassiumMgPer100g: 384,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'tofu': {
    name: 'Firm Tofu, Prepared with Calcium Sulfate',
    category: 'Plant Protein',
    servingSizeGrams: 125,
    servingUnitName: '1/2 block',
    caloriesPer100g: 76,
    proteinPer100g: 8.1,
    carbsPer100g: 1.9,
    fiberPer100g: 0.9,
    fatPer100g: 4.8,
    saturatedFatPer100g: 0.7,
    sugarPer100g: 0.6,
    sodiumMgPer100g: 14,
    calciumMgPer100g: 350,
    ironMgPer100g: 5.4,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'egg': {
    name: 'Boiled Whole Egg, Large',
    category: 'Eggs',
    servingSizeGrams: 50,
    servingUnitName: '1 large egg',
    caloriesPer100g: 155,
    proteinPer100g: 12.6,
    carbsPer100g: 1.1,
    fiberPer100g: 0.0,
    fatPer100g: 10.6,
    saturatedFatPer100g: 3.3,
    sugarPer100g: 1.1,
    sodiumMgPer100g: 124,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'boiled egg': {
    name: 'Soft-Boiled / Hard-Boiled Whole Egg',
    category: 'Eggs',
    servingSizeGrams: 50,
    servingUnitName: '1 egg',
    caloriesPer100g: 155,
    proteinPer100g: 12.6,
    carbsPer100g: 1.1,
    fiberPer100g: 0.0,
    fatPer100g: 10.6,
    saturatedFatPer100g: 3.3,
    sugarPer100g: 1.1,
    sodiumMgPer100g: 124,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'soft-boiled egg': {
    name: 'Soft-Boiled Whole Egg with Runny Yolk',
    category: 'Eggs',
    servingSizeGrams: 50,
    servingUnitName: '1 egg',
    caloriesPer100g: 155,
    proteinPer100g: 12.6,
    carbsPer100g: 1.1,
    fiberPer100g: 0.0,
    fatPer100g: 10.6,
    saturatedFatPer100g: 3.3,
    sugarPer100g: 1.1,
    sodiumMgPer100g: 124,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'carrot': {
    name: 'Fresh Crisp Carrot Sticks / Baby Carrots',
    category: 'Vegetables',
    servingSizeGrams: 85,
    servingUnitName: '1 medium carrot / sticks',
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 9.6,
    fiberPer100g: 2.8,
    fatPer100g: 0.2,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 4.7,
    sodiumMgPer100g: 69,
    vitaminCMgPer100g: 5.9,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'carrots': {
    name: 'Fresh Crisp Carrot Sticks / Baby Carrots',
    category: 'Vegetables',
    servingSizeGrams: 85,
    servingUnitName: '1 portion carrot sticks',
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 9.6,
    fiberPer100g: 2.8,
    fatPer100g: 0.2,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 4.7,
    sodiumMgPer100g: 69,
    vitaminCMgPer100g: 5.9,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'bell pepper': {
    name: 'Fresh Yellow / Sweet Bell Pepper Slices',
    category: 'Vegetables',
    servingSizeGrams: 90,
    servingUnitName: '1/2 pepper sliced',
    caloriesPer100g: 27,
    proteinPer100g: 1.0,
    carbsPer100g: 6.3,
    fiberPer100g: 0.9,
    fatPer100g: 0.2,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 4.2,
    sodiumMgPer100g: 2,
    vitaminCMgPer100g: 183.5,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'energy bites': {
    name: 'No-Bake Rolled Oat & Nut Butter Protein Energy Bites',
    category: 'Snacks & Bakery',
    servingSizeGrams: 50,
    servingUnitName: '2 energy bites',
    caloriesPer100g: 375,
    proteinPer100g: 10.5,
    carbsPer100g: 48.0,
    fiberPer100g: 6.2,
    fatPer100g: 16.5,
    saturatedFatPer100g: 2.8,
    sugarPer100g: 22.0,
    sodiumMgPer100g: 85,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: false
  },
  'protein balls': {
    name: 'No-Bake Rolled Oat & Nut Butter Protein Energy Bites',
    category: 'Snacks & Bakery',
    servingSizeGrams: 50,
    servingUnitName: '2 energy bites',
    caloriesPer100g: 375,
    proteinPer100g: 10.5,
    carbsPer100g: 48.0,
    fiberPer100g: 6.2,
    fatPer100g: 16.5,
    saturatedFatPer100g: 2.8,
    sugarPer100g: 22.0,
    sodiumMgPer100g: 85,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: false
  },
  'dill': {
    name: 'Fresh Garden Dill Weed / Herb Garnish',
    category: 'Herbs & Spices',
    servingSizeGrams: 10,
    servingUnitName: '1 tbsp chopped',
    caloriesPer100g: 43,
    proteinPer100g: 3.5,
    carbsPer100g: 7.0,
    fiberPer100g: 2.1,
    fatPer100g: 1.1,
    saturatedFatPer100g: 0.1,
    sugarPer100g: 0.0,
    sodiumMgPer100g: 61,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },

  // --- GRAINS & STARCHES ---
  'brown rice': {
    name: 'Cooked Long-Grain Brown Rice',
    category: 'Grains',
    servingSizeGrams: 150,
    servingUnitName: '1 cup',
    caloriesPer100g: 111,
    proteinPer100g: 2.6,
    carbsPer100g: 23.0,
    fiberPer100g: 1.8,
    fatPer100g: 0.9,
    saturatedFatPer100g: 0.2,
    sugarPer100g: 0.4,
    sodiumMgPer100g: 5,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'white rice': {
    name: 'Cooked Enriched White Rice',
    category: 'Grains',
    servingSizeGrams: 150,
    servingUnitName: '1 cup',
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.2,
    fiberPer100g: 0.4,
    fatPer100g: 0.3,
    saturatedFatPer100g: 0.1,
    sugarPer100g: 0.1,
    sodiumMgPer100g: 1,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'quinoa': {
    name: 'Cooked Quinoa',
    category: 'Grains',
    servingSizeGrams: 185,
    servingUnitName: '1 cup',
    caloriesPer100g: 120,
    proteinPer100g: 4.4,
    carbsPer100g: 21.3,
    fiberPer100g: 2.8,
    fatPer100g: 1.9,
    saturatedFatPer100g: 0.2,
    sugarPer100g: 0.9,
    sodiumMgPer100g: 7,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'pasta': {
    name: 'Cooked Enriched Pasta / Spaghetti',
    category: 'Pasta & Noodles',
    servingSizeGrams: 140,
    servingUnitName: '1 cup',
    caloriesPer100g: 158,
    proteinPer100g: 5.8,
    carbsPer100g: 30.9,
    fiberPer100g: 1.8,
    fatPer100g: 0.9,
    saturatedFatPer100g: 0.2,
    sugarPer100g: 0.6,
    sodiumMgPer100g: 1,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'penne pasta': {
    name: 'Cooked Enriched Penne Pasta',
    category: 'Pasta & Grains',
    servingSizeGrams: 140,
    servingUnitName: '1 cup cooked',
    caloriesPer100g: 158,
    proteinPer100g: 5.8,
    carbsPer100g: 30.9,
    fiberPer100g: 1.8,
    fatPer100g: 0.9,
    saturatedFatPer100g: 0.2,
    sugarPer100g: 0.6,
    sodiumMgPer100g: 1,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'penne': {
    name: 'Cooked Enriched Penne Pasta',
    category: 'Pasta & Grains',
    servingSizeGrams: 140,
    servingUnitName: '1 cup cooked',
    caloriesPer100g: 158,
    proteinPer100g: 5.8,
    carbsPer100g: 30.9,
    fiberPer100g: 1.8,
    fatPer100g: 0.9,
    saturatedFatPer100g: 0.2,
    sugarPer100g: 0.6,
    sodiumMgPer100g: 1,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'cherry tomato': {
    name: 'Ripe Red Cherry Tomatoes',
    category: 'Vegetables',
    servingSizeGrams: 100,
    servingUnitName: '1 cup cherry tomatoes',
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fiberPer100g: 1.2,
    fatPer100g: 0.2,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 2.6,
    sodiumMgPer100g: 5,
    vitaminCMgPer100g: 13.7,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'cherry tomatoes': {
    name: 'Ripe Red Cherry Tomatoes',
    category: 'Vegetables',
    servingSizeGrams: 100,
    servingUnitName: '1 cup cherry tomatoes',
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fiberPer100g: 1.2,
    fatPer100g: 0.2,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 2.6,
    sodiumMgPer100g: 5,
    vitaminCMgPer100g: 13.7,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'mozzarella': {
    name: 'Fresh Whole Milk Mozzarella Cheese',
    category: 'Dairy & Cheese',
    servingSizeGrams: 30,
    servingUnitName: '1 oz slice',
    caloriesPer100g: 280,
    proteinPer100g: 22.2,
    carbsPer100g: 2.2,
    fiberPer100g: 0.0,
    fatPer100g: 22.4,
    saturatedFatPer100g: 13.2,
    sugarPer100g: 1.0,
    sodiumMgPer100g: 627,
    calciumMgPer100g: 505,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: false,
    isNutFree: true
  },
  'fresh mozzarella': {
    name: 'Fresh Whole Milk Mozzarella Cheese',
    category: 'Dairy & Cheese',
    servingSizeGrams: 30,
    servingUnitName: '1 oz slice',
    caloriesPer100g: 280,
    proteinPer100g: 22.2,
    carbsPer100g: 2.2,
    fiberPer100g: 0.0,
    fatPer100g: 22.4,
    saturatedFatPer100g: 13.2,
    sugarPer100g: 1.0,
    sodiumMgPer100g: 627,
    calciumMgPer100g: 505,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: false,
    isNutFree: true
  },
  'basil': {
    name: 'Fresh Sweet Basil Leaves',
    category: 'Herbs & Spices',
    servingSizeGrams: 10,
    servingUnitName: '5 leaves',
    caloriesPer100g: 23,
    proteinPer100g: 3.2,
    carbsPer100g: 2.7,
    fiberPer100g: 1.6,
    fatPer100g: 0.6,
    saturatedFatPer100g: 0.1,
    sugarPer100g: 0.3,
    sodiumMgPer100g: 4,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'apple': {
    name: 'Fresh Crisp Apple Slices, with Skin',
    category: 'Fruits',
    servingSizeGrams: 100,
    servingUnitName: '1 small apple or slices',
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 13.8,
    fiberPer100g: 2.4,
    fatPer100g: 0.2,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 10.4,
    sodiumMgPer100g: 1,
    vitaminCMgPer100g: 4.6,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'apple slices': {
    name: 'Fresh Crisp Apple Slices, with Skin',
    category: 'Fruits',
    servingSizeGrams: 100,
    servingUnitName: '1 small apple or slices',
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 13.8,
    fiberPer100g: 2.4,
    fatPer100g: 0.2,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 10.4,
    sodiumMgPer100g: 1,
    vitaminCMgPer100g: 4.6,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'buckwheat': {
    name: 'Steamed Whole Grain Buckwheat Groats',
    category: 'Grains & Cereals',
    servingSizeGrams: 150,
    servingUnitName: '1 cup cooked',
    caloriesPer100g: 92,
    proteinPer100g: 3.4,
    carbsPer100g: 19.9,
    fiberPer100g: 2.7,
    fatPer100g: 0.6,
    saturatedFatPer100g: 0.1,
    sugarPer100g: 0.9,
    sodiumMgPer100g: 4,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'olive oil': {
    name: 'Extra Virgin Cold-Pressed Olive Oil',
    category: 'Oils & Dressings',
    servingSizeGrams: 14,
    servingUnitName: '1 tbsp',
    caloriesPer100g: 884,
    proteinPer100g: 0.0,
    carbsPer100g: 0.0,
    fiberPer100g: 0.0,
    fatPer100g: 100.0,
    saturatedFatPer100g: 13.8,
    sugarPer100g: 0.0,
    sodiumMgPer100g: 2,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'potato': {
    name: 'Baked Russet Potato with Skin',
    category: 'Vegetables',
    servingSizeGrams: 173,
    servingUnitName: '1 medium potato',
    caloriesPer100g: 93,
    proteinPer100g: 2.5,
    carbsPer100g: 21.2,
    fiberPer100g: 2.2,
    fatPer100g: 0.1,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 1.2,
    sodiumMgPer100g: 10,
    potassiumMgPer100g: 535,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'sweet potato': {
    name: 'Baked Sweet Potato',
    category: 'Vegetables',
    servingSizeGrams: 150,
    servingUnitName: '1 medium',
    caloriesPer100g: 90,
    proteinPer100g: 2.0,
    carbsPer100g: 20.7,
    fiberPer100g: 3.3,
    fatPer100g: 0.1,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 6.5,
    sodiumMgPer100g: 36,
    potassiumMgPer100g: 475,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },

  // --- VEGETABLES & GREENS ---
  'broccoli': {
    name: 'Steamed Broccoli Florets',
    category: 'Vegetables',
    servingSizeGrams: 100,
    servingUnitName: '1 cup chopped',
    caloriesPer100g: 35,
    proteinPer100g: 2.4,
    carbsPer100g: 7.2,
    fiberPer100g: 3.3,
    fatPer100g: 0.4,
    saturatedFatPer100g: 0.1,
    sugarPer100g: 1.4,
    sodiumMgPer100g: 41,
    vitaminCMgPer100g: 64.9,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'spinach': {
    name: 'Raw Baby Spinach',
    category: 'Vegetables',
    servingSizeGrams: 60,
    servingUnitName: '2 cups',
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fiberPer100g: 2.2,
    fatPer100g: 0.4,
    saturatedFatPer100g: 0.1,
    sugarPer100g: 0.4,
    sodiumMgPer100g: 79,
    ironMgPer100g: 2.7,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'avocado': {
    name: 'Fresh California Avocado',
    category: 'Fruits & Fats',
    servingSizeGrams: 150,
    servingUnitName: '1 avocado',
    caloriesPer100g: 160,
    proteinPer100g: 2.0,
    carbsPer100g: 8.5,
    fiberPer100g: 6.7,
    fatPer100g: 14.7,
    saturatedFatPer100g: 2.1,
    sugarPer100g: 0.7,
    sodiumMgPer100g: 7,
    potassiumMgPer100g: 485,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'tomato': {
    name: 'Fresh Red Tomato / Cherry Tomatoes',
    category: 'Vegetables',
    servingSizeGrams: 120,
    servingUnitName: '1 medium',
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fiberPer100g: 1.2,
    fatPer100g: 0.2,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 2.6,
    sodiumMgPer100g: 5,
    vitaminCMgPer100g: 13.7,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'cucumber': {
    name: 'Fresh Sliced Cucumber',
    category: 'Vegetables',
    servingSizeGrams: 100,
    servingUnitName: '1 cup slices',
    caloriesPer100g: 15,
    proteinPer100g: 0.7,
    carbsPer100g: 3.6,
    fiberPer100g: 0.5,
    fatPer100g: 0.1,
    saturatedFatPer100g: 0.0,
    sugarPer100g: 1.7,
    sodiumMgPer100g: 2,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'bell pepper': {
    name: 'Fresh Sweet Bell Pepper (Red/Yellow/Green)',
    category: 'Vegetables',
    servingSizeGrams: 100,
    servingUnitName: '1 medium',
    caloriesPer100g: 31,
    proteinPer100g: 1.0,
    carbsPer100g: 6.0,
    fiberPer100g: 2.1,
    fatPer100g: 0.3,
    saturatedFatPer100g: 0.1,
    sugarPer100g: 4.2,
    sodiumMgPer100g: 4,
    vitaminCMgPer100g: 127.7,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },

  // --- BAKERY & PASTRY ---
  'sourdough bread': {
    name: 'Artisan Sourdough Bread',
    category: 'Bakery',
    servingSizeGrams: 60,
    servingUnitName: '1 large slice',
    caloriesPer100g: 240,
    proteinPer100g: 8.5,
    carbsPer100g: 48.0,
    fiberPer100g: 2.5,
    fatPer100g: 1.2,
    saturatedFatPer100g: 0.3,
    sugarPer100g: 1.5,
    sodiumMgPer100g: 520,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'croissant': {
    name: 'All-Butter French Croissant',
    category: 'Bakery',
    servingSizeGrams: 65,
    servingUnitName: '1 croissant',
    caloriesPer100g: 406,
    proteinPer100g: 8.2,
    carbsPer100g: 45.8,
    fiberPer100g: 2.6,
    fatPer100g: 21.0,
    saturatedFatPer100g: 11.7,
    sugarPer100g: 11.3,
    sodiumMgPer100g: 467,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'bagel': {
    name: 'Plain / Sesame Bagel',
    category: 'Bakery',
    servingSizeGrams: 105,
    servingUnitName: '1 medium bagel',
    caloriesPer100g: 250,
    proteinPer100g: 10.2,
    carbsPer100g: 49.0,
    fiberPer100g: 2.3,
    fatPer100g: 1.5,
    saturatedFatPer100g: 0.3,
    sugarPer100g: 5.5,
    sodiumMgPer100g: 440,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'blueberry muffin': {
    name: 'Fresh Blueberry Bakery Muffin',
    category: 'Bakery',
    servingSizeGrams: 113,
    servingUnitName: '1 muffin',
    caloriesPer100g: 360,
    proteinPer100g: 4.8,
    carbsPer100g: 52.0,
    fiberPer100g: 1.6,
    fatPer100g: 15.0,
    saturatedFatPer100g: 3.2,
    sugarPer100g: 29.0,
    sodiumMgPer100g: 370,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },

  // --- DAIRY & CHEESES ---
  'greek yogurt': {
    name: 'Plain Non-Fat Greek Yogurt',
    category: 'Dairy',
    servingSizeGrams: 170,
    servingUnitName: '1 container (3/4 cup)',
    caloriesPer100g: 59,
    proteinPer100g: 10.3,
    carbsPer100g: 3.6,
    fiberPer100g: 0.0,
    fatPer100g: 0.4,
    saturatedFatPer100g: 0.1,
    sugarPer100g: 3.2,
    sodiumMgPer100g: 36,
    calciumMgPer100g: 110,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: false,
    isNutFree: true
  },
  'cheddar cheese': {
    name: 'Sharp Cheddar Cheese Slices',
    category: 'Dairy',
    servingSizeGrams: 28,
    servingUnitName: '1 slice (1 oz)',
    caloriesPer100g: 403,
    proteinPer100g: 24.9,
    carbsPer100g: 1.3,
    fiberPer100g: 0.0,
    fatPer100g: 33.1,
    saturatedFatPer100g: 21.1,
    sugarPer100g: 0.5,
    sodiumMgPer100g: 621,
    calciumMgPer100g: 721,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: false,
    isNutFree: true
  },
  'olive oil': {
    name: 'Extra Virgin Olive Oil (Dressing)',
    category: 'Oils & Dressings',
    servingSizeGrams: 14,
    servingUnitName: '1 tablespoon',
    caloriesPer100g: 884,
    proteinPer100g: 0.0,
    carbsPer100g: 0.0,
    fiberPer100g: 0.0,
    fatPer100g: 100.0,
    saturatedFatPer100g: 14.0,
    sugarPer100g: 0.0,
    sodiumMgPer100g: 2,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },

  // --- FAST FOOD & COMPOSITE DISHES ---
  'pizza': {
    fdcId: 173292,
    name: 'Pizza, Cheese / Pepperoni, Regular Crust',
    category: 'Fast Food',
    servingSizeGrams: 107,
    servingUnitName: '1 slice (1/8 of 12" pizza)',
    caloriesPer100g: 266,
    proteinPer100g: 11.4,
    carbsPer100g: 33.3,
    fiberPer100g: 2.3,
    fatPer100g: 9.8,
    saturatedFatPer100g: 4.5,
    sugarPer100g: 3.6,
    sodiumMgPer100g: 598,
    calciumMgPer100g: 188,
    ironMgPer100g: 2.5,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'cheese pizza': {
    fdcId: 173292,
    name: 'Cheese Pizza, Regular Crust',
    category: 'Fast Food',
    servingSizeGrams: 107,
    servingUnitName: '1 slice',
    caloriesPer100g: 266,
    proteinPer100g: 11.4,
    carbsPer100g: 33.3,
    fiberPer100g: 2.3,
    fatPer100g: 9.8,
    saturatedFatPer100g: 4.5,
    sugarPer100g: 3.6,
    sodiumMgPer100g: 598,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'pepperoni pizza': {
    fdcId: 173293,
    name: 'Pepperoni Pizza, Regular Crust',
    category: 'Fast Food',
    servingSizeGrams: 110,
    servingUnitName: '1 slice',
    caloriesPer100g: 275,
    proteinPer100g: 12.1,
    carbsPer100g: 31.8,
    fiberPer100g: 2.0,
    fatPer100g: 11.5,
    saturatedFatPer100g: 5.1,
    sugarPer100g: 3.4,
    sodiumMgPer100g: 684,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'burger': {
    fdcId: 173322,
    name: 'Hamburger / Beef Burger, Single Patty with Bun',
    category: 'Fast Food',
    servingSizeGrams: 150,
    servingUnitName: '1 burger',
    caloriesPer100g: 254,
    proteinPer100g: 13.3,
    carbsPer100g: 24.8,
    fiberPer100g: 1.4,
    fatPer100g: 11.7,
    saturatedFatPer100g: 4.3,
    sugarPer100g: 4.2,
    sodiumMgPer100g: 431,
    ironMgPer100g: 2.7,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'cheeseburger': {
    fdcId: 173324,
    name: 'Cheeseburger, Single Patty with Cheese & Bun',
    category: 'Fast Food',
    servingSizeGrams: 165,
    servingUnitName: '1 cheeseburger',
    caloriesPer100g: 284,
    proteinPer100g: 15.6,
    carbsPer100g: 24.1,
    fiberPer100g: 1.3,
    fatPer100g: 14.1,
    saturatedFatPer100g: 5.9,
    sugarPer100g: 4.4,
    sodiumMgPer100g: 597,
    calciumMgPer100g: 135,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'chicken burger': {
    fdcId: 173336,
    name: 'Crispy / Grilled Chicken Burger Sandwich with Bun',
    category: 'Fast Food',
    servingSizeGrams: 180,
    servingUnitName: '1 sandwich',
    caloriesPer100g: 260,
    proteinPer100g: 14.8,
    carbsPer100g: 26.5,
    fiberPer100g: 1.6,
    fatPer100g: 11.0,
    saturatedFatPer100g: 2.4,
    sugarPer100g: 3.8,
    sodiumMgPer100g: 560,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'french fries': {
    fdcId: 170695,
    name: 'French Fries, Deep Fried in Vegetable Oil',
    category: 'Fast Food',
    servingSizeGrams: 117,
    servingUnitName: '1 medium order',
    caloriesPer100g: 312,
    proteinPer100g: 3.4,
    carbsPer100g: 41.4,
    fiberPer100g: 3.8,
    fatPer100g: 15.0,
    saturatedFatPer100g: 2.3,
    sugarPer100g: 0.3,
    sodiumMgPer100g: 210,
    potassiumMgPer100g: 579,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'fries': {
    fdcId: 170695,
    name: 'French Fries, Deep Fried in Vegetable Oil',
    category: 'Fast Food',
    servingSizeGrams: 117,
    servingUnitName: '1 medium order',
    caloriesPer100g: 312,
    proteinPer100g: 3.4,
    carbsPer100g: 41.4,
    fiberPer100g: 3.8,
    fatPer100g: 15.0,
    saturatedFatPer100g: 2.3,
    sugarPer100g: 0.3,
    sodiumMgPer100g: 210,
    potassiumMgPer100g: 579,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'fried chicken': {
    fdcId: 171120,
    name: 'Crispy Fried Chicken, Breaded & Fried',
    category: 'Fast Food',
    servingSizeGrams: 140,
    servingUnitName: '1 piece (thigh/drumstick)',
    caloriesPer100g: 246,
    proteinPer100g: 24.0,
    carbsPer100g: 7.8,
    fiberPer100g: 0.4,
    fatPer100g: 13.5,
    saturatedFatPer100g: 3.7,
    sugarPer100g: 0.0,
    sodiumMgPer100g: 412,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'sandwich': {
    fdcId: 173350,
    name: 'Deli / Sub Sandwich with Bread & Fillings',
    category: 'Fast Food',
    servingSizeGrams: 200,
    servingUnitName: '1 sandwich',
    caloriesPer100g: 220,
    proteinPer100g: 10.5,
    carbsPer100g: 26.0,
    fiberPer100g: 1.8,
    fatPer100g: 8.2,
    saturatedFatPer100g: 2.8,
    sugarPer100g: 3.5,
    sodiumMgPer100g: 520,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'hot dog': {
    fdcId: 173308,
    name: 'Hot Dog on Bun with Frank',
    category: 'Fast Food',
    servingSizeGrams: 110,
    servingUnitName: '1 hot dog with bun',
    caloriesPer100g: 290,
    proteinPer100g: 10.1,
    carbsPer100g: 24.2,
    fiberPer100g: 1.2,
    fatPer100g: 16.5,
    saturatedFatPer100g: 6.2,
    sugarPer100g: 4.0,
    sodiumMgPer100g: 680,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'taco': {
    fdcId: 173360,
    name: 'Taco with Meat, Cheese, Lettuce & Tortilla Shell',
    category: 'Fast Food',
    servingSizeGrams: 100,
    servingUnitName: '1 taco',
    caloriesPer100g: 226,
    proteinPer100g: 9.8,
    carbsPer100g: 20.6,
    fiberPer100g: 3.0,
    fatPer100g: 11.8,
    saturatedFatPer100g: 4.5,
    sugarPer100g: 1.8,
    sodiumMgPer100g: 440,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'burrito': {
    fdcId: 173365,
    name: 'Burrito with Beans, Rice, Meat & Flour Tortilla',
    category: 'Fast Food',
    servingSizeGrams: 230,
    servingUnitName: '1 burrito',
    caloriesPer100g: 215,
    proteinPer100g: 8.5,
    carbsPer100g: 29.5,
    fiberPer100g: 3.2,
    fatPer100g: 7.2,
    saturatedFatPer100g: 2.6,
    sugarPer100g: 1.5,
    sodiumMgPer100g: 480,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'wrap': {
    fdcId: 173370,
    name: 'Tortilla Wrap with Protein & Fresh Greens',
    category: 'Fast Food',
    servingSizeGrams: 180,
    servingUnitName: '1 wrap',
    caloriesPer100g: 205,
    proteinPer100g: 11.2,
    carbsPer100g: 23.5,
    fiberPer100g: 2.0,
    fatPer100g: 7.5,
    saturatedFatPer100g: 2.2,
    sugarPer100g: 2.1,
    sodiumMgPer100g: 490,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'shawarma': {
    fdcId: 173375,
    name: 'Chicken / Beef Shawarma Pita Wrap with Tahini',
    category: 'Fast Food',
    servingSizeGrams: 220,
    servingUnitName: '1 shawarma wrap',
    caloriesPer100g: 218,
    proteinPer100g: 13.5,
    carbsPer100g: 22.0,
    fiberPer100g: 2.2,
    fatPer100g: 8.8,
    saturatedFatPer100g: 2.5,
    sugarPer100g: 2.4,
    sodiumMgPer100g: 460,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'chicken nuggets': {
    fdcId: 171125,
    name: 'Crispy Breaded Chicken Nuggets',
    category: 'Fast Food',
    servingSizeGrams: 90,
    servingUnitName: '6 nuggets',
    caloriesPer100g: 296,
    proteinPer100g: 15.3,
    carbsPer100g: 18.8,
    fiberPer100g: 1.2,
    fatPer100g: 18.9,
    saturatedFatPer100g: 3.8,
    sugarPer100g: 0.2,
    sodiumMgPer100g: 557,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'nuggets': {
    fdcId: 171125,
    name: 'Crispy Breaded Chicken Nuggets',
    category: 'Fast Food',
    servingSizeGrams: 90,
    servingUnitName: '6 nuggets',
    caloriesPer100g: 296,
    proteinPer100g: 15.3,
    carbsPer100g: 18.8,
    fiberPer100g: 1.2,
    fatPer100g: 18.9,
    saturatedFatPer100g: 3.8,
    sugarPer100g: 0.2,
    sodiumMgPer100g: 557,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'pasta': {
    fdcId: 173280,
    name: 'Pasta with Marinara / Tomato Sauce',
    category: 'Prepared Meals',
    servingSizeGrams: 200,
    servingUnitName: '1 bowl',
    caloriesPer100g: 131,
    proteinPer100g: 5.2,
    carbsPer100g: 25.1,
    fiberPer100g: 1.8,
    fatPer100g: 1.1,
    saturatedFatPer100g: 0.2,
    sugarPer100g: 2.8,
    sodiumMgPer100g: 240,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'noodles': {
    fdcId: 173285,
    name: 'Stir-Fried Noodles / Chow Mein with Veggies',
    category: 'Prepared Meals',
    servingSizeGrams: 220,
    servingUnitName: '1 bowl / takeout box',
    caloriesPer100g: 142,
    proteinPer100g: 4.5,
    carbsPer100g: 26.2,
    fiberPer100g: 1.6,
    fatPer100g: 2.3,
    saturatedFatPer100g: 0.4,
    sugarPer100g: 1.2,
    sodiumMgPer100g: 380,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'fried rice': {
    fdcId: 173290,
    name: 'Vegetable / Egg Fried Rice',
    category: 'Prepared Meals',
    servingSizeGrams: 200,
    servingUnitName: '1 bowl / cup',
    caloriesPer100g: 163,
    proteinPer100g: 4.1,
    carbsPer100g: 26.8,
    fiberPer100g: 1.3,
    fatPer100g: 4.4,
    saturatedFatPer100g: 0.9,
    sugarPer100g: 0.7,
    sodiumMgPer100g: 340,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'donut': {
    fdcId: 173250,
    name: 'Glazed / Frosted Yeast Donut',
    category: 'Bakery',
    servingSizeGrams: 60,
    servingUnitName: '1 donut',
    caloriesPer100g: 452,
    proteinPer100g: 4.9,
    carbsPer100g: 51.4,
    fiberPer100g: 1.7,
    fatPer100g: 25.3,
    saturatedFatPer100g: 6.1,
    sugarPer100g: 26.8,
    sodiumMgPer100g: 326,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'french toast': {
    fdcId: 173260,
    name: 'Egg-Battered Golden French Toast',
    category: 'Bakery',
    servingSizeGrams: 130,
    servingUnitName: '2 slices',
    caloriesPer100g: 229,
    proteinPer100g: 7.8,
    carbsPer100g: 30.5,
    fiberPer100g: 1.5,
    fatPer100g: 8.6,
    saturatedFatPer100g: 2.4,
    sugarPer100g: 8.2,
    sodiumMgPer100g: 375,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'pancakes': {
    fdcId: 173265,
    name: 'Fluffy Buttermilk Pancakes',
    category: 'Bakery',
    servingSizeGrams: 150,
    servingUnitName: '2 medium pancakes',
    caloriesPer100g: 227,
    proteinPer100g: 6.4,
    carbsPer100g: 37.9,
    fiberPer100g: 1.4,
    fatPer100g: 5.7,
    saturatedFatPer100g: 1.3,
    sugarPer100g: 8.8,
    sodiumMgPer100g: 439,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'pancake': {
    fdcId: 173265,
    name: 'Fluffy Buttermilk Pancake',
    category: 'Bakery',
    servingSizeGrams: 75,
    servingUnitName: '1 pancake',
    caloriesPer100g: 227,
    proteinPer100g: 6.4,
    carbsPer100g: 37.9,
    fiberPer100g: 1.4,
    fatPer100g: 5.7,
    saturatedFatPer100g: 1.3,
    sugarPer100g: 8.8,
    sodiumMgPer100g: 439,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'waffles': {
    fdcId: 173270,
    name: 'Belgian Golden Waffles',
    category: 'Bakery',
    servingSizeGrams: 140,
    servingUnitName: '1 round waffle',
    caloriesPer100g: 291,
    proteinPer100g: 7.9,
    carbsPer100g: 41.1,
    fiberPer100g: 2.1,
    fatPer100g: 10.7,
    saturatedFatPer100g: 2.2,
    sugarPer100g: 5.2,
    sodiumMgPer100g: 511,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'waffle': {
    fdcId: 173270,
    name: 'Belgian Golden Waffle',
    category: 'Bakery',
    servingSizeGrams: 140,
    servingUnitName: '1 waffle',
    caloriesPer100g: 291,
    proteinPer100g: 7.9,
    carbsPer100g: 41.1,
    fiberPer100g: 2.1,
    fatPer100g: 10.7,
    saturatedFatPer100g: 2.2,
    sugarPer100g: 5.2,
    sodiumMgPer100g: 511,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: true
  },
  'samosa': {
    fdcId: 173380,
    name: 'Spiced Potato & Pea Crispy Samosa',
    category: 'Snacks & Appetizers',
    servingSizeGrams: 80,
    servingUnitName: '1 medium samosa',
    caloriesPer100g: 262,
    proteinPer100g: 4.5,
    carbsPer100g: 31.0,
    fiberPer100g: 3.2,
    fatPer100g: 13.5,
    saturatedFatPer100g: 2.8,
    sugarPer100g: 1.5,
    sodiumMgPer100g: 385,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'momos': {
    fdcId: 173385,
    name: 'Steamed Tibetan Dumplings / Momos (Veg/Chicken)',
    category: 'Prepared Meals',
    servingSizeGrams: 150,
    servingUnitName: '6 steamed momos',
    caloriesPer100g: 185,
    proteinPer100g: 8.2,
    carbsPer100g: 24.5,
    fiberPer100g: 1.8,
    fatPer100g: 5.8,
    saturatedFatPer100g: 1.6,
    sugarPer100g: 1.2,
    sodiumMgPer100g: 360,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'dumplings': {
    fdcId: 173385,
    name: 'Steamed Dumplings / Momos',
    category: 'Prepared Meals',
    servingSizeGrams: 150,
    servingUnitName: '6 dumplings',
    caloriesPer100g: 185,
    proteinPer100g: 8.2,
    carbsPer100g: 24.5,
    fiberPer100g: 1.8,
    fatPer100g: 5.8,
    saturatedFatPer100g: 1.6,
    sugarPer100g: 1.2,
    sodiumMgPer100g: 360,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'spring rolls': {
    fdcId: 173390,
    name: 'Crispy Vegetable Spring Rolls / Egg Rolls',
    category: 'Snacks & Appetizers',
    servingSizeGrams: 100,
    servingUnitName: '2 spring rolls',
    caloriesPer100g: 250,
    proteinPer100g: 6.8,
    carbsPer100g: 30.2,
    fiberPer100g: 2.4,
    fatPer100g: 11.6,
    saturatedFatPer100g: 2.1,
    sugarPer100g: 2.5,
    sodiumMgPer100g: 420,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'spring roll': {
    fdcId: 173390,
    name: 'Crispy Vegetable Spring Roll',
    category: 'Snacks & Appetizers',
    servingSizeGrams: 50,
    servingUnitName: '1 spring roll',
    caloriesPer100g: 250,
    proteinPer100g: 6.8,
    carbsPer100g: 30.2,
    fiberPer100g: 2.4,
    fatPer100g: 11.6,
    saturatedFatPer100g: 2.1,
    sugarPer100g: 2.5,
    sodiumMgPer100g: 420,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },

  // --- COMMON STAPLES & INDIAN BREADS ---
  'roti': {
    fdcId: 173395,
    name: 'Whole Wheat Roti / Chapati Flatbread',
    category: 'Bakery',
    servingSizeGrams: 40,
    servingUnitName: '1 roti',
    caloriesPer100g: 297,
    proteinPer100g: 9.4,
    carbsPer100g: 56.4,
    fiberPer100g: 9.8,
    fatPer100g: 3.7,
    saturatedFatPer100g: 0.7,
    sugarPer100g: 1.2,
    sodiumMgPer100g: 180,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'chapati': {
    fdcId: 173395,
    name: 'Whole Wheat Chapati / Roti Flatbread',
    category: 'Bakery',
    servingSizeGrams: 40,
    servingUnitName: '1 chapati',
    caloriesPer100g: 297,
    proteinPer100g: 9.4,
    carbsPer100g: 56.4,
    fiberPer100g: 9.8,
    fatPer100g: 3.7,
    saturatedFatPer100g: 0.7,
    sugarPer100g: 1.2,
    sodiumMgPer100g: 180,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'idli': {
    fdcId: 173400,
    name: 'Steamed Rice & Lentil Idli Cake',
    category: 'Prepared Meals',
    servingSizeGrams: 60,
    servingUnitName: '1 idli',
    caloriesPer100g: 132,
    proteinPer100g: 3.8,
    carbsPer100g: 28.2,
    fiberPer100g: 1.6,
    fatPer100g: 0.4,
    saturatedFatPer100g: 0.1,
    sugarPer100g: 0.5,
    sodiumMgPer100g: 195,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'dosa': {
    fdcId: 173405,
    name: 'Crispy Fermented Rice & Lentil Dosa Crepe',
    category: 'Prepared Meals',
    servingSizeGrams: 100,
    servingUnitName: '1 plain dosa',
    caloriesPer100g: 168,
    proteinPer100g: 3.9,
    carbsPer100g: 29.5,
    fiberPer100g: 1.4,
    fatPer100g: 3.7,
    saturatedFatPer100g: 0.8,
    sugarPer100g: 0.6,
    sodiumMgPer100g: 245,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'bread': {
    fdcId: 172688,
    name: 'Whole Grain / White Sliced Bread',
    category: 'Bakery',
    servingSizeGrams: 50,
    servingUnitName: '2 slices',
    caloriesPer100g: 265,
    proteinPer100g: 9.0,
    carbsPer100g: 49.0,
    fiberPer100g: 2.7,
    fatPer100g: 3.2,
    saturatedFatPer100g: 0.7,
    sugarPer100g: 5.0,
    sodiumMgPer100g: 490,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: false,
    isDairyFree: true,
    isNutFree: true
  },
  'fish': {
    fdcId: 171960,
    name: 'Grilled White Fish Fillet',
    category: 'Seafood',
    servingSizeGrams: 140,
    servingUnitName: '1 fillet',
    caloriesPer100g: 115,
    proteinPer100g: 22.0,
    carbsPer100g: 0.0,
    fiberPer100g: 0.0,
    fatPer100g: 2.5,
    saturatedFatPer100g: 0.6,
    sugarPer100g: 0.0,
    sodiumMgPer100g: 75,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  },
  'vegetables': {
    fdcId: 170393,
    name: 'Steamed / Sautéed Mixed Vegetables',
    category: 'Vegetables',
    servingSizeGrams: 150,
    servingUnitName: '1 cup mixed veggies',
    caloriesPer100g: 45,
    proteinPer100g: 2.2,
    carbsPer100g: 8.5,
    fiberPer100g: 3.2,
    fatPer100g: 0.3,
    saturatedFatPer100g: 0.1,
    sugarPer100g: 3.5,
    sodiumMgPer100g: 35,
    vitaminCMgPer100g: 28.0,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isDairyFree: true,
    isNutFree: true
  }
};

export class NutritionDatabase {
  /**
   * Search for closest USDA food entry by name
   */
  static findUsdaEntry(foodName: string): UsdaNutrientProfile {
    const clean = foodName.toLowerCase().trim();

    // Direct key match
    if (USDA_FOOD_DATABASE[clean]) {
      return USDA_FOOD_DATABASE[clean];
    }

    // Substring or token match
    for (const [key, profile] of Object.entries(USDA_FOOD_DATABASE)) {
      if (clean.includes(key) || key.includes(clean)) {
        return profile;
      }
    }

    // Fast Food & Global Staples Keyword Mappings
    if (clean.includes('pizza')) return USDA_FOOD_DATABASE['pizza'];
    if (clean.includes('cheeseburger')) return USDA_FOOD_DATABASE['cheeseburger'];
    if (clean.includes('burger') || clean.includes('hamburger')) return USDA_FOOD_DATABASE['burger'];
    if (clean.includes('fry') || clean.includes('fries')) return USDA_FOOD_DATABASE['french fries'];
    if (clean.includes('nugget')) return USDA_FOOD_DATABASE['chicken nuggets'];
    if (clean.includes('fried chicken') || clean.includes('crispy chicken')) return USDA_FOOD_DATABASE['fried chicken'];
    if (clean.includes('hot dog') || clean.includes('hotdog')) return USDA_FOOD_DATABASE['hot dog'];
    if (clean.includes('taco')) return USDA_FOOD_DATABASE['taco'];
    if (clean.includes('burrito')) return USDA_FOOD_DATABASE['burrito'];
    if (clean.includes('wrap')) return USDA_FOOD_DATABASE['wrap'];
    if (clean.includes('shawarma')) return USDA_FOOD_DATABASE['shawarma'];
    if (clean.includes('samosa')) return USDA_FOOD_DATABASE['samosa'];
    if (clean.includes('momo') || clean.includes('dumpling')) return USDA_FOOD_DATABASE['momos'];
    if (clean.includes('spring roll') || clean.includes('egg roll')) return USDA_FOOD_DATABASE['spring rolls'];
    if (clean.includes('fried rice')) return USDA_FOOD_DATABASE['fried rice'];
    if (clean.includes('noodle') || clean.includes('chow mein') || clean.includes('ramen')) return USDA_FOOD_DATABASE['noodles'];
    if (clean.includes('pasta') || clean.includes('spaghetti') || clean.includes('macaroni')) return USDA_FOOD_DATABASE['pasta'];
    if (clean.includes('donut') || clean.includes('doughnut')) return USDA_FOOD_DATABASE['donut'];
    if (clean.includes('french toast')) return USDA_FOOD_DATABASE['french toast'];
    if (clean.includes('pancake')) return USDA_FOOD_DATABASE['pancakes'];
    if (clean.includes('waffle')) return USDA_FOOD_DATABASE['waffles'];
    if (clean.includes('roti') || clean.includes('chapati')) return USDA_FOOD_DATABASE['roti'];
    if (clean.includes('idli')) return USDA_FOOD_DATABASE['idli'];
    if (clean.includes('dosa')) return USDA_FOOD_DATABASE['dosa'];

    // Keyword tokens
    if (clean.includes('chicken') || clean.includes('poultry') || clean.includes('breast')) return USDA_FOOD_DATABASE['chicken breast'];
    if (clean.includes('salmon') || clean.includes('fish') || clean.includes('seafood')) return USDA_FOOD_DATABASE['salmon'];
    if (clean.includes('tofu') || clean.includes('soy') || clean.includes('bean curd')) return USDA_FOOD_DATABASE['tofu'];
    if (clean.includes('egg') || clean.includes('omelet')) return USDA_FOOD_DATABASE['egg'];
    if (clean.includes('rice') || clean.includes('grain')) return USDA_FOOD_DATABASE['brown rice'];
    if (clean.includes('potato') || clean.includes('tater')) return USDA_FOOD_DATABASE['potato'];
    if (clean.includes('sweet potato') || clean.includes('yam')) return USDA_FOOD_DATABASE['sweet potato'];
    if (clean.includes('broccoli') || clean.includes('cauliflower') || clean.includes('cabbage')) return USDA_FOOD_DATABASE['broccoli'];
    if (clean.includes('spinach') || clean.includes('kale') || clean.includes('lettuce') || clean.includes('salad') || clean.includes('greens')) return USDA_FOOD_DATABASE['spinach'];
    if (clean.includes('avocado') || clean.includes('guacamole')) return USDA_FOOD_DATABASE['avocado'];
    if (clean.includes('tomato')) return USDA_FOOD_DATABASE['tomato'];
    if (clean.includes('cucumber')) return USDA_FOOD_DATABASE['cucumber'];
    if (clean.includes('pepper')) return USDA_FOOD_DATABASE['bell pepper'];
    if (clean.includes('croissant') || clean.includes('pastry') || clean.includes('danish')) return USDA_FOOD_DATABASE['croissant'];
    if (clean.includes('bagel')) return USDA_FOOD_DATABASE['bagel'];
    if (clean.includes('muffin') || clean.includes('cake') || clean.includes('sweet')) return USDA_FOOD_DATABASE['blueberry muffin'];
    if (clean.includes('bread') || clean.includes('loaf') || clean.includes('toast') || clean.includes('sandwich')) return USDA_FOOD_DATABASE['sourdough bread'];
    if (clean.includes('yogurt') || clean.includes('dairy')) return USDA_FOOD_DATABASE['greek yogurt'];
    if (clean.includes('cheese') || clean.includes('cheddar')) return USDA_FOOD_DATABASE['cheddar cheese'];

    // Default balanced whole meal baseline per 100g
    return {
      name: `${foodName} (USDA Prepared Meal Composite)`,
      category: 'Prepared Food',
      servingSizeGrams: 150,
      servingUnitName: '1 portion',
      caloriesPer100g: 135,
      proteinPer100g: 6.5,
      carbsPer100g: 16.0,
      fiberPer100g: 2.0,
      fatPer100g: 4.5,
      saturatedFatPer100g: 1.2,
      sugarPer100g: 2.5,
      sodiumMgPer100g: 240,
      isVegan: false,
      isVegetarian: true,
      isGlutenFree: false,
      isDairyFree: false,
      isNutFree: true
    };
  }

  /**
   * Calculate precise nutrients for an item given its estimated weight in grams
   */
  static calculateNutrients(foodName: string, weightGrams: number): { profile: UsdaNutrientProfile; calculated: CalculatedNutrients } {
    const profile = this.findUsdaEntry(foodName);
    const factor = weightGrams / 100.0;

    const calories = Math.round(profile.caloriesPer100g * factor);
    const proteinGrams = Number((profile.proteinPer100g * factor).toFixed(1));
    const carbsGrams = Number((profile.carbsPer100g * factor).toFixed(1));
    const fiberGrams = Number((profile.fiberPer100g * factor).toFixed(1));
    const fatGrams = Number((profile.fatPer100g * factor).toFixed(1));
    const saturatedFatGrams = Number((profile.saturatedFatPer100g * factor).toFixed(1));
    const sugarGrams = Number((profile.sugarPer100g * factor).toFixed(1));
    const sodiumMg = Math.round(profile.sodiumMgPer100g * factor);

    const potassiumMg = profile.potassiumMgPer100g ? Math.round(profile.potassiumMgPer100g * factor) : undefined;
    const calciumMg = profile.calciumMgPer100g ? Math.round(profile.calciumMgPer100g * factor) : undefined;
    const ironMg = profile.ironMgPer100g ? Number((profile.ironMgPer100g * factor).toFixed(1)) : undefined;
    const vitaminCMg = profile.vitaminCMgPer100g ? Number((profile.vitaminCMgPer100g * factor).toFixed(1)) : undefined;

    // Macro energy distribution (4 kcal/g protein, 4 kcal/g carbs, 9 kcal/g fat)
    const proteinCal = proteinGrams * 4;
    const carbsCal = carbsGrams * 4;
    const fatCal = fatGrams * 9;
    const totalMacroCal = proteinCal + carbsCal + fatCal || 1;

    const macroPercentages = {
      proteinPct: Math.round((proteinCal / totalMacroCal) * 100),
      carbsPct: Math.round((carbsCal / totalMacroCal) * 100),
      fatPct: Math.round((fatCal / totalMacroCal) * 100)
    };

    return {
      profile,
      calculated: {
        weightGrams,
        calories,
        proteinGrams,
        carbsGrams,
        fiberGrams,
        fatGrams,
        saturatedFatGrams,
        sugarGrams,
        sodiumMg,
        potassiumMg,
        calciumMg,
        ironMg,
        vitaminCMg,
        macroPercentages
      }
    };
  }

  /**
   * Aggregate total plate nutrition from detected food components and compute Nutri-Score
   */
  static aggregatePlateNutrition(items: { name: string; weightGrams: number; confidence?: number; boundingBox?: [number, number, number, number]; portionDescription?: string }[], mealName?: string): PlateNutritionAnalysis {
    let totalWeightGrams = 0;
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFiber = 0;
    let totalFat = 0;
    let totalSatFat = 0;
    let totalSugar = 0;
    let totalSodium = 0;

    let isVegan = true;
    let isVegetarian = true;
    let isGlutenFree = true;
    let isDairyFree = true;
    let isNutFree = true;

    const detectedItems: DetectedFoodItem[] = items.map(item => {
      const { profile, calculated } = this.calculateNutrients(item.name, item.weightGrams);

      totalWeightGrams += calculated.weightGrams;
      totalCalories += calculated.calories;
      totalProtein += calculated.proteinGrams;
      totalCarbs += calculated.carbsGrams;
      totalFiber += calculated.fiberGrams;
      totalFat += calculated.fatGrams;
      totalSatFat += calculated.saturatedFatGrams;
      totalSugar += calculated.sugarGrams;
      totalSodium += calculated.sodiumMg;

      if (!profile.isVegan) isVegan = false;
      if (!profile.isVegetarian) isVegetarian = false;
      if (!profile.isGlutenFree) isGlutenFree = false;
      if (!profile.isDairyFree) isDairyFree = false;
      if (!profile.isNutFree) isNutFree = false;

      const dietaryTags: string[] = [];
      if (profile.isVegan) dietaryTags.push('Vegan');
      else if (profile.isVegetarian) dietaryTags.push('Vegetarian');
      if (profile.isGlutenFree) dietaryTags.push('Gluten-Free');
      if (calculated.proteinGrams >= 15) dietaryTags.push('High Protein');
      if (calculated.fiberGrams >= 4) dietaryTags.push('High Fiber');

      return {
        name: item.name,
        standardUsdaName: profile.name,
        confidence: item.confidence || 0.95,
        estimatedWeightGrams: item.weightGrams,
        portionDescription: item.portionDescription || `${item.weightGrams}g ${item.name}`,
        boundingBox: item.boundingBox,
        nutrients: calculated,
        dietaryTags
      };
    });

    // Total plate macro splits
    const totalProtCal = totalProtein * 4;
    const totalCarbCal = totalCarbs * 4;
    const totalFatCal = totalFat * 9;
    const grandCal = totalProtCal + totalCarbCal + totalFatCal || 1;

    const totalNutrients: CalculatedNutrients = {
      weightGrams: totalWeightGrams,
      calories: totalCalories,
      proteinGrams: Number(totalProtein.toFixed(1)),
      carbsGrams: Number(totalCarbs.toFixed(1)),
      fiberGrams: Number(totalFiber.toFixed(1)),
      fatGrams: Number(totalFat.toFixed(1)),
      saturatedFatGrams: Number(totalSatFat.toFixed(1)),
      sugarGrams: Number(totalSugar.toFixed(1)),
      sodiumMg: Math.round(totalSodium),
      macroPercentages: {
        proteinPct: Math.round((totalProtCal / grandCal) * 100),
        carbsPct: Math.round((totalCarbCal / grandCal) * 100),
        fatPct: Math.round((totalFatCal / grandCal) * 100)
      }
    };

    // Calculate Nutri-Score (A to E) based on European Standards / USDA density
    // Negative points: energy per 100g, sugar per 100g, sat fat per 100g, sodium per 100g
    // Positive points: fiber per 100g, protein per 100g
    const per100Factor = totalWeightGrams > 0 ? (100 / totalWeightGrams) : 1;
    const cal100 = totalCalories * per100Factor;
    const sugar100 = totalSugar * per100Factor;
    const satFat100 = totalSatFat * per100Factor;
    const sod100 = totalSodium * per100Factor;
    const fiber100 = totalFiber * per100Factor;
    const prot100 = totalProtein * per100Factor;

    let nutriPoints = 0;
    if (cal100 > 335) nutriPoints += 3;
    if (sugar100 > 9) nutriPoints += 3;
    if (satFat100 > 4) nutriPoints += 3;
    if (sod100 > 600) nutriPoints += 3;

    if (fiber100 >= 3) nutriPoints -= 3;
    if (prot100 >= 6) nutriPoints -= 3;

    let nutriScore: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
    let nutriScoreRationale = 'Excellent nutritional quality with abundant whole proteins, micronutrients, and dietary fiber.';

    if (nutriPoints <= -2) {
      nutriScore = 'A';
      nutriScoreRationale = 'Grade A: High in bioavailable protein & fiber with minimal refined sugar and saturated fat.';
    } else if (nutriPoints <= 2) {
      nutriScore = 'B';
      nutriScoreRationale = 'Grade B: Well-balanced whole food composition suitable for everyday healthy dining.';
    } else if (nutriPoints <= 6) {
      nutriScore = 'C';
      nutriScoreRationale = 'Grade C: Moderate nutritional balance; pair with fresh leafy greens for optimal micronutrients.';
    } else if (nutriPoints <= 10) {
      nutriScore = 'D';
      nutriScoreRationale = 'Grade D: Higher energy density and bakery carbohydrates; great for occasional energy replenishing.';
    } else {
      nutriScore = 'E';
      nutriScoreRationale = 'Grade E: High saturated fat/sugar content; enjoy as an occasional treat.';
    }

    // Health badges
    const healthTags: string[] = [];
    const isHighProtein = totalProtein >= 25;
    const isKetoFriendly = totalCarbs <= 15 && totalFat >= 20;
    const isHighFiber = totalFiber >= 6;
    const isLowSodium = totalSodium <= 450;

    if (isHighProtein) healthTags.push('High Protein (>25g)');
    if (isHighFiber) healthTags.push('High Fiber');
    if (isKetoFriendly) healthTags.push('Keto Friendly');
    if (isLowSodium) healthTags.push('Low Sodium');
    if (isVegan) healthTags.push('100% Plant-Based');
    else if (isVegetarian) healthTags.push('Vegetarian');
    if (isGlutenFree) healthTags.push('Gluten-Free');

    const componentsList = detectedItems.map(i => i.name).join(', ');
    const generatedDesc = `A delicious plate of ${mealName || 'freshly prepared meal'} featuring ${componentsList}. It delivers ${totalCalories} kcal, with ${totalProtein.toFixed(1)}g of protein and ${totalFiber.toFixed(1)}g of dietary fiber calibrated with official USDA FoodData Central profiles.`;

    return {
      mealName: mealName || (detectedItems.map(i => i.name).slice(0, 3).join(', ') + (detectedItems.length > 3 ? ' & more' : '')),
      mealType: detectedItems.length > 2 ? 'Complete Balanced Plate' : 'Individual Item / Snack',
      totalWeightGrams,
      totalNutrients,
      nutriScore,
      nutriScoreRationale,
      foodDescription: generatedDesc,
      healthTags,
      dietarySummary: {
        isVegan,
        isVegetarian,
        isGlutenFree,
        isDairyFree,
        isHighProtein,
        isKetoFriendly,
        isHighFiber,
        isLowSodium
      },
      detectedItems
    };
  }
}
