import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  GeoCoordinates,
  PresetLocation,
  DEFAULT_USER_LOCATION,
  SF_PRESET_LOCATIONS,
  calculateHaversineDistanceKm,
  estimateTransitETAs,
  requestBrowserLocation
} from '../services/geoService';
import { useToast } from './ToastContext';

export type LocationPermissionState = 'prompt' | 'granted' | 'denied' | 'requesting';

export interface UserLocationState {
  coordinates: GeoCoordinates;
  address: string;
  label: string;
  isManual: boolean;
}

interface LocationContextType {
  userLocation: UserLocationState;
  permissionStatus: LocationPermissionState;
  selectedRadiusKm: number;
  setSelectedRadiusKm: (radius: number) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  requestGpsLocation: () => Promise<void>;
  selectPresetLocation: (preset: PresetLocation) => void;
  setCustomManualLocation: (name: string, address: string, coords: GeoCoordinates) => void;
  calculateDistanceTo: (targetCoords: GeoCoordinates) => number;
  getTransitEtasTo: (targetCoords: GeoCoordinates) => ReturnType<typeof estimateTransitETAs>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY_LOCATION = 'foodloop_user_location_pref_v1';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [userLocation, setUserLocation] = useState<UserLocationState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCATION);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved location');
    }
    return {
      coordinates: DEFAULT_USER_LOCATION.coordinates,
      address: DEFAULT_USER_LOCATION.address,
      label: DEFAULT_USER_LOCATION.name,
      isManual: true
    };
  });

  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionState>('prompt');
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(25);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Save location preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(userLocation));
    } catch (e) {
      console.error(e);
    }
  }, [userLocation]);

  const requestGpsLocation = async () => {
    setPermissionStatus('requesting');
    try {
      const result = await requestBrowserLocation();
      const updated: UserLocationState = {
        coordinates: result.coordinates,
        address: result.address,
        label: 'My Current GPS Location',
        isManual: false
      };
      setUserLocation(updated);
      setPermissionStatus('granted');
      setIsLocationModalOpen(false);
      showToast('success', 'Location Detected', 'Showing surplus food within your immediate radius.');
    } catch (err: any) {
      setPermissionStatus('denied');
      showToast('info', 'Manual Location Active', err.message);
    }
  };

  const selectPresetLocation = (preset: PresetLocation) => {
    const updated: UserLocationState = {
      coordinates: preset.coordinates,
      address: preset.address,
      label: preset.name,
      isManual: true
    };
    setUserLocation(updated);
    setIsLocationModalOpen(false);
    showToast('success', `Location Set to ${preset.name}`, `Browsing surplus food within ${selectedRadiusKm} km.`);
  };

  const setCustomManualLocation = (name: string, address: string, coords: GeoCoordinates) => {
    const updated: UserLocationState = {
      coordinates: coords,
      address,
      label: name,
      isManual: true
    };
    setUserLocation(updated);
    setIsLocationModalOpen(false);
    showToast('success', `Location Updated`, `Searching around ${name}`);
  };

  const calculateDistanceTo = useCallback(
    (targetCoords: GeoCoordinates): number => {
      return calculateHaversineDistanceKm(userLocation.coordinates, targetCoords);
    },
    [userLocation.coordinates]
  );

  const getTransitEtasTo = useCallback(
    (targetCoords: GeoCoordinates) => {
      const dist = calculateDistanceTo(targetCoords);
      return estimateTransitETAs(dist);
    },
    [calculateDistanceTo]
  );

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        permissionStatus,
        selectedRadiusKm,
        setSelectedRadiusKm,
        isLocationModalOpen,
        setIsLocationModalOpen,
        requestGpsLocation,
        selectPresetLocation,
        setCustomManualLocation,
        calculateDistanceTo,
        getTransitEtasTo
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
