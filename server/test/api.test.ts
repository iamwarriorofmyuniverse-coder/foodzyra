process.env.NODE_ENV = 'test';
import { startServer } from '../server';
import { db } from '../db/database';

async function runTests() {
  console.log('🧪 =================================================');
  console.log('🧪 RUNNING COMPREHENSIVE FOODLOOP BACKEND TEST SUITE');
  console.log('🧪 =================================================\n');

  const TEST_PORT = 5099;
  const server = await startServer(TEST_PORT);
  const baseUrl = `http://127.0.0.1:${TEST_PORT}/api`;
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    await test('GET /api/health should return online status', async () => {
      const res = await fetch(`${baseUrl}/health`);
      const data = await res.json();
      if (!res.ok || data.status !== 'online') throw new Error(`Status: ${data.status}`);
    });

    // 2. Auth: Login
    let customerToken = '';
    let businessToken = '';
    let ngoToken = '';
    let adminToken = '';

    await test('POST /api/auth/login should authenticate Customer', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'sarah@foodloop.org', password: 'Password123!' })
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.error || 'No token');
      customerToken = data.token;
    });

    await test('POST /api/auth/login should authenticate Business', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bakery@foodloop.org', password: 'Password123!' })
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.error || 'No token');
      businessToken = data.token;
    });

    await test('POST /api/auth/login should authenticate NGO', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'contact@cityrelief.org', password: 'Password123!' })
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.error || 'No token');
      ngoToken = data.token;
    });

    await test('POST /api/auth/login should authenticate Admin', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@foodloop.org', password: 'Password123!' })
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.error || 'No token');
      adminToken = data.token;
    });

    // 3. Auth: Get Current Profile
    await test('GET /api/auth/me should return authenticated profile with impact metrics', async () => {
      const res = await fetch(`${baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      const data = await res.json();
      if (!res.ok || data.user.email !== 'sarah@foodloop.org') throw new Error('User profile mismatch');
    });

    // 4. Food Listings: Browse & Filter
    let testListingId = '';

    await test('GET /api/listings should retrieve active marketplace listings', async () => {
      const res = await fetch(`${baseUrl}/listings`);
      const data = await res.json();
      if (!res.ok || data.listings.length === 0) throw new Error('No listings returned');
      testListingId = data.listings[0].id;
    });

    await test('GET /api/listings?category=Bakery should filter by category', async () => {
      const res = await fetch(`${baseUrl}/listings?category=Bakery`);
      const data = await res.json();
      if (!res.ok || data.listings.some((l: any) => l.category !== 'Bakery')) throw new Error('Filter failed');
    });

    // 5. Food Listings: Create New Surplus Listing
    let createdListingId = '';
    await test('POST /api/listings should allow Business to publish surplus food', async () => {
      const res = await fetch(`${baseUrl}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${businessToken}`
        },
        body: JSON.stringify({
          title: 'Evening Fresh Bagels Box',
          description: 'Assorted plain, sesame, and poppy seed bagels fresh from today.',
          category: 'Bakery',
          listingType: 'sale',
          originalPrice: 14.00,
          discountedPrice: 4.50,
          quantity: 5,
          quantityUnit: 'boxes',
          weightKgEstimate: 1.5,
          images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600'],
          dietaryTags: ['Vegetarian'],
          allergens: ['Gluten', 'Sesame'],
          pickupDate: 'Today',
          pickupStartTime: '19:00',
          pickupEndTime: '20:30',
          expiryInfo: 'Best consumed within 48 hours.'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.listingId) throw new Error(data.error || 'Failed to create listing');
      createdListingId = data.listingId;
    });

    // 6. Food Listings: Status Management
    await test('PATCH /api/listings/:id/status should update status to AVAILABLE', async () => {
      const res = await fetch(`${baseUrl}/listings/${createdListingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${businessToken}`
        },
        body: JSON.stringify({ status: 'AVAILABLE' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    });

    // 7. Reservations: Reserve Surplus Food
    let pickupCodeToVerify = '';
    let createdReservationId = '';
    await test('POST /api/reservations should allow Customer to reserve surplus food & issue 6-digit pickup token', async () => {
      const res = await fetch(`${baseUrl}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          listingId: createdListingId,
          quantity: 2,
          notes: 'Will arrive at 19:15'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.reservation.pickupCode) throw new Error(data.error || 'No pickup code');
      pickupCodeToVerify = data.reservation.pickupCode;
      createdReservationId = data.reservation.id;
    });

    // 7b. Prevent Duplicate Pending Reservation
    await test('POST /api/reservations should prevent duplicate active reservation for same listing by same customer', async () => {
      const res = await fetch(`${baseUrl}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          listingId: createdListingId,
          quantity: 1
        })
      });
      const data = await res.json();
      if (res.ok) throw new Error('Expected duplicate reservation to fail');
      if (!data.error.includes('active pending reservation')) throw new Error(`Unexpected error: ${data.error}`);
    });

    // 7c. Prevent Overbooking
    await test('POST /api/reservations should prevent overbooking when requested quantity exceeds stock', async () => {
      const res = await fetch(`${baseUrl}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          listingId: createdListingId,
          quantity: 999 // Exceeds available stock
        })
      });
      const data = await res.json();
      if (res.ok) throw new Error('Expected overbooking to be rejected');
      if (!data.error.includes('Overbooking prevented')) throw new Error(`Unexpected error: ${data.error}`);
    });

    // 7d. Prevent Reserving Expired Listing
    await test('POST /api/reservations should reject reservation when listing pickup window has passed', async () => {
      // Create an expired listing
      db.prepare(`
        INSERT OR REPLACE INTO food_listings (id, business_id, title, description, category, listing_type, original_price, discounted_price, quantity, quantity_unit, pickup_date, pickup_start_time, pickup_end_time, expiry_info, status)
        VALUES ('expired-list-1', 'biz-1', 'Yesterday Bread', 'Surplus bread from yesterday', 'Bakery', 'sale', 10.0, 3.0, 5, 'bags', '2020-01-01', '10:00', '11:00', 'Best before yesterday', 'AVAILABLE')
      `).run();

      const res = await fetch(`${baseUrl}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          listingId: 'expired-list-1',
          quantity: 1
        })
      });
      const data = await res.json();
      if (res.ok) throw new Error('Expected expired listing reservation to fail');
      if (!data.error.includes('expired')) throw new Error(`Unexpected error: ${data.error}`);
    });

    // 8. Reservations: List Active
    await test('GET /api/reservations should return Customer reservation list', async () => {
      const res = await fetch(`${baseUrl}/reservations`, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      const data = await res.json();
      if (!res.ok || data.reservations.length === 0) throw new Error('No reservations found');
    });

    // 9. Pickups: Verify Pickup Code & Hand-off
    await test('POST /api/pickups/verify should verify 6-digit pickup code and record environmental impact', async () => {
      const res = await fetch(`${baseUrl}/pickups/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${businessToken}`
        },
        body: JSON.stringify({ pickupCode: pickupCodeToVerify })
      });
      const data = await res.json();
      if (!res.ok || !data.impact) throw new Error(data.error || 'Verification failed');
    });

    // 9b. Cancellation and Stock Rollback
    await test('POST /api/reservations/:id/cancel should cancel reservation and restore stock', async () => {
      const cancelListingId = 'cancel-test-list';
      db.prepare("DELETE FROM reservations WHERE listing_id = ?").run(cancelListingId);
      db.prepare(`
        INSERT OR REPLACE INTO food_listings (id, business_id, title, description, category, listing_type, original_price, discounted_price, quantity, quantity_unit, pickup_date, pickup_start_time, pickup_end_time, expiry_info, status)
        VALUES (?, 'biz-1', 'Artisan Croissants', 'Fresh butter croissants', 'Bakery', 'sale', 12.0, 4.0, 10, 'pieces', '2030-01-01', '18:00', '20:00', 'Best before tomorrow morning', 'AVAILABLE')
      `).run(cancelListingId);

      const reserveRes = await fetch(`${baseUrl}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({ listingId: cancelListingId, quantity: 3 })
      });
      const reserveData = await reserveRes.json();
      if (!reserveRes.ok) throw new Error(reserveData.error);

      // Check stock decremented to 7
      let listingRow = db.prepare('SELECT quantity FROM food_listings WHERE id = ?').get(cancelListingId) as any;
      if (listingRow.quantity !== 7) throw new Error(`Expected quantity 7 after reserve, got ${listingRow.quantity}`);

      // Cancel reservation
      const cancelRes = await fetch(`${baseUrl}/reservations/${reserveData.reservation.id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      const cancelData = await cancelRes.json();
      if (!cancelRes.ok) throw new Error(cancelData.error);

      // Verify stock restored to 10
      listingRow = db.prepare('SELECT quantity, status FROM food_listings WHERE id = ?').get(cancelListingId) as any;
      if (listingRow.quantity !== 10) throw new Error(`Expected quantity 10 after cancel, got ${listingRow.quantity}`);
      if (listingRow.status !== 'AVAILABLE') throw new Error(`Expected status AVAILABLE, got ${listingRow.status}`);
    });

    // 10. NGOs: Claim Donation
    let donationPickupCode = '';
    await test('POST /api/donations should allow NGO to claim bulk donation', async () => {
      db.prepare("UPDATE food_listings SET status = 'AVAILABLE' WHERE id = 'list-3'").run();
      const res = await fetch(`${baseUrl}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ngoToken}`
        },
        body: JSON.stringify({
          listingId: 'list-3', // Produce Crate Donation
          estimatedPeopleFed: 50
        })
      });
      const data = await res.json();
      if (!res.ok || !data.donation.pickupCode) throw new Error(data.error || 'Claim failed');
      donationPickupCode = data.donation.pickupCode;
    });

    // 11. Admin: Platform Statistics
    await test('GET /api/admin/stats should return aggregate platform waste reduction metrics', async () => {
      const res = await fetch(`${baseUrl}/admin/stats`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (!res.ok || !data.stats.totalMealsRescued) throw new Error('Failed to fetch admin stats');
    });

    // 12. Reporting
    await test('POST /api/listings/:id/report should create moderation report', async () => {
      const res = await fetch(`${baseUrl}/listings/${testListingId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          reason: 'Inaccurate pickup window',
          details: 'Store was closing 15 minutes early.'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    });

    // 13. AI: Food Listing Description Generator
    await test('POST /api/ai/describe-food should generate appetizing food description', async () => {
      const res = await fetch(`${baseUrl}/ai/describe-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Artisan Sourdough Loaf & Baguette Bundle',
          category: 'Bakery',
          quantity: 3,
          dietaryTags: ['Vegetarian']
        })
      });
      const data = await res.json();
      if (!res.ok || !data.description || !data.disclaimer) throw new Error(data.error || 'No description');
    });

    // 14. AI: Auto-Suggest Food Category
    await test('POST /api/ai/suggest-category should classify food into valid category', async () => {
      const res = await fetch(`${baseUrl}/ai/suggest-category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Organic Honeycrisp Apples & Berries Box'
        })
      });
      const data = await res.json();
      if (!res.ok || data.category !== 'Fresh Produce') throw new Error(`Expected Fresh Produce, got ${data.category}`);
    });

    // 15. AI: Surplus Demand Prediction
    await test('POST /api/ai/predict-demand should predict demand velocity and sellout rate', async () => {
      const res = await fetch(`${baseUrl}/ai/predict-demand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Bakery',
          quantity: 4
        })
      });
      const data = await res.json();
      if (!res.ok || !data.prediction.demandLevel || !data.prediction.estimatedSellThroughPercent) throw new Error('Prediction failed');
    });

    // 16. AI: Smart Discount Pricing Suggestion
    await test('POST /api/ai/suggest-pricing should calculate optimal markdown price', async () => {
      const res = await fetch(`${baseUrl}/ai/suggest-pricing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrice: 20.0,
          category: 'Bakery',
          hoursUntilClosing: 2
        })
      });
      const data = await res.json();
      if (!res.ok || !data.suggestion.suggestedDiscountedPrice) throw new Error('Pricing suggestion failed');
    });

    // 17. AI: Sale vs. Donation Recommendation
    await test('POST /api/ai/sale-or-donation should advise whether food should be sold or donated', async () => {
      const res = await fetch(`${baseUrl}/ai/sale-or-donation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: 25, // Large bulk batch
          originalPrice: 4.0,
          hoursUntilClosing: 1, // Tight window
          category: 'Fresh Produce'
        })
      });
      const data = await res.json();
      if (!res.ok || data.recommendation.recommendation !== 'donation') throw new Error(`Expected donation recommendation, got ${data.recommendation?.recommendation}`);
    });

    // 18. AI: Business Waste Analytics
    await test('GET /api/ai/business-waste-insights should return waste metrics and actionable tips', async () => {
      const res = await fetch(`${baseUrl}/ai/business-waste-insights`, {
        headers: { Authorization: `Bearer ${businessToken}` }
      });
      const data = await res.json();
      if (!res.ok || !data.analytics.actionableTips || data.analytics.actionableTips.length === 0) throw new Error('Waste insights failed');
    });

    // 19. AI: Customer Personalized Recommendations
    await test('GET /api/ai/customer-recommendations should return personalized food matches', async () => {
      const res = await fetch(`${baseUrl}/ai/customer-recommendations`, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.recommendations)) throw new Error('Customer recommendations failed');
    });

    // 20. Security Audit: Hardening Headers
    await test('Security Headers: Should respond with nosniff, frame-options, and strict transport headers', async () => {
      const res = await fetch(`${baseUrl}/health`);
      if (res.headers.get('x-content-type-options') !== 'nosniff') throw new Error('Missing X-Content-Type-Options');
      if (res.headers.get('x-frame-options') !== 'DENY') throw new Error('Missing X-Frame-Options');
      if (!res.headers.get('content-security-policy')) throw new Error('Missing Content-Security-Policy');
    });

    // 21. Security Audit: IDOR Listing Protection
    await test('IDOR Check: Unauthorized business cannot modify status of another merchant listing', async () => {
      // Create a second business user with unique email
      const uniqueBizEmail = `competitor_${Date.now()}@foodloop.org`;
      const registerRes = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Competitor Cafe',
          email: uniqueBizEmail,
          password: 'Password123!',
          role: 'business',
          businessName: 'Competitor Cafe'
        })
      });
      const regData = await registerRes.json();
      const competitorToken = regData.token;

      // Attempt to cancel/alter testListingId belonging to Bakery
      const patchRes = await fetch(`${baseUrl}/listings/${testListingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${competitorToken}`
        },
        body: JSON.stringify({ status: 'CANCELLED' })
      });

      if (patchRes.status !== 403) {
        throw new Error(`Expected 403 Forbidden for IDOR listing update, got ${patchRes.status}`);
      }
    });

    // 22. Security Audit: IDOR Reservation Cancellation Protection
    await test('IDOR Check: User cannot cancel another customer reservation', async () => {
      // Create a dedicated active listing & reservation for Sarah
      const idorListingId = `idor-list-${Date.now()}`;
      db.prepare(`
        INSERT INTO food_listings (id, business_id, title, description, category, listing_type, original_price, discounted_price, quantity, quantity_unit, pickup_date, pickup_start_time, pickup_end_time, expiry_info, status, images_json, dietary_tags_json, allergens_json)
        VALUES (?, 'biz-1', 'IDOR Protected Bag', 'Fresh bagels', 'Bakery', 'sale', 10.0, 3.5, 5, 'bags', '2030-01-01', '18:00', '20:00', 'Tomorrow', 'AVAILABLE', '[]', '[]', '[]')
      `).run(idorListingId);

      const sarahRes = await fetch(`${baseUrl}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({ listingId: idorListingId, quantity: 1 })
      });
      const sarahData = await sarahRes.json();
      if (!sarahRes.ok || !sarahData.reservation) {
        throw new Error(sarahData.error || 'Failed to create Sarah reservation');
      }
      const sarahReservationId = sarahData.reservation.id;

      // Register a second customer with unique email (Intruder Bob)
      const uniqueCustEmail = `bob_${Date.now()}@foodloop.org`;
      const custRes = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Intruder Bob',
          email: uniqueCustEmail,
          password: 'Password123!',
          role: 'customer'
        })
      });
      const custData = await custRes.json();
      const intruderToken = custData.token;

      // Intruder Bob attempts to cancel Sarah's reservation
      const cancelRes = await fetch(`${baseUrl}/reservations/${sarahReservationId}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${intruderToken}` }
      });

      if (cancelRes.status !== 403) {
        throw new Error(`Expected 403 Forbidden for IDOR reservation cancellation, got ${cancelRes.status}`);
      }
    });

    // 23. Security Audit: Unauthorized Pickup Token Verification
    await test('Pickup Auth: Random user cannot verify a pickup code', async () => {
      // Intruder Bob attempts to verify a pickup code
      const verifyRes = await fetch(`${baseUrl}/pickups/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({ pickupCode: 'FL-9999' })
      });

      // Should be rejected (either 400 for not matching or 403 for unauthorized)
      if (verifyRes.ok) {
        throw new Error('Unauthorized user was able to verify pickup code');
      }
    });

    // 24. AI Vision: Food Detection & USDA Nutrition Calculation
    await test('POST /api/ai/detect-food should detect food components & return USDA plate nutrition', async () => {
      const sampleImageBase64 = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const res = await fetch(`${baseUrl}/ai/detect-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: sampleImageBase64,
          mimeType: 'image/jpeg',
          hint: 'Mediterranean Protein Mezze Bowl'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.image_hash) {
        throw new Error('Food detection failed: missing response or image_hash');
      }
      if (data.is_food === true && data.analysis) {
        if (!Array.isArray(data.analysis.detectedItems) || !data.analysis.totalNutrients?.calories || !data.analysis.nutriScore) {
          throw new Error('Missing total calories or Nutri-Score in plate analysis');
        }
      } else if (data.error === 'AI_UNAVAILABLE') {
        // Honest AI unavailable mode verified
        if (data.items.length !== 0) throw new Error('AI_UNAVAILABLE must not fabricate fake items');
      }
    });

    // 25. Nutrition Intelligence: Direct USDA FoodData Central Lookup
    await test('POST /api/ai/nutrition-lookup should return verified USDA macros for 150g chicken breast', async () => {
      const res = await fetch(`${baseUrl}/ai/nutrition-lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: 'chicken breast',
          weightGrams: 150
        })
      });
      const data = await res.json();
      if (!res.ok || !data.calculatedNutrients) {
        throw new Error('Nutrition lookup failed');
      }
      // 150g chicken breast = 1.5 * 31.0g = 46.5g protein, ~248 kcal
      if (data.calculatedNutrients.proteinGrams < 40 || data.calculatedNutrients.calories < 200) {
        throw new Error(`Unexpected nutrient calculations: ${JSON.stringify(data.calculatedNutrients)}`);
      }
    });

    // 26. Smart Matching: Dietary & Macro Listing Ranking
    await test('POST /api/ai/smart-match-listings should match and rank surplus listings by protein/calorie criteria', async () => {
      const res = await fetch(`${baseUrl}/ai/smart-match-listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minProteinGrams: 20,
          maxCalories: 800,
          dietaryPreferences: ['High Protein']
        })
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.matches)) {
        throw new Error('Smart match failed');
      }
      if (data.matches.length > 0 && typeof data.matches[0].matchScore !== 'number') {
        throw new Error('Match score missing on ranked listing');
      }
    });

    // 27. AI Continuous Learning: Teach Plate & Retrieve Learned Plates
    await test('POST /api/ai/teach-plate & GET /api/ai/learned-plates should learn plate ingredients and recall them', async () => {
      const teachPayload = {
        mealName: 'Mediterranean Protein Mezze Bowl',
        mealType: 'Lunch',
        foodDescription: 'Hummus, falafel, cucumber slices, kalamata olives, and grilled pita',
        detectedItems: [
          { name: 'Hummus Dip', estimatedWeightGrams: 80, confidence: 0.95 },
          { name: 'Falafel Bites', estimatedWeightGrams: 100, confidence: 0.92 },
          { name: 'Cucumber Slices', estimatedWeightGrams: 50, confidence: 0.98 }
        ]
      };

      const teachRes = await fetch(`${baseUrl}/ai/teach-plate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teachPayload)
      });
      const text = await teachRes.text();
      let teachData: any;
      try {
        teachData = JSON.parse(text);
      } catch (e) {
        throw new Error(`Status ${teachRes.status}: ${text}`);
      }
      if (!teachRes.ok || !teachData.success || !teachData.plate) {
        throw new Error(`Teach plate failed: ${teachData.error || text}`);
      }

      const getRes = await fetch(`${baseUrl}/ai/learned-plates`);
      const getData = await getRes.json();
      if (!getRes.ok || !Array.isArray(getData.learnedPlates)) {
        throw new Error('Get learned plates failed');
      }

      const learned = getData.learnedPlates.find((p: any) => p.meal_name === 'Mediterranean Protein Mezze Bowl');
      if (!learned) {
        throw new Error('Saved plate not found in learned plates list');
      }
      if (learned.detected_items.length !== 3) {
        throw new Error(`Expected 3 detected items, got ${learned.detected_items.length}`);
      }
    });

    // 28. Phase 16 Test 8: Same image scanned twice (SHA-256 Cache Hit)
    await test('Test 8 — Duplicate image scan uses SHA-256 cache (First: AI Request, Second: CACHE HIT)', async () => {
      const testImageBase64 = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      
      // First scan (using learned plate to guarantee successful first scan and cache entry)
      const res1 = await fetch(`${baseUrl}/ai/detect-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: testImageBase64, mimeType: 'image/jpeg', hint: 'Mediterranean Protein Mezze Bowl' })
      });
      const data1 = await res1.json();
      if (!data1.image_hash) throw new Error('First scan failed to generate image_hash');

      // Second scan (same image hash)
      const res2 = await fetch(`${baseUrl}/ai/detect-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: testImageBase64, mimeType: 'image/jpeg' })
      });
      const data2 = await res2.json();
      if (data2.cached !== true) {
        throw new Error(`Expected cached: true on duplicate image scan, got cached=${data2.cached}`);
      }
    });

    // 29. Phase 16 Test 1 & 7: Clear single food & Confidence classification
    await test('Test 1 & 7 — Single Food & Confidence Tiering (>=0.75 Confirmed, 0.50-0.74 Possible)', async () => {
      const res = await fetch(`${baseUrl}/ai/usda-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: 'white rice',
          portionGrams: 150,
          visionConfidence: 0.95
        })
      });
      const data = await res.json();
      if (!res.ok || !data.match) throw new Error('USDA match failed');
      const m = data.match;
      if (m.visionFoodName !== 'white rice' || !m.usdaFoodName || !m.usdaFdcId || m.visionConfidence !== 0.95) {
        throw new Error(`Incomplete USDA audit trail: ${JSON.stringify(m)}`);
      }
      if (m.portionGrams !== 150 || !m.nutrients || m.nutrients.calories <= 0) {
        throw new Error(`Invalid calculated nutrients: ${JSON.stringify(m.nutrients)}`);
      }

      // Ambiguous / possible confidence test (0.65 -> possible)
      const resPossible = await fetch(`${baseUrl}/ai/usda-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: 'yellow curry',
          portionGrams: 100,
          visionConfidence: 0.65
        })
      });
      const dataPossible = await resPossible.json();
      if (!resPossible.ok || dataPossible.match.visionConfidence !== 0.65) {
        throw new Error('Failed to preserve possible confidence score');
      }
    });

    // 30. Phase 16 Test 2 & 3: Mixed meal & Multiple food items pure calculation
    await test('Test 2 & 3 — Mixed Meal & Multiple items calculation via pure application math', async () => {
      const res = await fetch(`${baseUrl}/ai/calculate-plate-nutrition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealName: 'Chicken, Rice & Broccoli Plate',
          items: [
            { name: 'chicken breast', portionGrams: 150, visionConfidence: 0.98, confirmed: true },
            { name: 'brown rice', portionGrams: 150, visionConfidence: 0.95, confirmed: true },
            { name: 'broccoli', portionGrams: 100, visionConfidence: 0.92, confirmed: true }
          ]
        })
      });
      const data = await res.json();
      if (!res.ok || !data.plate) throw new Error('Plate calculation failed');
      const plate = data.plate;
      if (plate.totalWeightGrams !== 400 || plate.totalNutrients.calories < 400) {
        throw new Error(`Calculated calories mismatch: ${plate.totalNutrients.calories}`);
      }
      if (!plate.nutriScore || !['A', 'B', 'C', 'D', 'E'].includes(plate.nutriScore)) {
        throw new Error(`Invalid Nutri-Score: ${plate.nutriScore}`);
      }
    });

    // 31. Phase 16 Test 4 & 5: Non-food & Portrait Rejection
    await test('Test 4 & 5 — Non-food and Portrait rejection (is_food: false)', async () => {
      const res = await fetch(`${baseUrl}/ai/detect-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
          hint: 'portrait selfie person face non-food vehicle'
        })
      });
      const data = await res.json();
      if (data.isFood !== false || data.is_food !== false) {
        throw new Error(`Expected isFood: false for non-food image, got isFood=${data.isFood}`);
      }
    });

    // 32. Phase 16 Test 9: Simulated API failure / offline mode (NO fabricated demo data)
    await test('Test 9 — API failure / offline returns honest AI_UNAVAILABLE without fake demo food', async () => {
      // Simulate detection when AI is not answering
      const res = await fetch(`${baseUrl}/ai/detect-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
          hint: 'unrecognized_dish_xyz'
        })
      });
      const data = await res.json();
      // Must not invent pasta or cherry tomatoes
      if (data.error === 'AI_UNAVAILABLE') {
        if (data.items && data.items.length > 0) {
          throw new Error('AI_UNAVAILABLE error must not return fabricated food items');
        }
      }
    });

    // 33. Phase 16 Test 10: Invalid or truncated AI response rejection
    await test('Test 10 — Invalid or truncated AI response returns SCAN_FAILED with 0 USDA calls', async () => {
      // Verify calculate-plate-nutrition rejects empty items array
      const res = await fetch(`${baseUrl}/ai/calculate-plate-nutrition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: []
        })
      });
      if (res.status !== 400) {
        throw new Error(`Expected 400 Bad Request on empty items calculation, got ${res.status}`);
      }
    });

    // 35. Fast Food Matrix: Verify USDA Matcher & Nutrition for Fast Foods & Common Staples
    await test('Fast Food Matrix: Pizza, Burger, Fries, Fried Chicken, Shawarma, Samosa, Momos, Noodles', async () => {
      const fastFoodTestList = [
        { query: 'pizza', expectedNameContains: 'Pizza', minCal: 200, maxCal: 350 },
        { query: 'burger', expectedNameContains: 'Burger', minCal: 200, maxCal: 350 },
        { query: 'french fries', expectedNameContains: 'Fries', minCal: 250, maxCal: 380 },
        { query: 'fried chicken', expectedNameContains: 'Chicken', minCal: 200, maxCal: 320 },
        { query: 'chicken nuggets', expectedNameContains: 'Nuggets', minCal: 240, maxCal: 360 },
        { query: 'taco', expectedNameContains: 'Taco', minCal: 180, maxCal: 300 },
        { query: 'shawarma', expectedNameContains: 'Shawarma', minCal: 180, maxCal: 300 },
        { query: 'samosa', expectedNameContains: 'Samosa', minCal: 200, maxCal: 320 },
        { query: 'momos', expectedNameContains: 'Momos', minCal: 140, maxCal: 250 },
        { query: 'noodles', expectedNameContains: 'Noodles', minCal: 100, maxCal: 220 },
        { query: 'fried rice', expectedNameContains: 'Rice', minCal: 120, maxCal: 240 },
        { query: 'donut', expectedNameContains: 'Donut', minCal: 350, maxCal: 550 },
        { query: 'roti', expectedNameContains: 'Roti', minCal: 240, maxCal: 360 },
        { query: 'idli', expectedNameContains: 'Idli', minCal: 90, maxCal: 180 },
        { query: 'dosa', expectedNameContains: 'Dosa', minCal: 120, maxCal: 220 }
      ];

      for (const item of fastFoodTestList) {
        const res = await fetch(`${baseUrl}/ai/usda-match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            foodName: item.query,
            portionGrams: 100,
            visionConfidence: 0.95
          })
        });
        const data = await res.json();
        if (!res.ok || !data.match) {
          throw new Error(`Failed to match fast food: ${item.query}`);
        }
        const m = data.match;
        if (!m.usdaFoodName.toLowerCase().includes(item.expectedNameContains.toLowerCase())) {
          throw new Error(`Expected USDA match to contain "${item.expectedNameContains}", got "${m.usdaFoodName}" for "${item.query}"`);
        }
        if (m.nutrients.calories < item.minCal || m.nutrients.calories > item.maxCal) {
          throw new Error(`Calories for 100g ${item.query} out of expected range: ${m.nutrients.calories} kcal`);
        }
      }
    });

    // 36. Fast Food Combo Plate: Burger + French Fries Application Math
    await test('Fast Food Combo Plate: Pure math calculation for Burger (150g) + French Fries (120g)', async () => {
      const res = await fetch(`${baseUrl}/ai/calculate-plate-nutrition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealName: 'Cheeseburger & Crispy Fries Combo',
          items: [
            { name: 'cheeseburger', portionGrams: 150, visionConfidence: 0.96, confirmed: true },
            { name: 'french fries', portionGrams: 120, visionConfidence: 0.94, confirmed: true }
          ]
        })
      });
      const data = await res.json();
      if (!res.ok || !data.plate) throw new Error('Combo calculation failed');
      const plate = data.plate;
      // 150g Cheeseburger (1.5*284 = 426 kcal) + 120g Fries (1.2*312 = 374 kcal) = ~800 kcal
      if (plate.totalWeightGrams !== 270 || plate.totalNutrients.calories < 700 || plate.totalNutrients.calories > 900) {
        throw new Error(`Unexpected combo plate calories: ${plate.totalNutrients.calories} kcal (weight: ${plate.totalWeightGrams}g)`);
      }
      if (plate.totalNutrients.proteinGrams < 20) {
        throw new Error(`Expected at least 20g protein in cheeseburger combo, got ${plate.totalNutrients.proteinGrams}g`);
      }
    });

  } finally {
    server.close();
  }

  console.log('\n🧪 =================================================');
  console.log(`🧪 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('🧪 =================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Execute tests
runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
