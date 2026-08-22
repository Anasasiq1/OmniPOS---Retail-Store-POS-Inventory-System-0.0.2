import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Store,
  Shield,
  Layers,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Utensils,
  ShoppingBag,
  Cpu,
  ShoppingBasket,
  X,
  Lock,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { BusinessType, Tenant } from '../../types';
import { DataTable, Column } from '../Common/DataTable';

export const TenantManagement: React.FC = () => {
  const {
    allTenants,
    addTenant,
    updateTenant,
    deleteTenant,
    toggleTenantStatus,
    changeTenantVertical,
    switchTenant,
    setActiveTab,
    settings,
  } = usePOS();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [verticalChangeTenant, setVerticalChangeTenant] = useState<Tenant | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [businessVertical, setBusinessVertical] = useState<BusinessType>('restaurant');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [city, setCity] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [plan, setPlan] = useState<'Starter' | 'Professional' | 'Enterprise'>('Professional');

  const openAddModal = () => {
    setName('');
    setBusinessVertical('restaurant');
    setAdminUsername('');
    setAdminEmail('');
    setStorePhone('+91 98470 ');
    setCity('Kochi, Kerala');
    setGstNumber('');
    setPlan('Professional');
    setEditingTenant(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (t: Tenant) => {
    setEditingTenant(t);
    setName(t.name);
    setBusinessVertical(t.businessVertical);
    setAdminUsername(t.adminUsername);
    setAdminEmail(t.adminEmail);
    setStorePhone(t.storePhone);
    setCity(t.city);
    setGstNumber(t.gstNumber || '');
    setPlan(t.plan);
    setIsAddModalOpen(true);
  };

  const handleSaveTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !adminUsername.trim()) return;

    if (editingTenant) {
      updateTenant(editingTenant.id, {
        name,
        adminUsername,
        adminEmail,
        storePhone,
        city,
        gstNumber,
        plan,
      });
    } else {
      addTenant({
        name,
        businessVertical,
        adminUsername,
        adminEmail,
        storePhone,
        city,
        gstNumber,
        plan,
      });
    }
    setIsAddModalOpen(false);
    setEditingTenant(null);
  };

  const totalTenants = allTenants.length;
  const activeTenants = allTenants.filter((t) => t.isActive).length;
  const restaurantTenants = allTenants.filter((t) => t.businessVertical === 'restaurant').length;
  const groceryTenants = allTenants.filter((t) => t.businessVertical === 'grocery').length;
  const electronicsTenants = allTenants.filter((t) => t.businessVertical === 'electronics').length;

  const columns: Column<Tenant>[] = [
    {
      header: 'Store / Tenant',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {(t.name || 'Tenant').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{t.name}</span>
            <span className="text-[11px] text-slate-500 block">{t.city}</span>
            <span className="text-[10px] font-mono text-slate-400">{t.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Business Vertical (Platform Theme)',
      render: (t) => {
        let badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
        let Icon = Utensils;
        if (t.businessVertical === 'grocery') {
          badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          Icon = ShoppingBag;
        } else if (t.businessVertical === 'electronics') {
          badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
          Icon = Cpu;
        } else if (t.businessVertical === 'shop') {
          badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
          Icon = ShoppingBasket;
        }

        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize ${badgeColor}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.businessVertical}</span>
            </span>
            <button
              onClick={() => setVerticalChangeTenant(t)}
              title="Superadmin Exclusive: Reassign Platform Vertical"
              className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 underline ml-1"
            >
              Change Vertical
            </button>
          </div>
        );
      },
    },
    {
      header: 'Tenant Admin',
      render: (t) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block font-mono">@{t.adminUsername}</span>
          <span className="text-[11px] text-slate-500 block">{t.adminEmail}</span>
          <span className="text-[10px] text-slate-400 block">{t.storePhone}</span>
        </div>
      ),
    },
    {
      header: 'SaaS Plan',
      render: (t) => (
        <span
          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
            t.plan === 'Enterprise'
              ? 'bg-purple-100 text-purple-800'
              : t.plan === 'Professional'
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {t.plan}
        </span>
      ),
    },
    {
      header: 'Live Store',
      render: (t) => (
        <button
          onClick={() => {
            switchTenant(t.id);
            setActiveTab('pos');
          }}
          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <span>Launch POS</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-100 p-4 md:p-6 space-y-6">
      {/* Superadmin Master Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3" /> Superadmin Master
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              SaaS Multi-Tenant Architecture Controller
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global tenant provisioning, tenant isolation enforcement, role access, and business vertical assignments.
          </p>
        </div>

        <button
          id="add-tenant-btn"
          onClick={openAddModal}
          className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Tenant Store</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Stores Provisioned</span>
          <div className="text-2xl font-black text-slate-900">{totalTenants}</div>
          <span className="text-[10px] text-slate-400 font-medium">{activeTenants} active live stores</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Restaurant Tenants</span>
          <div className="text-2xl font-black text-rose-700">{restaurantTenants}</div>
          <span className="text-[10px] text-slate-400">Tables & QR Menu active</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Grocery Marts</span>
          <div className="text-2xl font-black text-emerald-700">{groceryTenants}</div>
          <span className="text-[10px] text-slate-400">Batch & Expiry Alarms</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Electronics & Retail</span>
          <div className="text-2xl font-black text-sky-700">{electronicsTenants}</div>
          <span className="text-[10px] text-slate-400">IMEI Serial Management</span>
        </div>
      </div>

      {/* Universal DataTable for Tenants */}
      <DataTable
        data={allTenants}
        columns={columns}
        searchPlaceholder="Search store name, admin username, city, or tenant ID..."
        searchFilter={(t, q) =>
          t.name.toLowerCase().includes(q) ||
          t.adminUsername.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.businessVertical.toLowerCase().includes(q)
        }
        onEdit={openEditModal}
        onDelete={(t) => deleteTenant(t.id)}
        onToggleStatus={(t) => toggleTenantStatus(t.id)}
        canEdit={true}
        canDelete={true}
        canToggle={true}
        deleteConfirmTitle="Delete Store Tenant"
        deleteConfirmMessage={(t) =>
          `Are you sure you want to permanently delete '${t.name}'? All products, orders, and user accounts under tenant ID '${t.id}' will be removed.`
        }
        emptyMessage="No tenants found."
      />

      {/* Provision / Edit Tenant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveTenant}
            className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                <span>{editingTenant ? 'Edit Store Tenant' : 'Provision New Store Tenant'}</span>
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Store / Business Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Spice Restaurant & Cafe"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Superadmin Exclusive: Business Vertical Selector */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Assigned Business Vertical (Superadmin Exclusive)</span>
                  </label>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                    Fixed for Admin
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBusinessVertical('restaurant')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      businessVertical === 'restaurant'
                        ? 'border-rose-600 bg-rose-50/50 text-rose-800 font-bold ring-2 ring-rose-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Utensils className="w-5 h-5 text-rose-600" />
                    <span className="text-xs">Restaurant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBusinessVertical('grocery')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      businessVertical === 'grocery'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 font-bold ring-2 ring-emerald-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">Supermarket</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBusinessVertical('electronics')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      businessVertical === 'electronics'
                        ? 'border-sky-600 bg-sky-50/50 text-sky-800 font-bold ring-2 ring-sky-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Cpu className="w-5 h-5 text-sky-600" />
                    <span className="text-xs">Electronics</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Store Owner Username *</label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="e.g. royal_admin"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Admin Email *</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. owner@royalspice.com"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Store Phone *</label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Ernakulam, Kerala"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">GST / Tax ID</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="32ABCDE1234F1Z5"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono uppercase focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">SaaS Subscription Plan</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as any)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none"
                >
                  <option value="Starter">Starter (₹1,499/mo)</option>
                  <option value="Professional">Professional (₹3,499/mo)</option>
                  <option value="Enterprise">Enterprise (₹7,999/mo)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 h-10 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                {editingTenant ? 'Save Changes' : 'Provision Store'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Vertical Modal (Superadmin Exclusive) */}
      {verticalChangeTenant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                <Shield className="w-5 h-5 text-amber-600" />
                <span>Reassign Vertical for '{verticalChangeTenant.name}'</span>
              </h3>
              <button type="button" onClick={() => setVerticalChangeTenant(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              As the SaaS Superadmin, you can switch the entire platform theme and operational modules for this store.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  changeTenantVertical(verticalChangeTenant.id, 'restaurant');
                  setVerticalChangeTenant(null);
                }}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  verticalChangeTenant.businessVertical === 'restaurant'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Utensils className="w-5 h-5 text-rose-600" />
                  <div>
                    <span className="text-xs font-bold block">Restaurant & Dining</span>
                    <span className="text-[11px] text-slate-500">Enables Tables, KOT, and Digital QR Menu</span>
                  </div>
                </div>
                {verticalChangeTenant.businessVertical === 'restaurant' && (
                  <CheckCircle2 className="w-5 h-5 text-rose-600" />
                )}
              </button>

              <button
                onClick={() => {
                  changeTenantVertical(verticalChangeTenant.id, 'grocery');
                  setVerticalChangeTenant(null);
                }}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  verticalChangeTenant.businessVertical === 'grocery'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold block">Supermarket & Grocery</span>
                    <span className="text-[11px] text-slate-500">Enables Expiry Tracking & High-Volume Barcode</span>
                  </div>
                </div>
                {verticalChangeTenant.businessVertical === 'grocery' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </button>

              <button
                onClick={() => {
                  changeTenantVertical(verticalChangeTenant.id, 'electronics');
                  setVerticalChangeTenant(null);
                }}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  verticalChangeTenant.businessVertical === 'electronics'
                    ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-sky-600" />
                  <div>
                    <span className="text-xs font-bold block">Electronics & Gadgets</span>
                    <span className="text-[11px] text-slate-500">Enables Serial Number / IMEI Logging</span>
                  </div>
                </div>
                {verticalChangeTenant.businessVertical === 'electronics' && (
                  <CheckCircle2 className="w-5 h-5 text-sky-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
