import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Filter,
  Check,
  RefreshCw,
  UtensilsCrossed,
  ShoppingBag,
  Send,
  Timer,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Order, OrderStatus } from '../../types';

export const ChefKDSView: React.FC = () => {
  const { orders, bumpChefOrderStatus, updateOrderStatus, openPrintModal } = usePOS();
  const [filterChannel, setFilterChannel] = useState<'all' | 'dine-in' | 'takeaway' | 'delivery'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Real-time ticking clock for elapsed timer calculations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter orders relevant for kitchen (placed, cooking, confirmed, ready)
  const kitchenOrders = orders.filter((o) => {
    const isKitchenActive = ['placed', 'confirmed', 'cooking', 'ready'].includes(o.status);
    const matchesChannel = filterChannel === 'all' || o.type === filterChannel;
    return isKitchenActive && matchesChannel;
  });

  const cookingCount = orders.filter((o) => o.status === 'cooking').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const placedCount = orders.filter((o) => o.status === 'placed' || o.status === 'confirmed').length;

  const toggleItemCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getElapsedTimeMinutes = (order: Order): number => {
    const start = order.preparationStartedAt || order.timestamp || Date.now();
    return Math.floor((currentTime - start) / 60000);
  };

  const playKitchenChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top KDS Control Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg">
        {/* Title & Live Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base text-white tracking-wider">CHEF KITCHEN DISPLAY (KDS)</h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-xs text-slate-400">Live Kitchen Order Tickets & Expediter Display</p>
          </div>
        </div>

        {/* Status Metrics Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-400 font-semibold">Incoming:</span>
            <span className="font-black text-white">{placedCount}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-orange-950/60 border border-orange-500/40 flex items-center gap-2 text-xs text-orange-300">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-semibold">Cooking:</span>
            <span className="font-black text-orange-400">{cookingCount}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold">Ready:</span>
            <span className="font-black text-emerald-400">{readyCount}</span>
          </div>
        </div>

        {/* Filter Channels & Audio Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
            <button
              id="kds-filter-all"
              onClick={() => setFilterChannel('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterChannel === 'all' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Channels
            </button>
            <button
              id="kds-filter-dine-in"
              onClick={() => setFilterChannel('dine-in')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterChannel === 'dine-in' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dine-In
            </button>
            <button
              id="kds-filter-takeaway"
              onClick={() => setFilterChannel('takeaway')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterChannel === 'takeaway' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Takeaway
            </button>
            <button
              id="kds-filter-delivery"
              onClick={() => setFilterChannel('delivery')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterChannel === 'delivery' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Delivery
            </button>
          </div>

          <button
            id="kds-sound-toggle-btn"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playKitchenChime();
            }}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-slate-800 text-orange-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
            }`}
            title={soundEnabled ? 'Kitchen Sound Alert Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main KDS Grid Canvas */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {kitchenOrders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-8">
            <UtensilsCrossed className="w-16 h-16 stroke-1 mb-3 text-slate-700" />
            <h3 className="font-black text-lg text-slate-400">All Kitchen Orders Cleared!</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              There are no pending tickets in the kitchen queue. New orders fired from the POS or Waiter App will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {kitchenOrders.map((order) => {
              const elapsedMins = getElapsedTimeMinutes(order);
              const isUrgent = elapsedMins >= 20;
              const isWarning = elapsedMins >= 10 && elapsedMins < 20;

              return (
                <div
                  key={order.id}
                  id={`kds-ticket-${order.id}`}
                  className={`rounded-2xl border flex flex-col justify-between overflow-hidden transition-all shadow-xl ${
                    order.status === 'ready'
                      ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30'
                      : isUrgent
                      ? 'bg-rose-950/50 border-rose-500/80 ring-2 ring-rose-500/50 animate-pulse'
                      : isWarning
                      ? 'bg-amber-950/40 border-amber-500/60'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  {/* Card Header: KOT #, Table, Timer */}
                  <div className="p-3.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">{order.kotNumber || order.orderNumber}</span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            order.type === 'dine-in'
                              ? 'bg-indigo-900 text-indigo-200'
                              : order.type === 'delivery'
                              ? 'bg-purple-900 text-purple-200'
                              : 'bg-emerald-900 text-emerald-200'
                          }`}
                        >
                          {order.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                        {order.tableNumber ? `Table: ${order.tableNumber}` : order.customerName} • {order.time}
                      </p>
                    </div>

                    {/* Preparation Elapsed Timer */}
                    <div
                      className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-lg border ${
                        isUrgent
                          ? 'bg-rose-600 text-white border-rose-500'
                          : isWarning
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <Timer className="w-3.5 h-3.5" />
                      <span>{elapsedMins}m</span>
                    </div>
                  </div>

                  {/* Card Body: Items Checklist */}
                  <div className="p-3.5 flex-1 space-y-2 overflow-y-auto max-h-60 custom-scrollbar">
                    {order.items.map((item, idx) => {
                      const itemKey = `${order.id}-${idx}`;
                      const isChecked = checkedItems[itemKey];

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleItemCheck(itemKey)}
                          className={`p-2 rounded-xl border flex items-start justify-between gap-2 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-slate-950/60 border-slate-800 text-slate-500 line-through'
                              : 'bg-slate-800/80 border-slate-700/60 text-white hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-2 flex-1">
                            <div
                              className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 ${
                                isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-600 bg-slate-900'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3" />}
                            </div>
                            <div>
                              <p className="font-bold text-xs leading-tight">
                                <span className="text-orange-400 font-black mr-1">{item.quantity}x</span>
                                {item.product.name}
                              </p>
                              {item.selectedVariant && (
                                <p className="text-[10px] text-indigo-300">Portion: {item.selectedVariant.name}</p>
                              )}
                              {item.selectedAddons && item.selectedAddons.length > 0 && (
                                <p className="text-[10px] text-slate-400">
                                  + {item.selectedAddons.map((a) => a.name).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {order.notes && (
                      <div className="p-2 bg-amber-950/40 border border-amber-700/50 rounded-xl text-[11px] font-bold text-amber-300">
                        ⚡ Chef Instruction: {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Expediter Bump Bar Actions */}
                  <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-2">
                    {order.status === 'placed' || order.status === 'confirmed' ? (
                      <button
                        id={`kds-start-cooking-${order.id}`}
                        onClick={() => {
                          bumpChefOrderStatus(order.id, 'cooking');
                          playKitchenChime();
                        }}
                        className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Start Cooking</span>
                      </button>
                    ) : order.status === 'cooking' ? (
                      <button
                        id={`kds-mark-ready-${order.id}`}
                        onClick={() => {
                          bumpChefOrderStatus(order.id, 'ready');
                          playKitchenChime();
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Ready to Serve</span>
                      </button>
                    ) : (
                      <button
                        id={`kds-mark-served-${order.id}`}
                        onClick={() => {
                          bumpChefOrderStatus(order.id, 'paid');
                        }}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-black rounded-xl border border-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Completed / Served</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
