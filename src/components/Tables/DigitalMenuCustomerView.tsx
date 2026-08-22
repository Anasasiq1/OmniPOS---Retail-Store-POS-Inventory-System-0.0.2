import React, { useState } from 'react';
import {
  QrCode,
  Smartphone,
  Utensils,
  Flame,
  Plus,
  ShoppingBag,
  CheckCircle2,
  Share2,
  Download,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types';

export const DigitalMenuCustomerView: React.FC = () => {
  const { products, businessType, settings, addToCart, setActiveTab } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [customerOrderItems, setCustomerOrderItems] = useState<{ product: Product; count: number }[]>([]);
  const [orderSent, setOrderSent] = useState<boolean>(false);

  const menuProducts = products.filter((p) => p.businessType === 'restaurant');
  const categories = ['All', ...Array.from(new Set(menuProducts.map((p) => p.category)))];

  const filteredItems = menuProducts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesVeg = !vegOnly || p.isVeg === true;
    return matchesCat && matchesVeg;
  });

  const handleAddItem = (prod: Product) => {
    setCustomerOrderItems((prev) => {
      const exists = prev.find((i) => i.product.id === prod.id);
      if (exists) {
        return prev.map((i) => (i.product.id === prod.id ? { ...i, count: i.count + 1 } : i));
      }
      return [...prev, { product: prod, count: 1 }];
    });
  };

  const handlePlaceOrder = () => {
    customerOrderItems.forEach((item) => {
      addToCart(item.product, item.count);
    });
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
      setCustomerOrderItems([]);
      setActiveTab('pos');
    }, 1500);
  };

  const customerTotal = customerOrderItems.reduce(
    (acc, i) => acc + i.count * i.product.price,
    0
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-900 p-4 md:p-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Customer QR Digital Menu
            </h2>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live Preview
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Diners scan the table QR code on their smartphone to browse dishes with photos, allergen info, and order to kitchen.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Standee QR</span>
          </button>
        </div>
      </div>

      {/* Main Dual Pane: QR Standee on left, Mobile Mockup on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 flex-1">
        {/* Left Card: Printable Table Standee */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 flex flex-col items-center text-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Table QR Standee
            </span>
            <h3 className="text-lg font-bold text-white">{settings.storeName}</h3>
            <p className="text-xs text-slate-400">Scan for contactless menu & order</p>
          </div>

          <div className="my-6 p-4 bg-white rounded-2xl shadow-lg border-4 border-slate-900 max-w-[220px]">
            {/* SVG QR Code */}
            <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100">
              <rect x="5" y="5" width="28" height="28" rx="4" fill="currentColor" />
              <rect x="10" y="10" width="18" height="18" rx="2" fill="white" />
              <rect x="14" y="14" width="10" height="10" fill="currentColor" />
              <rect x="67" y="5" width="28" height="28" rx="4" fill="currentColor" />
              <rect x="72" y="10" width="18" height="18" rx="2" fill="white" />
              <rect x="76" y="14" width="10" height="10" fill="currentColor" />
              <rect x="5" y="67" width="28" height="28" rx="4" fill="currentColor" />
              <rect x="10" y="72" width="18" height="18" rx="2" fill="white" />
              <rect x="14" y="76" width="10" height="10" fill="currentColor" />
              <rect x="40" y="8" width="6" height="6" fill="currentColor" />
              <rect x="50" y="16" width="10" height="6" fill="currentColor" />
              <rect x="40" y="40" width="20" height="20" rx="3" fill="#6366f1" />
              <rect x="68" y="40" width="8" height="6" fill="currentColor" />
              <rect x="80" y="50" width="12" height="12" fill="currentColor" />
              <rect x="40" y="68" width="6" height="14" fill="currentColor" />
              <rect x="52" y="72" width="14" height="6" fill="currentColor" />
            </svg>
            <span className="text-[10px] font-bold text-slate-700 block mt-2">TABLE #04 DINE-IN</span>
          </div>

          <p className="text-xs text-slate-400 max-w-xs">
            Place this QR standee on each restaurant table. Orders placed flow into the active POS cart instantly.
          </p>
        </div>

        {/* Right 2 Cols: Interactive Mobile Phone Diner View */}
        <div className="lg:col-span-2 bg-white text-slate-900 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col max-h-[700px] overflow-hidden">
          {/* Diner Phone Header */}
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Table #04 • Dine In
              </span>
              <h3 className="text-base font-bold text-slate-900">{settings.storeName}</h3>
            </div>

            {/* Veg toggle */}
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Veg Only</span>
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>
          </div>

          {/* Category Chips */}
          <div className="py-3 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Food Menu List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {filteredItems.map((prod) => (
              <div
                key={prod.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Utensils className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      {prod.isVeg !== undefined && (
                        <span
                          className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                            prod.isVeg ? 'border-emerald-600' : 'border-rose-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              prod.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                        </span>
                      )}
                      <h4 className="font-bold text-xs text-slate-900">{prod.name}</h4>
                    </div>
                    {prod.nameMl && (
                      <p className="text-[11px] text-slate-500">{prod.nameMl}</p>
                    )}
                    <span className="font-black text-xs text-indigo-700 mt-1 block">
                      {settings.currency}
                      {prod.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddItem(prod)}
                  className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            ))}
          </div>

          {/* Diner Cart Footer */}
          {customerOrderItems.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 p-3 rounded-2xl">
              <div>
                <span className="text-xs text-slate-500 font-medium">
                  {customerOrderItems.reduce((acc, i) => acc + i.count, 0)} Items Added
                </span>
                <div className="text-base font-black text-slate-900">
                  {settings.currency}
                  {customerTotal.toFixed(2)}
                </div>
              </div>

              <button
                disabled={orderSent}
                onClick={handlePlaceOrder}
                className="px-5 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2"
              >
                {orderSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sent to Kitchen POS!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Place Order to Table</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
