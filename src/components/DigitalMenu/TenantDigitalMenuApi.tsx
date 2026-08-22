import React, { useState } from 'react';
import {
  QrCode,
  Key,
  Lock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  Shield,
  Smartphone,
  Globe,
  Radio,
  Unlink,
  Check,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const TenantDigitalMenuApi: React.FC = () => {
  const {
    settings,
    currentTenant,
    connectTenantDigitalMenuApi,
    disconnectTenantDigitalMenuApi,
    digitalMenuApis,
    t,
  } = usePOS();

  const [inputApiKey, setInputApiKey] = useState(settings.digitalMenuApiKey || '');
  const [inputApiSecret, setInputApiSecret] = useState(settings.digitalMenuApiSecret || '');
  const [copiedKey, setCopiedKey] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Find linked API details
  const connectedApi = digitalMenuApis.find(
    (api) => api.apiKey === settings.digitalMenuApiKey && (api.tenantId === currentTenant?.id || settings.digitalMenuConnected)
  );

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputApiKey.trim()) return;

    const ok = connectTenantDigitalMenuApi(inputApiKey.trim(), inputApiSecret.trim());
    if (ok) {
      setStatusMsg({ text: 'Successfully connected to External Digital Menu Application!', success: true });
    } else {
      setStatusMsg({
        text: 'Invalid API Key or Key not assigned to this tenant by Super Admin.',
        success: false,
      });
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(settings.digitalMenuApiKey || inputApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('qr_menu', 'External Digital Menu API Connection')}
              </h1>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  settings.digitalMenuConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {settings.digitalMenuConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Connect external customer QR ordering apps, self-order kiosks, and website menus via secured API credentials.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl space-y-6">
        {/* Architectural Notice Banner */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-950">External App API Architecture</h3>
            <p className="text-xs text-indigo-800 mt-0.5 leading-relaxed">
              In OMINI POS, the digital customer menu is delivered via standalone customer-facing mobile/web apps.
              This panel manages the secure REST API connection between your store's live menu items, tables, and the external application.
            </p>
          </div>
        </div>

        {/* Connection Status Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  settings.digitalMenuConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">API Connection Status</h2>
                <p className="text-xs text-slate-500">
                  {settings.digitalMenuConnected
                    ? 'Active realtime feed linked with Super Admin provisioned API key'
                    : 'No external digital menu currently connected'}
                </p>
              </div>
            </div>

            {settings.digitalMenuConnected && (
              <button
                id="disconnect-menu-api-btn"
                onClick={disconnectTenantDigitalMenuApi}
                className="flex items-center gap-1.5 px-3.5 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-all"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Disconnect Application</span>
              </button>
            )}
          </div>

          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                statusMsg.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Form to connect or show connected credentials */}
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                API Key (Provided by Super Admin) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={inputApiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                  placeholder="omni_live_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full h-11 pl-10 pr-24 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {inputApiKey && (
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1 bg-slate-200/60 rounded-lg"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                API Secret (Optional / Client Signature)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={inputApiSecret}
                  onChange={(e) => setInputApiSecret(e.target.value)}
                  placeholder="sec_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="connect-menu-api-btn"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all active:scale-98"
              >
                {settings.digitalMenuConnected ? 'Update Connection' : 'Connect External Digital Menu'}
              </button>
            </div>
          </form>

          {/* Connected Application Meta */}
          {connectedApi && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Connected Application Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block font-medium">Application Name:</span>
                  <span className="font-bold text-slate-800">{connectedApi.appName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Allowed Domains:</span>
                  <span className="font-mono text-slate-800">{connectedApi.allowedDomains}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Rate Limit:</span>
                  <span className="font-bold text-indigo-700">{connectedApi.rateLimitPerMin} req/min</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Last Handshake:</span>
                  <span className="font-medium text-slate-700">{connectedApi.lastUsedAt || 'Just now'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
