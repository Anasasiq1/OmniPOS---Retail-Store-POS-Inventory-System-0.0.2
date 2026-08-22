import React, { useState } from 'react';
import { Camera, Upload, Sparkles, Check, X, FileText, ArrowRight } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

interface ScanBillModalProps {
  onClose: () => void;
}

export const ScanBillModal: React.FC<ScanBillModalProps> = ({ onClose }) => {
  const { addProduct, businessType, settings } = usePOS();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedItems, setAnalyzedItems] = useState<
    Array<{ name: string; category: string; costPrice: number; sellingPrice: number; stock: number; unit: string }>
  >([]);

  const handleSimulateScan = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (businessType === 'grocery') {
        setAnalyzedItems([
          { name: 'Organic Almond Milk 1L', category: 'Dairy & Beverages', costPrice: 180, sellingPrice: 240, stock: 30, unit: 'pack' },
          { name: 'Cold Pressed Sunflower Oil 1L', category: 'Pantry', costPrice: 140, sellingPrice: 195, stock: 25, unit: 'bottle' },
          { name: 'Kerala Red Matta Rice 5kg', category: 'Grains & Rice', costPrice: 220, sellingPrice: 280, stock: 15, unit: 'pack' },
        ]);
      } else if (businessType === 'electronics') {
        setAnalyzedItems([
          { name: 'Type-C Braided Cable 2M', category: 'Accessories', costPrice: 150, sellingPrice: 399, stock: 50, unit: 'pcs' },
          { name: 'Wireless Bluetooth Earbuds Pro', category: 'Audio', costPrice: 850, sellingPrice: 1799, stock: 12, unit: 'pcs' },
        ]);
      } else {
        setAnalyzedItems([
          { name: 'Paneer Butter Masala', category: 'Main Course', costPrice: 110, sellingPrice: 240, stock: 30, unit: 'portion' },
          { name: 'Fresh Mint Lime Juice', category: 'Beverages', costPrice: 15, sellingPrice: 60, stock: 50, unit: 'glass' },
        ]);
      }
    }, 1200);
  };

  const handleImportAll = () => {
    analyzedItems.forEach((item) => {
      addProduct({
        name: item.name,
        category: item.category,
        price: item.sellingPrice,
        costPrice: item.costPrice,
        stock: item.stock,
        minStockAlert: 5,
        unit: item.unit,
        isAvailable: true,
        businessType,
        taxPercent: settings.taxRatePercent,
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
      });
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Supplier Invoice Scanner</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {analyzedItems.length === 0 ? (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3 bg-slate-50">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Scan or Upload Supplier Wholesale Bill</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Point camera or upload a purchase invoice. Line items, quantities, and cost prices are extracted into inventory.
                </p>
              </div>

              <div className="pt-3 flex justify-center gap-3">
                <button
                  type="button"
                  id="simulate-scan-invoice-btn"
                  disabled={isAnalyzing}
                  onClick={handleSimulateScan}
                  className="px-5 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <span>Reading & Parsing Invoice...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Simulate Auto-Scan Invoice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Extracted {analyzedItems.length} Products from Bill
                </h4>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                  OCR Verified
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {analyzedItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-[11px] text-slate-500">{item.category} • {item.stock} {item.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">Cost: {settings.currency}{item.costPrice}</span>
                      <span className="text-[11px] text-emerald-600 font-semibold">Sell: {settings.currency}{item.sellingPrice}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAnalyzedItems([])}
                  className="flex-1 h-10 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Re-scan
                </button>
                <button
                  type="button"
                  id="confirm-import-invoice-btn"
                  onClick={handleImportAll}
                  className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Import All into Inventory</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
