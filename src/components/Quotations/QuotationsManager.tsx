import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  ArrowRight,
  Printer,
  Trash2,
  Sparkles,
  Calendar,
  User,
  Phone,
  DollarSign,
  Send,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Quotation, QuotationItem } from '../../types';

export const QuotationsManager: React.FC = () => {
  const { quotations, addQuotation, deleteQuotation, convertQuotationToOrder, customers, products, openPrintModal } = usePOS();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'accepted' | 'converted'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  // New Quotation Form State
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [guestCount, setGuestCount] = useState<number>(50);
  const [validUntil, setValidUntil] = useState<string>(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('Standard catering setup included. 50% advance upon confirmation.');
  const [items, setItems] = useState<QuotationItem[]>([
    { id: 'item-1', name: 'Hyderabadi Chicken Dum Biryani (Catering Pack)', quantity: 50, unitPrice: 12.0, total: 600.0 },
    { id: 'item-2', name: 'Butter Chicken & Tandoori Roti Buffet', quantity: 50, unitPrice: 8.0, total: 400.0 },
    { id: 'item-3', name: 'Gulab Jamun & Ice Cream Dessert Station', quantity: 50, unitPrice: 4.0, total: 200.0 },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: 'item-' + Date.now(), name: 'Appetizer Platter', quantity: 10, unitPrice: 15.0, total: 150.0 },
    ]);
  };

  const handleUpdateItem = (id: string, field: keyof QuotationItem, val: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = Number((updated.quantity * updated.unitPrice).toFixed(2));
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const taxAmount = Number(((subtotal * 5) / 100).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  const handleSaveQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || items.length === 0) return;

    addQuotation({
      customerName,
      customerPhone,
      customerEmail,
      date: new Date().toISOString().split('T')[0],
      eventDate,
      guestCount,
      validUntil,
      items,
      subtotal,
      discountAmount: 0,
      taxAmount,
      totalAmount,
      status: 'sent',
      notes,
    });

    setIsCreateModalOpen(false);
    // Reset form
    setCustomerName('');
    setCustomerPhone('');
  };

  const handleConvertToSale = (quotationId: string) => {
    try {
      const newOrder = convertQuotationToOrder(quotationId);
      openPrintModal(newOrder, 'bill');
      alert(`Quotation successfully converted to Sale Order #${newOrder.orderNumber}!`);
    } catch (err: any) {
      alert(`Error converting quotation: ${err.message}`);
    }
  };

  const filteredQuotations = quotations.filter((q) => {
    const matchesQuery =
      searchQuery === '' ||
      q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.customerPhone && q.customerPhone.includes(searchQuery));
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">Quotations & Catering Estimates</h2>
            <p className="text-xs text-slate-500 font-medium">Create client estimates, catering quotes & 1-click convert into POS sales</p>
          </div>
        </div>

        {/* Search, Filter & Add Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="quotations-search-input"
              type="text"
              placeholder="Search quotation #, client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl w-60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({quotations.length})
            </button>
            <button
              onClick={() => setStatusFilter('sent')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'sent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('converted')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'converted' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Converted
            </button>
          </div>

          <button
            id="create-new-quotation-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quotation</span>
          </button>
        </div>
      </div>

      {/* Main Quotations List */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {filteredQuotations.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 p-8">
            <FileText className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">No Quotations Found</p>
            <p className="text-xs text-slate-400 mt-1">Create formal catering and bulk party food estimates for your customers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotations.map((q) => {
              const isConverted = q.status === 'converted';

              return (
                <div
                  key={q.id}
                  id={`quotation-card-${q.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{q.quotationNumber}</span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isConverted
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.status === 'accepted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Created: {q.createdAt}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-lg text-blue-600">${q.totalAmount.toFixed(2)}</span>
                      <p className="text-[10px] text-slate-400">Valid: {q.validUntil}</p>
                    </div>
                  </div>

                  {/* Client & Event Info */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>{q.customerName}</span>
                    </div>
                    {q.customerPhone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{q.customerPhone}</span>
                      </div>
                    )}
                    {q.eventDate && (
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Event Date: {q.eventDate} ({q.guestCount || 50} Guests)</span>
                      </div>
                    )}
                  </div>

                  {/* Items Preview */}
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-500">Items Included ({q.items.length}):</p>
                    <ul className="space-y-0.5 text-[11px] text-slate-700">
                      {q.items.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex justify-between truncate">
                          <span>• {item.name} (x{item.quantity})</span>
                          <span className="font-bold">${item.total.toFixed(2)}</span>
                        </li>
                      ))}
                      {q.items.length > 3 && (
                        <li className="text-[10px] text-blue-600 font-semibold">+ {q.items.length - 3} more item(s)...</li>
                      )}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      id={`delete-quotation-${q.id}`}
                      onClick={() => deleteQuotation(q.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Quotation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      {!isConverted ? (
                        <button
                          id={`convert-quotation-btn-${q.id}`}
                          onClick={() => handleConvertToSale(q.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Convert to Sale / Order</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <ShieldCheck className="w-4 h-4" /> Sale #{q.convertedOrderId || 'ORD'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create New Quotation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Create New Catering Quotation</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuotation} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Customer / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp / John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 555-0199"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Event / Catering Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expected Guests</label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Quote Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quotation Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Menu Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Item Description / Dish"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                        className="flex-1 p-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                      <div className="w-20">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                          className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-lg text-center"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Unit Price"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-lg text-right"
                        />
                      </div>
                      <div className="w-24 text-right font-black text-xs text-slate-900">
                        ${item.total.toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="p-4 bg-slate-100 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>VAT / Tax (5%):</span>
                  <span className="font-semibold text-slate-900">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-1.5 border-t border-slate-300">
                  <span>Total Estimated Quotation:</span>
                  <span className="text-blue-700">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Terms & Special Conditions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="save-quotation-submit-btn"
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                >
                  Save & Send Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
