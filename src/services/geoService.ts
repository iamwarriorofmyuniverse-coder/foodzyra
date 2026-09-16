export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface PresetLocation {
  id: string;
  name: string;
  city?: string;
  address: string;
  coordinates: GeoCoordinates;
  landmark: string;
}

export const INDIAN_PRESET_LOCATIONS: PresetLocation[] = [
  // Bengaluru
  {
    id: 'blr-indiranagar',
    name: 'Indiranagar, Bengaluru',
    city: 'Bengaluru',
    address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    landmark: '100ft Road Metro & Dining Promenade'
  },
  {
    id: 'blr-koramangala',
    name: 'Koramangala, Bengaluru',
    city: 'Bengaluru',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    landmark: 'Koramangala 4th Block Food Strip'
  },
  {
    id: 'blr-hsr',
    name: 'HSR Layout, Bengaluru',
    city: 'Bengaluru',
    address: '27th Main Road, Sector 1, HSR Layout, Bengaluru, Karnataka 560102',
    coordinates: { lat: 12.9121, lng: 77.6446 },
    landmark: 'HSR Sector 1 Commercial Hub'
  },
  {
    id: 'blr-whitefield',
    name: 'Whitefield, Bengaluru',
    city: 'Bengaluru',
    address: 'ITPL Main Road, Whitefield, Bengaluru, Karnataka 560066',
    coordinates: { lat: 12.9698, lng: 77.7499 },
    landmark: 'ITPL & Phoenix Marketcity Zone'
  },
  {
    id: 'blr-mgroad',
    name: 'MG Road / CBD, Bengaluru',
    city: 'Bengaluru',
    address: 'MG Road & Brigade Rd Junction, Bengaluru, Karnataka 560001',
    coordinates: { lat: 12.9756, lng: 77.6066 },
    landmark: 'MG Road Central Metro & Church Street'
  },
  {
    id: 'blr-jayanagar',
    name: 'Jayanagar, Bengaluru',
    city: 'Bengaluru',
    address: '4th Block, Jayanagar, Bengaluru, Karnataka 560011',
    coordinates: { lat: 12.9308, lng: 77.5838 },
    landmark: 'Jayanagar Shopping Complex'
  },

  // Mumbai
  {
    id: 'mum-bandra',
    name: 'Bandra West, Mumbai',
    city: 'Mumbai',
    address: 'Hill Road & Linking Rd, Bandra West, Mumbai, Maharashtra 400050',
    coordinates: { lat: 19.0596, lng: 72.8295 },
    landmark: 'Hill Road Food & Shopping Hub'
  },
  {
    id: 'mum-andheri',
    name: 'Andheri West, Mumbai',
    city: 'Mumbai',
    address: 'Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053',
    coordinates: { lat: 19.1363, lng: 72.8277 },
    landmark: 'Lokhandwala Market Promenade'
  },
  {
    id: 'mum-powai',
    name: 'Powai, Mumbai',
    city: 'Mumbai',
    address: 'Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
    coordinates: { lat: 19.1176, lng: 72.9060 },
    landmark: 'Hiranandani Galleria & Lake'
  },
  {
    id: 'mum-bkc',
    name: 'BKC / Lower Parel, Mumbai',
    city: 'Mumbai',
    address: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    coordinates: { lat: 19.0600, lng: 72.8656 },
    landmark: 'BKC Financial District'
  },
  {
    id: 'mum-juhu',
    name: 'Juhu, Mumbai',
    city: 'Mumbai',
    address: 'Juhu Tara Road, Juhu, Mumbai, Maharashtra 400049',
    coordinates: { lat: 19.1075, lng: 72.8263 },
    landmark: 'Juhu Beach & Dining Strip'
  },
  {
    id: 'mum-colaba',
    name: 'Colaba / Fort, Mumbai',
    city: 'Mumbai',
    address: 'Colaba Causeway, Mumbai, Maharashtra 400001',
    coordinates: { lat: 18.9220, lng: 72.8347 },
    landmark: 'Colaba Causeway & Gateway of India'
  },

  // Delhi NCR
  {
    id: 'del-cp',
    name: 'Connaught Place, New Delhi',
    city: 'Delhi NCR',
    address: 'Connaught Place, Inner Circle, New Delhi, Delhi 110001',
    coordinates: { lat: 28.6315, lng: 77.2167 },
    landmark: 'Rajiv Chowk Metro Central'
  },
  {
    id: 'del-hkv',
    name: 'Hauz Khas, New Delhi',
    city: 'Delhi NCR',
    address: 'Hauz Khas Village, South Delhi, New Delhi 110016',
    coordinates: { lat: 28.5494, lng: 77.2001 },
    landmark: 'Hauz Khas Village & Lake'
  },
  {
    id: 'del-gurgaon',
    name: 'Cyber City, Gurugram',
    city: 'Delhi NCR',
    address: 'DLF Cyber City, Phase 2, Gurugram, Haryana 122002',
    coordinates: { lat: 28.4950, lng: 77.0895 },
    landmark: 'Cyber Hub Dining Walkway'
  },
  {
    id: 'del-noida',
    name: 'Sector 18, Noida',
    city: 'Delhi NCR',
    address: 'Sector 18 Market, Noida, Uttar Pradesh 201301',
    coordinates: { lat: 28.5708, lng: 77.3261 },
    landmark: 'Mall of India & Sector 18 Metro'
  },
  {
    id: 'del-saket',
    name: 'Saket, New Delhi',
    city: 'Delhi NCR',
    address: 'Select Citywalk, Saket District Centre, New Delhi 110017',
    coordinates: { lat: 28.5284, lng: 77.2190 },
    landmark: 'Select Citywalk & District Centre'
  },

  // Hyderabad
  {
    id: 'hyd-hitec',
    name: 'Hitec City, Hyderabad',
    city: 'Hyderabad',
    address: 'Madhapur, Hitec City, Hyderabad, Telangana 500081',
    coordinates: { lat: 17.4435, lng: 78.3772 },
    landmark: 'Cyber Towers & Madhapur Food Strip'
  },
  {
    id: 'hyd-jubilee',
    name: 'Jubilee Hills, Hyderabad',
    city: 'Hyderabad',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
    coordinates: { lat: 17.4319, lng: 78.4073 },
    landmark: 'Road No. 36 Gourmet Avenue'
  },
  {
    id: 'hyd-gachibowli',
    name: 'Gachibowli, Hyderabad',
    city: 'Hyderabad',
    address: 'Gachibowli Main Rd, Hyderabad, Telangana 500032',
    coordinates: { lat: 17.4401, lng: 78.3489 },
    landmark: 'Financial District & Bio-Tech Hub'
  },

  // Chennai
  {
    id: 'chn-tnagar',
    name: 'T. Nagar, Chennai',
    city: 'Chennai',
    address: 'Pondy Bazaar & South Usman Rd, T. Nagar, Chennai, Tamil Nadu 600017',
    coordinates: { lat: 13.0418, lng: 80.2341 },
    landmark: 'Pondy Bazaar Pedestrian Plaza'
  },
  {
    id: 'chn-adyar',
    name: 'Adyar, Chennai',
    city: 'Chennai',
    address: 'Sardar Patel Road, Adyar, Chennai, Tamil Nadu 600020',
    coordinates: { lat: 13.0012, lng: 80.2565 },
    landmark: 'Adyar Bakery & Kasturibai Nagar'
  },
  {
    id: 'chn-annanagar',
    name: 'Anna Nagar, Chennai',
    city: 'Chennai',
    address: '2nd Avenue, Anna Nagar, Chennai, Tamil Nadu 600040',
    coordinates: { lat: 13.0850, lng: 80.2101 },
    landmark: 'Anna Nagar Roundtana'
  },

  // Pune
  {
    id: 'pne-kp',
    name: 'Koregaon Park, Pune',
    city: 'Pune',
    address: 'North Main Road, Koregaon Park, Pune, Maharashtra 411001',
    coordinates: { lat: 18.5362, lng: 73.8940 },
    landmark: 'KP Lanes 1 to 7 Cafe Corridor'
  },
  {
    id: 'pne-kothrud',
    name: 'Kothrud, Pune',
    city: 'Pune',
    address: 'Paud Road, Kothrud, Pune, Maharashtra 411038',
    coordinates: { lat: 18.5074, lng: 73.8077 },
    landmark: 'Kothrud PMT Bus Stand'
  },
  {
    id: 'pne-viman',
    name: 'Viman Nagar, Pune',
    city: 'Pune',
    address: 'Phoenix Marketcity Road, Viman Nagar, Pune, Maharashtra 411014',
    coordinates: { lat: 18.5679, lng: 73.9143 },
    landmark: 'Phoenix Marketcity Mall'
  },

  // Kolkata
  {
    id: 'kol-parkst',
    name: 'Park Street, Kolkata',
    city: 'Kolkata',
    address: 'Park Street, Kolkata, West Bengal 700016',
    coordinates: { lat: 22.5512, lng: 88.3524 },
    landmark: 'Park Street Iconic Food Hub'
  },
  {
    id: 'kol-saltlake',
    name: 'Salt Lake / Sector V, Kolkata',
    city: 'Kolkata',
    address: 'Sector V, Salt Lake, Kolkata, West Bengal 700091',
    coordinates: { lat: 22.5804, lng: 88.4237 },
    landmark: 'Sector V IT & Commercial Hub'
  }
];

