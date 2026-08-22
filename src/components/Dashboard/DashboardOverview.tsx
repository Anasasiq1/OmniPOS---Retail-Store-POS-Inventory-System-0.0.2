import React from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  BookOpen,
  UtensilsCrossed,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Play,
  QrCode,
  Flame,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const DashboardOverview: React.FC = () => {
  const {
    orders,
    products,
    customers,
    tables,
    businessType,
    setActiveTab,
    settings,
    openPrintModal,
    t,
  } = usePOS();

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const avgBill = totalOrders > 0 ? totalSales / totalOrders : 0;
  const expiringProducts = products.filter((p) => p.businessType === businessType && p.isExpiringSoon);
  const lowStockProducts = products.filter(
    (p) => p.businessType === businessType && p.stock > 0 && p.stock <= p.minStockAlert
  );
  const totalKhataDebt = customers
    .filter((c) => c.netBalance > 0)
    .reduce((acc, c) => acc + c.netBalance, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-100 p-4 md:p-6 space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Welcome back, Store Manager
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              {businessType.toUpperCase()} MODE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time terminal telemetry, active tables, stock alerts, and cashier operations.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="quick-start-sale-btn"
            onClick={() => setActiveTab('pos')}
            className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Launch POS Terminal</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">{t('total_sales', 'Total Sales Today')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {settings.currency}
            {totalSales.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +18.5% this shift
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">{t('total_orders', 'Orders Handled')}</span>
            <ShoppingCart className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalOrders}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Invoices generated</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">{t('avg_bill', 'Avg. Bill Value')}</span>
            <span className="text-xs font-bold text-slate-400">ABV</span>
          </div>
          <div className="text-2xl font-black text-indigo-600">
            {settings.currency}
            {avgBill.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Average basket size</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">{t('khata_collection', 'Khata Receivables')}</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">
            {settings.currency}
            {totalKhataDebt.toFixed(2)}
          </div>
          <span className="text-[10px] text-amber-600 font-medium mt-1 block">Due from {customers.length} patrons</span>
        </div>
      </div>

      {/* Middle Section: Recent Orders & Stock Alarms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices / Orders Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Recent Completed Invoices</h3>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              View Full History →
            </button>
          </div>

          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                onClick={() => openPrintModal(order, 'receipt')}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    #
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{order.orderNumber}</span>
                      {order.tableNumber && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                          Table {order.tableNumber}
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {order.items.length} items • {order.time}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-xs text-slate-900 block">
                    {settings.currency}
                    {order.total.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 justify-end">
                    <CheckCircle2 className="w-3 h-3" /> Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Alarms & Alerts */}
        <div className="space-y-4">
          {/* Expiring Soon Alarm */}
          {expiringProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-900">
                <Flame className="w-5 h-5 text-amber-600 shrink-0" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  Expiry Alert ({expiringProducts.length} Items)
                </h4>
              </div>
              <p className="text-xs text-amber-800">
                Products nearing expiry within 3 days. Consider markdown discounts or priority sales:
              </p>
              <div className="space-y-1.5">
                {expiringProducts.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    className="p-2 bg-white/90 rounded-lg text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800 truncate">{prod.name}</span>
                    <span className="text-amber-700 font-bold text-[11px] shrink-0">
                      {prod.stock} {prod.unit} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Warning */}
          {lowStockProducts.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-900">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  Low Stock Alert ({lowStockProducts.length})
                </h4>
              </div>
              <div className="space-y-1.5">
                {lowStockProducts.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    className="p-2 bg-white/90 rounded-lg text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800 truncate">{prod.name}</span>
                    <span className="text-rose-700 font-bold text-[11px] shrink-0">
                      Only {prod.stock} left
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('inventory')}
                className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Reorder in Inventory →
              </button>
            </div>
          )}

          {/* Restaurant Table Snapshot */}
          {businessType === 'restaurant' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <UtensilsCrossed className="w-4 h-4 text-indigo-600" />
                  <span>Floor Plan Status</span>
                </h4>
                <button
                  onClick={() => setActiveTab('tables')}
                  className="text-[11px] font-bold text-indigo-600"
                >
                  Manage Tables →
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {tables.slice(0, 8).map((tbl) => (
                  <div
                    key={tbl.id}
                    className={`p-2 rounded-xl text-center text-xs font-bold border ${
                      tbl.status === 'occupied'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    <span>{tbl.number}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
