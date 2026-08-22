import React, { useState, useRef } from 'react';
import {
  BookOpen,
  UserPlus,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  MessageSquare,
  Phone,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Send,
  Calendar,
  Download,
  Upload,
  FileSpreadsheet,
  Printer,
  SlidersHorizontal,
  RefreshCw,
  Archive,
  RotateCcw,
  CheckCheck,
  Ban,
  Wallet,
  Building2,
  FileText,
  UserCheck,
  ShieldCheck,
  ChevronDown,
  Info,
  Filter,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { CustomerKhata, KhataPaymentMethod, KhataTransaction } from '../../types';

export const KhataBook: React.FC = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    archiveCustomer,
    restoreCustomer,
    toggleCustomerStatus,
    disableKhata,
    enableKhata,
    recordKhataCredit,
    recordKhataPayment,
    recordKhataAdjustment,
    selectedKhataCustomer,
    setSelectedKhataCustomer,
    exportKhataToExcel,
    importCustomersFromData,
    settings,
    currentUser,
    t,
  } = usePOS();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'due' | 'cleared' | 'disabled' | 'archived'>('all');
  const [txTypeFilter, setTxTypeFilter] = useState<'all' | 'credit' | 'payment' | 'adjustment'>('all');

  // Modals state
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isGiveCreditOpen, setIsGiveCreditOpen] = useState(false);
  const [isReceivePaymentOpen, setIsReceivePaymentOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form states - Add Customer
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustLimit, setNewCustLimit] = useState(5000);
  const [newCustOpeningBal, setNewCustOpeningBal] = useState(0);
  const [newCustNotes, setNewCustNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Form states - Give Credit
  const [creditAmount, setCreditAmount] = useState<number>(500);
  const [creditDescription, setCreditDescription] = useState<string>('');
  const [creditBillId, setCreditBillId] = useState<string>('');
  const [creditNotes, setCreditNotes] = useState<string>('');

  // Form states - Receive Payment
  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<KhataPaymentMethod>('cash');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [paymentDescription, setPaymentDescription] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  // Form states - Balance Adjustment
  const [adjAmount, setAdjAmount] = useState<number>(100);
  const [adjType, setAdjType] = useState<'credit' | 'payment'>('credit');
  const [adjReason, setAdjReason] = useState<string>('');

  // Import state
  const [importText, setImportText] = useState('');
  const [importResults, setImportResults] = useState<{ successCount: number; errorCount: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculations
  const activeCustomersList = customers;
  const totalReceivable = activeCustomersList
    .filter((c) => (c.netBalance || 0) > 0)
    .reduce((acc, c) => acc + c.netBalance, 0);

  const totalClearedCustomers = activeCustomersList.filter((c) => c.netBalance === 0).length;
  const totalDebtorsCount = activeCustomersList.filter((c) => c.netBalance > 0).length;

  // Customer Filtering
  const filteredCustomers = activeCustomersList.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (c.name || '').toLowerCase().includes(query) ||
      (c.phone || '').includes(query) ||
      (c.customerId || '').toLowerCase().includes(query) ||
      (c.address || '').toLowerCase().includes(query);

    let matchesStatus = true;
    if (statusFilter === 'due') matchesStatus = c.netBalance > 0;
    else if (statusFilter === 'cleared') matchesStatus = c.netBalance === 0 && c.khataStatus !== 'disabled';
    else if (statusFilter === 'disabled') matchesStatus = c.khataStatus === 'disabled';
    else if (statusFilter === 'archived') matchesStatus = c.status === 'archived' || !c.isActive;

    return matchesSearch && matchesStatus;
  });

  const activeCustomer: CustomerKhata | null =
    (selectedKhataCustomer && customers.find((c) => c.id === selectedKhataCustomer.id)) ||
    filteredCustomers[0] ||
    customers[0] ||
    null;

  // Filter customer transactions
  const customerTransactions = (activeCustomer?.transactions || []).filter((tx) => {
    if (txTypeFilter === 'all') return true;
    if (txTypeFilter === 'credit') return tx.type === 'credit';
    if (txTypeFilter === 'payment') return tx.type === 'payment';
    return true;
  });

  // Handlers
  const handleOpenAddCustomer = () => {
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustAddress('');
    setNewCustLimit(5000);
    setNewCustOpeningBal(0);
    setNewCustNotes('');
    setFormError(null);
    setIsAddCustomerOpen(true);
  };

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newCustName.trim() || !newCustPhone.trim()) {
      setFormError('Customer name and phone number are required.');
      return;
    }

    addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      email: newCustEmail.trim() || undefined,
      address: newCustAddress.trim() || undefined,
      creditLimit: Number(newCustLimit) || 5000,
      openingBalance: Number(newCustOpeningBal) || 0,
      notes: newCustNotes.trim() || undefined,
      status: 'active',
      khataStatus: 'enabled',
    });

    setIsAddCustomerOpen(false);
  };

  const handleGiveCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || creditAmount <= 0) return;

    recordKhataCredit(
      activeCustomer.id,
      creditAmount,
      creditDescription.trim() || 'Store Credit Sale',
      creditBillId.trim() || undefined,
      creditNotes.trim() || undefined
    );

    setCreditAmount(500);
    setCreditDescription('');
    setCreditBillId('');
    setCreditNotes('');
    setIsGiveCreditOpen(false);
  };

  const handleReceivePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || paymentAmount <= 0) return;

    recordKhataPayment(
      activeCustomer.id,
      paymentAmount,
      paymentDescription.trim() || `Payment received (${paymentMethod.toUpperCase()})`,
      paymentMethod,
      paymentReference.trim() || undefined,
      paymentNotes.trim() || undefined
    );

    setPaymentAmount(500);
    setPaymentDescription('');
    setPaymentReference('');
    setPaymentNotes('');
    setIsReceivePaymentOpen(false);
  };

  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || adjAmount <= 0) return;

    recordKhataAdjustment(
      activeCustomer.id,
      adjAmount,
      adjType,
      adjReason.trim() || 'Manual Balance Adjustment',
      'Adjustment performed by Manager / Admin'
    );

    setAdjAmount(100);
    setAdjReason('');
    setIsAdjustmentOpen(false);
  };

  const handleSendReminderWhatsApp = (cust: CustomerKhata) => {
    const balanceText = `${settings.currency}${cust.netBalance.toFixed(2)}`;
    const text = encodeURIComponent(
      `🙏 നമസ്കാരം / Dear ${cust.name},\n\nThis is a friendly statement update from *${settings.storeName}*.\nYour current outstanding credit balance is *${balanceText}*.\n\nPlease settle the balance via UPI or visit our store at your earliest convenience.\n\nThank you for your business!`
    );
    window.open(`https://wa.me/91${cust.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handlePrintStatement = () => {
    window.print();
  };

  // CSV/Excel upload parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        setImportResults({ successCount: 0, errorCount: 1, errors: ['File contains no data rows.'] });
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      const items: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
        if (parts.length < 2) continue;

        const item: any = {};
        headers.forEach((h, idx) => {
          item[h] = parts[idx] || '';
        });
        items.push(item);
      }

      const res = importCustomersFromData(items);
      setImportResults(res);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-slate-100">
      {/* Left Pane: Customers List & Directory */}
      <div className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-hidden">
        {/* Header & Metrics */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Customer Khata Ledger</h3>
                <p className="text-[10px] text-slate-500">കസ്റ്റമർ ഖാത്താ ബുക്ക്</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="btn-export-khata-dropdown"
                onClick={() => exportKhataToExcel('all')}
                title="Export Khata to Excel/CSV"
                className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4 text-slate-600" />
              </button>

              <button
                id="btn-import-khata"
                onClick={() => setIsImportModalOpen(true)}
                title="Import Customers from Excel"
                className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Upload className="w-4 h-4 text-slate-600" />
              </button>

              <button
                id="add-customer-btn"
                onClick={handleOpenAddCustomer}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-[10px] font-bold text-rose-700 block uppercase tracking-wider">
                Total Due ({totalDebtorsCount})
              </span>
              <span className="text-base font-black text-rose-950 block mt-0.5">
                {settings.currency}
                {totalReceivable.toFixed(2)}
              </span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-700 block uppercase tracking-wider">
                Cleared Accounts
              </span>
              <span className="text-base font-black text-emerald-950 block mt-0.5">
                {totalClearedCustomers} Customers
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="khata-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, or customer ID..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 custom-scrollbar text-[11px] font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              All ({customers.length})
            </button>
            <button
              onClick={() => setStatusFilter('due')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'due' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Pending Due ({totalDebtorsCount})
            </button>
            <button
              onClick={() => setStatusFilter('cleared')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'cleared' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Zero Balance ({totalClearedCustomers})
            </button>
            <button
              onClick={() => setStatusFilter('disabled')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'disabled' ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Archived Khata
            </button>
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No customer records found matching your filter criteria.
            </div>
          ) : (
            filteredCustomers.map((cust) => {
              const isSelected = activeCustomer?.id === cust.id;
              const hasDue = (cust.netBalance || 0) > 0;
              const isCleared = cust.netBalance === 0;
              const isKhataDisabled = cust.khataStatus === 'disabled';

              return (
                <div
                  key={cust.id}
                  id={`khata-customer-row-${cust.id}`}
                  onClick={() => setSelectedKhataCustomer(cust)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/90 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {(cust.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{cust.name}</h4>
                        {cust.customerId && (
                          <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded shrink-0">
                            {cust.customerId}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{cust.phone}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{cust.lastActivity || 'Active'}</span>
                        {isKhataDisabled && (
                          <span className="text-[9px] text-slate-500 font-bold bg-slate-200 px-1 rounded">
                            Khata Disabled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-black text-xs block ${
                        hasDue ? 'text-rose-600' : isCleared ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      {settings.currency}
                      {Math.abs(cust.netBalance || 0).toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {hasDue ? 'Due (കടം)' : isCleared ? 'Cleared (0 Due)' : 'Advance'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Selected Customer Ledger & Statement */}
      {activeCustomer ? (
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
          {/* Customer Profile Banner */}
          <div className="p-4 md:p-5 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-700 text-white font-black text-base flex items-center justify-center shadow-xs">
                {(activeCustomer.name || 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-slate-900">{activeCustomer.name}</h3>
                  {activeCustomer.customerId && (
                    <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                      {activeCustomer.customerId}
                    </span>
                  )}
                  {activeCustomer.khataStatus === 'disabled' ? (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300 px-2 py-0.5 rounded-full">
                      Khata Disabled / Cycle Closed
                    </span>
                  ) : activeCustomer.netBalance === 0 ? (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                      Zero Balance / Cleared
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full">
                      Active Debt Cycle
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {activeCustomer.phone}
                  </span>
                  {activeCustomer.address && <span>• {activeCustomer.address}</span>}
                  <span className="text-slate-400">
                    • Limit: {settings.currency}{activeCustomer.creditLimit}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="btn-whatsapp-reminder"
                onClick={() => handleSendReminderWhatsApp(activeCustomer)}
                className="h-9 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Statement</span>
              </button>

              <button
                id="btn-export-single-ledger"
                onClick={() => exportKhataToExcel('ledger', activeCustomer.id)}
                title="Export Customer Statement to Excel"
                className="h-9 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                <span>Export Ledger</span>
              </button>

              <button
                id="btn-print-statement"
                onClick={handlePrintStatement}
                title="Print Statement"
                className="h-9 p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Khata Lifecycle: Disable / Archive vs Re-enable */}
              {activeCustomer.khataStatus === 'disabled' ? (
                <button
                  id="btn-re-enable-khata"
                  onClick={() => enableKhata(activeCustomer.id)}
                  className="h-9 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Credit Cycle</span>
                </button>
              ) : activeCustomer.netBalance === 0 ? (
                <button
                  id="btn-disable-zero-khata"
                  onClick={() => disableKhata(activeCustomer.id)}
                  title="Archive/Close Khata account while balance is zero"
                  className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                >
                  <Archive className="w-3.5 h-3.5 text-slate-500" />
                  <span>Archive Khata (Balance 0)</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* Ledger Financial Summary Card */}
          <div className="p-4 md:p-5 bg-white border-b border-slate-200">
            <div className="bg-slate-950 text-white rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm border border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Net Outstanding Balance / കുടിശ്ശിക
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {settings.currency}
                  {(activeCustomer.netBalance || 0).toFixed(2)}
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                  {activeCustomer.netBalance > 0 ? (
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Customer owes merchant {settings.currency}{activeCustomer.netBalance.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> All dues cleared! Account in good standing.
                    </span>
                  )}
                  <span>• Credit Limit: {settings.currency}{activeCustomer.creditLimit}</span>
                </div>
              </div>

              {/* Action Buttons: Give Credit, Receive Payment, Manual Adjustment */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="btn-give-credit-modal"
                  onClick={() => setIsGiveCreditOpen(true)}
                  disabled={activeCustomer.khataStatus === 'disabled'}
                  className={`px-4 h-10 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                    activeCustomer.khataStatus === 'disabled'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-700 text-white active:scale-98'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Give Credit (കടം)</span>
                </button>

                <button
                  id="btn-receive-payment-modal"
                  onClick={() => setIsReceivePaymentOpen(true)}
                  className="px-4 h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Receive Cash / UPI</span>
                </button>

                <button
                  id="btn-balance-adjustment-modal"
                  onClick={() => setIsAdjustmentOpen(true)}
                  className="px-3 h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Adjust</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ledger Statements & Transaction History */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Detailed Financial Statement / ഇടപാട് ചരിത്രം ({customerTransactions.length})
                </h4>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-[11px] font-bold">
                <button
                  onClick={() => setTxTypeFilter('all')}
                  className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    txTypeFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Entries
                </button>
                <button
                  onClick={() => setTxTypeFilter('credit')}
                  className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    txTypeFilter === 'credit' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Credit Sales
                </button>
                <button
                  onClick={() => setTxTypeFilter('payment')}
                  className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    txTypeFilter === 'payment' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Payments Settled
                </button>
              </div>
            </div>

            {customerTransactions.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No ledger transactions recorded yet. Use the buttons above to record purchases, settlements, or adjustments.
              </div>
            ) : (
              customerTransactions.map((tx) => {
                const isCredit = tx.type === 'credit';
                const isPayment = tx.type === 'payment';

                return (
                  <div
                    key={tx.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isCredit ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {isCredit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {isCredit ? 'Credit Given (കടം കൊടുത്തു)' : 'Payment Received (പണം വാങ്ങി)'}
                          </span>
                          {(tx.reference || tx.billId) && (
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.2 rounded font-semibold border border-slate-200">
                              Ref: {tx.reference || tx.billId}
                            </span>
                          )}
                          {tx.paymentMethod && (
                            <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded">
                              {tx.paymentMethod}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{tx.description}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-300" />
                            {tx.date} at {tx.time}
                          </span>
                          {tx.recordedBy && <span>• Logged by {tx.recordedBy}</span>}
                          {tx.notes && <span className="text-slate-500">• {tx.notes}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm font-black block ${
                          isCredit ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        {isCredit ? '+' : '-'} {settings.currency}
                        {tx.amount.toFixed(2)}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Bal: {settings.currency}
                        {tx.balanceAfter.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Select or add a customer to manage their Khata ledger.
        </div>
      )}

      {/* GIVE CREDIT MODAL */}
      {isGiveCreditOpen && activeCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleGiveCreditSubmit}
            className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Give Store Credit</h3>
                  <p className="text-[11px] text-slate-500">To {activeCustomer.name}</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsGiveCreditOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Credit Amount ({settings.currency}) *</label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseFloat(e.target.value) || 0)}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold text-rose-700 focus:bg-white focus:border-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Invoice / Bill Reference (Optional)</label>
              <input
                type="text"
                value={creditBillId}
                onChange={(e) => setCreditBillId(e.target.value)}
                placeholder="e.g. INV-8921"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Item Description / Reason *</label>
              <input
                type="text"
                required
                value={creditDescription}
                onChange={(e) => setCreditDescription(e.target.value)}
                placeholder="e.g. Provisions & Groceries Purchase"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsGiveCreditOpen(false)}
                className="flex-1 h-10 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-confirm-give-credit"
                className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Record Credit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RECEIVE PAYMENT MODAL */}
      {isReceivePaymentOpen && activeCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleReceivePaymentSubmit}
            className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Receive Settlement</h3>
                  <p className="text-[11px] text-slate-500">From {activeCustomer.name}</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsReceivePaymentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Amount Received ({settings.currency}) *</label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold text-emerald-700 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as KhataPaymentMethod)}
                  className="w-full h-9 px-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="cash">Cash (പണം)</option>
                  <option value="upi">UPI (GPay / PhonePe)</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tx / Ref Number</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g. UPI-984102"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Description</label>
              <input
                type="text"
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                placeholder="e.g. Full settlement at counter"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsReceivePaymentOpen(false)}
                className="flex-1 h-10 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-confirm-receive-cash"
                className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Record Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BALANCE ADJUSTMENT MODAL */}
      {isAdjustmentOpen && activeCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAdjustmentSubmit}
            className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Manual Ledger Adjustment</h3>
                  <p className="text-[11px] text-slate-500">For {activeCustomer.name}</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsAdjustmentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Adjustment Type</label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value as 'credit' | 'payment')}
                  className="w-full h-9 px-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="credit">+ Increase Due (Debit)</option>
                  <option value="payment">- Reduce Due (Credit)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Amount ({settings.currency})</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(parseFloat(e.target.value) || 0)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Justification Reason *</label>
              <input
                type="text"
                required
                value={adjReason}
                onChange={(e) => setAdjReason(e.target.value)}
                placeholder="e.g. Return item credit or rounding correction"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAdjustmentOpen(false)}
                className="flex-1 h-10 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-10 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Apply Adjustment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD NEW CUSTOMER MODAL */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCustomerSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Add Customer to Khata</h3>
                  <p className="text-[11px] text-slate-500">കസ്റ്റമറെ ഖാത്തായിൽ ചേർക്കുക</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsAddCustomerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="e.g. Rajesh Menon"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="+91 98470 00000"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="customer@email.com"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Credit Limit ({settings.currency})</label>
                <input
                  type="number"
                  value={newCustLimit}
                  onChange={(e) => setNewCustLimit(parseFloat(e.target.value) || 0)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Opening Balance ({settings.currency})</label>
                <input
                  type="number"
                  value={newCustOpeningBal}
                  onChange={(e) => setNewCustOpeningBal(parseFloat(e.target.value) || 0)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Address / Landmark</label>
              <input
                type="text"
                value={newCustAddress}
                onChange={(e) => setNewCustAddress(e.target.value)}
                placeholder="e.g. House No. 4, MG Road, Ernakulam"
                className="w-full h-9 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(false)}
                className="flex-1 h-10 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-save-customer-khata"
                className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save to Khata
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EXCEL / CSV IMPORT MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Import Customers from Excel / CSV</h3>
                  <p className="text-[11px] text-slate-500">Bulk upload customers with opening balances</p>
                </div>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-800 block">Required CSV Header Columns:</span>
              <code className="text-[11px] bg-white p-2 rounded-xl border border-slate-200 block text-slate-800 font-mono">
                Customer Name, Phone Number, Opening Balance, Credit Limit, Email, Address
              </code>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Select CSV or Excel Export File:</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            {importResults && (
              <div
                className={`p-3 rounded-xl border text-xs ${
                  importResults.errorCount === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="font-bold">
                  Import Summary: {importResults.successCount} added, {importResults.errorCount} skipped.
                </div>
                {importResults.errors.length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-[11px] space-y-0.5 max-h-24 overflow-y-auto">
                    {importResults.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setImportResults(null);
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
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