export const SF_PRESET_LOCATIONS: PresetLocation[] = INDIAN_PRESET_LOCATIONS; // Backwards-compatibility alias
export const DEFAULT_USER_LOCATION = INDIAN_PRESET_LOCATIONS[0]; // Indiranagar, Bengaluru

/**
 * Calculates accurate geodesic distance between two latitude/longitude points in kilometers using Haversine formula
 */
export function calculateHaversineDistanceKm(
  coord1: GeoCoordinates,
  coord2: GeoCoordinates
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const lat1 = (coord1.lat * Math.PI) / 180;
  const lat2 = (coord2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Number(distance.toFixed(1));
}

/**
 * Estimates transit ETAs based on distance
 */
export function estimateTransitETAs(distanceKm: number) {
  // Walking avg speed: 4.8 km/h (~12.5 min/km)
  const walkingMinutes = Math.max(1, Math.round(distanceKm * 12.5));
  
  // Biking avg speed: 15 km/h (~4 min/km)
  const bikingMinutes = Math.max(1, Math.round(distanceKm * 4));

  // Driving in city avg speed: 25 km/h + 2 min buffer
  const drivingMinutes = Math.max(2, Math.round((distanceKm / 25) * 60 + 2));

  return {
    walking: `${walkingMinutes} min walk`,
    biking: `${bikingMinutes} min bike`,
    driving: `${drivingMinutes} min drive`
  };
}

export const GLOBAL_PRESET_CITIES: PresetLocation[] = [
  {
    id: 'sf',
    name: 'San Francisco, CA',
    address: 'Market St & 4th St, San Francisco, CA',
    coordinates: { lat: 37.7858, lng: -122.4065 },
    landmark: 'Union Square Central'
  },
  {
    id: 'nyc',
    name: 'New York, NY',
    address: 'Broadway & 42nd St, New York, NY',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    landmark: 'Times Square & Midtown'
  },
  {
    id: 'london',
    name: 'London, UK',
    address: 'Trafalgar Square, London, WC2N 5DN',
    coordinates: { lat: 51.5080, lng: -0.1281 },
    landmark: 'Central London Hub'
  },
  {
    id: 'toronto',
    name: 'Toronto, Canada',
    address: 'Yonge St & Dundas St, Toronto, ON',
    coordinates: { lat: 43.6561, lng: -79.3802 },
    landmark: 'Downtown Toronto'
  },
  {
    id: 'berlin',
    name: 'Berlin, Germany',
    address: 'Alexanderplatz, 10178 Berlin',
    coordinates: { lat: 52.5219, lng: 13.4132 },
    landmark: 'Mitte Central'
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    address: 'Shibuya Crossing, Tokyo 150-0042',
    coordinates: { lat: 35.6595, lng: 139.7004 },
    landmark: 'Shibuya City Hub'
  },
  {
    id: 'mumbai',
    name: 'Mumbai, India',
    address: 'Bandra Kurla Complex, Mumbai 400051',
    coordinates: { lat: 19.0600, lng: 72.8656 },
    landmark: 'BKC Business Center'
  },
  {
    id: 'sydney',
    name: 'Sydney, Australia',
    address: 'George St, Sydney NSW 2000',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    landmark: 'Sydney CBD'
  }
];

/**
 * Worldwide Geocoding using OpenStreetMap Nominatim with local fallback
 */
export async function geocodeAddress(query: string): Promise<{ coordinates: GeoCoordinates; address: string; name: string }> {
  const trimmed = query.trim();
  if (!trimmed) throw new Error('Please enter a valid city or address.');

  // 1. Check local presets first
  const match = [...SF_PRESET_LOCATIONS, ...GLOBAL_PRESET_CITIES].find(
    p => p.name.toLowerCase().includes(trimmed.toLowerCase()) || p.address.toLowerCase().includes(trimmed.toLowerCase())
  );
  if (match) {
    return { coordinates: match.coordinates, address: match.address, name: match.name };
  }

  // 2. Query OpenStreetMap Nominatim
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=1`, {
      headers: { 'Accept-Language': 'en' }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const top = data[0];
        return {
          coordinates: {
            lat: parseFloat(top.lat),
            lng: parseFloat(top.lon)
          },
          address: top.display_name,
          name: top.display_name.split(',')[0]
        };
      }
    }
  } catch (err) {
    console.warn('Nominatim geocoding failed, falling back:', err);
  }

  // 3. Fallback jitter
  return {
    coordinates: DEFAULT_USER_LOCATION.coordinates,
    address: `${trimmed} (Approximate Search Location)`,
    name: trimmed
  };
}

/**
 * Safely requests location: HTML5 Geolocation with Automatic IP Fallback
 */
export async function requestBrowserLocation(): Promise<{ coordinates: GeoCoordinates; address: string }> {
  // 1. Try HTML5 Geolocation first
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: false,
            timeout: 4000,
            maximumAge: 120000
          }
        );
      });

      const coords = {
        lat: Number(position.coords.latitude.toFixed(4)),
        lng: Number(position.coords.longitude.toFixed(4))
      };

      // Reverse geocode if possible
      try {
        const rev = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=14`, {
          headers: { 'Accept-Language': 'en' }
        });
        if (rev.ok) {
          const revData = await rev.json();
          const city = revData.address?.city || revData.address?.town || revData.address?.suburb || revData.address?.state || 'Your Current Area';
          const country = revData.address?.country_code?.toUpperCase() || '';
          return { coordinates: coords, address: `${city}${country ? `, ${country}` : ''} (GPS Live)` };
        }
      } catch {
        // ignore
      }

      return { coordinates: coords, address: `Current Location (${coords.lat}° N, ${coords.lng}° W)` };
    } catch (geoError) {
      console.info('HTML5 Geolocation unavailable or denied, falling back to IP Geolocation...');
    }
  }

  // 2. Automatic IP-based Geolocation fallback
  try {
    const ipRes = await fetch('https://ipapi.co/json/', { timeout: 3000 } as any);
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.latitude && ipData.longitude) {
        const coords = {
          lat: Number(ipData.latitude.toFixed(4)),
          lng: Number(ipData.longitude.toFixed(4))
        };
        const city = ipData.city || 'Local Area';
        const region = ipData.region_code || ipData.country_name || '';
        return {
          coordinates: coords,
          address: `${city}${region ? `, ${region}` : ''} (Network Location)`
        };
      }
    }
  } catch (ipErr) {
    console.warn('IP Geolocation fallback failed:', ipErr);
  }

  // 3. Alternate free IP Geolocation service
  try {
    const freeIpRes = await fetch('https://freeipapi.com/api/json');
    if (freeIpRes.ok) {
      const freeData = await freeIpRes.json();
      if (freeData.latitude && freeData.longitude) {
        const coords = {
          lat: Number(freeData.latitude.toFixed(4)),
          lng: Number(freeData.longitude.toFixed(4))
        };
        return {
          coordinates: coords,
          address: `${freeData.cityName || 'City'}, ${freeData.countryName || ''} (Network Location)`
        };
      }
    }
  } catch {
    // ignore
  }

  // 4. Default to standard metropolitan central hub
  return {
    coordinates: DEFAULT_USER_LOCATION.coordinates,
    address: `${DEFAULT_USER_LOCATION.name} (Default Hub)`
  };
}
