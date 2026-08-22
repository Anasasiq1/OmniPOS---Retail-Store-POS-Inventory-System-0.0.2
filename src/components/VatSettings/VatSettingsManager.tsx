import React, { useState } from 'react';
import {
  Percent,
  Receipt,
  Save,
  CheckCircle2,
  ShieldCheck,
  Building,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { VatTaxSettings } from '../../types';

export const VatSettingsManager: React.FC = () => {
  const { vatSettings, updateVatSettings } = usePOS();
  const [formData, setFormData] = useState<VatTaxSettings>({ ...vatSettings });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVatSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Sample simulation calculation
  const sampleFoodSubtotal = 100.0;
  const sampleTax = formData.isTaxInclusive
    ? 0
    : Number(((sampleFoodSubtotal * formData.taxRate) / 100).toFixed(2));
  const sampleServiceCharge = formData.serviceChargeRate
    ? Number(((sampleFoodSubtotal * formData.serviceChargeRate) / 100).toFixed(2))
    : 0;
  const sampleTotal = sampleFoodSubtotal + sampleTax + sampleServiceCharge;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">VAT & Tax Configuration</h2>
            <p className="text-xs text-slate-500 font-medium">Configure restaurant sales tax, VAT/GST percentage, service charges & tax invoice IDs</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Tax Settings Saved & Applied Globally!</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tax Label / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VAT, GST, Sales Tax"
                  value={formData.taxName}
                  onChange={(e) => setFormData({ ...formData, taxName: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tax Rate Percentage (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-black text-blue-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tax Calculation Model</label>
                  <select
                    value={formData.isTaxInclusive ? 'inclusive' : 'exclusive'}
                    onChange={(e) => setFormData({ ...formData, isTaxInclusive: e.target.value === 'inclusive' })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="exclusive">Exclusive (Added on Bill)</option>
                    <option value="inclusive">Inclusive (Included in Price)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Service Charge Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={formData.serviceChargeRate || 0}
                    onChange={(e) => setFormData({ ...formData, serviceChargeRate: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tax Registration / GSTIN No.</label>
                  <input
                    type="text"
                    placeholder="e.g. 27AAAAA0000A1Z5 / TAX-99182"
                    value={formData.taxNumber || ''}
                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  id="save-vat-settings-btn"
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Tax Settings</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Live Calculation Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Live Invoice Calculation Preview</h3>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Sample simulation based on a $100.00 food order bill:
              </p>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Food Items Total:</span>
                  <span className="font-semibold text-slate-900">${sampleFoodSubtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>
                    {formData.taxName} ({formData.taxRate}%{' '}
                    {formData.isTaxInclusive ? 'Inclusive' : 'Exclusive'}):
                  </span>
                  <span className="font-bold text-blue-600">${sampleTax.toFixed(2)}</span>
                </div>

                {formData.serviceChargeRate ? (
                  <div className="flex justify-between text-slate-600">
                    <span>Service Charge ({formData.serviceChargeRate}%):</span>
                    <span className="font-semibold text-slate-900">${sampleServiceCharge.toFixed(2)}</span>
                  </div>
                ) : null}

                <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-emerald-700">${sampleTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Calculations apply automatically to all 3-step thermal receipts, pre-bills & KOT tickets.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
