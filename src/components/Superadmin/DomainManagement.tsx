import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Trash2,
  RefreshCw,
  Building,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Domain } from '../../types';

export const DomainManagement: React.FC = () => {
  const { domains, addDomain, deleteDomain, allTenants, resolveTenantByDomain, setCurrentTenant, isSuperadmin } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Domain Form
  const [domainName, setDomainName] = useState('');
  const [domainType, setDomainType] = useState<'subdomain' | 'custom'>('custom');
  const [selectedTenantId, setSelectedTenantId] = useState(allTenants[0]?.id || '');

  // Subdomain simulator state
  const [testDomainInput, setTestDomainInput] = useState('freshmart.omnipos.saas');
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const filteredDomains = domains.filter(
    (d) =>
      d.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tenantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const tenant = allTenants.find((t) => t.id === selectedTenantId);
    if (!tenant || !domainName.trim()) return;

    addDomain({
      domain: domainName.trim().toLowerCase(),
      subdomain: domainType === 'subdomain' ? domainName.trim().toLowerCase() : `${tenant.subdomain}.omnipos.saas`,
      tenantId: tenant.id,
      tenantName: tenant.name,
      isCustom: domainType === 'custom',
      sslActive: true,
      status: 'active',
      isPrimary: false,
      type: domainType,
      sslStatus: 'active',
    });

    setIsAddModalOpen(false);
    setDomainName('');
  };

  const handleTestDomain = () => {
    const tenant = resolveTenantByDomain(testDomainInput.trim().toLowerCase());
    if (tenant) {
      setSimulationResult(`✅ Resolved to Tenant: "${tenant.name}" (${tenant.businessVertical}) | Subdomain: ${tenant.subdomain}`);
    } else {
      setSimulationResult(`❌ Domain "${testDomainInput}" is not mapped to any tenant.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Multi-Tenant Domain & Subdomain Controller
              </h1>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                SaaS DNS & Routing
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Manage automatic subdomains (*.omnipos.saas), custom domains, SSL certificates and tenant routing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="add-domain-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Map Domain / Subdomain</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Subdomain Router Simulator Interactive Widget */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center gap-2.5 mb-2">
            <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h2 className="text-base font-bold">Live Subdomain & Domain Resolution Simulator</h2>
          </div>
          <p className="text-xs text-slate-300 mb-4 max-w-2xl">
            Test how incoming HTTP Host requests route customers and staff to their isolated tenant instance.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={testDomainInput}
                onChange={(e) => setTestDomainInput(e.target.value)}
                placeholder="Enter domain e.g. ajmeeri.omnipos.saas"
                className="w-full h-11 pl-10 pr-4 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 outline-none focus:border-indigo-400 font-mono"
              />
            </div>
            <button
              onClick={handleTestDomain}
              className="w-full sm:w-auto px-5 h-11 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <span>Test Resolution</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {simulationResult && (
            <div className="mt-3 p-3 bg-white/10 border border-white/15 rounded-xl text-xs font-semibold text-indigo-200">
              {simulationResult}
            </div>
          )}
        </div>

        {/* Domains List Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search domains or tenants..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
            <span className="text-xs font-bold text-slate-500">{filteredDomains.length} Domains Mapped</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Domain / Host</th>
                  <th className="py-3.5 px-4">Mapped Tenant</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">SSL Certificate</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredDomains.map((dom) => (
                  <tr key={dom.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-600" />
                        <span className="font-mono font-bold text-slate-900">{dom.domain}</span>
                        {dom.isPrimary && (
                          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded">
                            PRIMARY
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dom.tenantName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {dom.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-800 capitalize">{dom.sslStatus}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">{dom.createdAt}</td>

                    <td className="py-3.5 px-4 text-right">
                      {!dom.isPrimary && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove domain mapping for ${dom.domain}?`)) {
                              deleteDomain(dom.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Domain"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Domain Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Map Domain / Subdomain</h2>
                <p className="text-xs text-slate-400">Route domain directly to a tenant workspace.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDomain} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Tenant *</label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Domain Type</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDomainType('custom')}
                    className={`py-1.5 text-xs font-bold rounded-lg ${
                      domainType === 'custom' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Custom Domain
                  </button>
                  <button
                    type="button"
                    onClick={() => setDomainType('subdomain')}
                    className={`py-1.5 text-xs font-bold rounded-lg ${
                      domainType === 'subdomain' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    SaaS Subdomain
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {domainType === 'custom' ? 'Custom Domain (e.g. store.ajmeeri.live)' : 'Subdomain Prefix (e.g. ajmeeri)'} *
                </label>
                <input
                  type="text"
                  required
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder={domainType === 'custom' ? 'pos.mybusiness.com' : 'mybusiness.omnipos.saas'}
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

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
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-98"
                >
                  Save Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
