export interface CalculatedImpact {
  mealsCount: number;
  co2SavedKg: number;
  waterSavedLiters: number;
  moneySaved: number;
}

export function calculateImpact(weightKg: number, originalPrice: number, discountedPrice: number = 0): CalculatedImpact {
  // EPA & FAO standard coefficients for food waste reduction:
  // ~2.5 kg CO2e saved per kg food rescued from landfill
  // ~250 liters of agricultural freshwater footprint preserved per kg
  // ~0.5 kg per complete nutritious meal equivalent
  const mealsCount = Math.max(1, Math.round(weightKg / 0.5));
  const co2SavedKg = Number((weightKg * 2.5).toFixed(1));
  const waterSavedLiters = Math.round(weightKg * 250);
  const moneySaved = Number((Math.max(0, originalPrice - discountedPrice)).toFixed(2));

  return {
    mealsCount,
    co2SavedKg,
    waterSavedLiters,
    moneySaved
  };
}
