import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  Sparkles,
  HeartHandshake,
  Image as ImageIcon,
  Clock,
  MapPin,
  Leaf,
  DollarSign,
  AlertTriangle,
  Layers,
  Wand2,
  Camera,
  UploadCloud,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Info,
  ShieldCheck
} from 'lucide-react';
import { FoodCategory, ListingType, DietaryTag, FoodListing } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFoodLoop } from '../../context/FoodLoopContext';
import { useLocation } from '../../context/LocationContext';
import { ApiService } from '../../services/api';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: FoodCategory[] = [
  'Bakery',
  'Meals & Prepared',
  'Fresh Produce',
  'Groceries',
  'Dairy & Refrigerated',
  'Beverages',
  'Surprise Bag'
];

const DIETARY_OPTIONS: DietaryTag[] = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Kosher',
  'Dairy-Free',
  'Organic',
  'Nut-Free'
];

const FOOD_SAMPLE_PHOTOS = [
  { name: '🥖 Artisan Sourdough & Croissants', category: 'Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' },
  { name: '🍛 Hyderabadi Biryani Feast', category: 'Meals & Prepared', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80' },
  { name: '🥞 Steamed Idlis & Medu Vada', category: 'Meals & Prepared', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80' },
  { name: '🥦 Fresh Farm Produce Crate', category: 'Fresh Produce', url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80' },
  { name: '🧈 Bombay Pav Bhaji & Pav', category: 'Meals & Prepared', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' },
  { name: '🍫 Overload Fudge Brownies', category: 'Bakery', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80' },
  { name: '🥛 Fresh Paneer & A2 Dairy', category: 'Dairy & Refrigerated', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80' },
  { name: '🍬 Gulab Jamuns & Mithai', category: 'Surprise Bag', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80' },
  { name: '🍕 Wood-Fired Veggie Pizza', category: 'Meals & Prepared', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80' },
  { name: '🥟 Crispy Samosas & Savories', category: 'Bakery', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' }
];

const PRESETS = [
  {
    name: '🥖 Artisan Bakery Surprise Bag',
    category: 'Bakery' as FoodCategory,
    type: 'sale' as ListingType,
    title: 'Evening Artisan Sourdough & Pastry Surprise Bag',
    description: 'Fresh assortment of today’s sourdough loaves, buttery croissants, and morning pastries. Baked fresh this morning with organic stone-ground flour.',
    originalPrice: 399.00,
    discountedPrice: 149.00,
    quantity: 4,
    quantityUnit: 'bags',
    weightKg: 1.8,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    dietary: ['Vegetarian'] as DietaryTag[],
    allergens: ['Gluten', 'Dairy']
  },
  {
    name: '🍱 Chef Fresh Meal & Thali Box',
    category: 'Meals & Prepared' as FoodCategory,
    type: 'sale' as ListingType,
    title: 'Deluxe Fresh Prepared Meal Box & Rice Bowl',
    description: 'Freshly prepared meal combo with aromatic rice, dal/curry, roasted veggies, and fresh accompaniments from lunch service.',
    originalPrice: 349.00,
    discountedPrice: 129.00,
    quantity: 3,
    quantityUnit: 'boxes',
    weightKg: 1.4,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    dietary: ['Vegetarian'] as DietaryTag[],
    allergens: ['Dairy']
  },
  {
    name: '🥦 Bulk Fresh Produce Crate (Donation)',
    category: 'Fresh Produce' as FoodCategory,
    type: 'donation' as ListingType,
    title: 'Surplus Organic Veggies & Seasonal Fruits Crate',
    description: 'Crisp organic bell peppers, leafy greens, tomatoes, squash, and sweet apples ready for food bank soup kitchens or community shelters.',
    originalPrice: 850.00,
    discountedPrice: 0.00,
    quantity: 5,
    quantityUnit: 'crates (~12kg)',
    weightKg: 12.0,
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80',
    dietary: ['Vegan', 'Gluten-Free', 'Organic'] as DietaryTag[],
    allergens: []
  },
  {
    name: '🥟 Evening Snacks & Samosas Box',
    category: 'Bakery' as FoodCategory,
    type: 'sale' as ListingType,
    title: 'Crispy Samosas & Savory Evening Snacks Pack',
    description: 'Golden-crisp spiced potato samosas and assorted savories freshly fried for afternoon teatime.',
    originalPrice: 199.00,
    discountedPrice: 79.00,
    quantity: 5,
    quantityUnit: 'packs',
    weightKg: 1.0,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    dietary: ['Vegetarian', 'Vegan'] as DietaryTag[],
    allergens: ['Gluten']
  }
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { createFoodListing } = useFoodLoop();
  const { userLocation } = useLocation();

  const [type, setType] = useState<ListingType>('sale');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Bakery');
  
  // Photo states
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80');
  const [photoSourceMode, setPhotoSourceMode] = useState<'upload' | 'camera' | 'library' | 'url'>('upload');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Ref handles
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Pricing and food details
  const [originalPrice, setOriginalPrice] = useState<number>(299.00);
  const [discountedPrice, setDiscountedPrice] = useState<number>(99.00);
  const [quantity, setQuantity] = useState<number>(3);
  const [quantityUnit, setQuantityUnit] = useState<string>('bags');
  const [weightKgEstimate, setWeightKgEstimate] = useState<number>(1.5);
  const [pickupCity, setPickupCity] = useState<string>(userLocation.label.split(',')[0].trim() || 'Bengaluru');
  const [pickupAddress, setPickupAddress] = useState<string>(currentUser?.address || userLocation.address);
  const [date, setDate] = useState<string>('Today');
  const [startTime, setStartTime] = useState<string>('18:00');
  const [endTime, setEndTime] = useState<string>('20:00');
  const [expiryInfo, setExpiryInfo] = useState<string>('Best consumed within 24-48 hours or freeze immediately.');
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>(['Vegetarian']);
  const [allergensText, setAllergensText] = useState<string>('Gluten, Dairy');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // AI Demand & Recommendation States
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [isAutoCategorizing, setIsAutoCategorizing] = useState<boolean>(false);
  const [aiDemandInfo, setAiDemandInfo] = useState<{ demandLevel: string; sellThrough: number; rationale: string } | null>(null);
  const [saleOrDonationAdvice, setSaleOrDonationAdvice] = useState<{ recommendation: 'sale' | 'donation'; rationale: string } | null>(null);

  // --- CAMERA HANDLING (Defined before useEffect hooks) ---
  const stopCamera = React.useCallback(() => {
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
        throw new Error('Webcam not supported on this browser/environment.');
      }
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      setCameraError('Camera access not available or permission denied. Please upload a photo from your files or select a sample image.');
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
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setImageUrl(dataUrl);
      stopCamera();
      setAiNote('📸 Live photo captured and attached to listing!');
      setFormError(null);
    }
  };

  // --- FILE UPLOAD HANDLING ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Convert file to base64 Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
        setAiNote('📁 Food photo uploaded successfully from your device!');
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Re-sync on modal open
  useEffect(() => {
    if (isOpen) {
      setPickupCity(userLocation.label.split(',')[0].trim() || 'Bengaluru');
      setPickupAddress(currentUser?.address || userLocation.address);
      setFormError(null);
    } else {
      stopCamera();
    }
  }, [isOpen, currentUser, userLocation, stopCamera]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (!isOpen) return null;

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setType(preset.type);
    setTitle(preset.title);
    setDescription(preset.description);
    setCategory(preset.category);
    setOriginalPrice(preset.originalPrice);
    setDiscountedPrice(preset.discountedPrice);
    setQuantity(preset.quantity);
    setQuantityUnit(preset.quantityUnit);
    setWeightKgEstimate(preset.weightKg);
    setImageUrl(preset.image);
    setDietaryTags(preset.dietary);
    setAllergensText(preset.allergens.join(', '));
    setFormError(null);
    setAiNote(`✨ Loaded preset: ${preset.name}`);
  };

  // 1. AI Description Generator
  const handleGenerateAiDescription = async () => {
    if (!title) {
      setAiNote('Please enter a food title first to generate description.');
      return;
    }
    setIsAiGenerating(true);
    setAiNote(null);
    try {
      const res = await ApiService.describeFood({
        title,
        category,
        quantity: Number(quantity),
        quantityUnit,
        originalPrice: Number(originalPrice),
        discountedPrice: Number(discountedPrice),
        dietaryTags,
        notes: expiryInfo
      });
      setDescription(res.description);
      setAiNote('✨ Description generated! You can edit it freely before publishing.');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // 2. AI Auto-Categorize
  const handleAutoCategorize = async () => {
    if (!title) return;
    setIsAutoCategorizing(true);
    try {
      const res = await ApiService.suggestCategory(title, description);
      if (CATEGORIES.includes(res.category as FoodCategory)) {
        setCategory(res.category as FoodCategory);
        setAiNote(`✨ Category set to "${res.category}" (${Math.round(res.confidence * 100)}% match)`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAutoCategorizing(false);
    }
  };

  // 3. AI Smart Pricing & Sale vs Donation Advisor
  const handleSmartPricingAndAdvice = async () => {
    try {
      const pricing = await ApiService.suggestPricing(Number(originalPrice), category, 4);
      setDiscountedPrice(pricing.suggestedDiscountedPrice);

      const advice = await ApiService.recommendSaleOrDonation({
        quantity: Number(quantity),
        originalPrice: Number(originalPrice),
        hoursUntilClosing: 3,
        category
      });
      setSaleOrDonationAdvice({
        recommendation: advice.recommendation,
        rationale: advice.rationale
      });

      const demand = await ApiService.predictDemand({
        category,
        quantity: Number(quantity)
      });
      setAiDemandInfo({
        demandLevel: demand.demandLevel,
        sellThrough: demand.estimatedSellThroughPercent,
        rationale: demand.insights
      });
      
      setAiNote(`💡 Applied optimal ${pricing.suggestedDiscountPercent}% discount (₹${pricing.suggestedDiscountedPrice.toFixed(0)}).`);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleDietary = (tag: DietaryTag) => {
    setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!currentUser) {
      setFormError('Please ensure you are signed in or select a persona from the top menu.');
      return;
    }

    if (!imageUrl || imageUrl.trim() === '') {
      setFormError('📸 A clear photo of the food is required before publishing. Please upload a photo, take a picture, or select an image.');
      return;
    }

    if (!title.trim()) {
      setFormError('Food title / listing name is required.');
      return;
    }

    if (!description.trim()) {
      setFormError('Please provide a short description or list of contents.');
      return;
    }

    setIsSubmitting(true);
    try {
      const allergens = allergensText
        ? allergensText.split(',').map(a => a.trim()).filter(Boolean)
        : [];

      const targetCoords = userLocation.coordinates;

      await createFoodListing({
        businessId: currentUser.id,
        businessName: currentUser.businessName || currentUser.name,
        businessType: currentUser.businessType || (currentUser.role === 'customer' ? 'household' : 'other'),
        businessAddress: pickupAddress || currentUser.address || userLocation.address,
        businessRating: currentUser.role === 'business' ? 4.9 : 5.0,
        businessAvatar: currentUser.avatar,
        title: title.trim(),
        description: description.trim(),
        category,
        type,
        originalPrice: Number(originalPrice) || 0,
        discountedPrice: type === 'donation' ? 0 : Number(discountedPrice),
        quantity: Number(quantity) || 1,
        quantityUnit: quantityUnit || 'packs',
        images: [imageUrl],
        location: {
          address: pickupAddress || currentUser.address || userLocation.address,
          city: pickupCity || userLocation.label.split(',')[0].trim() || 'Bengaluru',
          lat: targetCoords.lat,
          lng: targetCoords.lng,
          distanceKm: 0.5
        },
        pickupWindow: {
          date,
          startTime,
          endTime
        },
        expiryInfo,
        dietaryTags,
        allergens,
        weightKgEstimate: Number(weightKgEstimate) || 1.0
      });
      stopCamera();
      onClose();
    } catch (err: any) {
      console.error('Error creating listing:', err);
      setFormError(err?.message || 'Could not publish listing. Please check form details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        
        {/* Header with Adaptive Role Badge */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-forest-600" />
                <span>
                  {currentUser?.role === 'business'
                    ? 'List Surplus Food (Merchant)'
                    : currentUser?.role === 'ngo'
                    ? 'Post Food Relief Batch (NGO)'
                    : 'Share Surplus Food (Community)'}
                </span>
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
                {currentUser?.role || 'user'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prevent edible food waste, feed the community, or recover value with verified photos
            </p>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          
          {/* Quick Presets Bar */}
          <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-100">
            <span className="text-xs font-bold text-forest-900 flex items-center gap-1.5 mb-2">
              <Wand2 className="w-3.5 h-3.5 text-forest-600" /> 1-Click Demo & Food Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => loadPreset(preset)}
                  className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white border border-forest-200 text-forest-800 hover:bg-forest-100/50 transition-colors shadow-2xs"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{formError}</div>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-rose-500 hover:text-rose-700 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* AI Helper Notification */}
          {aiNote && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between animate-in fade-in duration-200">
              <span className="font-semibold">{aiNote}</span>
              <button
                type="button"
                onClick={() => setAiNote(null)}
                className="text-slate-400 hover:text-slate-600 text-[11px] font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* 📸 MANDATORY PHOTO SECTION (Upload / Camera / Library / URL) */}
          {/* ============================================================ */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-forest-600" />
                <span>Food Photo</span>
                <span className="text-rose-600 font-extrabold">* (Required)</span>
              </label>
              {imageUrl && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3" /> Photo Attached
                </span>
              )}
            </div>

            {/* Photo Source Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => { stopCamera(); setPhotoSourceMode('upload'); }}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  photoSourceMode === 'upload' ? 'bg-white text-forest-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <button
                type="button"
                onClick={() => { setPhotoSourceMode('camera'); startCamera(); }}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  photoSourceMode === 'camera' ? 'bg-white text-forest-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Live Camera</span>
              </button>
              <button
                type="button"
                onClick={() => { stopCamera(); setPhotoSourceMode('library'); }}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  photoSourceMode === 'library' ? 'bg-white text-forest-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Samples</span>
              </button>
              <button
                type="button"
                onClick={() => { stopCamera(); setPhotoSourceMode('url'); }}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  photoSourceMode === 'url' ? 'bg-white text-forest-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                <span>URL</span>
              </button>
            </div>

            {/* Tab 1: Upload File */}
            {photoSourceMode === 'upload' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-forest-300 hover:border-forest-500 bg-white hover:bg-forest-50/40 rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-colors group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto rounded-2xl bg-forest-50 group-hover:bg-forest-100 text-forest-700 flex items-center justify-center mb-2 transition-colors">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Click to browse or drag & drop food photo
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
            )}

            {/* Tab 2: Live Camera */}
            {photoSourceMode === 'camera' && (
              <div className="bg-slate-900 rounded-2xl overflow-hidden p-3 text-white space-y-3">
                {cameraError ? (
                  <div className="p-4 text-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-xs text-amber-200">{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => setPhotoSourceMode('upload')}
                      className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold text-white"
                    >
                      Switch to File Upload
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative aspect-video rounded-xl bg-black overflow-hidden flex items-center justify-center">
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        LIVE CAMERA
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
                      >
                        Stop Camera
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab 3: Sample Food Library */}
            {photoSourceMode === 'library' && (
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-slate-500">Pick an authentic food photo from the library:</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                  {FOOD_SAMPLE_PHOTOS.map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setImageUrl(sample.url);
                        setAiNote(`📷 Selected photo: ${sample.name}`);
                        setFormError(null);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 text-left group transition-all ${
                        imageUrl === sample.url ? 'border-forest-600 ring-2 ring-forest-500/30' : 'border-slate-200 hover:border-forest-300'
                      }`}
                    >
                      <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[9px] font-bold text-white line-clamp-1 leading-tight">{sample.name}</span>
                      </div>
                      {imageUrl === sample.url && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-forest-600 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Direct URL */}
            {photoSourceMode === 'url' && (
              <div className="space-y-1">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            )}

            {/* Attached Photo Preview Container */}
            {imageUrl && (
              <div className="relative p-2.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img src={imageUrl} alt="Attached food preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-800 block truncate">Photo Ready</span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Image Attached
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Listing Type Switcher (Sale vs Donation) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Listing Objective
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('sale')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  type === 'sale'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Surplus Sale</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Discounted price to recover cost from diners</p>
              </button>

              <button
                type="button"
                onClick={() => setType('donation')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  type === 'donation'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Free NGO / Community Donation</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">100% Free (₹0) for food banks & shelters</p>
              </button>
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Food Title / Listing Name *</label>
                {title && (
                  <button
                    type="button"
                    onClick={handleAutoCategorize}
                    disabled={isAutoCategorizing}
                    className="text-[11px] font-bold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{isAutoCategorizing ? 'Categorizing...' : '✨ Auto-Categorize'}</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Evening Artisan Sourdough & Croissant Magic Bag"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500/30 bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Description & Contents *</label>
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={isAiGenerating || !title}
                className="text-[11px] font-bold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1 disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAiGenerating ? 'Writing with AI...' : '✨ AI Generate Description'}</span>
              </button>
            </div>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's in this surplus batch, freshness, and quality details..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
            />
          </div>

          {/* Pricing & Quantity Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Pricing & Quantity
              </label>
              <button
                type="button"
                onClick={handleSmartPricingAndAdvice}
                className="text-[11px] font-bold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                <span>💡 AI Smart Pricing & Advisor</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Retail Value (₹) *</label>
                <input
                  type="number"
                  step="10"
                  min="0"
                  required
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
                />
              </div>

              {type === 'sale' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Foodzyra Price (₹) *</label>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    required
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500/30 font-bold text-amber-600"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Unit Label</label>
                <input
                  type="text"
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  placeholder="bags / boxes / kg"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
                />
              </div>
            </div>

            {/* AI Advisor Card Preview */}
            {(saleOrDonationAdvice || aiDemandInfo) && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-forest-50 via-sprout-50/50 to-amber-50/40 border border-forest-200 text-xs space-y-2">
                {saleOrDonationAdvice && (
                  <div className="flex items-start gap-2">
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                      saleOrDonationAdvice.recommendation === 'donation' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {saleOrDonationAdvice.recommendation === 'donation' ? 'Recommend Donation' : 'Recommend Sale'}
                    </span>
                    <p className="text-slate-700 flex-1">{saleOrDonationAdvice.rationale}</p>
                  </div>
                )}
                {aiDemandInfo && (
                  <div className="text-slate-600 flex items-center gap-2 pt-1 border-t border-forest-200/50">
                    <span className="font-bold text-forest-900">Demand Forecast:</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-forest-200 font-extrabold text-forest-800">
                      {aiDemandInfo.demandLevel} Demand (~{aiDemandInfo.sellThrough}% sellout)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Logistics: Pickup Window */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-forest-600" /> Pickup Window & Freshness
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500">Day</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-500">Use-By / Expiry Details</label>
              <input
                type="text"
                value={expiryInfo}
                onChange={(e) => setExpiryInfo(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>

            {/* Pickup Location & City */}
            <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-forest-600" /> Pickup City & Neighborhood
                </label>
                <input
                  type="text"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500">Store / Pickup Address</label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. 100 Feet Road, Indiranagar"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Dietary & Allergens */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Dietary Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map(tag => {
                  const sel = dietaryTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleDietary(tag)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        sel ? 'bg-forest-600 text-white border-forest-600 font-semibold' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block">Allergens (Comma separated)</label>
              <input
                type="text"
                value={allergensText}
                onChange={(e) => setAllergensText(e.target.value)}
                placeholder="Gluten, Dairy, Peanuts, Tree Nuts, Eggs, Soy..."
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              {!imageUrl ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Photo required to publish
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All requirements met
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { stopCamera(); onClose(); }}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title || !imageUrl}
                className="px-6 py-2.5 text-xs font-bold text-white bg-forest-600 hover:bg-forest-700 rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2 transition-transform active:scale-95"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Publish Listing</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

