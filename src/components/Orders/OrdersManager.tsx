import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Printer,
  FileText,
  Flame,
  Phone,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Utensils,
  Truck,
  RotateCcw,
  X,
  Eye,
  Send,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Order, OrderStatus } from '../../types';

export const OrdersManager: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    cancelOrder,
    refundOrder,
    openPrintModal,
    createCallInOrder,
    products,
    customers,
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Phone / Call-in Order Modal State
  const [isCallInModalOpen, setIsCallInModalOpen] = useState<boolean>(false);
  const [callerName, setCallerName] = useState<string>('');
  const [callerPhone, setCallerPhone] = useState<string>('');
  const [callerAddress, setCallerAddress] = useState<string>('');
  const [callerType, setCallerType] = useState<'takeaway' | 'delivery'>('delivery');
  const [callInItems, setCallInItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 2 },
  ]);
  const [callNotes, setCallNotes] = useState<string>('');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      searchQuery === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.includes(searchQuery)) ||
      (o.tableNumber && o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || o.type === channelFilter;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  const handleAddCallItem = () => {
    setCallInItems((prev) => [...prev, { productId: products[0]?.id || '', quantity: 1 }]);
  };

  const handleCreateCallOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerName || callInItems.length === 0) return;

    const mappedItems = callInItems.map((ci) => {
      const prod = products.find((p) => p.id === ci.productId) || products[0];
      return {
        product: prod,
        quantity: ci.quantity,
        unitPrice: prod.price,
      };
    });

    const subtotal = mappedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const tax = Number(((subtotal * 5) / 100).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const newOrder = createCallInOrder({
      type: callerType,
      customerName: callerName,
      customerPhone: callerPhone,
      customerAddress: callerType === 'delivery' ? callerAddress : undefined,
      items: mappedItems,
      subtotal,
      discountAmount: 0,
      taxAmount: tax,
      total,
      paymentMethod: 'cash',
      status: 'placed',
      notes: callNotes,
    });

    openPrintModal(newOrder, 'kot');
    setIsCallInModalOpen(false);
    setCallerName('');
    setCallerPhone('');
    setCallerAddress('');
    setCallNotes('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">Food Orders Management</h2>
            <p className="text-xs text-slate-500 font-medium">All dine-in, takeaway, delivery, phone call-in & online web orders</p>
          </div>
        </div>

        {/* Search, Filter & New Call-In Order */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="orders-search-input"
              type="text"
              placeholder="Search order #, customer, table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl w-60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Channel Filter */}
          <select
            id="orders-channel-filter"
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="p-2 text-xs font-semibold bg-slate-100 border border-slate-200 rounded-xl"
          >
            <option value="all">All Channels</option>
            <option value="dine-in">Dine-In</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
          </select>

          <button
            id="open-call-in-order-modal-btn"
            onClick={() => setIsCallInModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>New Phone Order</span>
          </button>
        </div>
      </div>

      {/* Status Tabs Strip */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs">
        {['all', 'placed', 'cooking', 'ready', 'paid', 'delivered', 'cancelled', 'refunded'].map((st) => (
          <button
            key={st}
            id={`orders-status-tab-${st}`}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-bold capitalize whitespace-nowrap transition-all ${
              statusFilter === st ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st} ({st === 'all' ? orders.length : orders.filter((o) => o.status === st).length})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Order No / KOT</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Channel / Table</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items Summary</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">3-Step Print & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const isPaid = order.paymentStatus === 'paid' || order.status === 'paid';
                  const isCooking = order.status === 'cooking';
                  const isReady = order.status === 'ready';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <p className="font-black text-slate-900">{order.orderNumber}</p>
                        {order.kotNumber && (
                          <span className="text-[10px] text-orange-600 font-bold">KOT: {order.kotNumber}</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600 font-medium">
                        {order.date} <span className="text-slate-400 block text-[10px]">{order.time}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-black text-[10px] uppercase ${
                            order.type === 'dine-in'
                              ? 'bg-indigo-100 text-indigo-800'
                              : order.type === 'delivery'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {order.type}
                        </span>
                        {order.tableNumber && (
                          <span className="font-bold text-rose-700 block mt-0.5">Table: {order.tableNumber}</span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">
                        <p className="truncate max-w-[120px]">{order.customerName}</p>
                        {order.customerPhone && <p className="text-[10px] text-slate-400">{order.customerPhone}</p>}
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">
                        {order.items.map((i) => `${i.product.name} (${i.quantity})`).join(', ')}
                      </td>
                      <td className="p-3 font-black text-slate-900 text-sm">${order.total.toFixed(2)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.paymentGateway || order.paymentMethod} • {order.paymentStatus || 'paid'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            order.status === 'cooking'
                              ? 'bg-orange-100 text-orange-800 animate-pulse'
                              : order.status === 'ready'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'delivered' || order.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Step 1: KOT Print */}
                          <button
                            id={`print-kot-${order.id}`}
                            onClick={() => openPrintModal(order, 'kot')}
                            className="p-1.5 text-orange-700 hover:bg-orange-100 rounded-lg border border-orange-200"
                            title="Print KOT Ticket (Step 1)"
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </button>

                          {/* Step 2: Pre-Bill Print */}
                          <button
                            id={`print-prebill-${order.id}`}
                            onClick={() => openPrintModal(order, 'bill')}
                            className="p-1.5 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200"
                            title="Print Pre-Bill (Step 2)"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Step 3: Final Receipt Print */}
                          <button
                            id={`print-receipt-${order.id}`}
                            onClick={() => openPrintModal(order, 'receipt')}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                            title="Print Paid Receipt (Step 3)"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Order Status Action Menu */}
                          {order.status !== 'cancelled' && order.status !== 'refunded' && (
                            <button
                              onClick={() => {
                                const reason = prompt('Enter cancellation reason (or leave blank):');
                                if (reason !== null) cancelOrder(order.id, reason);
                              }}
                              className="px-2 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Call-In Order Intake Modal */}
      {isCallInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-orange-600" />
                Intake Phone / Call-In Food Order
              </h3>
              <button onClick={() => setIsCallInModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCallOrder} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Caller / Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Brown"
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0123"
                    value={callerPhone}
                    onChange={(e) => setCallerPhone(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Order Fulfillment Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCallerType('delivery')}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      callerType === 'delivery'
                        ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-500/20'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" /> Doorstep Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setCallerType('takeaway')}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      callerType === 'takeaway'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Customer Pickup
                  </button>
                </div>
              </div>

              {callerType === 'delivery' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    value={callerAddress}
                    onChange={(e) => setCallerAddress(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              )}

              {/* Items Selector */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase">Ordered Dishes</label>
                  <button
                    type="button"
                    onClick={handleAddCallItem}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    + Add Dish
                  </button>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {callInItems.map((ci, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={ci.productId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCallInItems((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, productId: val } : item))
                          );
                        }}
                        className="flex-1 p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - ${p.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={ci.quantity}
                        onChange={(e) => {
                          const qty = Number(e.target.value);
                          setCallInItems((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, quantity: qty } : item))
                          );
                        }}
                        className="w-16 p-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-center font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chef Cooking Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Ring bell twice, extra ketchup packets"
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCallInModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="confirm-call-in-order-btn"
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Fire Call-in Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
