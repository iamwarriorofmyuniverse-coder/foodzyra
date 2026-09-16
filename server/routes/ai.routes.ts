import { Router } from 'express';
import { z } from 'zod';
import { AiService } from '../services/aiService';
import { UsdaMatcher } from '../services/usdaMatcher';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// 1. POST /api/ai/describe-food
const DescribeFoodSchema = z.object({
  title: z.string().min(2),
  category: z.string(),
  quantity: z.number().int().positive().default(1),
  quantityUnit: z.string().optional(),
  originalPrice: z.number().optional(),
  discountedPrice: z.number().optional(),
  dietaryTags: z.array(z.string()).optional(),
  notes: z.string().optional()
});

router.post('/describe-food', validate({ body: DescribeFoodSchema }), async (req, res, next) => {
  try {
    const result = await AiService.generateDescription(req.body);
    res.json({
      success: true,
      description: result.description,
      source: result.source,
      disclaimer: 'AI-generated text is an advisory draft. Merchant must verify accuracy and food freshness before publishing.'
    });
  } catch (err) {
    next(err);
  }
});

// 2. POST /api/ai/suggest-category
const SuggestCategorySchema = z.object({
  title: z.string().min(2),
  notes: z.string().optional()
});

router.post('/suggest-category', validate({ body: SuggestCategorySchema }), async (req, res, next) => {
  try {
    const result = await AiService.suggestCategory(req.body.title, req.body.notes || '');
    res.json({
      success: true,
      category: result.category,
      confidence: result.confidence,
      reason: result.reason,
      source: result.source
    });
  } catch (err) {
    next(err);
  }
});

// 3. POST /api/ai/predict-demand
const PredictDemandSchema = z.object({
  category: z.string(),
  quantity: z.number().int().positive().default(1),
  pickupStartHour: z.string().optional(),
  dayOfWeek: z.string().optional()
});

router.post('/predict-demand', validate({ body: PredictDemandSchema }), async (req, res, next) => {
  try {
    const result = await AiService.predictDemand(req.body);
    res.json({
      success: true,
      prediction: result
    });
  } catch (err) {
    next(err);
  }
});

// 4. POST /api/ai/suggest-pricing
const SuggestPricingSchema = z.object({
  originalPrice: z.number().min(0),
  category: z.string(),
  hoursUntilClosing: z.number().optional().default(4)
});

router.post('/suggest-pricing', validate({ body: SuggestPricingSchema }), (req, res, next) => {
  try {
    const result = AiService.suggestDiscount(req.body.originalPrice, req.body.category, req.body.hoursUntilClosing);
    res.json({
      success: true,
      suggestion: result
    });
  } catch (err) {
    next(err);
  }
});

// 5. POST /api/ai/sale-or-donation
const SaleOrDonationSchema = z.object({
  quantity: z.number().int().positive(),
  originalPrice: z.number().min(0),
  hoursUntilClosing: z.number().default(4),
  category: z.string()
});

router.post('/sale-or-donation', validate({ body: SaleOrDonationSchema }), (req, res, next) => {
  try {
    const result = AiService.recommendSaleOrDonation(req.body);
    res.json({
      success: true,
      recommendation: result
    });
  } catch (err) {
    next(err);
  }
});

// 6. GET /api/ai/business-waste-insights
router.get('/business-waste-insights', authenticate, async (req, res, next) => {
  try {
    const analytics = await AiService.getBusinessWasteAnalytics(req.user!.id);
    res.json({
      success: true,
      analytics
    });
  } catch (err) {
    next(err);
  }
});

// 7. GET /api/ai/customer-recommendations
router.get('/customer-recommendations', authenticate, (req, res, next) => {
  try {
    const recommendations = AiService.getCustomerRecommendations(req.user!.id);
    res.json({
      success: true,
      recommendations
    });
  } catch (err) {
    next(err);
  }
});

// 8. POST /api/ai/detect-food (Computer Vision Food Detection & USDA Nutrition)
const DetectFoodSchema = z.object({
  image: z.string().min(10), // Base64 data or image URL/buffer
  mimeType: z.string().optional().default('image/jpeg'),
  hint: z.string().optional(),
  colorFingerprint: z.record(z.any()).optional()
});

router.post('/detect-food', validate({ body: DetectFoodSchema }), async (req, res, next) => {
  try {
    const { image, mimeType, hint, colorFingerprint } = req.body;
    const result = await AiService.detectFoodFromImage(image, mimeType, hint || '', colorFingerprint);
    res.json({
      success: !result.error,
      source: result.source,
      isFood: result.isFood,
      is_food: result.is_food,
      image_hash: result.image_hash,
      cached: result.cached,
      message: result.message,
      error: result.error,
      items: result.items,
      confirmed_items: result.confirmed_items,
      possible_items: result.possible_items,
      low_confidence_items: result.low_confidence_items,
      analysis: result.analysis,
      telemetry: AiService.getTelemetry(),
      disclaimer: 'Nutrient breakdowns calculated mathematically from USDA FoodData Central foundation reference values.'
    });
  } catch (err) {
    next(err);
  }
});

// 8b. POST /api/ai/usda-match (Search and score USDA candidates for food item)
const UsdaMatchSchema = z.object({
  foodName: z.string().min(1),
  portionGrams: z.number().positive().default(100),
  visionConfidence: z.number().min(0).max(1).optional().default(1.0)
});

