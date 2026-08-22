import React, { useState } from 'react';
import {
  Printer,
  X,
  CheckCircle2,
  Share2,
  Phone,
  MessageSquare,
  QrCode,
  Flame,
  FileText,
  UtensilsCrossed,
  Receipt,
  Bluetooth,
  Wifi,
  Usb,
  Clock,
  Sparkles,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Order } from '../../types';

export const BillPrintModal: React.FC = () => {
  const { activePrintModal, closePrintModal, settings, printKotTicket, printPreBillCheck, printThermalReceipt } = usePOS();
  const [thermalWidth, setThermalWidth] = useState<'80mm' | '58mm'>(settings.printer.thermalWidth || '80mm');
  const [printerConnection, setPrinterConnection] = useState<'bluetooth' | 'wifi' | 'usb' | 'cable'>('bluetooth');
  const [printSuccess, setPrintSuccess] = useState<boolean>(false);

  if (!activePrintModal) return null;

  const { order, type } = activePrintModal;

  const handlePrint = () => {
    if (type === 'kot') printKotTicket(order);
    else if (type === 'bill') printPreBillCheck(order);
    else printThermalReceipt(order);

    setPrintSuccess(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const shareWhatsApp = () => {
    const message = encodeURIComponent(
      `🍽️ *${settings.storeName}*\nBill for Order #${order.orderNumber}\n` +
      `Items: ${order.items.map(i => `${i.product.name} x${i.quantity}`).join(', ')}\n` +
      `*Total: $${order.total.toFixed(2)}*\nThank you for dining with us!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            {type === 'kot' && (
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
            )}
            {type === 'bill' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
            )}
            {type === 'receipt' && (
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {type === 'kot' && 'Step 1: KOT Kitchen Order Ticket'}
                {type === 'bill' && 'Step 2: Customer Pre-Bill / Check Estimate'}
                {type === 'receipt' && 'Step 3: Final Paid Thermal Receipt'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Order #{order.orderNumber} • {order.type.toUpperCase()}</p>
            </div>
          </div>
          <button
            id="close-bill-print-modal-btn"
            onClick={closePrintModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printer Controls / Options */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Paper Width:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
              <button
                id="select-80mm-width-btn"
                onClick={() => setThermalWidth('80mm')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  thermalWidth === '80mm' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                80mm Thermal
              </button>
              <button
                id="select-58mm-width-btn"
                onClick={() => setThermalWidth('58mm')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  thermalWidth === '58mm' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                58mm Mini
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Interface:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
              <button
                id="printer-conn-bt-btn"
                onClick={() => setPrinterConnection('bluetooth')}
                className={`p-1 px-2 rounded-md font-semibold flex items-center gap-1 ${
                  printerConnection === 'bluetooth' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                }`}
                title="Bluetooth POS Printer"
              >
                <Bluetooth className="w-3.5 h-3.5" /> BT
              </button>
              <button
                id="printer-conn-wifi-btn"
                onClick={() => setPrinterConnection('wifi')}
                className={`p-1 px-2 rounded-md font-semibold flex items-center gap-1 ${
                  printerConnection === 'wifi' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                }`}
                title="WiFi / Network Printer"
              >
                <Wifi className="w-3.5 h-3.5" /> WiFi
              </button>
              <button
                id="printer-conn-usb-btn"
                onClick={() => setPrinterConnection('usb')}
                className={`p-1 px-2 rounded-md font-semibold flex items-center gap-1 ${
                  printerConnection === 'usb' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                }`}
                title="USB / Cable Printer"
              >
                <Usb className="w-3.5 h-3.5" /> USB
              </button>
            </div>
          </div>
        </div>

        {/* Thermal Print Preview Stage */}
        <div className="p-6 bg-slate-200/60 max-h-[460px] overflow-y-auto custom-scrollbar flex justify-center">
          <div
            id="printable-receipt"
            className={`bg-white p-5 rounded-md shadow-md text-slate-900 font-mono text-xs transition-all ${
              thermalWidth === '80mm' ? 'w-[320px]' : 'w-[240px]'
            }`}
          >
            {/* Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-400">
              <h2 className="font-black text-sm tracking-wider uppercase text-slate-950">{settings.storeName}</h2>
              {type !== 'kot' && (
                <>
                  <p className="text-[10px] text-slate-600">{settings.address}</p>
                  <p className="text-[10px] text-slate-600">Tel: {settings.phone}</p>
                  {settings.gstNumber && <p className="text-[10px] text-slate-600">VAT/GST: {settings.gstNumber}</p>}
                </>
              )}

              <div className="mt-2 py-1 px-2 bg-slate-100 rounded text-center font-bold text-xs uppercase tracking-wider border border-slate-300">
                {type === 'kot' && `🔥 KITCHEN ORDER TICKET (${order.kotNumber || 'KOT-1'})`}
                {type === 'bill' && 'PRE-BILL ESTIMATE (UNPAID)'}
                {type === 'receipt' && 'TAX INVOICE / CASH RECEIPT'}
              </div>
            </div>

            {/* Metadata */}
            <div className="py-2 text-[11px] space-y-0.5 border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span>Order No:</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{order.date} {order.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Channel:</span>
                <span className="font-bold capitalize text-indigo-700">{order.type}</span>
              </div>
              {order.tableNumber && (
                <div className="flex justify-between font-bold text-rose-700 bg-rose-50 px-1 py-0.5 rounded">
                  <span>TABLE / BOOTH:</span>
                  <span>{order.tableNumber}</span>
                </div>
              )}
              {order.waiterName && (
                <div className="flex justify-between">
                  <span>Waiter / Steward:</span>
                  <span>{order.waiterName}</span>
                </div>
              )}
              {order.customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="truncate max-w-[140px]">{order.customerName}</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="py-3 border-b border-dashed border-slate-400">
              <div className="flex justify-between font-bold pb-1 text-[11px] border-b border-slate-200">
                <span className="flex-1">ITEM DESCRIPTION</span>
                <span className="w-8 text-center">QTY</span>
                {type !== 'kot' && <span className="w-16 text-right">TOTAL</span>}
              </div>

              <div className="divide-y divide-slate-100 pt-1 space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="pt-1 text-[11px]">
                    <div className="flex justify-between items-start">
                      <span className="flex-1 font-semibold pr-1">
                        {item.product.name}
                        {item.selectedVariant && <span className="text-[10px] text-slate-500 block">({item.selectedVariant.name})</span>}
                      </span>
                      <span className="w-8 text-center font-bold">x{item.quantity}</span>
                      {type !== 'kot' && (
                        <span className="w-16 text-right font-bold">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="pl-2 text-[10px] text-slate-500">
                        + {item.selectedAddons.map(a => a.name).join(', ')}
                      </div>
                    )}
                    {item.notes && (
                      <div className="pl-2 text-[10px] font-bold text-amber-700 bg-amber-50 rounded px-1 mt-0.5">
                        Note: {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary (Only for Bill & Receipt) */}
            {type !== 'kot' && (
              <div className="py-2 text-[11px] space-y-1 border-b border-dashed border-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                    <span>-${order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax / VAT ({settings.taxRatePercent}%):</span>
                  <span>${order.taxAmount.toFixed(2)}</span>
                </div>
                {order.deliveryFee && order.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>${order.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-300">
                  <span>NET TOTAL:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>

                {type === 'receipt' && (
                  <div className="pt-1.5 space-y-0.5 text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-bold uppercase text-slate-900">{order.paymentGateway || order.paymentMethod}</span>
                    </div>
                    {order.cashTendered && (
                      <>
                        <div className="flex justify-between">
                          <span>Amount Tendered:</span>
                          <span>${order.cashTendered.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-emerald-700">
                          <span>Change Returned:</span>
                          <span>${(order.changeAmount || 0).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="pt-3 text-center text-[10px] text-slate-500 space-y-1">
              {type === 'kot' ? (
                <p className="font-bold text-slate-700">*** PLEASE PREPARE EXPEDITIOUSLY ***</p>
              ) : (
                <>
                  <p className="font-bold text-slate-700">{settings.printer.footerNote || 'Thank you for dining with us!'}</p>
                  <p className="text-[9px]">Powered by OmniRestro Cloud SaaS</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            id="share-whatsapp-receipt-btn"
            onClick={shareWhatsApp}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Share WhatsApp
          </button>

          <div className="flex items-center gap-2">
            <button
              id="cancel-print-btn"
              onClick={closePrintModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              id="confirm-thermal-print-btn"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              {type === 'kot' && 'Print KOT Ticket'}
              {type === 'bill' && 'Print Pre-Bill'}
              {type === 'receipt' && 'Print Receipt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
