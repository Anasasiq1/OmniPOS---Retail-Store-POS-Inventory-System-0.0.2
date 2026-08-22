import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  Flame,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Barcode,
  Camera,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types';
import { AddProductModal } from './AddProductModal';
import { ScanBillModal } from './ScanBillModal';

export const InventoryManager: React.FC = () => {
  const {
    products,
    businessType,
    adjustStock,
    deleteProduct,
    settings,
    setIsScannerOpen,
    t,
  } = usePOS();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanBillOpen, setIsScanBillOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'expiring' | 'out'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [barcodeModalProduct, setBarcodeModalProduct] = useState<Product | null>(null);

  // Relevant products for current vertical
  const verticalProducts = products.filter((p) => p.businessType === businessType);

  // Key KPI metrics
  const totalSKUs = verticalProducts.length;
  const lowStockCount = verticalProducts.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const expiringCount = verticalProducts.filter((p) => p.isExpiringSoon).length;
  const outOfStockCount = verticalProducts.filter((p) => p.stock <= 0).length;
  const totalInventoryValuation = verticalProducts.reduce(
    (acc, p) => acc + p.stock * (p.costPrice || p.price * 0.7),
    0
  );

  const categories = ['All', ...Array.from(new Set(verticalProducts.map((p) => p.category)))];

  // Filtering
  const filteredProducts = verticalProducts.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.stock > 0 && p.stock <= p.minStockAlert;
    else if (stockFilter === 'expiring') matchesStock = !!p.isExpiringSoon;
    else if (stockFilter === 'out') matchesStock = p.stock <= 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-100 p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            <span>Inventory & Stock Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time stock ledger, batch tracking, expiry alarms & barcode tools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="scan-supplier-bill-btn"
            onClick={() => setIsScanBillOpen(true)}
            className="h-10 px-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Scan Supplier Bill</span>
          </button>
          <button
            id="add-new-product-btn"
            onClick={() => {
              setEditingProduct(null);
              setIsAddModalOpen(true);
            }}
            className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total SKUs */}
        <div
          onClick={() => setStockFilter('all')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer ${
            stockFilter === 'all'
              ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-xs'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total SKUs</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalSKUs}</div>
          <span className="text-[10px] text-slate-400">Active catalog items</span>
        </div>

        {/* Expiring Soon */}
        <div
          onClick={() => setStockFilter('expiring')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer ${
            stockFilter === 'expiring'
              ? 'border-amber-600 ring-2 ring-amber-100 shadow-xs'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Expiring Soon</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">{expiringCount}</div>
          <span className="text-[10px] text-amber-600 font-medium">Expires in ≤ 3 days</span>
        </div>

        {/* Low Stock */}
        <div
          onClick={() => setStockFilter('low')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer ${
            stockFilter === 'low'
              ? 'border-rose-600 ring-2 ring-rose-100 shadow-xs'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700">{lowStockCount}</div>
          <span className="text-[10px] text-rose-600 font-medium">Below alert threshold</span>
        </div>

        {/* Stock Valuation */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Stock Valuation</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {settings.currency}
            {totalInventoryValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[10px] text-slate-400">Total cost value in stock</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU or barcode..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 text-slate-700 outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
          <span>Showing {filteredProducts.length} items</span>
        </div>
      </div>

      {/* Inventory Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4 text-center">Quick Stock Adjust</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching inventory items found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  const isLow = !isOutOfStock && product.stock <= product.minStockAlert;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product Name & SKU */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{product.name}</span>
                            {product.nameMl && (
                              <span className="text-[11px] text-slate-500 block">{product.nameMl}</span>
                            )}
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono">{product.sku}</span>
                              {product.requiresImei && (
                                <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                                  IMEI
                                </span>
                              )}
                              {product.isExpiringSoon && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                                  <Flame className="w-2.5 h-2.5" /> Expiring Soon
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {product.category}
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {settings.currency}
                        {product.price.toFixed(2)}
                      </td>

                      {/* Cost Price */}
                      <td className="py-3 px-4 text-slate-500">
                        {settings.currency}
                        {(product.costPrice || product.price * 0.7).toFixed(2)}
                      </td>

                      {/* Stock Level Badge */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            isOutOfStock
                              ? 'bg-red-100 text-red-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {product.stock} {product.unit}
                        </span>
                      </td>

                      {/* Quick Stock Adjust Buttons */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            id={`adjust-sub-5-${product.id}`}
                            onClick={() => adjustStock(product.id, -5)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                            title="Deduct 5 items"
                          >
                            -5
                          </button>
                          <button
                            id={`adjust-sub-1-${product.id}`}
                            onClick={() => adjustStock(product.id, -1)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                            title="Deduct 1 item"
                          >
                            -1
                          </button>
                          <button
                            id={`adjust-add-1-${product.id}`}
                            onClick={() => adjustStock(product.id, 1)}
                            className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px]"
                            title="Add 1 item"
                          >
                            +1
                          </button>
                          <button
                            id={`adjust-add-10-${product.id}`}
                            onClick={() => adjustStock(product.id, 10)}
                            className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px]"
                            title="Add 10 items (Stock In)"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setBarcodeModalProduct(product)}
                            title="Generate Barcode Label"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Barcode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsAddModalOpen(true);
                            }}
                            title="Edit Product"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            title="Delete Product"
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <AddProductModal
          editingProduct={editingProduct}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Scan Supplier Bill Modal */}
      {isScanBillOpen && <ScanBillModal onClose={() => setIsScanBillOpen(false)} />}

      {/* Barcode Label Modal */}
      {barcodeModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-center">
            <h3 className="font-bold text-base text-slate-900">Print Barcode Label</h3>
            <div className="p-4 border-2 border-slate-900 rounded-xl space-y-2 bg-white">
              <span className="font-bold text-xs text-slate-900 block">{barcodeModalProduct.name}</span>
              <div className="font-mono text-xl tracking-widest py-2 bg-slate-50 font-bold border border-dashed border-slate-300">
                ||| | |||| | ||||| |||||
              </div>
              <span className="font-mono text-xs text-slate-600 block">{barcodeModalProduct.barcode}</span>
              <span className="font-black text-sm text-slate-900 block">
                MRP: {settings.currency}
                {barcodeModalProduct.price.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setBarcodeModalProduct(null)}
                className="flex-1 h-10 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setBarcodeModalProduct(null);
                }}
                className="flex-1 h-10 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-indigo-700"
              >
                Print Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
