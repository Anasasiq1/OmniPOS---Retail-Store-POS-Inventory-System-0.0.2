import React, { useState } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  Truck,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const ImportExportManager: React.FC = () => {
  const {
    products,
    customers,
    orders,
    purchases,
    accounts,
    exportDataToCsv,
    importProductsFromCsv,
    importCustomersFromCsv,
    t,
  } = usePOS();

  const [importType, setImportType] = useState<'products' | 'customers'>('products');
  const [csvContent, setCsvContent] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const sampleProductsCsv = `name,category,price,costPrice,stock,unit,barcode
Basmati Rice Premium,Grains,120,95,100,KG,890103001
Sunflower Oil 1L,Oil & Fat,145,120,50,L,890103002
Chilly Powder 500g,Spices,110,85,80,Pcs,890103003`;

  const sampleCustomersCsv = `name,phone,email,address,creditLimit,netBalance
Suresh Kumar,+91 98471 23456,suresh@gmail.com,Kochi Ernakulam,10000,0
Anjali Menon,+91 98472 34567,anjali@gmail.com,Kaloor Stadium,5000,0`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      setFeedback(null);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!csvContent.trim()) return;

    let res;
    if (importType === 'products') {
      res = importProductsFromCsv(csvContent);
    } else {
      res = importCustomersFromCsv(csvContent);
    }
    setFeedback(res);
    if (res.success) {
      setCsvContent('');
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
                {t('import_export', 'Data Import & Export Center')}
              </h1>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                CSV / Excel Engine
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Seamlessly bulk import new products or customer lists, and export real-time business ledgers.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl space-y-6">
        {/* Export Data Cards Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
            Quick Data Export (CSV)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Products Export */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Products Catalog</h3>
                  <p className="text-xs text-slate-400">{products.length} Items</p>
                </div>
              </div>
              <button
                id="export-products-csv-btn"
                onClick={() => exportDataToCsv('products')}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                title="Export Products"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Customers Export */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Customers & Khata</h3>
                  <p className="text-xs text-slate-400">{customers.length} Accounts</p>
                </div>
              </div>
              <button
                id="export-customers-csv-btn"
                onClick={() => exportDataToCsv('customers')}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                title="Export Customers"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Sales Orders Export */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Sales Invoices</h3>
                  <p className="text-xs text-slate-400">{orders.length} Invoices</p>
                </div>
              </div>
              <button
                id="export-orders-csv-btn"
                onClick={() => exportDataToCsv('orders')}
                className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                title="Export Orders"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Daily Purchases Export */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Daily Purchases</h3>
                  <p className="text-xs text-slate-400">{purchases.length} Purchase Bills</p>
                </div>
              </div>
              <button
                id="export-purchases-csv-btn"
                onClick={() => exportDataToCsv('purchases')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Export Purchases"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Accounts Export */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Accounts & Ledger</h3>
                  <p className="text-xs text-slate-400">{accounts.length} Transactions</p>
                </div>
              </div>
              <button
                id="export-accounts-csv-btn"
                onClick={() => exportDataToCsv('accounts')}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                title="Export Accounts"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk CSV Import Wizard Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Bulk CSV Import Wizard</h2>
                <p className="text-xs text-slate-500">Upload CSV files or paste comma-separated entries below.</p>
              </div>
            </div>

            {/* Type selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setImportType('products');
                  setFeedback(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  importType === 'products' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Import Products
              </button>
              <button
                onClick={() => {
                  setImportType('customers');
                  setFeedback(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  importType === 'customers' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Import Customers
              </button>
            </div>
          </div>

          {/* Sample template download button */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-600 font-medium">
              Need a sample CSV format? Click to populate sample test data.
            </span>
            <button
              onClick={() =>
                setCsvContent(importType === 'products' ? sampleProductsCsv : sampleCustomersCsv)
              }
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
            >
              Load Sample Template
            </button>
          </div>

          {/* File Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-4 text-center transition-colors bg-slate-50/50">
            <input
              type="file"
              id="csv-file-input"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center">
              <FileSpreadsheet className="w-8 h-8 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-indigo-600 hover:underline">
                Upload CSV File from Device
              </span>
              <span className="text-[11px] text-slate-400">or paste raw CSV text in the box below</span>
            </label>
          </div>

          {/* Textarea for CSV */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">CSV Content (Header row required)</label>
            <textarea
              rows={5}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="Paste comma-separated data with headers..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-mono outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>

          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                feedback.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              id="execute-import-csv-btn"
              onClick={handleExecuteImport}
              disabled={!csvContent.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-98"
            >
              Commit & Import to Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
