import { User, FoodListing, Reservation, DonationClaim, PlatformStats } from '../types';
import {
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_RESERVATIONS,
  INITIAL_DONATION_CLAIMS,
  INITIAL_PLATFORM_STATS
} from './seedData';

const STORAGE_KEYS = {
  USERS: 'foodloop_users_v2',
  CURRENT_USER: 'foodloop_current_user_v2',
  LISTINGS: 'foodloop_listings_v2',
  RESERVATIONS: 'foodloop_reservations_v2',
  DONATION_CLAIMS: 'foodloop_claims_v2',
  PLATFORM_STATS: 'foodloop_stats_v2',
};

// Generic Safe Storage Helper
function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage, using fallback`, e);
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export const StorageService = {
  // Initialize baseline data
  init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setStoredItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      setStoredItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]); // Aarav Sharma (Customer)
    }
    if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
      setStoredItem(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
      setStoredItem(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DONATION_CLAIMS)) {
      setStoredItem(STORAGE_KEYS.DONATION_CLAIMS, INITIAL_DONATION_CLAIMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PLATFORM_STATS)) {
      setStoredItem(STORAGE_KEYS.PLATFORM_STATS, INITIAL_PLATFORM_STATS);
    }
  },

  // Reset to initial seed
  resetData(): void {
    setStoredItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    setStoredItem(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    setStoredItem(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    setStoredItem(STORAGE_KEYS.DONATION_CLAIMS, INITIAL_DONATION_CLAIMS);
    setStoredItem(STORAGE_KEYS.PLATFORM_STATS, INITIAL_PLATFORM_STATS);
  },

  // Users
  getUsers(): User[] {
    return getStoredItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  saveUsers(users: User[]): void {
    setStoredItem(STORAGE_KEYS.USERS, users);
  },
  getCurrentUser(): User {
    return getStoredItem<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },
  setCurrentUser(user: User): void {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Listings
  getListings(): FoodListing[] {
    return getStoredItem<FoodListing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  },
  saveListings(listings: FoodListing[]): void {
    setStoredItem(STORAGE_KEYS.LISTINGS, listings);
  },

  // Reservations
  getReservations(): Reservation[] {
    return getStoredItem<Reservation[]>(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
  },
  saveReservations(reservations: Reservation[]): void {
    setStoredItem(STORAGE_KEYS.RESERVATIONS, reservations);
  },

  // Donation Claims
  getDonationClaims(): DonationClaim[] {
    return getStoredItem<DonationClaim[]>(STORAGE_KEYS.DONATION_CLAIMS, INITIAL_DONATION_CLAIMS);
  },
  saveDonationClaims(claims: DonationClaim[]): void {
    setStoredItem(STORAGE_KEYS.DONATION_CLAIMS, claims);
  },

  // Stats
  getPlatformStats(): PlatformStats {
    return getStoredItem<PlatformStats>(STORAGE_KEYS.PLATFORM_STATS, INITIAL_PLATFORM_STATS);
  },
  savePlatformStats(stats: PlatformStats): void {
    setStoredItem(STORAGE_KEYS.PLATFORM_STATS, stats);
  },

  // Auth Token
  getAuthToken(): string | null {
    return localStorage.getItem('foodloop_auth_token');
  },
  setAuthToken(token: string): void {
    localStorage.setItem('foodloop_auth_token', token);
  }
};
