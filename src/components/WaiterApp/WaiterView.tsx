import React, { useState } from 'react';
import {
  Utensils,
  Flame,
  Plus,
  Minus,
  Trash2,
  Send,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coffee,
  ChevronRight,
  Search,
  Sparkles,
  ArrowRightLeft,
  X,
  Volume2,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { CartItem, Product } from '../../types';

export const WaiterView: React.FC = () => {
  const {
    tables,
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    sendKotFromWaiter,
    currentUser,
    openPrintModal,
    updateTableStatus,
    orders,
  } = usePOS();

  const [activeTableNumber, setActiveTableNumber] = useState<string>('T-01');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [tableCart, setTableCart] = useState<CartItem[]>([]);
  const [waiterSearch, setWaiterSearch] = useState<string>('');
  const [specialNote, setSpecialNote] = useState<string>('');
  const [kotSentSuccess, setKotSentSuccess] = useState<boolean>(false);

  const activeTable = tables.find((t) => t.number === activeTableNumber) || tables[0];

  const quickModifierTags = ['Less Spicy', 'Extra Spicy', 'No Onion/Garlic', 'Extra Sauce', 'Crispy', 'Fast Service'];

  const filteredWaiterProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery = waiterSearch === '' || p.name.toLowerCase().includes(waiterSearch.toLowerCase());
    return matchesCat && matchesQuery && p.isActive !== false;
  });

  const addItemToTable = (product: Product) => {
    setTableCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          unitPrice: product.price,
        },
      ];
    });
  };

  const updateTableItemQty = (prodId: string, delta: number) => {
    setTableCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === prodId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleFireKot = () => {
    if (tableCart.length === 0) return;
    const noteContent = specialNote ? specialNote : undefined;
    const createdOrder = sendKotFromWaiter(activeTableNumber, tableCart, guestCount, noteContent);
    setKotSentSuccess(true);
    setTableCart([]);
    setSpecialNote('');
    setTimeout(() => setKotSentSuccess(false), 3000);
  };

  const handleRequestPreBill = () => {
    const matchedOrder = orders.find((o) => o.tableNumber === activeTableNumber && o.status !== 'paid' && o.status !== 'cancelled');
    if (matchedOrder) {
      openPrintModal(matchedOrder, 'bill');
    } else if (tableCart.length > 0) {
      const subtotal = tableCart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
      const tax = Number(((subtotal * 5) / 100).toFixed(2));
      const tempOrder = {
        id: 'ord-temp',
        orderNumber: 'EST-PRE',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        type: 'dine-in' as any,
        tableNumber: activeTableNumber,
        customerName: `Table ${activeTableNumber} Guest`,
        waiterName: currentUser.name,
        items: tableCart,
        subtotal,
        discountAmount: 0,
        taxAmount: tax,
        total: Number((subtotal + tax).toFixed(2)),
        paymentMethod: 'cash' as any,
        status: 'cooking' as any,
        businessType: 'restaurant' as any,
        tenantId: 'tenant-01',
      };
      openPrintModal(tempOrder, 'bill');
    } else {
      alert(`No active running orders or pending items for Table ${activeTableNumber}`);
    }
  };

  const cartSubtotal = tableCart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden">
      {/* Waiter Top Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-sm text-white tracking-wide">WAITER ORDER TERMINAL</h2>
              <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-500/30">
                Staff: {currentUser.name}
              </span>
            </div>
            <p className="text-xs text-slate-400">Fast Table Ordering & KOT Dispatch Station</p>
          </div>
        </div>

        {/* Guest Count Counter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 px-3">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-300">Guests:</span>
          <div className="flex items-center gap-1.5 ml-1">
            <button
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-xs"
            >
              -
            </button>
            <span className="w-4 text-center font-black text-xs text-white">{guestCount}</span>
            <button
              onClick={() => setGuestCount(guestCount + 1)}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-xs"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Table Selector Horizontal Bar */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Tables:</span>
        {tables.map((tbl) => {
          const isSelected = tbl.number === activeTableNumber;
          return (
            <button
              key={tbl.id}
              id={`waiter-table-btn-${tbl.number}`}
              onClick={() => setActiveTableNumber(tbl.number)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-orange-600 text-white border-orange-500 shadow-md ring-2 ring-orange-500/30'
                  : tbl.status === 'occupied'
                  ? 'bg-slate-800/90 text-amber-300 border-amber-500/40 hover:bg-slate-800'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>{tbl.name || tbl.number}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  tbl.status === 'occupied' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Main Waiter Work Area: Left Menu, Right Running Table Order */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Food Catalog */}
        <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-900/50 overflow-hidden">
          {/* Search & Category Pills */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="waiter-menu-search"
                type="text"
                placeholder="Search food item to add..."
                value={waiterSearch}
                onChange={(e) => setWaiterSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {filteredWaiterProducts.map((prod) => {
                const countInTable = tableCart.find((i) => i.product.id === prod.id)?.quantity || 0;
                return (
                  <div
                    key={prod.id}
                    id={`waiter-add-item-${prod.id}`}
                    onClick={() => addItemToTable(prod)}
                    className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-orange-500/50 rounded-xl p-2.5 flex flex-col justify-between cursor-pointer transition-all active:scale-97 select-none relative group"
                  >
                    {countInTable > 0 && (
                      <div className="absolute top-2 right-2 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                        {countInTable}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-xs text-white line-clamp-1">{prod.name}</h4>
                      <p className="text-[10px] text-slate-400">{prod.category}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="font-black text-xs text-orange-400">${prod.price.toFixed(2)}</span>
                      <span className="w-5 h-5 rounded bg-slate-700 group-hover:bg-orange-600 text-white flex items-center justify-center font-bold text-xs transition-colors">
                        +
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Running Order for Selected Table & KOT Dispatch */}
        <div className="w-full md:w-[360px] lg:w-[400px] bg-slate-950 flex flex-col border-l border-slate-800">
          {/* Table Running Header */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
              <div>
                <h3 className="font-black text-sm text-white">Table {activeTableNumber} Order</h3>
                <p className="text-[10px] text-slate-400">
                  Status: {activeTable.status.toUpperCase()} • Guests: {guestCount}
                </p>
              </div>
            </div>
            {tableCart.length > 0 && (
              <button
                onClick={() => setTableCart([])}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Modifier Chips */}
          <div className="p-2.5 bg-slate-900/60 border-b border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chef Instructions / Modifiers:</p>
            <div className="flex flex-wrap gap-1">
              {quickModifierTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSpecialNote((prev) => (prev ? `${prev}, ${tag}` : tag))}
                  className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-md transition-colors"
                >
                  +{tag}
                </button>
              ))}
            </div>
            {specialNote && (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-1 rounded">
                <span className="truncate">Note: {specialNote}</span>
                <button onClick={() => setSpecialNote('')} className="text-slate-400 hover:text-white ml-2">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Table Items Cart */}
          <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-2">
            {tableCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6">
                <Coffee className="w-10 h-10 stroke-1 mb-2 text-slate-600" />
                <p className="text-xs font-bold text-slate-400">No Pending Items</p>
                <p className="text-[10px] text-slate-500 mt-1">Tap items on the left to fire a new KOT round for Table {activeTableNumber}.</p>
              </div>
            ) : (
              tableCart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-white truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-orange-400 font-semibold">${item.unitPrice.toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                      <button
                        onClick={() => updateTableItemQty(item.product.id, -1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-black text-xs text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateTableItemQty(item.product.id, 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-black text-xs text-white min-w-[50px] text-right">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* KOT Dispatch & Pre-Bill Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
            {kotSentSuccess && (
              <div className="p-2 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                🔥 KOT Sent to Kitchen Display Successfully!
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Pending Round Total:</span>
              <span className="font-black text-sm text-white">${cartSubtotal.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="waiter-request-prebill-btn"
                onClick={handleRequestPreBill}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Print Pre-Bill</span>
              </button>

              <button
                id="waiter-send-kot-btn"
                disabled={tableCart.length === 0}
                onClick={handleFireKot}
                className="py-2.5 px-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 disabled:opacity-40"
              >
                <Flame className="w-4 h-4" />
                <span>Send KOT to Chef</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
