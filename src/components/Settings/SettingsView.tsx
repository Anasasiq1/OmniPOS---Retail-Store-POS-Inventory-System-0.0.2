import React, { useState } from 'react';
import {
  Settings,
  Store,
  Printer,
  Receipt,
  FileText,
  Save,
  RotateCcw,
  Check,
  Globe,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, businessType, setBusinessType, playSound } = usePOS();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [gstNumber, setGstNumber] = useState(settings.gstNumber);
  const [taxRatePercent, setTaxRatePercent] = useState(settings.taxRatePercent);
  const [currency, setCurrency] = useState(settings.currency);
  const [receiptThermalWidth, setReceiptThermalWidth] = useState(settings.receiptThermalWidth);
  const [enableWhatsAppReceipts, setEnableWhatsAppReceipts] = useState(settings.enableWhatsAppReceipts);
  const [enableKhataBook, setEnableKhataBook] = useState(settings.enableKhataBook);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      tagline,
      address,
      phone,
      gstNumber,
      taxRatePercent,
      currency,
      receiptThermalWidth,
      enableWhatsAppReceipts,
      enableKhataBook,
    });
    playSound('success');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-100 p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>Store Settings & POS Configuration</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            GST taxation rules, thermal receipt widths, business verticals, and merchant profiles.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-4xl space-y-6">
        {/* Store Profile Section */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-indigo-600" />
            <span>Store Profile & Invoicing Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Store / Business Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Store Tagline / Slogan</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Address & City</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Customer Care Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* GST & Tax Configuration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>GST Compliance & Taxes</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Merchant GSTIN Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Default GST Rate (%)</label>
              <input
                type="number"
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Thermal Printer Settings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Thermal Receipt Printer & Digital e-Bills</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Paper Roll Width</label>
              <select
                value={receiptThermalWidth}
                onChange={(e) => setReceiptThermalWidth(e.target.value as any)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:border-indigo-500 outline-none"
              >
                <option value="80mm">80mm (Standard POS Desktop Printer)</option>
                <option value="58mm">58mm (Handheld Mobile Bluetooth Printer)</option>
              </select>
            </div>

            <div className="flex flex-col justify-center space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableWhatsAppReceipts}
                  onChange={(e) => setEnableWhatsAppReceipts(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span>Enable 1-Click WhatsApp Invoicing Link</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableKhataBook}
                  onChange={(e) => setEnableKhataBook(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span>Enable Customer Khata Book & Store Credit</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            id="save-settings-btn"
            className="px-6 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-98"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Store Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
