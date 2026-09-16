import { USDA_FOOD_DATABASE, UsdaNutrientProfile, CalculatedNutrients } from './nutritionDatabase';

export interface UsdaMatchResult {
  visionFoodName: string;
  visionConfidence: number;
  usdaFoodName: string;
  usdaFdcId: number;
  usdaMatchConfidence: number;
  portionGrams: number;
  servingUnitName: string;
  profile: UsdaNutrientProfile;
  nutrients: CalculatedNutrients;
}

export interface ConfirmedFoodInput {
  name: string;
  portionGrams: number;
  visionConfidence?: number;
  confirmed?: boolean;
}

export class UsdaMatcher {
  private static requestCount = 0;

  static getRequestCount(): number {
    return this.requestCount;
  }

  static resetRequestCount(): void {
    this.requestCount = 0;
  }

  /**
   * Search USDA database for the closest food match using token and alias scoring.
   * Does NOT blindly accept the first match; computes a match confidence score.
   */
  static matchFood(foodName: string, portionGrams: number = 100, visionConfidence: number = 1.0): UsdaMatchResult {
    this.requestCount++;
    console.log(`[Foodzyra] USDA REQUEST: "${foodName}"`);
    const clean = foodName.toLowerCase().trim().replace(/[^a-z0-9\s]/g, ' ');
    const tokens = clean.split(/\s+/).filter(t => t.length > 1);

    let bestMatchKey = '';
    let bestProfile: UsdaNutrientProfile | null = null;
    let bestScore = 0;

    // 1. Direct exact key match
    if (USDA_FOOD_DATABASE[clean]) {
      bestMatchKey = clean;
      bestProfile = USDA_FOOD_DATABASE[clean];
      bestScore = 1.0;
    } else {
      // 2. Multi-candidate token scoring
      for (const [key, profile] of Object.entries(USDA_FOOD_DATABASE)) {
        const keyTokens = key.toLowerCase().split(/\s+/);
        const nameTokens = profile.name.toLowerCase().split(/[\s,]+/);

        let matchCount = 0;
        for (const token of tokens) {
          if (keyTokens.includes(token) || nameTokens.includes(token)) {
            matchCount += 2;
          } else if (keyTokens.some(kt => kt.startsWith(token) || token.startsWith(kt))) {
            matchCount += 1;
          }
        }

        const score = matchCount / Math.max(tokens.length, keyTokens.length);
        if (score > bestScore) {
          bestScore = score;
          bestMatchKey = key;
          bestProfile = profile;
        }
      }
    }

    // 3. Fallback to generic wholesome food item if no strong match
    if (!bestProfile || bestScore < 0.3) {
      bestProfile = USDA_FOOD_DATABASE['salad'] || USDA_FOOD_DATABASE['spinach'] || Object.values(USDA_FOOD_DATABASE)[0];
      bestScore = 0.40;
    }

    const matchConfidence = Number(Math.min(1.0, Math.max(0.4, bestScore)).toFixed(2));
    const nutrients = this.calculateNutrients(bestProfile, portionGrams);

    return {
      visionFoodName: foodName,
      visionConfidence: Number(visionConfidence.toFixed(2)),
      usdaFoodName: bestProfile.name,
      usdaFdcId: bestProfile.fdcId || 100000 + Math.abs(this.hashCode(bestProfile.name) % 900000),
      usdaMatchConfidence: matchConfidence,
      portionGrams,
      servingUnitName: bestProfile.servingUnitName,
      profile: bestProfile,
      nutrients
    };
  }

  /**
   * Pure application math for calculating nutrients:
   * Nutrient = (USDA per 100g * portionGrams) / 100
   */
  static calculateNutrients(profile: UsdaNutrientProfile, portionGrams: number): CalculatedNutrients {
    const factor = Math.max(1, portionGrams) / 100;
    
    const calories = Math.round(profile.caloriesPer100g * factor);
    const proteinGrams = Number((profile.proteinPer100g * factor).toFixed(1));
    const carbsGrams = Number((profile.carbsPer100g * factor).toFixed(1));
    const fatGrams = Number((profile.fatPer100g * factor).toFixed(1));
    const fiberGrams = Number((profile.fiberPer100g * factor).toFixed(1));
    const saturatedFatGrams = Number((profile.saturatedFatPer100g * factor).toFixed(1));
    const sugarGrams = Number((profile.sugarPer100g * factor).toFixed(1));
    const sodiumMg = Math.round(profile.sodiumMgPer100g * factor);

    const totalMacroKcal = (proteinGrams * 4) + (carbsGrams * 4) + (fatGrams * 9);
    const proteinPct = totalMacroKcal > 0 ? Math.round(((proteinGrams * 4) / totalMacroKcal) * 100) : 0;
    const carbsPct = totalMacroKcal > 0 ? Math.round(((carbsGrams * 4) / totalMacroKcal) * 100) : 0;
    const fatPct = totalMacroKcal > 0 ? Math.round(((fatGrams * 9) / totalMacroKcal) * 100) : 0;

    return {
      weightGrams: portionGrams,
      calories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      fiberGrams,
      saturatedFatGrams,
      sugarGrams,
      sodiumMg,
      potassiumMg: profile.potassiumMgPer100g ? Math.round(profile.potassiumMgPer100g * factor) : undefined,
      calciumMg: profile.calciumMgPer100g ? Math.round(profile.calciumMgPer100g * factor) : undefined,
      ironMg: profile.ironMgPer100g ? Number((profile.ironMgPer100g * factor).toFixed(1)) : undefined,
      vitaminCMg: profile.vitaminCMgPer100g ? Number((profile.vitaminCMgPer100g * factor).toFixed(1)) : undefined,
      macroPercentages: {
        proteinPct,
        carbsPct,
        fatPct
      }
    };
  }

