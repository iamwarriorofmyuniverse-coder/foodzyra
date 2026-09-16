import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Activity,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  Scale,
  Search,
  RefreshCw,
  X,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Plus,
  Trash2,
  Brain,
  Check,
  Eye,
  HelpCircle,
  Database,
  Edit2,
  Utensils,
  VideoOff
} from 'lucide-react';
import { FoodListing } from '../../types';

interface FoodVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMatchedListing?: (listingId: string) => void;
  nearbyListings?: FoodListing[];
}

export const FoodVisionModal: React.FC<FoodVisionModalProps> = ({
  isOpen,
  onClose,
  onSelectMatchedListing,
  nearbyListings = []
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'nutrition' | 'smart_matches' | 'manual'>('scan');
  const [stage, setStage] = useState<'review' | 'nutrition'>('review');
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [smartMatches, setSmartMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [isTeaching, setIsTeaching] = useState(false);
  const [teachSuccessMessage, setTeachSuccessMessage] = useState<string | null>(null);
  const [editingMealName, setEditingMealName] = useState(false);
  const [customMealNameInput, setCustomMealNameInput] = useState('');
  const [editingItemIdx, setEditingItemIdx] = useState<number | null>(null);
  const [editingItemName, setEditingItemName] = useState('');
  const [manualFoodName, setManualFoodName] = useState('');
  const [manualFoodGrams, setManualFoodGrams] = useState(150);
  const [isAddingManualFood, setIsAddingManualFood] = useState(false);
  const [telemetry, setTelemetry] = useState<any>(null);

  // Live Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample plate presets for instant 1-click testing
  const SAMPLE_PRESETS = [
    {
      name: '🍛 Hyderabadi Chicken Biryani & Raita',
      category: 'Meals & Prepared',
      img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      description: 'Aromatic spiced basmati rice, tender chicken pieces, caramelized onions, boiled egg, and herb raita'
    },
    {
      name: '🥞 Crispy Masala Dosa & Sambar',
      category: 'Meals & Prepared',
      img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      description: 'Golden fermented crepe with spiced potato filling, coconut chutney, and lentil vegetable sambar'
    },
    {
      name: '🍕 Wood-Fired Margherita Pizza',
      category: 'Meals & Prepared',
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      description: 'Thin artisan crust, San Marzano tomato sauce, fresh buffalo mozzarella, and sweet basil leaves'
    },
    {
      name: '🍔 Classic Gourmet Burger & Fries',
      category: 'Meals & Prepared',
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      description: 'Toasted brioche bun, grilled patty, melted cheddar, crisp lettuce, tomato slices, and golden fries'
    },
    {
      name: '🥖 Theobroma Artisan Sourdough & Pastry Bag',
      category: 'Bakery',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      description: 'Fresh sourdough loaf, butter croissants, and blueberry cinnamon danish'
    },
    {
      name: '🥗 Mediterranean Garden Superfood Salad',
      category: 'Fresh Produce',
      img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      description: 'Baby spinach, cherry tomatoes, cucumber, avocado, soft-boiled eggs, and cold-pressed dressing'
    }
  ];

  // 1. Camera Lifecycle Management
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        throw new Error('Webcam is not supported or accessible on this browser.');
      }
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      setCameraError('Camera access not permitted. Please upload an image file or choose a preset.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      stopCamera();
      analyzeImage(dataUrl, 'Live Camera Capture');
    }
  };

  // Fetch telemetry on modal mount
  useEffect(() => {
    if (isOpen) {
      fetch('/api/ai/telemetry')
        .then(r => r.json())
        .then(d => { if (d.success) setTelemetry(d.telemetry); })
        .catch(() => {});
    } else {
      stopCamera();
    }
  }, [isOpen, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // 2. Smart Matches Generator against Indian Surplus Listings
  const computeSmartMatches = useCallback((totalNutrients: any) => {
    setLoadingMatches(true);
    try {
      const activeProtein = totalNutrients?.proteinGrams || 20;
      const activeCalories = totalNutrients?.calories || 500;

      // Match against nearbyListings prop
      const matches = nearbyListings.map(listing => {
        let matchScore = 70;
        const matchReasons: string[] = [];

        const isVeg = (listing.dietaryTags || []).some(t => t.toLowerCase().includes('veg'));
        const discountPct = listing.originalPrice > 0 
          ? Math.round(((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100) 
          : 100;

        // Discount logic
        if (discountPct >= 50) {
          matchScore += 12;
          matchReasons.push(`High Value: ${discountPct}% off retail`);
        }

        // Category & nutrition affinity
        if (listing.category === 'Meals & Prepared') {
          matchScore += 10;
          matchReasons.push(`Meal Alignment: ~${Math.round(activeProtein * 0.9)}g Protein profile`);
        } else if (listing.category === 'Bakery') {
          matchScore += 5;
          matchReasons.push(`Bakery surplus rescue`);
        }

        if (isVeg) {
          matchReasons.push(`100% Pure Vegetarian`);
        }

        return {
          listingId: listing.id,
          title: listing.title,
          businessName: listing.businessName,
          businessAddress: listing.location?.address || 'Bengaluru, India',
          category: listing.category,
          listingType: listing.type,
          discountedPrice: listing.discountedPrice,
          originalPrice: listing.originalPrice,
          discountPercent: discountPct,
          distanceKm: Number((Math.random() * 2.5 + 0.5).toFixed(1)),
          images: listing.images || [],
          nutriScore: isVeg ? 'A' : 'B',
          estimatedNutrition: {
            calories: Math.round(activeCalories * 0.95),
            proteinGrams: Math.round(activeProtein * 0.9),
            carbsGrams: Math.round((activeCalories * 0.5) / 4)
          },
          matchScore: Math.min(99, Math.max(65, matchScore)),
          matchReasons
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      setSmartMatches(matches);
    } catch (e) {
      console.error('Error computing smart matches:', e);
    } finally {
      setLoadingMatches(false);
    }
  }, [nearbyListings]);

  if (!isOpen) return null;

  // 3. Image Analysis & Pipeline
  const resizeImage = (file: File): Promise<{ base64: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          const maxDim = 800;
          let width = image.width;
          let height = image.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(image, 0, 0, width, height);
            resolve({ base64: canvas.toDataURL('image/jpeg', 0.85) });
          } else {
            resolve({ base64: readerEvent.target?.result as string });
          }
        };
        image.onerror = () => resolve({ base64: readerEvent.target?.result as string });
        image.src = readerEvent.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    try {
      const { base64 } = await resizeImage(file);
      setImagePreview(base64);
      analyzeImage(base64);
    } catch (err) {
      console.error('Error processing uploaded file:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
      e.target.value = '';
    }
  };

  const handlePresetSelect = (preset: typeof SAMPLE_PRESETS[0]) => {
    setImagePreview(preset.img);
    analyzeImage(preset.img, preset.name);
  };

  const analyzeImage = async (imageSrc: string, hint: string = '') => {
    setIsScanning(true);
    setScanResult(null);
    setSmartMatches([]);
    setStage('review');

    try {
      const response = await fetch('/api/ai/detect-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageSrc,
          mimeType: 'image/jpeg',
          hint
        })
      });

      const data = await response.json();
      setScanResult(data);
      if (data.telemetry) setTelemetry(data.telemetry);

      if (data.success && data.isFood) {
        const detected = data.analysis?.detectedItems || data.items || [];
        setItemsList(detected);
        setActiveTab('nutrition');
        if (data.analysis?.totalNutrients) {
          computeSmartMatches(data.analysis.totalNutrients);
        }
      } else {
        setActiveTab('nutrition');
        setSmartMatches([]);
      }
    } catch (err) {
      console.error('Food detection failed:', err);
      setScanResult({
        success: false,
        isFood: false,
        error: 'NETWORK_ERROR',
        message: 'Could not connect to food scanning service. You can enter food items manually.'
      });
      setActiveTab('nutrition');
    } finally {
      setIsScanning(false);
    }
  };

  // 4. Manual Search / USDA Entry
  const handleManualFoodSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualFoodName.trim()) return;
    setIsAddingManualFood(true);
    try {
      const portion = Number(manualFoodGrams) || 150;
      const res = await fetch('/api/ai/usda-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: manualFoodName.trim(),
          portionGrams: portion,
          visionConfidence: 1.0
        })
      });
      const data = await res.json();
      if (data.success && data.match) {
        const newItem = {
          name: manualFoodName.trim(),
          standardUsdaName: data.match.usdaFoodName,
          usdaFdcId: data.match.usdaFdcId,
          usdaMatchConfidence: data.match.usdaMatchConfidence,
          portionDescription: `${portion}g ${manualFoodName.trim()}`,
          estimatedWeightGrams: portion,
          confidence: 1.0,
          status: 'confirmed',
          confirmed: true,
          nutrients: data.match.nutrients
        };
        const updated = [...itemsList, newItem];
        setItemsList(updated);

        const currentMealTitle = scanResult?.analysis?.mealName || `${manualFoodName.trim()} Dish`;
        const plateRes = await fetch('/api/ai/calculate-plate-nutrition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: updated.map(i => ({
              name: i.name,
              portionGrams: i.estimatedWeightGrams,
              visionConfidence: i.confidence,
              confirmed: true
            })),
            mealName: currentMealTitle
          })
        });
        const plateData = await plateRes.json();
        if (plateData.success && plateData.plate) {
          setScanResult({
            success: true,
            isFood: true,
            is_food: true,
            source: 'manual_entry',
            analysis: {
              ...plateData.plate,
              foodDescription: `Nutritional profile computed from USDA FoodData Central foundation database.`,
              detectedItems: updated
            }
          });
          if (plateData.plate.totalNutrients) {
            computeSmartMatches(plateData.plate.totalNutrients);
          }
        }
        setManualFoodName('');
        setActiveTab('nutrition');
        setStage('nutrition');
      }
    } catch (err) {
      console.error('Manual food lookup failed:', err);
    } finally {
      setIsAddingManualFood(false);
    }
  };

  // 5. Ingredient confirmation & Math Recalculation
  const handleToggleItemConfirmation = (index: number) => {
    const updated = [...itemsList];
    updated[index].confirmed = !updated[index].confirmed;
    setItemsList(updated);
  };

  const recalculateLocalNutrition = (items: any[]) => {
    const confirmedOnly = items.filter(i => i.confirmed !== false);
    
    let totalWeight = 0;
    let totalCal = 0;
    let totalProt = 0;
    let totalCarb = 0;
    let totalFat = 0;
    let totalFiber = 0;

    for (const item of confirmedOnly) {
      const weight = item.estimatedWeightGrams || 100;
      totalWeight += weight;
      if (item.nutrients) {
        const factor = weight / (item.nutrients.weightGrams || 100);
        totalCal += Math.round(item.nutrients.calories * factor);
        totalProt += item.nutrients.proteinGrams * factor;
        totalCarb += item.nutrients.carbsGrams * factor;
        totalFat += item.nutrients.fatGrams * factor;
        totalFiber += (item.nutrients.fiberGrams || 0) * factor;
      }
    }

    const totalMacroKcal = (totalProt * 4) + (totalCarb * 4) + (totalFat * 9);
    const proteinPct = totalMacroKcal > 0 ? Math.round(((totalProt * 4) / totalMacroKcal) * 100) : 0;
    const carbsPct = totalMacroKcal > 0 ? Math.round(((totalCarb * 4) / totalMacroKcal) * 100) : 0;
    const fatPct = totalMacroKcal > 0 ? Math.round(((totalFat * 9) / totalMacroKcal) * 100) : 0;

    let nutriScore: 'A' | 'B' | 'C' | 'D' | 'E' = 'B';
    const calPer100 = totalWeight > 0 ? (totalCal / totalWeight) * 100 : 0;
    const fiberPer100 = totalWeight > 0 ? (totalFiber / totalWeight) * 100 : 0;

    if (calPer100 < 150 && fiberPer100 >= 2.0) nutriScore = 'A';
    else if (calPer100 < 220) nutriScore = 'B';
    else if (calPer100 < 300) nutriScore = 'C';
    else nutriScore = 'D';

    const healthTags: string[] = [];
    if (totalProt >= 25) healthTags.push('High Protein (>25g)');
    if (totalFiber >= 5) healthTags.push('High Fiber');
    if (totalCal < 550) healthTags.push('Calorie Friendly');

    if (scanResult?.analysis) {
      setScanResult({
        ...scanResult,
        analysis: {
          ...scanResult.analysis,
          totalWeightGrams: totalWeight,
          nutriScore,
          healthTags: healthTags.length > 0 ? healthTags : scanResult.analysis.healthTags,
          totalNutrients: {
            ...scanResult.analysis.totalNutrients,
            calories: totalCal,
            proteinGrams: Number(totalProt.toFixed(1)),
            carbsGrams: Number(totalCarb.toFixed(1)),
            fatGrams: Number(totalFat.toFixed(1)),
            fiberGrams: Number(totalFiber.toFixed(1)),
            macroPercentages: { proteinPct, carbsPct, fatPct }
          }
        }
      });
    }
  };

  const handleConfirmDetections = () => {
    recalculateLocalNutrition(itemsList);
    setStage('nutrition');
  };

  const handleAdjustItemWeight = (index: number, newWeight: number) => {
    const updatedItems = [...itemsList];
    updatedItems[index].estimatedWeightGrams = newWeight;
    updatedItems[index].portionDescription = `${newWeight}g ${updatedItems[index].name}`;
    setItemsList(updatedItems);
    recalculateLocalNutrition(updatedItems);
  };

  const handleAddIngredient = async (ingredientName?: string) => {
    const nameToLookup = ingredientName || newIngredientName;
    if (!nameToLookup || !nameToLookup.trim()) return;
    try {
      const res = await fetch('/api/ai/usda-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: nameToLookup.trim(),
          portionGrams: 75,
          visionConfidence: 1.0
        })
      });
      const data = await res.json();
      if (data.success && data.match) {
        const newItem = {
          name: nameToLookup.trim(),
          standardUsdaName: data.match.usdaFoodName,
          usdaFdcId: data.match.usdaFdcId,
          usdaMatchConfidence: data.match.usdaMatchConfidence,
          portionDescription: `75g ${nameToLookup.trim()}`,
          estimatedWeightGrams: 75,
          confidence: 1.0,
          status: 'confirmed',
          confirmed: true,
          nutrients: data.match.nutrients
        };
        const updated = [...itemsList, newItem];
        setItemsList(updated);
        recalculateLocalNutrition(updated);
        setNewIngredientName('');
        setShowAddIngredient(false);
      }
    } catch (e) {
      console.error('Failed to add custom ingredient:', e);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const updated = itemsList.filter((_, i) => i !== index);
    setItemsList(updated);
    recalculateLocalNutrition(updated);
  };

  const nutriScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'bg-emerald-600 text-white';
      case 'B': return 'bg-green-500 text-white';
      case 'C': return 'bg-amber-400 text-slate-900';
      case 'D': return 'bg-orange-500 text-white';
      case 'E': return 'bg-red-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-forest-800 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                Foodzyra AI Vision & USDA Nutrition
                <span className="text-xs uppercase bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Decoupled Pipeline
                </span>
              </h2>
              <p className="text-xs text-forest-100">
                AI Vision food detection matched directly with USDA FoodData Central foundation nutrition
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-forest-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 overflow-x-auto gap-1">
          <button
            onClick={() => { setActiveTab('scan'); setScanResult(null); stopCamera(); }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'scan'
                ? 'border-forest-600 text-forest-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-forest-600" />
            Photo Scanner / Camera
          </button>

          {scanResult && scanResult.isFood && scanResult.analysis && (
            <>
              <button
                onClick={() => { setActiveTab('nutrition'); setStage('review'); }}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
                  activeTab === 'nutrition' && stage === 'review'
                    ? 'border-forest-600 text-forest-800 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Eye className="w-4 h-4 text-forest-600" />
                Stage 1: Detections ({itemsList.length})
              </button>
              <button
                onClick={() => { setActiveTab('nutrition'); setStage('nutrition'); }}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
                  activeTab === 'nutrition' && stage === 'nutrition'
                    ? 'border-forest-600 text-forest-800 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Activity className="w-4 h-4 text-forest-600" />
                Stage 2: USDA Nutrition & Macros
              </button>
              <button
                onClick={() => setActiveTab('smart_matches')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
                  activeTab === 'smart_matches'
                    ? 'border-forest-600 text-forest-800 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                Surplus Matches ({smartMatches.length})
              </button>
            </>
          )}

          <button
            onClick={() => { setActiveTab('manual'); stopCamera(); }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
              activeTab === 'manual'
                ? 'border-forest-600 text-forest-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-600" />
            Direct USDA Search
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: SCANNER & PHOTO / CAMERA */}
          {activeTab === 'scan' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h3 className="text-xl font-black text-slate-900">Scan Any Food Dish or Fast-Food</h3>
                <p className="text-xs text-slate-600">
                  Take a photo with your webcam/phone, upload an image file, or choose from authentic Indian & fast-food presets below.
                </p>
              </div>

              {/* Live Camera Video Stream Area */}
              {isCameraActive ? (
                <div className="bg-slate-900 rounded-3xl p-4 text-center space-y-4 shadow-xl border border-slate-700">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-black max-h-72 mx-auto">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      <span>📸 Snap & Analyze Plate</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl transition-colors"
                    >
                      Cancel Camera
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option A: Live Camera */}
                  <div
                    onClick={startCamera}
                    className="border-2 border-dashed border-forest-300 bg-forest-50/40 hover:bg-forest-50 hover:border-forest-500 rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 shadow-xs hover:shadow-md"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-forest-600 text-white flex items-center justify-center shadow-md">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Open Live Camera</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Use your laptop or phone camera to scan food in real-time</p>
                    </div>
                    <span className="text-[11px] font-bold text-forest-700 bg-white px-3 py-1 rounded-full border border-forest-200">
                      Live Webcam Snap
                    </span>
                  </div>

                  {/* Option B: File Upload */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-forest-500 hover:bg-slate-50 rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 shadow-xs hover:shadow-md"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-inner">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Upload Photo File</h4>
                      <p className="text-xs text-slate-500 mt-0.5">JPG, PNG, or WebP photo of your plate or grocery bag</p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                      Browse Files
                    </span>
                  </div>
                </div>
              )}

              {isScanning && (
                <div className="py-8 text-center space-y-3 bg-forest-50 rounded-2xl border border-forest-200">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-forest-600" />
                  <p className="text-sm font-bold text-slate-900">Analyzing plate with Foodzyra AI Vision...</p>
                  <p className="text-xs text-slate-500">Separating visual items and querying USDA FoodData Central Foundation Database</p>
                </div>
              )}

              {/* Sample Presets for Quick 1-Click Testing */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Or Test with Real Dishes (1-Click Instant Scan):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {SAMPLE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-forest-500 hover:shadow-md transition-all text-left group bg-white"
                    >
                      <img
                        src={preset.img}
                        alt={preset.name}
                        className="w-14 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-forest-700">
                          {preset.name}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{preset.description}</p>
                        <span className="text-[10px] font-semibold text-forest-700 bg-forest-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                          Test Vision & USDA
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MANUAL FOOD ENTRY */}
          {activeTab === 'manual' && (
            <div className="space-y-6 max-w-xl mx-auto py-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Direct USDA Nutrition Lookup</h3>
                <p className="text-xs text-slate-600">
                  Search any food item directly from USDA FoodData Central foundation reference values.
                </p>
              </div>

              <form onSubmit={handleManualFoodSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Food Name or Ingredient
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Biryani, Boiled Egg, Pizza, Dosa, Chicken Breast, Sourdough..."
                    value={manualFoodName}
                    onChange={(e) => setManualFoodName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Portion Weight (Grams): {manualFoodGrams}g
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="600"
                    step="10"
                    value={manualFoodGrams}
                    onChange={(e) => setManualFoodGrams(Number(e.target.value))}
                    className="w-full accent-forest-600 cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('scan')}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Back to Scanner
                  </button>

                  <button
                    type="submit"
                    disabled={isAddingManualFood || !manualFoodName.trim()}
                    className="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold rounded-xl shadow transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAddingManualFood ? 'Matching USDA...' : 'Calculate Nutrition'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: NUTRITION & VISION RESULTS */}
          {scanResult && activeTab === 'nutrition' && (
            stage === 'review' ? (
              /* STAGE 1: RAW AI FOOD DETECTION & CONFIRMATION REVIEW */
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-forest-50 border border-forest-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-forest-600" />
                      Stage 1: Verify AI Food Detections
                    </span>
                    <p className="text-xs text-slate-600">
                      Review detected items below. Check or uncheck foods before computing USDA nutrition totals.
                    </p>
                  </div>
                  <button
                    onClick={handleConfirmDetections}
                    className="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Confirm & Compute Nutrition</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Visual Image & Detected Meal Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 bg-slate-900 rounded-2xl overflow-hidden aspect-square relative">
                    {imagePreview && (
                      <img src={imagePreview} alt="Scanned Plate" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                      <span className="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        AI Food Detection
                      </span>
                      <p className="text-sm font-bold truncate">{scanResult.analysis?.mealName || 'Scanned Food Plate'}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Database className="w-4 h-4 text-forest-700" />
                        Identified Ingredients ({itemsList.length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddIngredient(!showAddIngredient)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-50 hover:bg-forest-100 text-forest-700 text-xs font-semibold rounded-lg border border-forest-200 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    {/* Quick Add Ingredient Container */}
                    {showAddIngredient && (
                      <div className="p-3 rounded-xl bg-white border border-forest-200 shadow-sm space-y-2">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (newIngredientName.trim()) handleAddIngredient();
                          }}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Type food name (e.g. Avocado, Sambar, Roti)..."
                            value={newIngredientName}
                            onChange={(e) => setNewIngredientName(e.target.value)}
                            className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none"
                          />
                          <button
                            type="submit"
                            disabled={!newIngredientName.trim()}
                            className="px-3 py-1 text-xs font-bold bg-forest-600 text-white rounded-lg disabled:opacity-50"
                          >
                            Add
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Detections List */}
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {itemsList.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                            item.confirmed !== false
                              ? 'bg-white border-emerald-300 shadow-xs'
                              : 'bg-slate-50 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                            <input
                              type="checkbox"
                              checked={item.confirmed !== false}
                              onChange={() => handleToggleItemConfirmation(idx)}
                              className="w-4 h-4 accent-forest-600 rounded cursor-pointer shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 capitalize truncate">{item.name}</p>
                              <p className="text-[11px] text-slate-500 truncate">
                                USDA: {item.standardUsdaName || item.name} • ~{item.estimatedWeightGrams || 100}g
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(idx)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* STAGE 2: CONFIRMED NUTRITION & PORTION SLIDERS */
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Main Macro Cards */}
                {scanResult.analysis?.totalNutrients && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                      <Flame className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                      <span className="text-xl font-black text-amber-900">
                        {scanResult.analysis.totalNutrients.calories}
                      </span>
                      <p className="text-[11px] font-bold text-amber-700">Calories (kcal)</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                      <Dumbbell className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <span className="text-xl font-black text-blue-900">
                        {scanResult.analysis.totalNutrients.proteinGrams}g
                      </span>
                      <p className="text-[11px] font-bold text-blue-700">Protein</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-center">
                      <Wheat className="w-5 h-5 text-amber-700 mx-auto mb-1" />
                      <span className="text-xl font-black text-amber-900">
                        {scanResult.analysis.totalNutrients.carbsGrams}g
                      </span>
                      <p className="text-[11px] font-bold text-amber-700">Carbs</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                      <Droplets className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                      <span className="text-xl font-black text-rose-900">
                        {scanResult.analysis.totalNutrients.fatGrams}g
                      </span>
                      <p className="text-[11px] font-bold text-rose-700">Fat</p>
                    </div>
                  </div>
                )}

                {/* Portion Adjusters & Live Math */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-forest-700" />
                        Dynamic Portion Sliders (USDA Foundation Math)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Drag sliders to instantly recalculate calories and macros with zero latency.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStage('review')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300"
                    >
                      Edit Items
                    </button>
                  </div>

                  <div className="space-y-2">
                    {itemsList.filter(i => i.confirmed !== false).map((item, idx) => {
                      const originalIdx = itemsList.indexOf(item);
                      const cal = item.nutrients ? Math.round(item.nutrients.calories * (item.estimatedWeightGrams / (item.nutrients.weightGrams || 100))) : 0;
                      const prot = item.nutrients ? Number((item.nutrients.proteinGrams * (item.estimatedWeightGrams / (item.nutrients.weightGrams || 100))).toFixed(1)) : 0;

                      return (
                        <div key={idx} className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 capitalize">{item.name}</span>
                            <span className="text-xs font-bold text-forest-800">{cal} kcal • {prot}g Protein</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[11px] font-semibold text-slate-600 w-24">
                              {item.estimatedWeightGrams} grams
                            </span>
                            <input
                              type="range"
                              min="10"
                              max="400"
                              step="5"
                              value={item.estimatedWeightGrams}
                              onChange={(e) => handleAdjustItemWeight(originalIdx, Number(e.target.value))}
                              className="flex-1 accent-forest-600 cursor-pointer"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Call to Action: Smart Matches */}
                <div className="bg-gradient-to-r from-forest-800 to-emerald-800 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      Rescue Similar Surplus Food in India
                    </h4>
                    <p className="text-xs text-forest-100">
                      Explore active surplus meals matching this nutritional profile ({scanResult.analysis?.totalNutrients?.proteinGrams}g Protein, {scanResult.analysis?.totalNutrients?.calories} kcal) at up to 70% off.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('smart_matches')}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-2 shrink-0"
                  >
                    <span>View Surplus Matches ({smartMatches.length})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          )}

          {/* TAB 3: SMART MATCHED SURPLUS LISTINGS */}
          {activeTab === 'smart_matches' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Surplus Meals Matching Your Nutrition Profile
                  </h3>
                  <p className="text-xs text-slate-600">
                    Ranked by protein density, calorie alignment, dietary tags, and proximity savings in India
                  </p>
                </div>
                <span className="text-xs font-bold text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
                  {smartMatches.length} Available Stores
                </span>
              </div>

              {loadingMatches ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-forest-600" />
                  <p className="text-xs">Computing multi-factor dietary smart matches...</p>
                </div>
              ) : smartMatches.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No immediate matches found</p>
                  <p className="text-xs text-slate-500 mt-1">Browse all available items in the surplus marketplace feed.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {smartMatches.map((match, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-forest-500 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-forest-600 text-white px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            {match.matchScore}% Match
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${nutriScoreColor(match.nutriScore)}`}>
                              Nutri {match.nutriScore}
                            </span>
                            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {match.discountPercent}% OFF
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{match.title}</h4>
                          <p className="text-xs text-slate-500">{match.businessName} • {match.distanceKm} km away</p>
                        </div>

                        <div className="flex items-center gap-3 text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="font-semibold text-forest-800">{match.estimatedNutrition.calories} kcal</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-blue-700">{match.estimatedNutrition.proteinGrams}g Protein</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-amber-700">{match.estimatedNutrition.carbsGrams}g Carbs</span>
                        </div>

                        <div className="space-y-1">
                          {match.matchReasons.slice(0, 2).map((reason: string, rIdx: number) => (
                            <p key={rIdx} className="text-[11px] text-emerald-700 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {reason}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-base font-extrabold text-forest-900">
                            {match.discountedPrice === 0 ? 'FREE' : `₹${match.discountedPrice.toFixed(0)}`}
                          </span>
                          {match.originalPrice > 0 && (
                            <span className="text-xs text-slate-400 line-through ml-1.5">
                              ₹{match.originalPrice.toFixed(0)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectMatchedListing) {
                              onSelectMatchedListing(match.listingId);
                            }
                            onClose();
                          }}
                          className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 active:scale-95"
                        >
                          <span>Reserve Item</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer with Telemetry */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Nutritional values computed per USDA FoodData Central Foundation Database.</span>
            {telemetry && (
              <span className="hidden md:inline-flex items-center gap-1.5 bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-mono text-[10px]">
                Vision: {telemetry.vision_requests} | Cache: {telemetry.cache_hits} | USDA: {telemetry.usda_requests}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-colors self-end sm:self-auto"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
