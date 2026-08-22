import React, { useState, useEffect } from 'react';
import { Camera, X, Barcode, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const ScannerModal: React.FC = () => {
  const {
    isScannerOpen,
    setIsScannerOpen,
    products,
    businessType,
    addToCart,
    playSound,
    settings,
  } = usePOS();

  const [scannedItemName, setScannedItemName] = useState<string | null>(null);

  if (!isScannerOpen) return null;

  const verticalProducts = products.filter((p) => p.businessType === businessType);

  const handleScanBarcode = (barcodeVal: string) => {
    const product = verticalProducts.find((p) => p.barcode === barcodeVal);
    if (product) {
      addToCart(product, 1);
      setScannedItemName(product.name);
      setTimeout(() => {
        setScannedItemName(null);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm">Optical Barcode Scanner</h3>
          </div>
          <button
            onClick={() => setIsScannerOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Simulator with animated red laser beam */}
        <div className="p-6 bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-64 h-48 border-2 border-indigo-500/80 rounded-2xl relative flex items-center justify-center bg-slate-900/60 shadow-inner">
            {/* Viewfinder corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white"></div>

            {/* Laser scanning line */}
            <div className="w-full h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></div>

            {/* Scanned popup confirmation */}
            {scannedItemName && (
              <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center animate-in zoom-in-95">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1" />
                <span className="text-white font-bold text-xs">Added to Cart:</span>
                <span className="text-emerald-300 font-black text-sm line-clamp-1">
                  {scannedItemName}
                </span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Point camera or click any sample barcode below to simulate instant scanner hardware read.
          </p>
        </div>

        {/* Click-to-Scan Preset Barcodes for Fast Testing */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Click Quick Test Barcode / SKU
          </span>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
            {verticalProducts.slice(0, 5).map((prod) => (
              <button
                key={prod.id}
                onClick={() => handleScanBarcode(prod.barcode)}
                className="w-full p-2.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between text-xs text-left transition-colors group"
              >
                <div>
                  <span className="font-bold text-slate-900 block group-hover:text-indigo-700">
                    {prod.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Code: {prod.barcode}
                  </span>
                </div>

                <span className="font-black text-slate-700 shrink-0">
                  {settings.currency}
                  {prod.price.toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200">
          <button
            onClick={() => setIsScannerOpen(false)}
            className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
