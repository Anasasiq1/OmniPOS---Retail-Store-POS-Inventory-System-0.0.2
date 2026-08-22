import React, { useState } from 'react';
import {
  Archive,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileArchive,
  Clock,
  HardDrive,
  Database,
  Lock,
  Layers,
  FileText,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const BackupManager: React.FC = () => {
  const {
    currentTenant,
    isSuperadmin,
    generateZipBackup,
    restoreFromZip,
    products,
    customers,
    orders,
    purchases,
    accounts,
    t,
  } = usePOS();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreFeedback, setRestoreFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDownloadBackup = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateZipBackup();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const tenantPrefix = isSuperadmin ? 'omnipos_full_platform' : `omnipos_${currentTenant?.subdomain || 'tenant'}`;
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `${tenantPrefix}_backup_${dateStr}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Backup generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setRestoreFeedback(null);
    }
  };

  const handleExecuteRestore = async () => {
    if (!selectedFile) return;

    const confirmed = confirm(
      `⚠️ WARNING: Restoring from "${selectedFile.name}" will overwrite current data with the contents of this archive.\n\nA safety rollback snapshot will be automatically recorded in the audit log.\n\nDo you want to proceed?`
    );
    if (!confirmed) return;

    setIsRestoring(true);
    setRestoreFeedback(null);
    try {
      const res = await restoreFromZip(selectedFile);
      setRestoreFeedback(res);
      if (res.success) {
        setSelectedFile(null);
      }
    } catch (err: any) {
      setRestoreFeedback({ success: false, message: `Restore error: ${err.message}` });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('backup_restore', 'Database Backup & Disaster Recovery')}
              </h1>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                ZIP Archive Engine
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Export encrypted ZIP snapshots containing products, customers, transactions, purchases & accounts.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl space-y-6">
        {/* System Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Products</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{products.length}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Customers</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{customers.length}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sales Orders</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{orders.length}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Purchases</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{purchases.length}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Ledger TXNs</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{accounts.length}</span>
          </div>
        </div>

        {/* 2 Main Columns: Backup vs Restore */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Backup Generator Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Generate Backup Snapshot</h2>
                  <p className="text-xs text-slate-500">
                    {isSuperadmin
                      ? 'Full multi-tenant platform database package'
                      : `Isolated snapshot for ${currentTenant?.name}`}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  What is included in the ZIP archive:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 font-mono text-[11px]">
                  <li>database/products.json</li>
                  <li>database/customers.json</li>
                  <li>database/orders.json</li>
                  <li>database/purchases.json</li>
                  <li>database/accounts.json</li>
                  <li>settings/config.json</li>
                  <li>backup-manifest.json (SHA-256 integrity checksums)</li>
                </ul>
              </div>
            </div>

            <button
              id="generate-backup-zip-btn"
              onClick={handleDownloadBackup}
              disabled={isGenerating}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compressing Archive...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download .ZIP Backup Archive</span>
                </>
              )}
            </button>
          </div>

          {/* Restore Engine Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Restore Database from ZIP</h2>
                  <p className="text-xs text-slate-500">Restore products, customers & accounts from backup file.</p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-5 text-center transition-colors bg-slate-50/50">
                <input
                  type="file"
                  id="backup-file-input"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="backup-file-input" className="cursor-pointer flex flex-col items-center">
                  <FileArchive className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-indigo-600 hover:underline">
                    {selectedFile ? selectedFile.name : 'Choose or drag .ZIP backup file'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">Accepts standard OMINI POS ZIP packages</span>
                </label>
              </div>

              {restoreFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    restoreFeedback.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {restoreFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{restoreFeedback.message}</span>
                </div>
              )}
            </div>

            <button
              id="execute-restore-zip-btn"
              onClick={handleExecuteRestore}
              disabled={!selectedFile || isRestoring}
              className="w-full h-12 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating & Restoring Database...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Verify & Execute Restore</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
