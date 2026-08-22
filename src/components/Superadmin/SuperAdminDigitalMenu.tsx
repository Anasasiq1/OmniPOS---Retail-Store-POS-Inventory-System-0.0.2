import React, { useState } from 'react';
import {
  Key,
  Plus,
  Shield,
  Search,
  RefreshCw,
  Trash2,
  Lock,
  Globe,
  Radio,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Building,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { DigitalMenuAPI } from '../../types';

export const SuperAdminDigitalMenu: React.FC = () => {
  const {
    digitalMenuApis,
    createDigitalMenuApi,
    toggleDigitalMenuApiStatus,
    revokeDigitalMenuApi,
    regenerateDigitalMenuApiKey,
    allTenants,
    t,
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // New API Key Form State
  const [tenantId, setTenantId] = useState(allTenants[0]?.id || '');
  const [appName, setAppName] = useState('');
  const [allowedDomains, setAllowedDomains] = useState('');
  const [rateLimitPerMin, setRateLimitPerMin] = useState(120);

  const filteredApis = digitalMenuApis.filter(
    (api) =>
      api.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.apiKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateApi = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTenant = allTenants.find((t) => t.id === tenantId);
    if (!selectedTenant || !appName.trim()) return;

    const newKey = `omni_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
    const newSecret = `sec_${Math.random().toString(36).substring(2, 15)}`;

    createDigitalMenuApi({
      tenantId: selectedTenant.id,
      tenantName: selectedTenant.name,
      apiKey: newKey,
      apiSecret: newSecret,
      appName: appName.trim(),
      allowedDomains: allowedDomains.trim() || `${selectedTenant.subdomain}.omnipos.saas`,
      rateLimitPerMin,
      status: 'active',
      permissions: ['menu:read', 'order:create', 'table:status'],
    });

    setIsCreateModalOpen(false);
    setAppName('');
    setAllowedDomains('');
  };

  const handleCopyKey = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Super Admin – Digital Menu API Controller
              </h1>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full">
                PLATFORM ROOT
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Provision external API keys, enforce rate limiting, assign to tenant stores & monitor external app traffic.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="create-api-key-btn"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New API Key</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 pt-4 border-t border-slate-100 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by app name, tenant or API key..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="p-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Application & Tenant</th>
                  <th className="py-3.5 px-4">API Key</th>
                  <th className="py-3.5 px-4">Allowed Domains</th>
                  <th className="py-3.5 px-4">Rate Limit & Calls</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredApis.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No API keys provisioned yet.
                    </td>
                  </tr>
                ) : (
                  filteredApis.map((api) => (
                    <tr key={api.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{api.appName}</span>
                          <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {api.tenantName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs">
                        <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 w-fit">
                          <span className="text-slate-800 font-bold">
                            {api.apiKey.substring(0, 14)}...
                          </span>
                          <button
                            onClick={() => handleCopyKey(api.id, api.apiKey)}
                            className="text-slate-400 hover:text-indigo-600 p-0.5"
                            title="Copy full key"
                          >
                            {copiedKeyId === api.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono text-slate-600 max-w-xs truncate">
                        {api.allowedDomains}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{api.rateLimitPerMin} req/min</span>
                          <span className="text-slate-400">{api.totalCallsCount.toLocaleString()} total calls</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            api.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : api.status === 'disabled'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {api.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => regenerateDigitalMenuApiKey(api.id)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Regenerate API Credentials"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => toggleDigitalMenuApiStatus(api.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              api.status === 'active'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={api.status === 'active' ? 'Disable Key' : 'Enable Key'}
                          >
                            {api.status === 'active' ? <Lock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Revoke API key for ${api.appName}? This cannot be undone.`)) {
                                revokeDigitalMenuApi(api.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Revoke Key"
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

      {/* Generate API Key Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Generate Digital Menu API Key</h2>
                <p className="text-xs text-slate-400">Assign to tenant store for external application consumption.</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApi} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assign to Tenant *</label>
                <select
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                >
                  {allTenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.businessVertical})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Application Name *</label>
                <input
                  type="text"
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. Customer Self-Order QR Mobile WebApp"
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Allowed Host Domains / Origins</label>
                <input
                  type="text"
                  value={allowedDomains}
                  onChange={(e) => setAllowedDomains(e.target.value)}
                  placeholder="e.g. ajmeeri.live, menu.ajmeerirestaurant.com"
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rate Limit (Requests / Min)</label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={rateLimitPerMin}
                  onChange={(e) => setRateLimitPerMin(Number(e.target.value))}
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-98"
                >
                  Provision API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
