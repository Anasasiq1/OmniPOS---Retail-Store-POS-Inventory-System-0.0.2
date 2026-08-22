import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  MessageSquare,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Send,
  Printer,
  X,
  Phone,
  User,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { CustomerKhata, SupplierParty } from '../../types';

export const DueListManager: React.FC = () => {
  const { customers, suppliers, recordKhataPayment, recordSupplierPayment } = usePOS();
  const [activeTab, setActiveTab] = useState<'customer_dues' | 'supplier_dues'>('customer_dues');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Settle Customer Due Modal
  const [selectedCustForSettle, setSelectedCustForSettle] = useState<CustomerKhata | null>(null);
  const [settleAmount, setSettleAmount] = useState<number>(0);
  const [settleMethod, setSettleMethod] = useState<string>('cash');
  const [settleNote, setSettleNote] = useState<string>('');

  const customerDues = customers.filter(
    (c) =>
      c.netBalance > 0 &&
      (searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery))
  );

  const supplierDues = suppliers.filter(
    (s) =>
      s.netBalance > 0 &&
      (searchQuery === '' ||
        s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery))
  );

  const totalCustomerReceivable = customerDues.reduce((sum, c) => sum + c.netBalance, 0);
  const totalSupplierPayable = supplierDues.reduce((sum, s) => sum + s.netBalance, 0);

  const handleSettleCustomerDue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustForSettle || settleAmount <= 0) return;

    recordKhataPayment(
      selectedCustForSettle.id,
      settleAmount,
      settleNote || 'Customer due payment collection',
      settleMethod
    );

    setSelectedCustForSettle(null);
    setSettleAmount(0);
    setSettleNote('');
  };

  const sendWhatsAppReminder = (customer: CustomerKhata) => {
    const text = `Hello ${customer.name}, this is a payment reminder from Restaurant POS. You have an outstanding due balance of $${customer.netBalance.toFixed(
      2
    )}. Please settle via UPI, Card or Cash. Thank you!`;
    const url = `https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">Financial Due List & Collections</h2>
            <p className="text-xs text-slate-500 font-medium">Track customer credit dues, supplier payables, and 1-click WhatsApp reminders</p>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="due-list-search-input"
              type="text"
              placeholder="Search customer, supplier name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl w-60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('customer_dues')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'customer_dues' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> Customer Receivables ({customerDues.length})
            </button>
            <button
              onClick={() => setActiveTab('supplier_dues')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'supplier_dues' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" /> Supplier Payables ({supplierDues.length})
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 pb-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Customer Dues</p>
            <h3 className="text-xl font-black text-rose-600 mt-1">${totalCustomerReceivable.toFixed(2)}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{customerDues.length} Customers pending settlement</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Supplier Payables</p>
            <h3 className="text-xl font-black text-amber-600 mt-1">${totalSupplierPayable.toFixed(2)}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{supplierDues.length} Suppliers with pending invoices</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Net Working Gap</p>
            <h3 className="text-xl font-black text-slate-800 mt-1">
              ${(totalCustomerReceivable - totalSupplierPayable).toFixed(2)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Receivables minus Payables</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Due List Table */}
      <div className="flex-1 p-6 pt-3 overflow-y-auto custom-scrollbar">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          {activeTab === 'customer_dues' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Credit Limit</th>
                  <th className="p-3">Total Purchases</th>
                  <th className="p-3">Outstanding Due</th>
                  <th className="p-3">Due Status</th>
                  <th className="p-3 text-right">Settlement & Reminder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerDues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">
                      🎉 No outstanding customer dues found! All customer accounts are settled.
                    </td>
                  </tr>
                ) : (
                  customerDues.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{cust.name}</td>
                      <td className="p-3 text-slate-600 font-semibold">{cust.phone}</td>
                      <td className="p-3 text-slate-600">${(cust.creditLimit || 0).toFixed(2)}</td>
                      <td className="p-3 font-semibold">${(cust.totalPurchases || 0).toFixed(2)}</td>
                      <td className="p-3 font-black text-sm text-rose-600">${cust.netBalance.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                          Payment Overdue
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`whatsapp-remind-${cust.id}`}
                            onClick={() => sendWhatsAppReminder(cust)}
                            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp Remind</span>
                          </button>

                          <button
                            id={`settle-due-btn-${cust.id}`}
                            onClick={() => {
                              setSelectedCustForSettle(cust);
                              setSettleAmount(cust.netBalance);
                            }}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors"
                          >
                            Collect Due
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Supplier Company</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Total Billed</th>
                  <th className="p-3">Payable Due</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierDues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">
                      🎉 No supplier payables outstanding! All vendor invoices are paid.
                    </td>
                  </tr>
                ) : (
                  supplierDues.map((sup) => (
                    <tr key={sup.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{sup.companyName}</td>
                      <td className="p-3 font-semibold text-slate-800">{sup.contactPerson}</td>
                      <td className="p-3 text-slate-600">{sup.phone}</td>
                      <td className="p-3 font-semibold text-slate-700">{sup.category}</td>
                      <td className="p-3 font-semibold">${(sup.totalPurchases || 0).toFixed(2)}</td>
                      <td className="p-3 font-black text-sm text-rose-600">${sup.netBalance.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            recordSupplierPayment(sup.id, sup.netBalance, 'bank', 'Cleared vendor invoice');
                            alert(`Paid $${sup.netBalance.toFixed(2)} to ${sup.companyName}`);
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs"
                        >
                          Clear Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Settle Customer Due Modal */}
      {selectedCustForSettle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Collect Due: {selectedCustForSettle.name}</h3>
              <button onClick={() => setSelectedCustForSettle(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Total Outstanding Balance: <span className="font-black text-rose-600">${selectedCustForSettle.netBalance.toFixed(2)}</span>
            </p>

            <form onSubmit={handleSettleCustomerDue} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Received Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedCustForSettle.netBalance}
                  required
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(Number(e.target.value))}
                  className="w-full p-2.5 text-base font-black bg-slate-50 border border-slate-300 rounded-xl text-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={settleMethod}
                  onChange={(e) => setSettleMethod(e.target.value)}
                  className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="cash">Cash in Hand</option>
                  <option value="upi">UPI / QR Code</option>
                  <option value="card">Card Terminal (POS)</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Receipt Note / Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Paid full due at front desk counter"
                  value={settleNote}
                  onChange={(e) => setSettleNote(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustForSettle(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="confirm-collect-due-submit"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Confirm & Update Khata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
