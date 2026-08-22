import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Truck,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  Printer,
  Package,
  Layers,
  Clock,
  ArrowUpDown,
  Upload,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Purchase, PurchaseItem } from '../../types';

export const PurchaseManager: React.FC = () => {
  const { purchases, addPurchase, deletePurchase, updatePurchase, products, currentTenant, t, exportDataToCsv } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);

  // New Purchase Form State
  const [supplier, setSupplier] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'bank' | 'upi'>('cash');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [billImageUploaded, setBillImageUploaded] = useState(false);

  // Line items for the purchase
  const [items, setItems] = useState<Omit<PurchaseItem, 'id'>[]>([
    {
      productName: 'Fresh Tomatoes (തക്കാളി)',
      category: 'Vegetables',
      quantity: 50,
      unit: 'KG',
      rate: 40,
      tax: 0,
      total: 2000,
    },
    {
      productName: 'Big Onions (സവാള)',
      category: 'Vegetables',
      quantity: 30,
      unit: 'KG',
      rate: 35,
      tax: 0,
      total: 1050,
    },
    {
      productName: 'Cooking Oil (പാചക എണ്ണ)',
      category: 'Oil & Fat',
      quantity: 20,
      unit: 'L',
      rate: 140,
      tax: 0,
      total: 2800,
    },
  ]);

  const calculateSubtotal = () => items.reduce((acc, item) => acc + item.total, 0);
  const subtotal = calculateSubtotal();
  const pendingAmount = Math.max(0, subtotal - paidAmount);

  const handleAddItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        productName: '',
        category: 'General',
        quantity: 1,
        unit: 'KG',
        rate: 0,
        tax: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof Omit<PurchaseItem, 'id'>, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'rate') {
        const q = field === 'quantity' ? Number(value) : item.quantity;
        const r = field === 'rate' ? Number(value) : item.rate;
        item.total = q * r;
      }
      updated[index] = item;
      return updated;
    });
  };

  const handleSelectExistingProduct = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        productId: prod.id,
        productName: prod.name,
        category: prod.category,
        quantity: 10,
        unit: prod.unit || 'KG',
        rate: prod.costPrice || prod.price * 0.7,
        tax: 0,
        total: 10 * (prod.costPrice || prod.price * 0.7),
      };
      return updated;
    });
  };

  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier.trim() || items.length === 0) return;

    const validItems: PurchaseItem[] = items.map((it, idx) => ({
      ...it,
      id: `pitem-${Date.now()}-${idx}`,
    }));

    addPurchase({
      purchaseDate,
      supplier: supplier.trim(),
      invoiceNumber: invoiceNumber.trim() || `INV-${Date.now().toString().slice(-6)}`,
      items: validItems,
      subtotal,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: subtotal,
      paymentMethod,
      paidAmount: paymentMethod === 'credit' ? paidAmount : subtotal,
      pendingAmount: paymentMethod === 'credit' ? pendingAmount : 0,
      notes: notes.trim(),
      status: paymentMethod === 'credit' && pendingAmount > 0 ? (paidAmount > 0 ? 'partial' : 'pending') : 'completed',
    });

    setIsAddModalOpen(false);
    // Reset form
    setSupplier('');
    setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
    setNotes('');
    setPaidAmount(0);
  };

  // Filtered Purchases
  const filteredPurchases = purchases.filter((p) => {
    const matchesSearch =
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.items.some((it) => it.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDate = !dateFilter || p.purchaseDate === dateFilter;
    const matchesPayment = paymentFilter === 'all' || p.paymentMethod === paymentFilter;
    return matchesSearch && matchesDate && matchesPayment;
  });

  // Aggregate Metrics
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayPurchases = purchases.filter((p) => p.purchaseDate === todayDateStr);
  const totalPurchaseValueToday = todayPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPendingSupplierCredit = purchases.reduce((sum, p) => sum + p.pendingAmount, 0);
  const totalPurchasesMonth = purchases.reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('purchases', 'Daily Purchase Management')}
              </h1>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {purchases.length} Invoices
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Record daily incoming raw materials, vegetable procurements, ingredients & update stock automatically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="export-purchases-btn"
              onClick={() => exportDataToCsv('purchases')}
              className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              id="add-purchase-btn"
              onClick={() => {
                setPaidAmount(subtotal);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Record Daily Purchase</span>
            </button>
          </div>
        </div>

        {/* Metrics Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Purchases</p>
              <p className="text-xl font-black text-slate-900">₹{totalPurchaseValueToday.toLocaleString()}</p>
              <p className="text-[11px] text-indigo-600 font-semibold">{todayPurchases.length} invoices received today</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Supplier Credit</p>
              <p className="text-xl font-black text-amber-700">₹{totalPendingSupplierCredit.toLocaleString()}</p>
              <p className="text-[11px] text-amber-600 font-semibold">Unsettled vendor balances</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Month Procurement</p>
              <p className="text-xl font-black text-emerald-700">₹{totalPurchasesMonth.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-600 font-semibold">Auto-synced with store inventory</p>
            </div>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search supplier, item name, invoice #..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent outline-none text-slate-800 text-xs font-semibold cursor-pointer"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-slate-400 hover:text-slate-700 text-xs ml-1"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="all">All Payment Types</option>
              <option value="cash">Cash Paid</option>
              <option value="credit">Credit / Pending</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Purchases Table List */}
      <div className="p-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date & Invoice</th>
                  <th className="py-3.5 px-4">Supplier / Vendor</th>
                  <th className="py-3.5 px-4">Procured Items</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment & Status</th>
                  <th className="py-3.5 px-4">Recorded By</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-12 h-12 text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-600">No purchase records found</p>
                        <p className="text-xs text-slate-400">Click "Record Daily Purchase" above to add invoice entries.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{purchase.invoiceNumber}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {purchase.purchaseDate}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                            {(purchase.supplier || 'Supplier').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{purchase.supplier || 'Supplier'}</p>
                            {purchase.notes && <p className="text-[11px] text-slate-400 truncate max-w-xs">{purchase.notes}</p>}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 max-w-xs">
                          {purchase.items.map((item, idx) => (
                            <div key={idx} className="text-xs flex items-center justify-between text-slate-600 bg-slate-50 px-2 py-0.5 rounded">
                              <span className="font-medium truncate">{item.productName}</span>
                              <span className="font-bold text-slate-800 ml-2">
                                {item.quantity} {item.unit} × ₹{item.rate}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-base">₹{purchase.totalAmount.toLocaleString()}</span>
                          {purchase.pendingAmount > 0 ? (
                            <span className="text-[11px] text-amber-700 font-bold">
                              ₹{purchase.paidAmount.toLocaleString()} Paid (₹{purchase.pendingAmount.toLocaleString()} Due)
                            </span>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-bold">Fully Paid</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                              purchase.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : purchase.status === 'partial'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {purchase.status}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium uppercase">{purchase.paymentMethod}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">{purchase.createdBy}</td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingPurchase(purchase)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Invoice Slip"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete invoice ${purchase.invoiceNumber}?`)) {
                                deletePurchase(purchase.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Purchase"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Daily Purchase Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Record Daily Purchase / Raw Materials</h2>
                <p className="text-xs text-slate-400">Stock will be automatically updated in store inventory.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePurchase} className="p-6 space-y-5">
              {/* Supplier & Invoice metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Supplier / Vendor *</label>
                  <input
                    type="text"
                    required
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="e.g. Ernakulam Wholesale Market"
                    className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Invoice / Bill Number *</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="INV-1092"
                    className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Purchase Date *</label>
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Procured Items Line-Item Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Purchased Items / Ingredients ({items.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
                  {items.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded-xl border border-slate-200/80 flex flex-wrap sm:flex-nowrap items-center gap-2 shadow-2xs">
                      {/* Name input / selector */}
                      <div className="flex-1 min-w-[160px]">
                        <input
                          type="text"
                          required
                          placeholder="Item Name (e.g. Tomato / അരി)"
                          value={item.productName}
                          onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                          className="w-full h-9 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-semibold"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="w-20">
                        <input
                          type="number"
                          min="0.1"
                          step="any"
                          required
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full h-9 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-bold text-center"
                        />
                      </div>

                      {/* Unit */}
                      <div className="w-20">
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                          className="w-full h-9 px-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-700"
                        >
                          <option value="KG">KG</option>
                          <option value="L">Litre</option>
                          <option value="Pcs">Pcs</option>
                          <option value="Gram">Gram</option>
                          <option value="Box">Box</option>
                          <option value="Bag">Bag (അരി ചാക്ക്)</option>
                        </select>
                      </div>

                      {/* Rate */}
                      <div className="w-24">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            required
                            placeholder="Rate"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                            className="w-full h-9 pl-5 pr-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-bold"
                          />
                        </div>
                      </div>

                      {/* Total */}
                      <div className="w-24 text-right font-black text-slate-900 text-sm">
                        ₹{item.total.toLocaleString()}
                      </div>

                      {/* Delete row */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(index)}
                        disabled={items.length <= 1}
                        className="p-1.5 text-slate-300 hover:text-rose-600 disabled:opacity-30 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details & Settlement */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                  >
                    <option value="cash">Cash (പണം)</option>
                    <option value="credit">Credit / Udhaar (കടം)</option>
                    <option value="upi">UPI (GPay / PhonePe)</option>
                    <option value="bank">Bank Transfer (NEFT/RTGS)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount Paid Now (₹)</label>
                  <input
                    type="number"
                    min="0"
                    max={subtotal}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-xl outline-none font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Balance Due (₹)</label>
                  <div className="h-10 px-3 text-sm bg-amber-50 border border-amber-200 rounded-xl flex items-center font-black text-amber-900">
                    ₹{pendingAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Notes & Upload Bill image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Remarks</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Delivered to kitchen store room, fresh batch"
                    className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Upload Bill Image / Receipt</label>
                  <button
                    type="button"
                    onClick={() => setBillImageUploaded(!billImageUploaded)}
                    className={`w-full h-10 px-3 border rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      billImageUploaded
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>{billImageUploaded ? 'Bill Image Attached (INV.jpg)' : 'Attach Vendor Bill Scan'}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Actions & Total */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-bold">Total Invoice Value</span>
                  <span className="text-2xl font-black text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-98"
                  >
                    Save & Update Stock
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Purchase Slip Modal */}
      {viewingPurchase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Procurement Invoice</span>
                <h3 className="text-lg font-black text-slate-900">{viewingPurchase.invoiceNumber}</h3>
              </div>
              <button onClick={() => setViewingPurchase(null)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <p><strong>Supplier:</strong> {viewingPurchase.supplier}</p>
              <p><strong>Date:</strong> {viewingPurchase.purchaseDate}</p>
              <p><strong>Payment Mode:</strong> <span className="uppercase font-bold">{viewingPurchase.paymentMethod}</span></p>
              <p><strong>Recorded By:</strong> {viewingPurchase.createdBy}</p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Rate</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewingPurchase.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-medium">{it.productName}</td>
                      <td className="p-2 text-center">{it.quantity} {it.unit}</td>
                      <td className="p-2 text-right">₹{it.rate}</td>
                      <td className="p-2 text-right font-bold">₹{it.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-sm">
              <span className="font-bold text-slate-700">Total Purchase:</span>
              <span className="text-xl font-black text-slate-900">₹{viewingPurchase.totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice Slip</span>
              </button>
              <button
                onClick={() => setViewingPurchase(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
