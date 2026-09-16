import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FoodLoopProvider, useFoodLoop } from './context/FoodLoopContext';
import { LocationProvider } from './context/LocationContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ListingDetailsModal } from './components/listings/ListingDetailsModal';
import { CreateListingModal } from './components/listings/CreateListingModal';
import { PickupModal } from './components/reservations/PickupModal';
import { ReservationConfirmationModal } from './components/reservations/ReservationConfirmationModal';
import { LocationPromptModal } from './components/location/LocationPromptModal';
import { PickupDirectionsModal } from './components/location/PickupDirectionsModal';
import { FoodVisionModal } from './components/nutrition/FoodVisionModal';
import { ThemeCustomizerModal } from './components/theme/ThemeCustomizerModal';
import { MobileInstallBanner } from './components/common/MobileInstallBanner';
import { FoodListing } from './types';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [directionsListing, setDirectionsListing] = useState<FoodListing | null>(null);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);

  const {
    listings,
    selectedListing,
    setSelectedListing,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isPickupModalOpen,
    setIsPickupModalOpen,
    isVisionModalOpen,
    setIsVisionModalOpen,
    confirmedReservation,
    isConfirmationModalOpen,
    setIsConfirmationModalOpen
  } = useFoodLoop();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDirections = (listing: FoodListing) => {
    setDirectionsListing(listing);
    setIsDirectionsOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'customer':
        return <CustomerDashboard onNavigate={handleNavigate} />;
      case 'business':
        return <BusinessDashboard onNavigate={handleNavigate} />;
      case 'ngo':
        return <NgoDashboard onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'reservations':
        return <ReservationsPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-forest-100 selection:text-forest-900">
      {/* Global Navbar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page Body */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Modals */}
      <ListingDetailsModal
        listing={selectedListing}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedListing(null);
        }}
        onOpenDirections={handleOpenDirections}
      />

      <CreateListingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <PickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
      />

      {/* Reservation Confirmation Modal */}
      <ReservationConfirmationModal
        reservation={confirmedReservation}
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onOpenDirections={handleOpenDirections}
        onViewOrders={() => handleNavigate('reservations')}
      />

      {/* Location Modal */}
      <LocationPromptModal />

      {/* Global Directions Modal */}
      <PickupDirectionsModal
        listing={directionsListing}
        isOpen={isDirectionsOpen}
        onClose={() => {
          setIsDirectionsOpen(false);
          setDirectionsListing(null);
        }}
      />

      {/* AI Food Vision & USDA Nutrition Studio */}
      <FoodVisionModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
        nearbyListings={listings}
        onSelectMatchedListing={(listingId) => {
          const match = listings.find(l => l.id === listingId);
          if (match) {
            setSelectedListing(match);
            setIsDetailsModalOpen(true);
          }
        }}
      />

      {/* Mobile Install App Banner */}
      <MobileInstallBanner />

      {/* Mobile Sticky Bottom App Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-pb">
        <button
          onClick={() => handleNavigate('customer')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
            currentPage === 'customer' ? 'text-forest-600 dark:text-forest-400' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Explore</span>
        </button>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-forest-600"
        >
          <svg className="w-5 h-5 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>Post Food</span>
        </button>

        <button
          onClick={() => setIsVisionModalOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-forest-700 dark:text-forest-300"
        >
          <div className="w-10 h-10 -mt-5 rounded-full bg-gradient-to-r from-forest-600 via-emerald-600 to-sprout-600 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 active:scale-95 transition-transform">
            <span className="text-base">📸</span>
          </div>
          <span className="font-extrabold text-forest-700 dark:text-forest-400">Scan Plate</span>
        </button>

        <button
          onClick={() => handleNavigate('reservations')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
            currentPage === 'reservations' ? 'text-forest-600 dark:text-forest-400' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Orders</span>
        </button>

        <button
          onClick={() => handleNavigate('profile')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
            currentPage === 'profile' ? 'text-forest-600 dark:text-forest-400' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <LocationProvider>
          <AuthProvider>
            <FoodLoopProvider>
              <AppContent />
            </FoodLoopProvider>
          </AuthProvider>
        </LocationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
