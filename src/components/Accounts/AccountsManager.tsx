import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Wallet,
  Receipt,
  Building,
  CreditCard,
  Zap,
  Droplets,
  Truck,
  Users,
  Utensils,
  Package,
  Trash2,
  FileSpreadsheet,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { AccountTransaction } from '../../types';

export const AccountsManager: React.FC = () => {
  const {
    accounts,
    addAccountTransaction,
    deleteAccountTransaction,
    purchases,
    orders,
    customers,
    exportDataToCsv,
    t,
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Transaction Form State
  const [transType, setTransType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<AccountTransaction['category']>('Electricity');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'upi' | 'card' | 'credit'>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Aggregate Numbers
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAccounts = accounts.filter((a) => a.date === todayStr);

  const todayIncome = todayAccounts.filter((a) => a.type === 'income').reduce((sum, a) => sum + a.amount, 0);
  const todayExpense = todayAccounts.filter((a) => a.type === 'expense').reduce((sum, a) => sum + a.amount, 0);
  const todayProfit = todayIncome - todayExpense;

  const todaySales = orders
    .filter((o) => o.date.includes('21 Aug') || o.date === new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }))
    .reduce((sum, o) => sum + o.total, 0);

  const todayPurchasesTotal = purchases.filter((p) => p.purchaseDate === todayStr).reduce((sum, p) => sum + p.totalAmount, 0);

  // Total Outstanding Customer Credit (Khata)
  const totalCustomerCredit = customers.reduce((sum, c) => sum + c.netBalance, 0);

  // Filtered List
  const filteredAccounts = accounts.filter((a) => {
    const matchesSearch =
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.referenceNumber && a.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDate = !dateFilter || a.date === dateFilter;
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesDate && matchesType && matchesCategory;
  });

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) return;

    addAccountTransaction({
      date,
      type: transType,
      category,
      description: description.trim(),
      amount: Number(amount),
      paymentMethod,
      referenceNumber: referenceNumber.trim() || undefined,
    });

    setIsAddModalOpen(false);
    setDescription('');
    setAmount('');
    setReferenceNumber('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('accounts', 'Daily Accounts & Ledger')}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Real-Time P&L
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Track daily store cash flows, utilities, salaries, vendor expenses, sales income & profit margins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="export-accounts-btn"
              onClick={() => exportDataToCsv('accounts')}
              className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              id="add-transaction-btn"
              onClick={() => {
                setTransType('expense');
                setCategory('Electricity');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Add Income / Expense</span>
            </button>
          </div>
        </div>

        {/* Financial Metrics Cards Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
          {/* Today's Income */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">{t('today_income', "Today's Income")}</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-lg font-black text-emerald-900 mt-1">₹{todayIncome.toLocaleString()}</p>
          </div>

          {/* Today's Expense */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">{t('today_expense', "Today's Expense")}</span>
              <TrendingDown className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-lg font-black text-rose-900 mt-1">₹{todayExpense.toLocaleString()}</p>
          </div>

          {/* Today's Profit */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">{t('today_profit', "Today's Profit")}</span>
              <DollarSign className="w-4 h-4 text-indigo-600" />
            </div>
            <p className={`text-lg font-black mt-1 ${todayProfit >= 0 ? 'text-indigo-900' : 'text-rose-700'}`}>
              ₹{todayProfit.toLocaleString()}
            </p>
          </div>

          {/* Today's Purchases */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{t('today_purchase', 'Purchases')}</span>
              <Package className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-lg font-black text-slate-800 mt-1">₹{todayPurchasesTotal.toLocaleString()}</p>
          </div>

          {/* POS Sales Total */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{t('today_sales', 'POS Sales')}</span>
              <Receipt className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-lg font-black text-slate-800 mt-1">₹{todaySales.toLocaleString()}</p>
          </div>

          {/* Outstanding Customer Credit (Khata) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Khata Udhaar</span>
              <Wallet className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-lg font-black text-amber-900 mt-1">₹{totalCustomerCredit.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search description, reference #..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            {/* Type Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  typeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('income')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  typeFilter === 'income' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Income (+)
              </button>
              <button
                onClick={() => setTypeFilter('expense')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  typeFilter === 'expense' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Expense (-)
              </button>
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent outline-none text-slate-800 text-xs font-semibold cursor-pointer"
              />
              {dateFilter && (
                <button onClick={() => setDateFilter('')} className="text-slate-400 hover:text-slate-700 text-xs ml-1">
                  ✕
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Sales Income">Sales Income</option>
              <option value="Purchase Expense">Purchase Expense</option>
              <option value="Electricity">Electricity (KSEB)</option>
              <option value="Rent">Rent</option>
              <option value="Salary">Salary / Wages</option>
              <option value="Packaging">Packaging</option>
              <option value="Credit Collection">Khata Settlement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date & Ref</th>
                  <th className="py-3.5 px-4">Type & Category</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Recorded By</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <DollarSign className="w-12 h-12 text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-600">No account entries found</p>
                        <p className="text-xs text-slate-400">Click "Add Income / Expense" above to record cash flows.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{tx.date}</span>
                          {tx.referenceNumber && (
                            <span className="text-xs text-slate-400 font-mono">{tx.referenceNumber}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              tx.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span className="font-bold text-slate-900">{tx.category}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 max-w-sm">{tx.description}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-black text-base ${
                            tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                          {tx.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">{tx.createdBy}</td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Delete this transaction record: "${tx.description}"?`)) {
                              deleteAccountTransaction(tx.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Record Account Transaction</h2>
                <p className="text-xs text-slate-400">Add daily income or operating expenses.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-6 space-y-4">
              {/* Type Switcher (Income vs Expense) */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setTransType('income');
                    setCategory('Sales Income');
                  }}
                  className={`py-2 rounded-lg font-bold text-xs transition-all ${
                    transType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  + Income (വരുമാനം)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTransType('expense');
                    setCategory('Electricity');
                  }}
                  className={`py-2 rounded-lg font-bold text-xs transition-all ${
                    transType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  - Expense (ചിലവ്)
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                >
                  {transType === 'income' ? (
                    <>
                      <option value="Sales Income">Sales Income (POS)</option>
                      <option value="Credit Collection">Credit Collection (Khata)</option>
                      <option value="Cash Income">Cash Income</option>
                      <option value="Bank Income">Bank Income</option>
                      <option value="UPI Income">UPI Income</option>
                      <option value="Card Income">Card Income</option>
                      <option value="Other Income">Other Income</option>
                    </>
                  ) : (
                    <>
                      <option value="Purchase Expense">Purchase Expense</option>
                      <option value="Electricity">Electricity (KSEB)</option>
                      <option value="Water">Water Supply</option>
                      <option value="Rent">Shop / Room Rent</option>
                      <option value="Salary">Staff Salary / Daily Wages</option>
                      <option value="Transport">Transport & Freight</option>
                      <option value="Packaging">Packaging & Parcel Bags</option>
                      <option value="Maintenance">Maintenance & Repair</option>
                      <option value="Food">Staff Food & Refreshment</option>
                      <option value="Other Expense">Other Expense</option>
                    </>
                  )}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full h-11 pl-8 pr-4 text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-black text-slate-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description / Particulars *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. KSEB monthly power bill payment"
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Payment Method & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI (GPay/PhonePe)</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="card">Debit/Credit Card</option>
                    <option value="credit">Credit (Pending)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Reference Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reference / Bill # (Optional)</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. REC-8819 / TXN-998822"
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-98 ${
                    transType === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
