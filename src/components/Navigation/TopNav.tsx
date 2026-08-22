import React from 'react';
import {
  Search,
  Languages,
  WifiOff,
  RefreshCw,
  Barcode,
  Utensils,
  ShoppingBag,
  Cpu,
  Shield,
  KeyRound,
  Store,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const TopNav: React.FC = () => {
  const {
    businessType,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    isOffline,
    pendingSyncCount,
    syncOfflineQueue,
    setIsScannerOpen,
    setIsAuthModalOpen,
    currentUser,
    currentTenant,
    t,
  } = usePOS();

  const isSuperadmin = currentUser.role === 'superadmin';

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-4 md:px-6 sticky top-0 z-30 flex items-center justify-between shadow-xs">
      {/* Left: Store Badge & Search Bar */}
      <div className="flex items-center gap-3 md:gap-6 flex-1 max-w-2xl">
        <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-slate-200">
          {isSuperadmin ? (
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>SaaS Superadmin</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
              <Store className="w-3.5 h-3.5 text-indigo-600" />
              <span className="truncate max-w-[160px]">{currentTenant?.name}</span>
            </div>
          )}

          {businessType === 'restaurant' && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              <Utensils className="w-3 h-3" />
              <span>Dine-In</span>
            </div>
          )}
          {businessType === 'grocery' && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <ShoppingBag className="w-3 h-3" />
              <span>Mart</span>
            </div>
          )}
          {businessType === 'electronics' && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
              <Cpu className="w-3 h-3" />
              <span>Tech</span>
            </div>
          )}
        </div>

        {/* Search / Barcode input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder', 'Search products, SKU, barcode...')}
            className="w-full h-10 pl-10 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 text-slate-900"
          />
          <button
            id="open-barcode-scanner-top-btn"
            onClick={() => setIsScannerOpen(true)}
            title="Scan Barcode / Camera"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Barcode className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Actions & Role Status */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Offline Badge with sync button */}
        {isOffline ? (
          <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-full text-xs font-semibold">
            <WifiOff className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span className="hidden sm:inline">Offline</span>
            {pendingSyncCount > 0 && (
              <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingSyncCount}
              </span>
            )}
          </div>
        ) : (
          pendingSyncCount > 0 && (
            <button
              id="sync-pending-orders-btn"
              onClick={syncOfflineQueue}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Sync {pendingSyncCount}</span>
            </button>
          )
        )}

        {/* Language Switcher (EN / ML) */}
        <button
          id="toggle-language-btn"
          onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 h-10 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          title="Switch Language"
        >
          <Languages className="w-4 h-4 text-indigo-600" />
          <span className="font-bold">{language === 'en' ? 'EN' : 'മലയാളം'}</span>
        </button>

        {/* Switch Account / RBAC Button */}
        <button
          id="open-auth-modal-btn"
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-98"
          title="Switch Role / Account"
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline capitalize">{currentUser.role}</span>
          <span className="sm:hidden font-mono">@{currentUser.username}</span>
        </button>
      </div>
    </header>
  );
};
