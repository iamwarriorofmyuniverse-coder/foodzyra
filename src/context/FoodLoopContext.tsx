import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  FoodListing,
  Reservation,
  DonationClaim,
  PlatformStats,
  FilterState,
  DietaryTag
} from '../types';
import { ApiService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  type: 'all',
  maxDistanceKm: 50,
  maxPrice: 2000,
  pickupTime: 'all',
  dietary: [],
  sortBy: 'distance'
};

interface FoodLoopContextType {
  listings: FoodListing[];
  reservations: Reservation[];
  claims: DonationClaim[];
  stats: PlatformStats | null;
  filters: FilterState;
  setFilters: (filters: Partial<FilterState> | ((prev: FilterState) => FilterState)) => void;
  resetFilters: () => void;
  selectedListing: FoodListing | null;
  setSelectedListing: (listing: FoodListing | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isPickupModalOpen: boolean;
  setIsPickupModalOpen: (open: boolean) => void;
  isDetailsModalOpen: boolean;
  setIsDetailsModalOpen: (open: boolean) => void;
  isVisionModalOpen: boolean;
  setIsVisionModalOpen: (open: boolean) => void;
  confirmedReservation: Reservation | null;
  setConfirmedReservation: (reservation: Reservation | null) => void;
  isConfirmationModalOpen: boolean;
  setIsConfirmationModalOpen: (open: boolean) => void;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  reserveFood: (listingId: string, quantity: number, notes?: string) => Promise<Reservation>;
  claimFoodDonation: (listingId: string, peopleFed: number) => Promise<DonationClaim>;
  createFoodListing: (data: Omit<FoodListing, 'id' | 'createdAt' | 'status'>) => Promise<FoodListing>;
  verifyPickupCode: (code: string) => Promise<{ success: boolean; itemTitle: string; type: string; impact: any }>;
  reportFoodListing: (listingId: string, reason: string) => Promise<void>;
  moderateFoodListing: (listingId: string, action: 'approve' | 'remove') => Promise<void>;
  cancelUserReservation: (reservationId: string) => Promise<void>;
}

const FoodLoopContext = createContext<FoodLoopContextType | undefined>(undefined);

export const FoodLoopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, refreshUsers } = useAuth();
  const { showToast } = useToast();

  const [listings, setListings] = useState<FoodListing[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [claims, setClaims] = useState<DonationClaim[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [filters, setFiltersState] = useState<FilterState>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState<boolean>(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState<boolean>(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);

  const setFilters = (updates: Partial<FilterState> | ((prev: FilterState) => FilterState)) => {
    if (typeof updates === 'function') {
      setFiltersState(updates);
    } else {
      setFiltersState(prev => ({ ...prev, ...updates }));
    }
  };

  const resetFilters = () => {
    setFiltersState(DEFAULT_FILTERS);
  };

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allListings, allReservations, allClaims, platformStats] = await Promise.all([
        ApiService.getListings(filters),
        ApiService.getReservations(),
        ApiService.getDonationClaims(),
        ApiService.getPlatformStats()
      ]);
      setListings(allListings);
      setReservations(allReservations);
      setClaims(allClaims);
      setStats(platformStats);
    } catch (e: any) {
      console.error('Error refreshing FoodLoop data', e);
      showToast('error', 'Failed to load listings', e.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const reserveFood = async (listingId: string, quantity: number, notes?: string): Promise<Reservation> => {
    if (!currentUser) throw new Error('Please log in to reserve food');
    try {
      const res = await ApiService.reserveListing(listingId, currentUser, quantity, notes);
      showToast(
        'success',
        'Surplus Food Reserved!',
        `Your 6-digit pickup code is ${res.pickupCode}. Present this at pickup.`
      );
      
      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });

      setConfirmedReservation(res);
      setIsConfirmationModalOpen(true);
      setIsDetailsModalOpen(false);

      await refreshData();
      await refreshUsers();
      return res;
    } catch (e: any) {
      showToast('error', 'Reservation Failed', e.message);
      throw e;
    }
  };

  const claimFoodDonation = async (listingId: string, peopleFed: number): Promise<DonationClaim> => {
    if (!currentUser) throw new Error('Please log in to claim donation');
    try {
      const claim = await ApiService.claimDonation(listingId, currentUser, peopleFed);
      showToast(
        'success',
        'Donation Claimed!',
        `Pickup code ${claim.pickupCode} issued for ${claim.listing.businessName}.`
      );

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      await refreshData();
      await refreshUsers();
      setIsDetailsModalOpen(false);
      return claim;
    } catch (e: any) {
      showToast('error', 'Donation Claim Failed', e.message);
      throw e;
    }
  };

  const createFoodListing = async (data: Omit<FoodListing, 'id' | 'createdAt' | 'status'>): Promise<FoodListing> => {
    try {
      const newListing = await ApiService.createListing(data);
      showToast(
        'success',
        'Listing Published!',
        `"${newListing.title}" is now live and discoverable on Foodzyra.`
      );
      setIsCreateModalOpen(false);
      await refreshData();
      return newListing;
    } catch (e: any) {
      showToast('error', 'Could not create listing', e.message);
      throw e;
    }
  };

  const verifyPickupCode = async (code: string) => {
    if (!currentUser) throw new Error('Please log in');
    try {
      const result = await ApiService.verifyAndCollectOrder(code, currentUser.id);
      showToast(
        'success',
        'Pickup Verified & Completed!',
        `Saved ${result.impact.mealsCount} meals and avoided ${result.impact.co2SavedKg}kg CO₂e!`
      );

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });

      setIsPickupModalOpen(false);
      await refreshData();
      await refreshUsers();
      return result;
    } catch (e: any) {
      showToast('error', 'Verification Error', e.message);
      throw e;
    }
  };

  const reportFoodListing = async (listingId: string, reason: string) => {
    try {
      await ApiService.reportListing(listingId, reason);
      showToast('warning', 'Listing Reported', 'Our moderation team will review this food item.');
      await refreshData();
    } catch (e: any) {
      showToast('error', 'Failed to report listing', e.message);
    }
  };

  const moderateFoodListing = async (listingId: string, action: 'approve' | 'remove') => {
    try {
      await ApiService.adminModerateListing(listingId, action);
      showToast(
        'info',
        action === 'remove' ? 'Listing Removed' : 'Listing Approved',
        `Action successfully applied.`
      );
      await refreshData();
    } catch (e: any) {
      showToast('error', 'Moderation Failed', e.message);
    }
  };

  const cancelUserReservation = async (reservationId: string) => {
    try {
      await ApiService.cancelReservation(reservationId);
      showToast('info', 'Reservation Cancelled', 'The item has been returned to available surplus stock.');
      await refreshData();
    } catch (e: any) {
      showToast('error', 'Cancellation Failed', e.message);
    }
  };

  return (
    <FoodLoopContext.Provider
      value={{
        listings,
        reservations,
        claims,
        stats,
        filters,
        setFilters,
        resetFilters,
        selectedListing,
        setSelectedListing,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isPickupModalOpen,
        setIsPickupModalOpen,
        isDetailsModalOpen,
        setIsDetailsModalOpen,
        isVisionModalOpen,
        setIsVisionModalOpen,
        confirmedReservation,
        setConfirmedReservation,
        isConfirmationModalOpen,
        setIsConfirmationModalOpen,
        isLoading,
        refreshData,
        reserveFood,
        claimFoodDonation,
        createFoodListing,
        verifyPickupCode,
        reportFoodListing,
        moderateFoodListing,
        cancelUserReservation
      }}
    >
      {children}
    </FoodLoopContext.Provider>
  );
};

export function useFoodLoop(): FoodLoopContextType {
  const context = useContext(FoodLoopContext);
  if (!context) {
    throw new Error('useFoodLoop must be used within a FoodLoopProvider');
  }
  return context;
}
