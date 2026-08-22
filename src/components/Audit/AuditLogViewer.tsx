import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Calendar,
  Filter,
  Download,
  Lock,
  User,
  Clock,
  Database,
  Key,
  ShoppingBag,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { AuditLog } from '../../types';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs, isSuperadmin, currentTenant, t } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const uName = log.userName || log.username || 'System';
    const uRole = log.userRole || log.role || 'admin';
    const matchesSearch =
      (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      uName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.entityId && log.entityId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    const matchesDate = !dateFilter || (log.timestamp && log.timestamp.includes(dateFilter));
    return matchesSearch && matchesAction && matchesModule && matchesDate;
  });

  const getActionColor = (action: string) => {
    if (action.includes('DELETE') || action.includes('REVOKE') || action.includes('RESTORE')) {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    if (action.includes('CREATE') || action.includes('COMPLETE') || action.includes('PAYMENT')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (action.includes('UPDATE') || action.includes('EDIT')) {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('audit_logs', 'Security & Operational Audit Trails')}
              </h1>
              <span className="bg-slate-900 text-white text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                IMMUTABLE
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Real-time administrative activity stream capturing sales, purchases, khata settlements, logins & API security events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              {filteredLogs.length} Events Captured
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, action, details..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
            >
              <option value="all">All Modules</option>
              <option value="POS_SALES">POS Sales</option>
              <option value="PURCHASES">Daily Purchases</option>
              <option value="ACCOUNTS">Accounts & Ledger</option>
              <option value="INVENTORY">Inventory / Products</option>
              <option value="CUSTOMERS">Customers / Khata</option>
              <option value="DIGITAL_MENU_API">Digital Menu API</option>
              <option value="BACKUP_RESTORE">Backup & Recovery</option>
              <option value="AUTH">Authentication</option>
            </select>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent outline-none text-slate-800 text-xs font-semibold cursor-pointer"
              />
              {dateFilter && (
                <button onClick={() => setDateFilter('')} className="text-slate-400 hover:text-slate-700 text-xs ml-1">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="p-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Timestamp & IP</th>
                  <th className="py-3.5 px-4">User & Role</th>
                  <th className="py-3.5 px-4">Module</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Event Details</th>
                  <th className="py-3.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <Activity className="w-12 h-12 text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-600">No matching audit logs found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-slate-800">{log.timestamp}</span>
                          {log.ipAddress && <span className="text-[11px] font-mono text-slate-400">{log.ipAddress}</span>}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs uppercase">
                            {(log.userName || log.username || 'S').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{log.userName || log.username || 'System'}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">{log.userRole || log.role || 'Staff'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {log.module}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-700 font-medium max-w-md">
                        {log.details}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inspect Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Audit Record Payload</span>
                <h3 className="text-lg font-black text-slate-900">{selectedLog.action}</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-400 font-bold">Event ID:</span>
                <span className="font-mono text-slate-800">{selectedLog.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-400 font-bold">Timestamp:</span>
                <span className="font-mono text-slate-800">{selectedLog.timestamp}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-400 font-bold">Operator:</span>
                <span className="font-bold text-slate-800">{selectedLog.userName || selectedLog.username || 'System'} ({selectedLog.userRole || selectedLog.role || 'Staff'})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-400 font-bold">IP Address:</span>
                <span className="font-mono text-slate-800">{selectedLog.ipAddress || '127.0.0.1'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-400 font-bold">Entity ID:</span>
                <span className="font-mono text-slate-800">{selectedLog.entityId || 'N/A'}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">Details & Description</span>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium">
                {selectedLog.details}
              </div>
            </div>

            {selectedLog.previousState && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Previous Snapshot Payload</span>
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-36">
                  {JSON.stringify(selectedLog.previousState, null, 2)}
                </pre>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
