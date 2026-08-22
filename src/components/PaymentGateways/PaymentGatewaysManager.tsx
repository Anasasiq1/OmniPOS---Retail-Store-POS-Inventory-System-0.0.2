import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Settings,
  Key,
  Lock,
  Zap,
  ExternalLink,
  Edit2,
  X,
  Sparkles,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { PaymentGatewayConfig } from '../../types';

export const PaymentGatewaysManager: React.FC = () => {
  const { paymentGateways, updatePaymentGateway } = usePOS();
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayConfig | null>(null);

  // Modal editing
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [merchantId, setMerchantId] = useState<string>('');
  const [isSandbox, setIsSandbox] = useState<boolean>(true);

  const handleOpenEdit = (gw: PaymentGatewayConfig) => {
    setSelectedGateway(gw);
    setApiKey(gw.apiKey || '');
    setApiSecret(gw.apiSecret || '');
    setMerchantId(gw.merchantId || '');
    setIsSandbox(gw.isSandbox ?? true);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGateway) return;

    updatePaymentGateway(selectedGateway.id, {
      apiKey,
      apiSecret,
      merchantId,
      isSandbox,
    });

    setSelectedGateway(null);
    alert(`${selectedGateway.name} credentials updated successfully!`);
  };

  const toggleGatewayActive = (gw: PaymentGatewayConfig) => {
    updatePaymentGateway(gw.id, { isEnabled: !gw.isEnabled });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-slate-900">11+ Global Payment Gateways</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                Multi-Currency & Regional
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Configure international and localized payment providers for online orders, contactless QR & POS checkout
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>PCI-DSS End-to-End Encrypted</span>
        </div>
      </div>

      {/* Gateway Grid */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paymentGateways.map((gw) => {
            const hasCredentials = Boolean(gw.apiKey || gw.merchantId || gw.id === 'cash');

            return (
              <div
                key={gw.id}
                id={`gateway-card-${gw.id}`}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-4 ${
                  gw.isEnabled ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200 opacity-80'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{gw.icon || '💳'}</span>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{gw.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{gw.supportedCurrencies?.join(', ') || 'USD, EUR, GBP'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleGatewayActive(gw)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      gw.isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        gw.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Gateway Metadata */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Environment:</span>
                    <span className="font-bold text-slate-800">
                      {gw.isSandbox ? 'Test / Sandbox' : 'Production Live'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Credentials:</span>
                    <span className="font-semibold text-slate-800">
                      {hasCredentials ? '••••••••' : 'Not Configured'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    id={`configure-gateway-${gw.id}`}
                    onClick={() => handleOpenEdit(gw)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure Keys</span>
                  </button>

                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {gw.isEnabled ? 'Active at POS' : 'Disabled'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gateway Configuration Modal */}
      {selectedGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>{selectedGateway.icon}</span>
                Configure {selectedGateway.name}
              </h3>
              <button onClick={() => setSelectedGateway(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Environment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSandbox(true)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      isSandbox ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    Sandbox / Test
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSandbox(false)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      !isSandbox ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    Live Production
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Publishable Key / Client ID</label>
                <input
                  type="text"
                  placeholder="pk_test_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Secret Key / API Token</label>
                <input
                  type="password"
                  placeholder="sk_test_..."
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Merchant ID / Account Ref (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. acct_9281728"
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGateway(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="save-gateway-keys-btn"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
