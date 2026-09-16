import React, { useState } from 'react';
import {
  Leaf,
  ShoppingBag,
  Store,
  HeartHandshake,
  ShieldAlert,
  PlusCircle,
  QrCode,
  User,
  ChevronDown,
  Menu,
  X,
  Compass,
  MapPin,
  RefreshCw,
  LogOut,
  Sparkles,
  Palette
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFoodLoop } from '../../context/FoodLoopContext';
import { useLocation } from '../../context/LocationContext';
import { useTheme, THEME_PRESETS_META } from '../../context/ThemeContext';
import { UserRole, Reservation } from '../../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { currentUser, allUsers, switchUser, switchRoleQuick, logout, resetDatabase } = useAuth();
  const { setIsCreateModalOpen, setIsPickupModalOpen, setIsVisionModalOpen, reservations } = useFoodLoop();
  const { userLocation, setIsLocationModalOpen, selectedRadiusKm } = useLocation();
  const { config, setIsCustomizerOpen } = useTheme();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingReservationsCount = reservations.filter(
    r => r.userId === currentUser?.id && r.status === 'pending_pickup'
  ).length;

  const roleMeta: Record<UserRole, { label: string; badgeColor: string; icon: React.ReactNode }> = {
    customer: {
      label: 'Customer / Shopper',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <ShoppingBag className="w-3.5 h-3.5" />
    },
    business: {
      label: 'Business Merchant',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Store className="w-3.5 h-3.5" />
    },
    ngo: {
      label: 'NGO / Food Bank',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      icon: <HeartHandshake className="w-3.5 h-3.5" />
    },
    admin: {
      label: 'System Admin',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: <ShieldAlert className="w-3.5 h-3.5" />
    }
  };

  const handleRoleChange = async (userId: string) => {
    await switchUser(userId);
    setIsRoleMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Desktop Navigation Links */}
          <div className="flex items-center gap-3 xl:gap-5 min-w-0 shrink-0">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 group text-left focus:outline-none shrink-0"
            >
              <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-md shadow-forest-600/20 group-hover:scale-105 transition-transform shrink-0">
                <Leaf className="w-5 h-5 xl:w-6 xl:h-6 text-sprout-300" />
              </div>
              <div className="shrink-0">
                <span className="text-lg xl:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center">
                  Food<span className="text-forest-600">zyra</span>
                </span>
                <span className="block text-[9px] xl:text-[10px] font-medium tracking-wider text-slate-400 uppercase -mt-1">
                  Surplus Food Network
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 shrink-0">
              <button
                onClick={() => onNavigate('customer')}
                className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-colors ${
                  currentPage === 'customer'
                    ? 'bg-forest-50 dark:bg-forest-950/50 text-forest-700 dark:text-forest-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Browse Surplus
              </button>

              <button
                onClick={() => onNavigate('business')}
                className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-colors ${
                  currentUser?.role === 'business' ? 'inline-flex' : 'hidden 2xl:inline-flex'
                } ${
                  currentPage === 'business'
                    ? 'bg-forest-50 dark:bg-forest-950/50 text-forest-700 dark:text-forest-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Business Hub
              </button>

              <button
                onClick={() => onNavigate('ngo')}
                className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-colors ${
                  currentUser?.role === 'ngo' ? 'inline-flex' : 'hidden 2xl:inline-flex'
                } ${
                  currentPage === 'ngo'
                    ? 'bg-forest-50 dark:bg-forest-950/50 text-forest-700 dark:text-forest-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                NGO Rescue
              </button>

              <button
                onClick={() => onNavigate('admin')}
                className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-colors ${
                  currentUser?.role === 'admin' ? 'inline-flex' : 'hidden 2xl:inline-flex'
                } ${
                  currentPage === 'admin'
                    ? 'bg-forest-50 dark:bg-forest-950/50 text-forest-700 dark:text-forest-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Admin
              </button>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0">
            
            {/* Location Pill Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="inline-flex items-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-xl text-xs font-bold border border-forest-200/80 dark:border-forest-800/80 bg-forest-50/70 dark:bg-forest-950/40 hover:bg-forest-100 dark:hover:bg-forest-900/60 text-forest-900 dark:text-forest-200 shadow-2xs transition-colors shrink-0"
              title="Change your discovery location or search radius"
            >
              <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              <span className="truncate max-w-[70px] xl:max-w-[90px] 2xl:max-w-[120px]">{userLocation.label}</span>
              <span className="hidden 2xl:inline text-[10px] text-forest-600 dark:text-forest-400 font-semibold shrink-0">({selectedRadiusKm}km)</span>
            </button>

            {/* Quick Action: AI Nutrition Vision (Available to all, prioritized for customers/shoppers) */}
            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-forest-700 hover:from-emerald-700 hover:to-forest-800 text-white shadow-sm transition-all hover:shadow shrink-0"
              title="AI Food Detection & USDA Nutrition Studio"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="hidden 2xl:inline">AI Nutrition Vision</span>
              <span className="2xl:hidden">AI Scan</span>
            </button>

            {/* Quick Action: Universal Post Surplus / Share Food for all users */}
            {currentUser && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold bg-forest-600 hover:bg-forest-700 text-white shadow-sm transition-all hover:shadow shrink-0"
                title={
                  currentUser.role === 'business'
                    ? 'Post store surplus food for discount sale or donation'
                    : currentUser.role === 'ngo'
                    ? 'Post surplus donation or relief food batch'
                    : 'Share surplus food or homemade meals with your community'
                }
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="hidden 2xl:inline">
                  {currentUser.role === 'business'
                    ? 'Post Surplus'
                    : currentUser.role === 'ngo'
                    ? 'Post Donation'
                    : 'Share Food'}
                </span>
                <span className="2xl:hidden">
                  {currentUser.role === 'business' ? 'Post' : 'Share'}
                </span>
              </button>
            )}

            {/* Quick Action: Business verify pickup */}
            {currentUser?.role === 'business' && (
              <button
                onClick={() => setIsPickupModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-all shrink-0"
                title="Verify customer 6-digit pickup code or scan QR"
              >
                <QrCode className="w-4 h-4 text-forest-600 shrink-0" />
                <span className="hidden 2xl:inline">Verify Pickup</span>
                <span className="2xl:hidden">Verify</span>
              </button>
            )}

            {/* Quick Action: NGO specific action */}
            {currentUser?.role === 'ngo' && (
              <button
                onClick={() => onNavigate('ngo')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-all shrink-0"
              >
                <HeartHandshake className="w-4 h-4 shrink-0" />
                <span>Rescue Hub</span>
              </button>
            )}

            {/* Theme Studio Customizer Button */}
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shrink-0"
              title="Customize Themes & Colors"
            >
              <Palette className="w-4 h-4 text-forest-600 shrink-0" />
              <div
                className="w-2.5 h-2.5 rounded-full border border-white shadow-xs shrink-0"
                style={{ backgroundColor: THEME_PRESETS_META[config.preset]?.previewColor || '#2c7a56' }}
              />
            </button>

            {/* Reservations button with pending badge */}
            <button
              onClick={() => onNavigate('reservations')}
              className={`relative p-2 rounded-xl border shrink-0 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                currentPage === 'reservations' ? 'border-forest-400 bg-forest-50/50 dark:bg-forest-950/50 text-forest-700 dark:text-forest-300' : 'border-slate-200 dark:border-slate-800'
              }`}
              title="My Reservations"
            >
              <ShoppingBag className="w-5 h-5 shrink-0" />
              {pendingReservationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {pendingReservationsCount}
                </span>
              )}
            </button>

            {/* Persona / Role Selector Dropdown */}
            {currentUser && (
              <div className="relative shrink-0">
                <button
                  onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left shrink-0"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-forest-500/20 shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[80px] xl:max-w-[110px] leading-tight">
                      {currentUser.name}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md border mt-0.5 whitespace-nowrap ${roleMeta[currentUser.role]?.badgeColor}`}>
                      {roleMeta[currentUser.role]?.icon}
                      <span>{roleMeta[currentUser.role]?.label.split('/')[0]}</span>
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {isRoleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Persona / Role</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Test multi-sided platform interactions</p>
                    </div>

                    <div className="py-1 max-h-64 overflow-y-auto">
                      {allUsers.map(user => {
                        const isSelected = user.id === currentUser.id;
                        return (
                          <button
                            key={user.id}
                            onClick={() => handleRoleChange(user.id)}
                            className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                              isSelected ? 'bg-forest-50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold truncate ${isSelected ? 'text-forest-900 font-bold' : 'text-slate-800'}`}>
                                {user.name}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${roleMeta[user.role]?.badgeColor}`}>
                                  {roleMeta[user.role]?.label}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-forest-600"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 px-2 space-y-1">
                      <button
                        onClick={() => {
                          setIsRoleMenuOpen(false);
                          onNavigate('profile');
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        My Profile & Impact
                      </button>
                      <button
                        onClick={() => {
                          setIsRoleMenuOpen(false);
                          onNavigate('login');
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-slate-400" />
                        Sign In / Register
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onNavigate('reservations')}
              className="relative p-2 rounded-xl border border-slate-200 text-slate-600"
            >
              <ShoppingBag className="w-5 h-5" />
              {pendingReservationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {pendingReservationsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          {currentUser && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${roleMeta[currentUser.role]?.badgeColor}`}>
                  {roleMeta[currentUser.role]?.label}
                </span>
              </div>
            </div>
          )}
          {/* Mobile Location Switcher */}
          <button
            onClick={() => {
              setIsLocationModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full p-3 rounded-2xl bg-forest-50 dark:bg-forest-950/40 border border-forest-200/80 dark:border-forest-800/80 text-forest-900 dark:text-forest-200 text-xs font-bold flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
              <span className="truncate">{userLocation.label}</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-lg bg-forest-600 text-white shrink-0">
              {selectedRadiusKm} km radius
            </span>
          </button>

          {/* Mobile AI Nutrition Vision Button */}
          <button
            onClick={() => {
              setIsVisionModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-forest-700 hover:from-emerald-700 hover:to-forest-800 text-white shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
            <span>AI Nutrition Vision Studio</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setIsCreateModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-forest-600 hover:bg-forest-700 text-white"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Surplus</span>
            </button>
            <button
              onClick={() => {
                setIsPickupModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <QrCode className="w-4 h-4 text-forest-600" />
              <span>Verify Code</span>
            </button>
          </div>

          <div className="space-y-1 pt-2">
            <button
              onClick={() => { onNavigate('customer'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${currentPage === 'customer' ? 'bg-forest-50 dark:bg-forest-950/50 text-forest-700 dark:text-forest-300 font-bold' : 'text-slate-700 dark:text-slate-200'}`}
            >
              Browse Surplus Food
            </button>
            <button
              onClick={() => { onNavigate('business'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${currentPage === 'business' ? 'bg-forest-50 text-forest-700 font-bold' : 'text-slate-700'}`}
            >
              Business Merchant Hub
            </button>
            <button
              onClick={() => { onNavigate('ngo'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${currentPage === 'ngo' ? 'bg-forest-50 text-forest-700 font-bold' : 'text-slate-700'}`}
            >
              NGO Food Recovery Hub
            </button>
            <button
              onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${currentPage === 'admin' ? 'bg-forest-50 text-forest-700 font-bold' : 'text-slate-700'}`}
            >
              Admin Dashboard
            </button>
            <button
              onClick={() => { onNavigate('reservations'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${currentPage === 'reservations' ? 'bg-forest-50 text-forest-700 font-bold' : 'text-slate-700'}`}
            >
              My Reservations & Orders
            </button>
            <button
              onClick={() => { onNavigate('profile'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${currentPage === 'profile' ? 'bg-forest-50 text-forest-700 font-bold' : 'text-slate-700'}`}
            >
              Profile & Personal Impact
            </button>

            {/* Mobile Theme Studio Trigger */}
            <button
              onClick={() => { setIsCustomizerOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-950/40 flex items-center justify-between mt-1"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-forest-600" />
                <span>Customize Theme & Colors</span>
              </div>
              <div
                className="w-3 h-3 rounded-full border border-white shadow-xs"
                style={{ backgroundColor: THEME_PRESETS_META[config.preset]?.previewColor || '#2c7a56' }}
              />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Switch Persona</p>
            <div className="grid grid-cols-2 gap-2">
              {allUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleRoleChange(user.id)}
                  className={`p-2 rounded-xl border text-left text-xs font-semibold truncate ${
                    user.id === currentUser?.id ? 'border-forest-600 bg-forest-50 text-forest-800' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {user.name.split(' ')[0]} ({user.role})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