router.post('/usda-match', validate({ body: UsdaMatchSchema }), (req, res, next) => {
  try {
    const { foodName, portionGrams, visionConfidence } = req.body;
    const match = UsdaMatcher.matchFood(foodName, portionGrams, visionConfidence);
    res.json({
      success: true,
      match
    });
  } catch (err) {
    next(err);
  }
});

// 8c. POST /api/ai/calculate-plate-nutrition (Pure application math calculation for confirmed items)
const CalculatePlateNutritionSchema = z.object({
  items: z.array(z.object({
    name: z.string(),
    portionGrams: z.number().positive(),
    visionConfidence: z.number().optional(),
    confirmed: z.boolean().optional()
  })).min(1),
  mealName: z.string().optional().default('Custom Scanned Plate')
});

router.post('/calculate-plate-nutrition', validate({ body: CalculatePlateNutritionSchema }), (req, res, next) => {
  try {
    const { items, mealName } = req.body;
    const plate = UsdaMatcher.aggregatePlateNutrition(items, mealName);
    res.json({
      success: true,
      plate,
      telemetry: AiService.getTelemetry()
    });
  } catch (err) {
    next(err);
  }
});

// 8d. GET /api/ai/telemetry (Vision, Cache & USDA telemetry metrics)
router.get('/telemetry', (req, res) => {
  res.json({
    success: true,
    telemetry: AiService.getTelemetry()
  });
});

// 9. POST /api/ai/nutrition-lookup (Direct USDA Food Item Breakdown)
const NutritionLookupSchema = z.object({
  foodName: z.string().min(2),
  weightGrams: z.number().positive().default(100)
});

router.post('/nutrition-lookup', validate({ body: NutritionLookupSchema }), (req, res, next) => {
  try {
    const { foodName, weightGrams } = req.body;
    const result = AiService.lookupFoodNutrition(foodName, weightGrams);
    res.json({
      success: true,
      foodName,
      weightGrams,
      profile: result.profile,
      calculatedNutrients: result.calculated
    });
  } catch (err) {
    next(err);
  }
});

// 10. POST /api/ai/smart-match-listings (Dietary & Macro Smart Matching)
const SmartMatchSchema = z.object({
  minProteinGrams: z.number().optional(),
  maxCalories: z.number().optional(),
  maxPrice: z.number().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  maxDistanceKm: z.number().optional(),
  targetCategory: z.string().optional(),
  scannedPlateMacros: z.object({
    calories: z.number(),
    proteinGrams: z.number()
  }).optional()
});

router.post('/smart-match-listings', validate({ body: SmartMatchSchema }), (req, res, next) => {
  try {
    const matches = AiService.smartMatchDietaryListings(req.body);
    res.json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (err) {
    next(err);
  }
});

// 11. POST /api/ai/analyze-dish (Instant Custom Dish Breakdown)
const AnalyzeDishSchema = z.object({
  dishName: z.string().min(1)
});

router.post('/analyze-dish', validate({ body: AnalyzeDishSchema }), (req, res, next) => {
  try {
    const { dishName } = req.body;
    const analysis = AiService.getDishAnalysis(dishName);
    res.json({
      success: true,
      source: 'dish_intelligence_engine',
      isFood: true,
      analysis,
      disclaimer: 'Nutrient breakdowns calculated from USDA FoodData Central foundation reference values. Portions can be adjusted dynamically.'
    });
  } catch (err) {
    next(err);
  }
});

// 12. POST /api/ai/teach-plate (AI Continuous Learning & Plate Memory)
const TeachPlateSchema = z.object({
  mealName: z.string().min(2),
  mealType: z.string().optional().default('Meals & Prepared'),
  foodDescription: z.string().optional(),
  colorFingerprint: z.string().optional(),
  detectedItems: z.array(z.object({
    name: z.string(),
    weightGrams: z.number().positive().optional(),
    estimatedWeightGrams: z.number().positive().optional(),
    confidence: z.number().optional(),
    portionDescription: z.string().optional()
  })).min(1)
});

router.post('/teach-plate', validate({ body: TeachPlateSchema }), (req, res, next) => {
  try {
    const normalizedItems = req.body.detectedItems.map(item => ({
      name: item.name,
      weightGrams: item.weightGrams ?? item.estimatedWeightGrams ?? 100,
      portionDescription: item.portionDescription || item.name,
      confidence: item.confidence ?? 0.95
    }));

    const result = AiService.teachPlate({
      ...req.body,
      detectedItems: normalizedItems
    });

    res.json({
      success: true,
      message: `AI Vision model successfully learned "${req.body.mealName}". Future scans will recognize this exact composition!`,
      plate: result,
      result
    });
  } catch (err) {
    next(err);
  }
});

// 13. GET /api/ai/learned-plates (Retrieve Memorized Food Plates)
router.get('/learned-plates', (req, res, next) => {
  try {
    const rawPlates = AiService.getLearnedPlates();
    const plates = rawPlates.map(p => ({
      ...p,
      detected_items: JSON.parse(p.detected_items_json || '[]')
    }));

    res.json({
      success: true,
      count: plates.length,
      plates,
      learnedPlates: plates
    });
  } catch (err) {
    next(err);
  }
});

export default router;
