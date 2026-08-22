import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Sparkles,
  Percent,
  DollarSign,
  Copy,
  Calendar,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Coupon } from '../../types';

export const CouponsManager: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = usePOS();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form
  const [code, setCode] = useState<string>('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(20);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(10);
  const [validUntil, setValidUntil] = useState<string>(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [usageLimit, setUsageLimit] = useState<number>(100);

  const filteredCoupons = coupons.filter(
    (c) =>
      searchQuery === '' ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: code.toUpperCase(),
        title: `${code.toUpperCase()} Promo`,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount: discountType === 'percentage' ? maxDiscountAmount : undefined,
        startDate: new Date().toISOString().split('T')[0],
        endDate: validUntil,
        validUntil,
        usageLimit,
      });
    } else {
      addCoupon({
        code: code.toUpperCase(),
        title: `${code.toUpperCase()} Promo`,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount: discountType === 'percentage' ? maxDiscountAmount : undefined,
        startDate: new Date().toISOString().split('T')[0],
        endDate: validUntil,
        validUntil,
        usageLimit,
        isActive: true,
        applicableTo: 'all',
        description: `${discountType === 'percentage' ? `${discountValue}% OFF` : `$${discountValue} OFF`} on orders over $${minOrderAmount}`,
      });
    }

    setIsModalOpen(false);
    setEditingCoupon(null);
    setCode('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Coupon code "${text}" copied to clipboard!`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">Coupons & Promo Offers</h2>
            <p className="text-xs text-slate-500 font-medium">Create percentage discounts, flat cashback, and promo codes for POS & online web orders</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="coupons-search-input"
              type="text"
              placeholder="Search coupon code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl w-56 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            id="add-new-coupon-btn"
            onClick={() => {
              setEditingCoupon(null);
              setCode('');
              setDiscountValue(15);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCoupons.map((coupon) => {
            const isExpired = new Date(coupon.validUntil) < new Date();

            return (
              <div
                key={coupon.id}
                id={`coupon-card-${coupon.code}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
                {/* Top Banner Tag */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-slate-900 tracking-wider bg-slate-100 px-3 py-1 rounded-xl border border-dashed border-slate-300 font-mono">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                      title="Copy Code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      coupon.isActive && !isExpired
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                {/* Value Pill */}
                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                  <p className="text-xs font-bold text-rose-700">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `$${coupon.discountValue} FLAT DISCOUNT`}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Min Order: ${coupon.minOrderAmount}{' '}
                    {coupon.maxDiscountAmount ? `• Max Cap: $${coupon.maxDiscountAmount}` : ''}
                  </p>
                </div>

                {/* Validity & Usage Counter */}
                <div className="text-xs text-slate-500 space-y-1">
                  <p className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Valid till: <span className="font-semibold text-slate-700">{coupon.validUntil}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    Redeemed: <span className="font-bold text-slate-900">{coupon.usageCount || 0}</span> / {coupon.usageLimit || '∞'} times
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })}
                    className={`text-[11px] font-bold ${
                      coupon.isActive ? 'text-slate-500 hover:text-slate-800' : 'text-emerald-600 hover:text-emerald-700'
                    }`}
                  >
                    {coupon.isActive ? 'Pause Coupon' : 'Enable Coupon'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCoupon(coupon);
                        setCode(coupon.code);
                        setDiscountType(coupon.discountType);
                        setDiscountValue(coupon.discountValue);
                        setMinOrderAmount(coupon.minOrderAmount);
                        setMaxDiscountAmount(coupon.maxDiscountAmount || 0);
                        setValidUntil(coupon.validUntil);
                        setUsageLimit(coupon.usageLimit || 100);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Coupon Promo Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20 or WELCOME5"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat ($)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {discountType === 'percentage' ? 'Percentage Value (%)' : 'Discount Amount ($)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Min Order Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                {discountType === 'percentage' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Max Discount Cap ($)</label>
                    <input
                      type="number"
                      min="1"
                      value={maxDiscountAmount}
                      onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Max Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="save-coupon-submit-btn"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
                >
                  {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
