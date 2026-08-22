import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BookOpen,
  BarChart3,
  UtensilsCrossed,
  QrCode,
  Settings,
  Store,
  WifiOff,
  Wifi,
  Users,
  Shield,
  Building2,
  Lock,
  ChevronRight,
  Truck,
  DollarSign,
  Globe,
  Archive,
  ShieldAlert,
  FileSpreadsheet,
  Key,
  UserCheck,
  Flame,
  Utensils,
  CreditCard,
  Tag,
  FileText,
  Percent,
  Crown,
  Phone,
  Send,
  MessageSquare,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { RoleGuard } from '../Common/RoleGuard';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    businessType,
    setBusinessType,
    settings,
    isOffline,
    setIsOffline,
    pendingSyncCount,
    syncOfflineQueue,
    currentUser,
    currentTenant,
    setIsAuthModalOpen,
    orders,
    tables,
    reservations,
    quotations,
    t,
  } = usePOS();

  const isSuperadmin = currentUser.role === 'superadmin';
  const cookingCount = orders.filter((o) => o.status === 'cooking').length;
  const occupiedTablesCount = tables.filter((t) => t.status === 'occupied').length;

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-white border-r border-slate-200 py-4 px-3 z-40 fixed left-0 top-0 select-none shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-3">
        <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xl shadow-md tracking-wider">
          🍽️
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="font-black text-base text-slate-900 tracking-tight leading-tight truncate">
              {settings.storeName || 'OmniPOS SaaS'}
            </h1>
            <span className="text-[9px] uppercase font-black px-1.5 py-0.2 rounded bg-orange-600 text-white">
              SaaS
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate font-semibold">
            {isSuperadmin ? 'Superadmin Master SaaS' : `${businessType.toUpperCase()} Food Suite`}
          </p>
        </div>
      </div>

      {/* Dynamic Navigation Links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto custom-scrollbar px-1">
        {/* Superadmin SaaS Root Controls */}
        <RoleGuard allowedRoles={['superadmin']}>
          <div className="pt-1 pb-1 mb-1 border-b border-slate-100">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider px-3 block mb-1">
              Super Admin SaaS
            </span>
            <button
              id="nav-tenants"
              onClick={() => setActiveTab('tenants')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-xs transition-all text-left ${
                activeTab === 'tenants'
                  ? 'bg-orange-600 text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'tenants' ? 'text-white' : 'text-orange-600'}`} />
              <span className="truncate">Multi-Restaurant SaaS</span>
              <span className="ml-auto text-[9px] bg-amber-400 text-amber-950 font-black px-1 py-0.2 rounded">
                ROOT
              </span>
            </button>
            <button
              id="nav-subscriptions"
              onClick={() => setActiveTab('subscriptions')}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-xs transition-all text-left ${
                activeTab === 'subscriptions'
                  ? 'bg-orange-600 text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Crown className={`w-4 h-4 shrink-0 ${activeTab === 'subscriptions' ? 'text-white' : 'text-amber-500'}`} />
              <span className="truncate">SaaS License Plans</span>
            </button>
          </div>
        </RoleGuard>

        {/* Section: Operational Food POS & Staff Apps */}
        <div className="pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
            Food Service & Operations
          </span>

          {/* POS Terminal */}
          <button
            id="nav-pos"
            onClick={() => setActiveTab('pos')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'pos'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className={`w-4 h-4 shrink-0 ${activeTab === 'pos' ? 'text-white' : 'text-orange-500'}`} />
            <span className="truncate">Food POS Terminal</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-black bg-emerald-500 text-white">
              3-STEP
            </span>
          </button>

          {/* Waiter App */}
          <button
            id="nav-waiter-app"
            onClick={() => setActiveTab('waiter_app')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'waiter_app'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Utensils className={`w-4 h-4 shrink-0 ${activeTab === 'waiter_app' ? 'text-white' : 'text-orange-500'}`} />
            <span className="truncate">Waiter App</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-slate-200 text-slate-700">
              STAFF
            </span>
          </button>

          {/* Chef Kitchen Display System (KDS) */}
          <button
            id="nav-chef-kds"
            onClick={() => setActiveTab('chef_kds')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'chef_kds'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Flame className={`w-4 h-4 shrink-0 ${activeTab === 'chef_kds' ? 'text-white' : 'text-orange-600 animate-pulse'}`} />
            <span className="truncate">Chef Kitchen (KDS)</span>
            {cookingCount > 0 && (
              <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-black bg-rose-600 text-white">
                {cookingCount}
              </span>
            )}
          </button>

          {/* Table Floor Plan & Reservations */}
          <button
            id="nav-tables"
            onClick={() => setActiveTab('tables')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'tables'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className={`w-4 h-4 shrink-0 ${activeTab === 'tables' ? 'text-white' : 'text-indigo-500'}`} />
            <span className="truncate">Tables & Booking</span>
            {occupiedTablesCount > 0 && (
              <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-900">
                {occupiedTablesCount} Busy
              </span>
            )}
          </button>

          {/* Food Orders */}
          <button
            id="nav-orders"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'orders'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Store className={`w-4 h-4 shrink-0 ${activeTab === 'orders' ? 'text-white' : 'text-slate-500'}`} />
            <span className="truncate">Food Orders ({orders.length})</span>
          </button>

          {/* Delivery Dispatch & Riders */}
          <button
            id="nav-delivery"
            onClick={() => setActiveTab('delivery')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'delivery'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Truck className={`w-4 h-4 shrink-0 ${activeTab === 'delivery' ? 'text-white' : 'text-purple-500'}`} />
            <span className="truncate">Delivery & Riders</span>
          </button>

          {/* Catering Quotations (Convert to Sale) */}
          <button
            id="nav-quotations"
            onClick={() => setActiveTab('quotations')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'quotations'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'quotations' ? 'text-white' : 'text-blue-500'}`} />
            <span className="truncate">Quotations / Catering</span>
          </button>

          {/* Digital Web Menu */}
          <button
            id="nav-digital-menu"
            onClick={() => setActiveTab('digital_menu')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'digital_menu'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <QrCode className={`w-4 h-4 shrink-0 ${activeTab === 'digital_menu' ? 'text-white' : 'text-slate-500'}`} />
            <span className="truncate">Digital QR Menu Web</span>
          </button>
        </div>

        {/* Section: Finance & Khata */}
        <div className="pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
            Financials & Khata Book
          </span>

          {/* Parties: Customers & Suppliers */}
          <button
            id="nav-parties"
            onClick={() => setActiveTab('parties')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'parties'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className={`w-4 h-4 shrink-0 ${activeTab === 'parties' ? 'text-white' : 'text-indigo-600'}`} />
            <span className="truncate">Parties (Client/Vendor)</span>
          </button>

          {/* Due List & WhatsApp Remind */}
          <button
            id="nav-due-list"
            onClick={() => setActiveTab('due_list')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'due_list'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CreditCard className={`w-4 h-4 shrink-0 ${activeTab === 'due_list' ? 'text-white' : 'text-amber-600'}`} />
            <span className="truncate">Due List & Reminders</span>
          </button>

          {/* Khata Book */}
          <button
            id="nav-khata"
            onClick={() => setActiveTab('khata')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'khata'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === 'khata' ? 'text-white' : 'text-slate-500'}`} />
            <span className="truncate">Customer Khata</span>
          </button>

          {/* Daily Accounts & P&L */}
          <button
            id="nav-accounts"
            onClick={() => setActiveTab('accounts')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'accounts'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <DollarSign className={`w-4 h-4 shrink-0 ${activeTab === 'accounts' ? 'text-white' : 'text-emerald-600'}`} />
            <span className="truncate">Income & Expenses</span>
          </button>

          {/* Coupons & Promos */}
          <button
            id="nav-coupons"
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'coupons'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Tag className={`w-4 h-4 shrink-0 ${activeTab === 'coupons' ? 'text-white' : 'text-rose-500'}`} />
            <span className="truncate">Coupons & Promos</span>
          </button>

          {/* 11+ Payment Gateways */}
          <button
            id="nav-gateways"
            onClick={() => setActiveTab('gateways')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'gateways'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Globe className={`w-4 h-4 shrink-0 ${activeTab === 'gateways' ? 'text-white' : 'text-emerald-500'}`} />
            <span className="truncate">11+ Payment Gateways</span>
          </button>
        </div>

        {/* Section: Inventory & Analytics */}
        <div className="pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
            Catalog & Analytics
          </span>

          {/* Inventory & Food Recipes */}
          <button
            id="nav-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'inventory'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Package className={`w-4 h-4 shrink-0 ${activeTab === 'inventory' ? 'text-white' : 'text-slate-500'}`} />
            <span className="truncate">Food Menu & Stock</span>
          </button>

          {/* Reports & Analytics */}
          <button
            id="nav-reports"
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'reports'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === 'reports' ? 'text-white' : 'text-slate-500'}`} />
            <span className="truncate">Analytics (13+ Reports)</span>
          </button>

          {/* VAT & Tax Settings */}
          <button
            id="nav-vat-settings"
            onClick={() => setActiveTab('vat_settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'vat_settings'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Percent className={`w-4 h-4 shrink-0 ${activeTab === 'vat_settings' ? 'text-white' : 'text-blue-600'}`} />
            <span className="truncate">VAT / Tax Settings</span>
          </button>

          {/* Settings */}
          <button
            id="nav-settings"
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left ${
              activeTab === 'settings'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings className={`w-4 h-4 shrink-0 ${activeTab === 'settings' ? 'text-white' : 'text-slate-500'}`} />
            <span className="truncate">Thermal Printers & Settings</span>
          </button>
        </div>
      </nav>

      {/* Offline Status & User Profile Bar */}
      <div className="mt-auto pt-2 border-t border-slate-200 px-1 space-y-1.5">
        <div
          className={`p-1.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
            isOffline
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {isOffline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            )}
            <div className="flex flex-col">
              <span className="font-bold text-[11px]">{isOffline ? 'Offline' : 'Online Sync'}</span>
              {pendingSyncCount > 0 && (
                <span className="text-[9px] opacity-80">{pendingSyncCount} queued</span>
              )}
            </div>
          </div>
          <button
            id="toggle-offline-btn"
            onClick={() => {
              if (isOffline && pendingSyncCount > 0) syncOfflineQueue();
              setIsOffline(!isOffline);
            }}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
              isOffline
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isOffline ? 'Sync' : 'Test'}
          </button>
        </div>

        {/* User Account Switcher */}
        <button
          id="user-profile-btn"
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left group"
        >
          <div
            className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${
              currentUser.avatarColor || 'bg-slate-900'
            }`}
          >
            {(currentUser.name || currentUser.username || 'Admin').substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</span>
              <span
                className={`text-[8px] uppercase font-bold px-1.5 py-0.2 rounded ${
                  currentUser.role === 'superadmin'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : currentUser.role === 'admin'
                    ? 'bg-orange-100 text-orange-900'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 truncate font-mono">@{currentUser.username}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
        </button>
      </div>
    </aside>
  );
};
