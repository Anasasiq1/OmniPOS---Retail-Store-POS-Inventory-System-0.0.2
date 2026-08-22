import React from 'react';
import { Printer, Share2, Download, CheckCircle2, X, MessageSquare } from 'lucide-react';
import { Order } from '../../types';
import { usePOS } from '../../context/POSContext';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const { settings, t } = usePOS();

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🧾 *${settings.storeName}* - Digital Invoice\nOrder: ${order.orderNumber}\nDate: ${order.date} ${order.time}\n\n*Items:*\n` +
        order.items.map((i) => `• ${i.product.name} x${i.quantity} = ${settings.currency}${(i.quantity * i.unitPrice).toFixed(2)}`).join('\n') +
        `\n\n*Subtotal:* ${settings.currency}${order.subtotal.toFixed(2)}\n*Tax (GST):* ${settings.currency}${order.taxAmount.toFixed(2)}\n*Total Paid:* ${settings.currency}${order.total.toFixed(2)}\n*Payment Method:* ${order.paymentMethod.toUpperCase()}\n\nThank you for shopping with us! 🙏`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Actions */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm tracking-wide">Payment Successful</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div className="p-6 bg-slate-50 flex justify-center">
          <div
            id="printable-receipt"
            className="w-full bg-white p-5 rounded-lg border border-slate-200 shadow-xs font-mono text-xs text-slate-800 space-y-3"
          >
            {/* Store Brand Header */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
              <h2 className="font-bold text-base text-slate-900 tracking-tight font-sans">
                {settings.storeName}
              </h2>
              <p className="text-[11px] text-slate-500 font-sans">{settings.tagline}</p>
              <p className="text-[10px] text-slate-500">{settings.address}</p>
              <p className="text-[10px] text-slate-500">Phone: {settings.phone}</p>
              <p className="text-[10px] text-slate-500 font-bold">GSTIN: {settings.gstNumber}</p>
            </div>

            {/* Order Info */}
            <div className="text-[11px] space-y-0.5 pb-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span>Invoice:</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>
                  {order.date} {order.time}
                </span>
              </div>
              {order.tableNumber && (
                <div className="flex justify-between">
                  <span>Table Number:</span>
                  <span className="font-bold text-indigo-600">{order.tableNumber}</span>
                </div>
              )}
              {order.customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{order.customerName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Order Type:</span>
                <span className="capitalize">{order.type}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-1.5 pb-3 border-b border-dashed border-slate-300">
              <div className="flex justify-between font-bold text-[11px] pb-1 border-b border-slate-200">
                <span className="flex-1">Item</span>
                <span className="w-10 text-center">Qty</span>
                <span className="w-16 text-right">Price</span>
                <span className="w-16 text-right">Total</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="flex-1 font-medium truncate pr-1">{item.product.name}</span>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <span className="w-16 text-right">
                      {settings.currency}
                      {item.unitPrice.toFixed(2)}
                    </span>
                    <span className="w-16 text-right font-semibold">
                      {settings.currency}
                      {(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                  </div>
                  {item.imeiOrSerial && (
                    <div className="text-[9px] text-slate-500 pl-1">IMEI/SN: {item.imeiOrSerial}</div>
                  )}
                  {item.discountPercent && item.discountPercent > 0 ? (
                    <div className="text-[9px] text-emerald-600 pl-1">
                      Disc ({item.discountPercent}%): -{settings.currency}
                      {((item.quantity * item.unitPrice * item.discountPercent) / 100).toFixed(2)}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Calculations & Totals */}
            <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>
                  {settings.currency}
                  {order.subtotal.toFixed(2)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>
                    -{settings.currency}
                    {order.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST ({settings.taxRatePercent}%):</span>
                <span>
                  {settings.currency}
                  {order.taxAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL:</span>
                <span>
                  {settings.currency}
                  {order.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>Payment Mode:</span>
                <span className="font-bold uppercase text-indigo-700">{order.paymentMethod}</span>
              </div>
              {order.cashTendered && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Cash Tendered:</span>
                    <span>
                      {settings.currency}
                      {order.cashTendered.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Change Returned:</span>
                    <span>
                      {settings.currency}
                      {(order.changeAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Footer Barcode & QR code placeholder */}
            <div className="text-center pt-2 space-y-2">
              <div className="font-sans text-[10px] text-slate-400 tracking-widest font-mono">
                ||||| | |||| |||||| | ||||| |||||||
              </div>
              <p className="text-[10px] text-slate-500 font-sans font-medium">
                Thank you for your visit! Please visit again.
              </p>
              <p className="text-[9px] text-slate-400">Powered by OmniPOS Smart Retail</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap gap-2">
          <button
            id="print-receipt-btn"
            onClick={handlePrint}
            className="flex-1 min-w-[130px] h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <button
            id="whatsapp-share-receipt-btn"
            onClick={handleWhatsAppShare}
            className="flex-1 min-w-[130px] h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp e-Bill</span>
          </button>
          <button
            id="close-receipt-btn"
            onClick={onClose}
            className="w-full h-10 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
          >
            Done & Return to POS
          </button>
        </div>
      </div>
    </div>
  );
};
