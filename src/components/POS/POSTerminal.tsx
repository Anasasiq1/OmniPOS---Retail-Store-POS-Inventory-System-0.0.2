import React, { useState } from 'react';
import {
  Search,
  Barcode,
  Pause,
  Percent,
  Split,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  QrCode,
  CreditCard,
  Banknote,
  Clock,
  Layers,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Cpu,
  Utensils,
  Check,
  Camera,
  Flame,
  AlertTriangle,
  X,
  FileText,
  Printer,
  Tag,
  UserCheck,
  Send,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Product, ProductVariant, ProductAddon } from '../../types';
import { CheckoutModal } from './CheckoutModal';
import { BillPrintModal } from './BillPrintModal';

export const POSTerminal: React.FC = () => {
  const {
    products,
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    setItemDiscount,
    clearCart,
    cartSubtotal,
    cartTax,
    cartDiscount,
    cartTotal,
    businessType,
    orderType,
    setOrderType,
    selectedTableNumber,
    setSelectedTableNumber,
    tables,
    heldCarts,
    holdCurrentCart,
    resumeCart,
    deleteHeldCart,
    setIsScannerOpen,
    searchQuery,
    setSearchQuery,
    openPrintModal,
    sendKotFromWaiter,
    selectedCustomer,
    setSelectedCustomer,
    customers,
    settings,
    t,
  } = usePOS();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedProductForCustomization, setSelectedProductForCustomization] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [itemNoteInput, setItemNoteInput] = useState<string>('');
  const [itemQuantityInput, setItemQuantityInput] = useState<number>(1);

  const [isCustomerPickerOpen, setIsCustomerPickerOpen] = useState<boolean>(false);

  const handleProductClick = (product: Product) => {
    if (product.stock <= 0) return;

    // If product has variants or add-ons, open the customization modal
    if ((product.variants && product.variants.length > 0) || (product.addons && product.addons.length > 0)) {
      setSelectedProductForCustomization(product);
      setSelectedVariantId(product.variants?.[0]?.id);
      setSelectedAddonIds([]);
      setItemNoteInput('');
      setItemQuantityInput(1);
      return;
    }

    addToCart(product, 1);
  };

  const handleConfirmCustomization = () => {
    if (!selectedProductForCustomization) return;
    addToCart(
      selectedProductForCustomization,
      itemQuantityInput,
      selectedVariantId,
      selectedAddonIds,
      itemNoteInput || undefined
    );
    setSelectedProductForCustomization(null);
  };

  const handleFireQuickKot = () => {
    if (cart.length === 0) return;
    const tableNum = selectedTableNumber || 'Counter';
    const newOrder = sendKotFromWaiter(tableNum, cart, 2, 'Fired directly from POS Terminal');
    openPrintModal(newOrder, 'kot');
    clearCart();
  };

  const handleQuickPreBill = () => {
    if (cart.length === 0) return;
    const tempOrder = {
      id: 'temp-' + Date.now(),
      tenantId: 'tenant-01',
      orderNumber: `EST-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      type: orderType,
      tableNumber: selectedTableNumber,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Guest',
      items: [...cart],
      subtotal: cartSubtotal,
      discountAmount: cartDiscount,
      taxAmount: cartTax,
      total: cartTotal,
      paymentMethod: 'cash' as any,
      status: 'placed' as any,
      businessType: 'restaurant' as any,
    };
    openPrintModal(tempOrder as any, 'bill');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-slate-100">
      {/* Center/Left Section: Product Catalog & Categories */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 bg-slate-50">
        {/* Top Control Bar: Search, Order Type, Table Selector, Barcode */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          {/* Order Type Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              id="order-type-dine-in-btn"
              onClick={() => setOrderType('dine-in')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                orderType === 'dine-in' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" /> Dine-In Table
            </button>
            <button
              id="order-type-takeaway-btn"
              onClick={() => setOrderType('takeaway')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                orderType === 'takeaway' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Pickup / Takeaway
            </button>
            <button
              id="order-type-delivery-btn"
              onClick={() => setOrderType('delivery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                orderType === 'delivery' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Delivery
            </button>
          </div>

          {/* Dine-in Table Selector */}
          {orderType === 'dine-in' && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500">Table:</span>
              <select
                id="pos-table-selector"
                value={selectedTableNumber}
                onChange={(e) => setSelectedTableNumber(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-100 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Table...</option>
                {tables.map((tbl) => (
                  <option key={tbl.id} value={tbl.number}>
                    Table {tbl.number} ({tbl.status.toUpperCase()} - {tbl.capacity} Seats)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="pos-food-search-input"
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                id="clear-pos-search-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Camera / Barcode Scanner button */}
          <button
            id="open-barcode-scanner-btn"
            onClick={() => setIsScannerOpen(true)}
            className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Scan Barcode / SKU"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Scanner</span>
          </button>
        </div>

        {/* Categories Horizontal Scrolling Pill Bar */}
        <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`category-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs scale-102'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <Utensils className="w-12 h-12 stroke-1 mb-2" />
              <p className="text-sm font-semibold">No food items found matching &ldquo;{searchQuery}&rdquo;</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs text-indigo-600 font-bold hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map((product) => {
                const inCartItem = cart.find((i) => i.product.id === product.id);
                const isOutOfStock = product.stock <= 0;

                return (
                  <div
                    key={product.id}
                    id={`pos-product-card-${product.id}`}
                    onClick={() => handleProductClick(product)}
                    className={`relative bg-white rounded-xl border p-3 flex flex-col justify-between transition-all cursor-pointer select-none group shadow-2xs hover:shadow-md hover:border-indigo-300 ${
                      isOutOfStock ? 'opacity-50 grayscale cursor-not-allowed border-slate-200' : 'border-slate-200'
                    }`}
                  >
                    {/* Item Image or Emoji icon */}
                    <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-100 mb-2 flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Utensils className="w-8 h-8 text-slate-400" />
                      )}

                      {/* Veg / Non-Veg Indicator */}
                      {product.dietaryType && (
                        <div className="absolute top-1.5 left-1.5">
                          <span
                            className={`w-3.5 h-3.5 rounded-xs border-2 flex items-center justify-center bg-white ${
                              product.dietaryType === 'veg'
                                ? 'border-emerald-600'
                                : product.dietaryType === 'non-veg'
                                ? 'border-rose-600'
                                : 'border-amber-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.dietaryType === 'veg'
                                  ? 'bg-emerald-600'
                                  : product.dietaryType === 'non-veg'
                                  ? 'bg-rose-600'
                                  : 'bg-amber-600'
                              }`}
                            />
                          </span>
                        </div>
                      )}

                      {/* In-Cart Badge */}
                      {inCartItem && (
                        <div className="absolute top-1.5 right-1.5 bg-indigo-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded-md shadow-xs">
                          {inCartItem.quantity} in cart
                        </div>
                      )}

                      {/* Variants / Addons Pill */}
                      {((product.variants && product.variants.length > 0) || (product.addons && product.addons.length > 0)) && (
                        <div className="absolute bottom-1.5 right-1.5 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                          Options+
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs line-clamp-1 leading-tight">{product.name}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{product.category}</p>
                    </div>

                    {/* Price & Stock */}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">${product.price.toFixed(2)}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          product.stock <= (product.minStockAlert || 5)
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {product.stock} {product.unit || 'left'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Active Food Order Cart & 3-Step Checkout Controls */}
      <div className="w-full lg:w-[380px] xl:w-[420px] bg-white flex flex-col border-l border-slate-200 shadow-md">
        {/* Cart Top Header: Guest / Khata Party selector & Hold options */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
          {/* Customer Selection */}
          <div className="relative flex-1">
            <button
              id="select-cart-customer-btn"
              onClick={() => setIsCustomerPickerOpen(!isCustomerPickerOpen)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:border-indigo-400 text-slate-800 transition-colors"
            >
              <span className="flex items-center gap-1.5 truncate">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</span>
              </span>
              <span className="text-[10px] text-slate-400">Change</span>
            </button>

            {/* Customer Dropdown */}
            {isCustomerPickerOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 max-h-56 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setIsCustomerPickerOpen(false);
                  }}
                  className="w-full text-left p-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Walk-in Customer (General)
                </button>
                <div className="border-t border-slate-100 my-1" />
                {customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setIsCustomerPickerOpen(false);
                    }}
                    className="w-full text-left p-2 text-xs hover:bg-indigo-50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.phone}</p>
                    </div>
                    {c.netBalance > 0 && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        Due: ${c.netBalance.toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hold Cart button */}
          <button
            id="hold-current-cart-btn"
            onClick={() => holdCurrentCart()}
            disabled={cart.length === 0}
            className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg border border-slate-200 transition-colors disabled:opacity-40"
            title="Hold Cart / Save for Later"
          >
            <Pause className="w-4 h-4" />
          </button>

          {/* Clear Cart */}
          <button
            id="clear-all-cart-items-btn"
            onClick={clearCart}
            disabled={cart.length === 0}
            className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors disabled:opacity-40"
            title="Clear Order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Held Carts Bar if any */}
        {heldCarts.length > 0 && (
          <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            <span className="text-[10px] font-bold text-amber-800 uppercase shrink-0">Held ({heldCarts.length}):</span>
            {heldCarts.map((h) => (
              <div key={h.id} className="flex items-center gap-1 bg-white border border-amber-300 rounded-lg px-2 py-0.5 text-xs shrink-0">
                <button onClick={() => resumeCart(h.id)} className="font-bold text-slate-800 hover:text-indigo-600">
                  {h.name} ({h.items.length})
                </button>
                <button onClick={() => deleteHeldCart(h.id)} className="text-slate-400 hover:text-rose-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <ShoppingBag className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
              <p className="text-xs font-bold text-slate-600">No Food Items Added</p>
              <p className="text-[11px] text-slate-400 mt-1">Tap items on the left menu to build your table or takeout order.</p>
            </div>
          ) : (
            cart.map((item) => {
              const itemTotal =
                (item.unitPrice + (item.selectedAddons || []).reduce((a, b) => a + b.price, 0)) * item.quantity;
              const discountedTotal = item.discountPercent ? itemTotal * (1 - item.discountPercent / 100) : itemTotal;

              return (
                <div
                  key={item.product.id + (item.selectedVariant?.id || '')}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{item.product.name}</h4>
                      {item.selectedVariant && (
                        <p className="text-[10px] font-semibold text-indigo-600">Variant: {item.selectedVariant.name}</p>
                      )}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-slate-500 truncate">
                          + {item.selectedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[10px] text-amber-700 bg-amber-100/60 px-1 py-0.5 rounded mt-0.5 inline-block">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-black text-xs text-slate-900">${discountedTotal.toFixed(2)}</span>
                      {item.discountPercent && (
                        <span className="text-[9px] text-emerald-600 block">(-{item.discountPercent}%)</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Action Buttons */}
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-black text-xs text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const disc = prompt('Enter discount % for this item (0-100):', '10');
                          if (disc !== null) setItemDiscount(item.product.id, Number(disc));
                        }}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                        title="Item Discount %"
                      >
                        <Percent className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Remove item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Financial Summary & 3-Step Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          {/* Bill Calculation Details */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">${cartSubtotal.toFixed(2)}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon / Promo Discount:</span>
                <span>-${cartDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>VAT / Tax ({settings.taxRatePercent || 5}%):</span>
              <span className="font-semibold text-slate-900">${cartTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-1.5 border-t border-slate-200">
              <span>Total Payable:</span>
              <span className="text-indigo-700">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* 3-Step Billing Action Buttons */}
          <div className="space-y-2 pt-1">
            {/* Step 1 & Step 2 Secondary Action Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                id="pos-fire-kot-btn"
                type="button"
                disabled={cart.length === 0}
                onClick={handleFireQuickKot}
                className="py-2 px-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                title="Send KOT Kitchen Order Ticket directly to kitchen"
              >
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>Fire KOT (Step 1)</span>
              </button>

              <button
                id="pos-pre-bill-estimate-btn"
                type="button"
                disabled={cart.length === 0}
                onClick={handleQuickPreBill}
                className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                title="Print Intermediate Pre-Bill for Guest Table"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pre-Bill (Step 2)</span>
              </button>
            </div>

            {/* Step 3: Main Checkout & Payment Settlement */}
            <button
              id="pos-open-checkout-btn"
              type="button"
              disabled={cart.length === 0}
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-40"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Step 3: Pay & Settle (${cartTotal.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Customization / Variant / Add-on Modal */}
      {selectedProductForCustomization && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{selectedProductForCustomization.name}</h3>
                <p className="text-xs text-slate-500">Base Price: ${selectedProductForCustomization.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => setSelectedProductForCustomization(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
              {/* Variants Section */}
              {selectedProductForCustomization.variants && selectedProductForCustomization.variants.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">Select Portion / Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProductForCustomization.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-2.5 rounded-xl border text-left flex justify-between items-center text-xs font-bold transition-all ${
                          selectedVariantId === v.id
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{v.name}</span>
                        <span className="text-indigo-600">${v.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons Section */}
              {selectedProductForCustomization.addons && selectedProductForCustomization.addons.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">Select Add-ons & Extras</label>
                  <div className="space-y-1.5">
                    {selectedProductForCustomization.addons.map((a) => {
                      const isSelected = selectedAddonIds.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                            setSelectedAddonIds((prev) =>
                              isSelected ? prev.filter((id) => id !== a.id) : [...prev, a.id]
                            );
                          }}
                          className={`w-full p-2 rounded-xl border text-left flex justify-between items-center text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </span>
                            {a.name}
                          </span>
                          <span className="font-bold text-emerald-700">+${a.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chef Cooking Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">Preparation Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Mild spice, no cilantro, extra crispy"
                  value={itemNoteInput}
                  onChange={(e) => setItemNoteInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setItemQuantityInput(Math.max(1, itemQuantityInput - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700"
                >
                  -
                </button>
                <span className="font-black text-sm text-slate-900">{itemQuantityInput}</span>
                <button
                  type="button"
                  onClick={() => setItemQuantityInput(itemQuantityInput + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700"
                >
                  +
                </button>
              </div>

              <button
                id="confirm-customization-add-to-cart-btn"
                type="button"
                onClick={handleConfirmCustomization}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* 3-Step Thermal Bill & KOT Print Modal */}
      <BillPrintModal />
    </div>
  );
};
