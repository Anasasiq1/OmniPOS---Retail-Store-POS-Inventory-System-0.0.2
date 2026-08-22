import React, { useState } from 'react';
import { X, Sparkles, Barcode } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types';

interface AddProductModalProps {
  onClose: () => void;
  editingProduct?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, editingProduct }) => {
  const { addProduct, updateProduct, businessType, settings } = usePOS();

  const [name, setName] = useState(editingProduct?.name || '');
  const [nameMl, setNameMl] = useState(editingProduct?.nameMl || '');
  const [sku, setSku] = useState(editingProduct?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [barcode, setBarcode] = useState(editingProduct?.barcode || `890${Math.floor(100000000 + Math.random() * 900000000)}`);
  const [category, setCategory] = useState(editingProduct?.category || (businessType === 'restaurant' ? 'Main Course' : 'Pantry'));
  const [price, setPrice] = useState<number>(editingProduct?.price || 100);
  const [costPrice, setCostPrice] = useState<number>(editingProduct?.costPrice || 60);
  const [stock, setStock] = useState<number>(editingProduct?.stock || 20);
  const [minStockAlert, setMinStockAlert] = useState<number>(editingProduct?.minStockAlert || 5);
  const [unit, setUnit] = useState(editingProduct?.unit || (businessType === 'restaurant' ? 'portion' : 'pcs'));
  const [image, setImage] = useState(editingProduct?.image || '');
  const [requiresImei, setRequiresImei] = useState(editingProduct?.requiresImei || false);
  const [expiryDate, setExpiryDate] = useState(editingProduct?.expiryDate || '');
  const [isVeg, setIsVeg] = useState(editingProduct?.isVeg ?? true);
  const [taxPercent, setTaxPercent] = useState<number>(editingProduct?.taxPercent || settings.taxRatePercent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        nameMl: nameMl || undefined,
        sku,
        barcode,
        category,
        price,
        costPrice,
        stock,
        minStockAlert,
        unit,
        image: image || undefined,
        requiresImei,
        expiryDate: expiryDate || undefined,
        isExpiringSoon: !!expiryDate && new Date(expiryDate).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 3,
        isVeg: businessType === 'restaurant' ? isVeg : undefined,
        taxPercent,
      });
    } else {
      addProduct({
        name,
        nameMl: nameMl || undefined,
        sku,
        barcode,
        category,
        price,
        costPrice,
        stock,
        minStockAlert,
        unit,
        image: image || undefined,
        requiresImei,
        expiryDate: expiryDate || undefined,
        isExpiringSoon: !!expiryDate && new Date(expiryDate).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 3,
        isVeg: businessType === 'restaurant' ? isVeg : undefined,
        isAvailable: stock > 0,
        taxPercent,
        businessType,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 my-6">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">
              {editingProduct ? 'Edit Product' : 'Add New Product to Inventory'}
            </h3>
            <p className="text-xs text-slate-400 capitalize">{businessType} Edition Catalog</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Item Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Organic Whole Milk 1L"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Local Name (മലയാളം / Hindi)
              </label>
              <input
                type="text"
                value={nameMl}
                onChange={(e) => setNameMl(e.target.value)}
                placeholder="e.g. ജൈവ പാൽ"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* SKU & Barcode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Barcode</label>
              <div className="relative">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:border-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setBarcode(`890${Math.floor(100000000 + Math.random() * 900000000)}`)}
                  title="Generate Barcode"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                >
                  <Barcode className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Fresh Produce, Dairy, Audio"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Unit of Measure</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-500 outline-none"
              >
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="L">Liters (L)</option>
                <option value="pack">Pack</option>
                <option value="bottle">Bottle</option>
                <option value="box">Box</option>
                <option value="portion">Portion / Plate</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price ({settings.currency})</label>
              <input
                type="number"
                step="any"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Cost Price ({settings.currency})</label>
              <input
                type="number"
                step="any"
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Min Alert Level</label>
              <input
                type="number"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Business Mode Specific Attributes */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Vertical Attributes
            </span>

            {/* Expiry Date (Grocery) */}
            {businessType === 'grocery' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            {/* Requires IMEI (Electronics) */}
            {businessType === 'electronics' && (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Require IMEI/Serial Number</span>
                  <span className="text-[11px] text-slate-500">Prompt cashier for device serial at checkout</span>
                </div>
                <input
                  type="checkbox"
                  checked={requiresImei}
                  onChange={(e) => setRequiresImei(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Veg / Non-Veg (Restaurant) */}
            {businessType === 'restaurant' && (
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="veg_option"
                    checked={isVeg}
                    onChange={() => setIsVeg(true)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="veg_option"
                    checked={!isVeg}
                    onChange={() => setIsVeg(false)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>Non-Vegetarian</span>
                </label>
              </div>
            )}

            {/* Image URL */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Product Photo URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-product-submit-btn"
              className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              {editingProduct ? 'Save Changes' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