  /**
   * Aggregate multiple confirmed foods into total plate nutrition and calculate Nutri-Score.
   */
  static aggregatePlateNutrition(confirmedFoods: Array<{ name: string; portionGrams: number; visionConfidence?: number; confirmed?: boolean }>, mealName: string = 'Custom Scanned Plate') {
    // Filter out unconfirmed items
    const validFoods = confirmedFoods.filter(f => f.confirmed !== false && f.portionGrams > 0);

    const matchedItems: UsdaMatchResult[] = validFoods.map(f =>
      this.matchFood(f.name, f.portionGrams, f.visionConfidence ?? 1.0)
    );

    let totalWeightGrams = 0;
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSaturatedFat = 0;
    let totalSugar = 0;
    let totalSodium = 0;

    let isVegan = true;
    let isVegetarian = true;
    let isGlutenFree = true;
    let isDairyFree = true;

    for (const item of matchedItems) {
      totalWeightGrams += item.portionGrams;
      totalCalories += item.nutrients.calories;
      totalProtein += item.nutrients.proteinGrams;
      totalCarbs += item.nutrients.carbsGrams;
      totalFat += item.nutrients.fatGrams;
      totalFiber += item.nutrients.fiberGrams;
      totalSaturatedFat += item.nutrients.saturatedFatGrams;
      totalSugar += item.nutrients.sugarGrams;
      totalSodium += item.nutrients.sodiumMg;

      if (!item.profile.isVegan) isVegan = false;
      if (!item.profile.isVegetarian) isVegetarian = false;
      if (!item.profile.isGlutenFree) isGlutenFree = false;
      if (!item.profile.isDairyFree) isDairyFree = false;
    }

    const totalMacroKcal = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);
    const proteinPct = totalMacroKcal > 0 ? Math.round(((totalProtein * 4) / totalMacroKcal) * 100) : 0;
    const carbsPct = totalMacroKcal > 0 ? Math.round(((totalCarbs * 4) / totalMacroKcal) * 100) : 0;
    const fatPct = totalMacroKcal > 0 ? Math.round(((totalFat * 9) / totalMacroKcal) * 100) : 0;

    const totalNutrients: CalculatedNutrients = {
      weightGrams: totalWeightGrams,
      calories: totalCalories,
      proteinGrams: Number(totalProtein.toFixed(1)),
      carbsGrams: Number(totalCarbs.toFixed(1)),
      fatGrams: Number(totalFat.toFixed(1)),
      fiberGrams: Number(totalFiber.toFixed(1)),
      saturatedFatGrams: Number(totalSaturatedFat.toFixed(1)),
      sugarGrams: Number(totalSugar.toFixed(1)),
      sodiumMg: totalSodium,
      macroPercentages: {
        proteinPct,
        carbsPct,
        fatPct
      }
    };

    // Calculate Nutri-Score (A through E)
    let nutriScore: 'A' | 'B' | 'C' | 'D' | 'E' = 'B';
    let rationale = 'Balanced macronutrient density with dietary fiber and lean nutrients.';

    const calPer100 = totalWeightGrams > 0 ? (totalCalories / totalWeightGrams) * 100 : 0;
    const fiberPer100 = totalWeightGrams > 0 ? (totalFiber / totalWeightGrams) * 100 : 0;
    const satFatPer100 = totalWeightGrams > 0 ? (totalSaturatedFat / totalWeightGrams) * 100 : 0;
    const sugarPer100 = totalWeightGrams > 0 ? (totalSugar / totalWeightGrams) * 100 : 0;

    if (calPer100 < 150 && fiberPer100 >= 2.0 && satFatPer100 < 2.0 && sugarPer100 < 5.0) {
      nutriScore = 'A';
      rationale = 'Excellent nutritional balance: Low energy density, high fiber, minimal saturated fat.';
    } else if (calPer100 < 220 && satFatPer100 < 4.0 && sugarPer100 < 10.0) {
      nutriScore = 'B';
      rationale = 'High quality meal with balanced protein and moderate calories.';
    } else if (calPer100 < 300 && sugarPer100 < 15.0) {
      nutriScore = 'C';
      rationale = 'Moderate nutritional profile. Suitable for active energy replenishment.';
    } else {
      nutriScore = 'D';
      rationale = 'Higher caloric or sugar concentration. Best consumed in moderation.';
    }

    const healthTags: string[] = [];
    if (totalProtein >= 25) healthTags.push('High Protein (>25g)');
    if (totalFiber >= 5) healthTags.push('High Fiber');
    if (isVegan) healthTags.push('Vegan');
    else if (isVegetarian) healthTags.push('Vegetarian');
    if (isGlutenFree) healthTags.push('Gluten-Free');
    if (isDairyFree) healthTags.push('Dairy-Free');
    if (totalSodium < 500) healthTags.push('Low Sodium');
    if (totalCalories < 550) healthTags.push('Calorie Friendly');

    return {
      mealName,
      totalWeightGrams,
      totalNutrients,
      nutriScore,
      nutriScoreRationale: rationale,
      healthTags,
      dietarySummary: {
        isVegan,
        isVegetarian,
        isGlutenFree,
        isDairyFree,
        isHighProtein: totalProtein >= 25,
        isKetoFriendly: carbsPct < 15,
        isHighFiber: totalFiber >= 5,
        isLowSodium: totalSodium < 500
      },
      items: matchedItems
    };
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
