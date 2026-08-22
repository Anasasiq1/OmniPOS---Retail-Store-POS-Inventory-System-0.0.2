import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  Split,
  Percent,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  Zap,
  Globe,
  Wallet,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { PaymentMethod, PaymentGatewayId, SplitPaymentDetails } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartSubtotal,
    cartTax,
    cartDiscount,
    cartTotal,
    completeCheckout,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    paymentGateways,
    selectedCustomer,
    selectedTableNumber,
    orderType,
    settings,
  } = usePOS();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId>('stripe');
  const [cashTendered, setCashTendered] = useState<number>(cartTotal);
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Split payment state
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [splitMethod1, setSplitMethod1] = useState<PaymentMethod>('cash');
  const [splitAmount1, setSplitAmount1] = useState<number>(Math.round(cartTotal / 2));
  const [splitMethod2, setSplitMethod2] = useState<PaymentMethod>('card');

  if (!isOpen) return null;

  const changeDue = Math.max(0, (cashTendered || 0) - cartTotal);
  const quickCashOptions = [cartTotal, Math.ceil(cartTotal / 10) * 10, Math.ceil(cartTotal / 50) * 50, 50, 100];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const handleFinalPayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));

    let splitDetails: SplitPaymentDetails | undefined = undefined;
    if (isSplitMode) {
      const p1 = splitAmount1;
      const p2 = Number((cartTotal - splitAmount1).toFixed(2));
      splitDetails = {
        cash: splitMethod1 === 'cash' ? p1 : splitMethod2 === 'cash' ? p2 : 0,
        upi: splitMethod1 === 'upi' ? p1 : splitMethod2 === 'upi' ? p2 : 0,
        card: splitMethod1 === 'card' ? p1 : splitMethod2 === 'card' ? p2 : 0,
        khata: splitMethod1 === 'khata' ? p1 : splitMethod2 === 'khata' ? p2 : 0,
        isSplit: true,
      };
    }

    const gatewayName = paymentMethod === 'gateway' ? selectedGateway.toUpperCase() : undefined;

    completeCheckout(
      paymentMethod,
      paymentMethod === 'cash' ? cashTendered : cartTotal,
      orderNotes,
      splitDetails,
      gatewayName
    );

    setIsProcessing(false);
    onClose();
  };

  const enabledGateways = paymentGateways.filter((g) => g.isEnabled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Secure Restaurant Checkout
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {orderType.toUpperCase()} • {selectedTableNumber ? `Table ${selectedTableNumber}` : 'Direct Service'} • {cart.length} Item(s)
            </p>
          </div>
          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Order Financial Summary Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Zap className="w-32 h-32" />
            </div>
            <div className="flex justify-between items-center relative z-10">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Payable Amount</p>
                <h1 className="text-3xl font-black tracking-tight text-white mt-1">${cartTotal.toFixed(2)}</h1>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Includes VAT / Tax (${cartTax.toFixed(2)})
                </p>
              </div>
              <div className="text-right text-xs space-y-1">
                <div className="text-slate-300">Subtotal: <span className="font-semibold text-white">${cartSubtotal.toFixed(2)}</span></div>
                {cartDiscount > 0 && (
                  <div className="text-emerald-300 font-semibold">Discount: -${cartDiscount.toFixed(2)}</div>
                )}
                {selectedCustomer && (
                  <div className="text-indigo-300 font-medium truncate max-w-[160px]">Guest: {selectedCustomer.name}</div>
                )}
              </div>
            </div>
          </div>

          {/* Promo Code / Coupon Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-600" /> Have a Coupon / Promo Code?
              </label>
              {appliedCoupon && (
                <button
                  id="remove-applied-coupon-btn"
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
                >
                  Remove ({appliedCoupon.code})
                </button>
              )}
            </div>

            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  id="coupon-code-input"
                  type="text"
                  placeholder="e.g. WELCOME10, SAVE15, FLAT5"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs font-semibold uppercase bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  id="apply-coupon-btn"
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Coupon &ldquo;{appliedCoupon.code}&rdquo; Applied Successfully!
                </span>
                <span>-${cartDiscount.toFixed(2)} Saved</span>
              </div>
            )}

            {couponFeedback && !appliedCoupon && (
              <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {couponFeedback.message}
              </p>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Choose Payment Method</label>
              <button
                id="toggle-split-payment-btn"
                type="button"
                onClick={() => setIsSplitMode(!isSplitMode)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isSplitMode ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Split className="w-3.5 h-3.5" /> {isSplitMode ? 'Split Payment Active' : 'Split Bill (50/50)'}
              </button>
            </div>

            {!isSplitMode ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  id="paymethod-cash-btn"
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold text-xs">Cash Payment</span>
                </button>

                <button
                  id="paymethod-card-btn"
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <span className="font-bold text-xs">POS Card Swipe</span>
                </button>

                <button
                  id="paymethod-upi-btn"
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-sky-600" />
                  <span className="font-bold text-xs">Dynamic QR / UPI</span>
                </button>

                <button
                  id="paymethod-gateway-btn"
                  type="button"
                  onClick={() => setPaymentMethod('gateway')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'gateway'
                      ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Globe className="w-6 h-6 text-purple-600" />
                  <span className="font-bold text-xs">11+ Gateways</span>
                </button>

                <button
                  id="paymethod-khata-btn"
                  type="button"
                  onClick={() => setPaymentMethod('khata')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all col-span-2 sm:col-span-4 ${
                    paymentMethod === 'khata'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-xs">Customer Due / Khata Credit (Pay Later Ledger)</span>
                  </div>
                  {selectedCustomer && (
                    <span className="text-[11px] text-amber-700">Will be billed to {selectedCustomer.name} (Current Due: ${selectedCustomer.netBalance})</span>
                  )}
                </button>
              </div>
            ) : (
              /* Split Payment Controls */
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <p className="text-xs font-bold text-amber-900">Split Payment Breakdown</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Part 1 Method</label>
                    <select
                      id="split-part1-method-select"
                      value={splitMethod1}
                      onChange={(e) => setSplitMethod1(e.target.value as PaymentMethod)}
                      className="w-full mt-1 p-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI / QR</option>
                    </select>
                    <input
                      id="split-part1-amount-input"
                      type="number"
                      value={splitAmount1}
                      onChange={(e) => setSplitAmount1(Number(e.target.value))}
                      className="w-full mt-2 p-2 text-xs font-bold bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Part 2 Method</label>
                    <select
                      id="split-part2-method-select"
                      value={splitMethod2}
                      onChange={(e) => setSplitMethod2(e.target.value as PaymentMethod)}
                      className="w-full mt-1 p-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="card">Card</option>
                      <option value="cash">Cash</option>
                      <option value="upi">UPI / QR</option>
                    </select>
                    <div className="w-full mt-2 p-2 text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg text-slate-700">
                      Balance: ${(cartTotal - splitAmount1).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cash Tendered Calculator (If Cash selected) */}
          {paymentMethod === 'cash' && !isSplitMode && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Cash Tendered & Change</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    id="cash-tendered-amount-input"
                    type="number"
                    value={cashTendered || ''}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-base font-black text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="bg-emerald-100 border border-emerald-300 px-4 py-2 rounded-xl text-right">
                  <p className="text-[10px] uppercase font-bold text-emerald-800">Change Due</p>
                  <p className="text-lg font-black text-emerald-950">${changeDue.toFixed(2)}</p>
                </div>
              </div>

              {/* Quick Cash Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickCashOptions.map((amt, i) => (
                  <button
                    key={i}
                    id={`quick-cash-${amt}-btn`}
                    type="button"
                    onClick={() => setCashTendered(amt)}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:border-emerald-500 rounded-lg text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors shadow-2xs"
                  >
                    ${amt.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 11+ Payment Gateway Selector (If Online Gateway selected) */}
          {paymentMethod === 'gateway' && !isSplitMode && (
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-3">
              <label className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Select Connected Payment Gateway (11+ Supported)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {enabledGateways.map((gw) => (
                  <button
                    key={gw.id}
                    id={`select-gateway-${gw.id}-btn`}
                    type="button"
                    onClick={() => setSelectedGateway(gw.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      selectedGateway === gw.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-100/50'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <div>
                      <p className="text-xs font-bold truncate">{gw.name}</p>
                      <p className={`text-[10px] truncate ${selectedGateway === gw.id ? 'text-purple-200' : 'text-slate-400'}`}>{gw.supportedRegions?.[0] || 'Global Gateway'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Order Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Special Order / Chef Notes</label>
            <input
              id="order-checkout-notes-input"
              type="text"
              placeholder="e.g. Less spicy, pack sauces separately, VIP guest"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            id="cancel-checkout-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Back to Menu
          </button>

          <button
            id="complete-payment-confirm-btn"
            type="button"
            disabled={isProcessing}
            onClick={handleFinalPayment}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Processing Payment...</span>
            ) : (
              <>
                <span>Complete & Print 3-Step Bill</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
