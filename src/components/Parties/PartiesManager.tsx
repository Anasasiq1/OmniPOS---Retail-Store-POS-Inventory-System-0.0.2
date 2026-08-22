import React, { useState } from 'react';
import {
  Users,
  Building2,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Trash2,
  Edit2,
  MessageSquare,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { CustomerKhata, SupplierParty } from '../../types';

export const PartiesManager: React.FC = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    recordSupplierPayment,
  } = usePOS();

  const [activeTab, setActiveTab] = useState<'customers' | 'suppliers'>('customers');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Customer Modal
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [custName, setCustName] = useState<string>('');
  const [custPhone, setCustPhone] = useState<string>('');
  const [custEmail, setCustEmail] = useState<string>('');
  const [custAddress, setCustAddress] = useState<string>('');
  const [custOpening, setCustOpening] = useState<number>(0);
  const [custLimit, setCustLimit] = useState<number>(500);

  // Supplier Modal
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState<boolean>(false);
  const [supCompany, setSupCompany] = useState<string>('');
  const [supContact, setSupContact] = useState<string>('');
  const [supPhone, setSupPhone] = useState<string>('');
  const [supEmail, setSupEmail] = useState<string>('');
  const [supCategory, setSupCategory] = useState<string>('Meat & Poultry');
  const [supAddress, setSupAddress] = useState<string>('');

  // Supplier Payment Modal
  const [selectedSupplierForPayment, setSelectedSupplierForPayment] = useState<SupplierParty | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState<string>('bank');

  const filteredCustomers = customers.filter(
    (c) =>
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSuppliers = suppliers.filter(
    (s) =>
      searchQuery === '' ||
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
  );

  const totalCustomerReceivables = customers.reduce((sum, c) => sum + (c.netBalance || 0), 0);
  const totalSupplierPayables = suppliers.reduce((sum, s) => sum + (s.netBalance || 0), 0);

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    addCustomer({
      name: custName,
      phone: custPhone,
      email: custEmail,
      address: custAddress,
      creditLimit: custLimit,
      openingBalance: custOpening,
      totalCredit: custOpening,
      totalPayments: 0,
      totalPurchases: 0,
      status: 'active',
      khataStatus: 'enabled',
    });

    setIsCustomerModalOpen(false);
    setCustName('');
    setCustPhone('');
    setCustOpening(0);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supCompany || !supContact) return;

    addSupplier({
      name: supCompany,
      companyName: supCompany,
      contactPerson: supContact,
      phone: supPhone,
      email: supEmail,
      category: supCategory,
      categorySupplied: supCategory,
      address: supAddress,
      status: 'active',
      openingBalance: 0,
      netBalance: 0,
      totalPurchases: 0,
      totalPaid: 0,
    });

    setIsSupplierModalOpen(false);
    setSupCompany('');
    setSupContact('');
    setSupPhone('');
  };

  const handleConfirmSupplierPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierForPayment || payAmount <= 0) return;
    recordSupplierPayment(selectedSupplierForPayment.id, payAmount, payMode, 'Supplier invoice payout');
    setSelectedSupplierForPayment(null);
    setPayAmount(0);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">Parties: Customers & Suppliers</h2>
            <p className="text-xs text-slate-500 font-medium">Customer khata accounts, vendor profiles & financial balance ledgers</p>
          </div>
        </div>

        {/* View Switcher, Search & Add */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="parties-search-input"
              type="text"
              placeholder="Search customer, supplier name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl w-60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'customers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Customers ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'suppliers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Suppliers ({suppliers.length})
            </button>
          </div>

          {activeTab === 'customers' ? (
            <button
              id="add-customer-party-btn"
              onClick={() => setIsCustomerModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          ) : (
            <button
              id="add-supplier-party-btn"
              onClick={() => setIsSupplierModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Metrics Strip */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Customer Due (Receivables)</p>
              <p className="font-black text-sm text-emerald-700">${totalCustomerReceivables.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Supplier Due (Payables)</p>
              <p className="font-black text-sm text-rose-700">${totalSupplierPayables.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {activeTab === 'customers' ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Customer ID / Name</th>
                  <th className="p-3">Phone & Contact</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Credit Limit</th>
                  <th className="p-3">Total Purchases</th>
                  <th className="p-3">Current Due Balance</th>
                  <th className="p-3">Khata Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{cust.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{cust.customerId || cust.id}</span>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-800">{cust.phone}</p>
                      {cust.email && <p className="text-[10px] text-slate-400">{cust.email}</p>}
                    </td>
                    <td className="p-3 text-slate-600 truncate max-w-xs">{cust.address || 'N/A'}</td>
                    <td className="p-3 font-semibold text-slate-700">${(cust.creditLimit || 0).toFixed(2)}</td>
                    <td className="p-3 font-semibold">${(cust.totalPurchases || 0).toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className={`font-black text-sm ${
                          cust.netBalance > 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        ${cust.netBalance.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          cust.khataStatus === 'enabled' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cust.khataStatus || 'enabled'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const msg = encodeURIComponent(`Hi ${cust.name}, this is a gentle reminder from Restaurant POS. Your outstanding due balance is $${cust.netBalance.toFixed(2)}. Please settle at your convenience.`);
                            window.open(`https://wa.me/?text=${msg}`, '_blank');
                          }}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          title="WhatsApp Reminder"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCustomer(cust.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Suppliers Table */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Supplier / Vendor</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Phone & Email</th>
                  <th className="p-3">Supply Category</th>
                  <th className="p-3">Total Purchases</th>
                  <th className="p-3">Total Paid</th>
                  <th className="p-3">Balance Payable</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{sup.companyName}</td>
                    <td className="p-3 font-semibold text-slate-800">{sup.contactPerson}</td>
                    <td className="p-3 text-slate-600">
                      <p>{sup.phone}</p>
                      {sup.email && <p className="text-[10px] text-slate-400">{sup.email}</p>}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded-md">
                        {sup.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">${(sup.totalPurchases || 0).toFixed(2)}</td>
                    <td className="p-3 font-semibold text-emerald-700">${(sup.totalPaid || 0).toFixed(2)}</td>
                    <td className="p-3 font-black text-sm text-rose-600">${sup.netBalance.toFixed(2)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sup.netBalance > 0 && (
                          <button
                            onClick={() => {
                              setSelectedSupplierForPayment(sup);
                              setPayAmount(sup.netBalance);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs"
                          >
                            Pay Vendor
                          </button>
                        )}
                        <button
                          onClick={() => deleteSupplier(sup.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Add New Customer Party</h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert Johnson"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 555-0199"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="guest@gmail.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Opening Due Balance ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={custOpening}
                    onChange={(e) => setCustOpening(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Credit Limit ($)</label>
                  <input
                    type="number"
                    value={custLimit}
                    onChange={(e) => setCustLimit(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Delivery / Residence Address</label>
                <input
                  type="text"
                  placeholder="Street Address, Apt/Suite"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="save-customer-party-submit"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Add Raw Material / Food Supplier</h3>
              <button onClick={() => setIsSupplierModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Supplier Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Spice & Provisions Ltd"
                  value={supCompany}
                  onChange={(e) => setSupCompany(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Michael Harris"
                    value={supContact}
                    onChange={(e) => setSupContact(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0188"
                    value={supPhone}
                    onChange={(e) => setSupPhone(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Supply Category</label>
                <select
                  value={supCategory}
                  onChange={(e) => setSupCategory(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="Meat & Poultry">Meat & Poultry</option>
                  <option value="Vegetables & Farm Produce">Vegetables & Farm Produce</option>
                  <option value="Spices & Grocery Essentials">Spices & Grocery Essentials</option>
                  <option value="Dairy, Cheese & Milk">Dairy, Cheese & Milk</option>
                  <option value="Beverages & Syrups">Beverages & Syrups</option>
                  <option value="Packaging & Disposables">Packaging & Disposables</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="save-supplier-party-submit"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Supplier Payout Modal */}
      {selectedSupplierForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-base text-slate-900">
              Pay Supplier: {selectedSupplierForPayment.companyName}
            </h3>
            <p className="text-xs text-slate-500">Current Outstanding Due: <span className="font-black text-rose-600">${selectedSupplierForPayment.netBalance.toFixed(2)}</span></p>

            <form onSubmit={handleConfirmSupplierPayment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 text-base font-black bg-slate-50 border border-slate-300 rounded-xl text-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Mode</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="bank">Bank Transfer (NEFT/ACH)</option>
                  <option value="upi">UPI / Instant QR</option>
                  <option value="card">Business Debit/Credit Card</option>
                  <option value="cash">Petty Cash</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSupplierForPayment(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
