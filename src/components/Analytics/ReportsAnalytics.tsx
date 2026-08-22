import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  QrCode,
  Banknote,
  BookOpen,
  DollarSign,
  Package,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const ReportsAnalytics: React.FC = () => {
  const { orders, products, customers, settings, businessType } = usePOS();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Metrics
  const totalGrossSales = orders.reduce((acc, o) => acc + o.total, 0);
  const totalTaxCollected = orders.reduce((acc, o) => acc + o.taxAmount, 0);
  const totalDiscounts = orders.reduce((acc, o) => acc + o.discountAmount, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalGrossSales / totalOrdersCount : 0;

  // Breakdown by payment method
  const upiTotal = orders.filter((o) => o.paymentMethod === 'upi').reduce((acc, o) => acc + o.total, 0);
  const cashTotal = orders.filter((o) => o.paymentMethod === 'cash').reduce((acc, o) => acc + o.total, 0);
  const cardTotal = orders.filter((o) => o.paymentMethod === 'card').reduce((acc, o) => acc + o.total, 0);
  const khataTotal = orders.filter((o) => o.paymentMethod === 'khata').reduce((acc, o) => acc + o.total, 0);

  // Hourly velocity mock data
  const hourlyData = [
    { hour: '9 AM', amount: 450, count: 3 },
    { hour: '11 AM', amount: 1280, count: 8 },
    { hour: '1 PM', amount: 2650, count: 14 },
    { hour: '3 PM', amount: 980, count: 5 },
    { hour: '5 PM', amount: 1840, count: 11 },
    { hour: '7 PM', amount: 3420, count: 19 },
    { hour: '9 PM', amount: 2100, count: 12 },
  ];
  const maxHourly = Math.max(...hourlyData.map((h) => h.amount));

  // Top selling products extracted from orders
  const itemSalesMap: Record<string, { name: string; qty: number; total: number }> = {};
  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      if (!itemSalesMap[item.product.id]) {
        itemSalesMap[item.product.id] = { name: item.product.name, qty: 0, total: 0 };
      }
      itemSalesMap[item.product.id].qty += item.quantity;
      itemSalesMap[item.product.id].total += item.quantity * item.unitPrice;
    });
  });
  const topSellingItems = Object.values(itemSalesMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Order ID,Date,Time,Type,Items Count,Subtotal,Tax,Discount,Total,Payment Method\n' +
      orders
        .map(
          (o) =>
            `${o.orderNumber},${o.date},${o.time},${o.type},${o.items.length},${o.subtotal},${o.taxAmount},${o.discountAmount},${o.total},${o.paymentMethod}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OmniPOS_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-100 p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Sales Reports & Business Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            GST tax reports, revenue trends, payment splits, and top-selling SKUs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            {(['today', 'week', 'month'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  timeRange === r
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            id="export-sales-csv-btn"
            onClick={handleExportCSV}
            className="h-10 px-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Gross Sales</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {settings.currency}
            {totalGrossSales.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs yesterday
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Invoices</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalOrdersCount}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Completed transactions</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Avg. Ticket Size</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {settings.currency}
            {avgOrderValue.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Per customer average</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">GST Collected ({settings.taxRatePercent}%)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {settings.currency}
            {totalTaxCollected.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Ready for GSTR-1 filing</span>
        </div>
      </div>

      {/* Middle Section: Hourly Velocity & Payment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Sales Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Hourly Sales Velocity</h3>
              <p className="text-xs text-slate-400">Peak trading hours and footfall volume</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              Peak: 7 PM - 9 PM
            </span>
          </div>

          <div className="pt-6 h-56 flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
            {hourlyData.map((slot, idx) => {
              const heightPercent = Math.round((slot.amount / maxHourly) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {settings.currency}
                    {slot.amount}
                  </span>
                  <div
                    style={{ height: `${Math.max(15, heightPercent)}%` }}
                    className="w-full max-w-[42px] bg-indigo-600 rounded-t-lg group-hover:bg-indigo-700 transition-all shadow-xs"
                  />
                  <span className="text-[11px] font-semibold text-slate-600">{slot.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Payment Modes</h3>
            <p className="text-xs text-slate-400">Tender splits across all bills</p>
          </div>

          <div className="space-y-3 pt-2">
            {/* UPI */}
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">UPI QR Pay</span>
                  <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</span>
                </div>
              </div>
              <span className="font-black text-xs text-indigo-900">
                {settings.currency}
                {upiTotal.toFixed(2)}
              </span>
            </div>

            {/* Cash */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Cash Tender</span>
                  <span className="text-[10px] text-slate-500">In-drawer currency</span>
                </div>
              </div>
              <span className="font-black text-xs text-emerald-900">
                {settings.currency}
                {cashTotal.toFixed(2)}
              </span>
            </div>

            {/* Card */}
            <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Card Swipes</span>
                  <span className="text-[10px] text-slate-500">EDC Pinpad</span>
                </div>
              </div>
              <span className="font-black text-xs text-sky-900">
                {settings.currency}
                {cardTotal.toFixed(2)}
              </span>
            </div>

            {/* Khata */}
            <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Khata Udhaar</span>
                  <span className="text-[10px] text-slate-500">Store credit ledger</span>
                </div>
              </div>
              <span className="font-black text-xs text-amber-900">
                {settings.currency}
                {khataTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Selling Items Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Top Performing Menu & Retail Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4 text-center">Units Sold</th>
                <th className="py-3 px-4 text-right">Revenue Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {topSellingItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-indigo-600">
                    {item.qty} units
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    {settings.currency}
                    {item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
