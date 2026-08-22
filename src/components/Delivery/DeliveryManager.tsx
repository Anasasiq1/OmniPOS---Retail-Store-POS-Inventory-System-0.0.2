import React, { useState } from 'react';
import {
  Send,
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  User,
  Navigation,
  DollarSign,
  AlertCircle,
  Search,
  Filter,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Order } from '../../types';

export const DeliveryManager: React.FC = () => {
  const { orders, updateDeliveryStatus, tenantUsers, currentUser } = usePOS();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'dispatched' | 'delivered'>('all');
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<Order | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const deliveryDrivers = tenantUsers.filter((u) => u.role === 'delivery_driver' || u.role === 'waiter' || u.role === 'admin');

  const deliveryOrders = orders.filter((o) => {
    const isDelivery = o.type === 'delivery';
    const matchesQuery =
      searchQuery === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.includes(searchQuery)) ||
      (o.customerAddress && o.customerAddress.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && (o.deliveryStatus === 'pending' || !o.deliveryStatus)) ||
      (statusFilter === 'dispatched' && (o.deliveryStatus === 'on_the_way' || o.deliveryStatus === 'picked_up')) ||
      (statusFilter === 'delivered' && o.deliveryStatus === 'delivered');

    return isDelivery && matchesQuery && matchesStatus;
  });

  const handleAssignDriver = () => {
    if (!selectedOrderForDispatch || !selectedDriverId) return;
    const driver = deliveryDrivers.find((d) => d.id === selectedDriverId);
    updateDeliveryStatus(selectedOrderForDispatch.id, 'on_the_way', driver?.id, driver?.name);
    setSelectedOrderForDispatch(null);
    setSelectedDriverId('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">Delivery & Rider Dispatch</h2>
            <p className="text-xs text-slate-500 font-medium">Manage doorstep deliveries, driver assignments, and live rider tracking</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="delivery-search-input"
              type="text"
              placeholder="Search delivery address, phone, order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl w-64 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({orders.filter((o) => o.type === 'delivery').length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('dispatched')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'dispatched' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              On The Way
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'delivered' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Main Delivery Content Grid */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {deliveryOrders.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 p-8">
            <Truck className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">No Delivery Orders Found</p>
            <p className="text-xs text-slate-400 mt-1">Delivery orders created in the Food POS or Online Web Menu will show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveryOrders.map((order) => {
              const isDelivered = order.deliveryStatus === 'delivered' || order.status === 'delivered';
              const isDispatched = order.deliveryStatus === 'on_the_way' || order.deliveryStatus === 'picked_up';

              return (
                <div
                  key={order.id}
                  id={`delivery-card-${order.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{order.orderNumber}</span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : isDispatched
                              ? 'bg-blue-100 text-blue-800 animate-pulse'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.deliveryStatus || 'Pending Dispatch'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{order.date} • {order.time}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-base text-slate-900">${order.total.toFixed(2)}</span>
                      <span className="text-[10px] block font-semibold text-slate-500 uppercase">
                        {order.paymentStatus === 'paid' ? 'PAID ONLINE' : 'CASH ON DELIVERY (COD)'}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <User className="w-3.5 h-3.5 text-purple-600" />
                      <span>{order.customerName}</span>
                    </div>
                    {order.customerPhone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`tel:${order.customerPhone}`} className="hover:text-purple-600 font-semibold underline">
                          {order.customerPhone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{order.customerAddress || '123 Market Street, Suite 400'}</span>
                    </div>
                  </div>

                  {/* Ordered Items Summary */}
                  <div className="text-xs text-slate-600 border-t border-slate-100 pt-2">
                    <span className="font-semibold text-slate-500">Items: </span>
                    <span>{order.items.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}</span>
                  </div>

                  {/* Driver Assignment Status */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-slate-600 font-medium">Rider:</span>
                      <span className="font-bold text-slate-900">{order.deliveryDriverName || 'Unassigned'}</span>
                    </div>

                    {order.deliveryDriverName && (
                      <span className="text-[10px] text-slate-400 font-mono">Bike #DL-882</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    {!isDelivered && (
                      <>
                        {!isDispatched ? (
                          <button
                            id={`dispatch-delivery-btn-${order.id}`}
                            onClick={() => {
                              setSelectedOrderForDispatch(order);
                              setSelectedDriverId(deliveryDrivers[0]?.id || '');
                            }}
                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Assign Rider & Dispatch</span>
                          </button>
                        ) : (
                          <button
                            id={`mark-delivered-btn-${order.id}`}
                            onClick={() => updateDeliveryStatus(order.id, 'delivered')}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Delivered & Settle</span>
                          </button>
                        )}
                      </>
                    )}

                    {isDelivered && (
                      <div className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Delivered Successfully
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Driver Assignment Modal */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-600" />
              Assign Delivery Rider for {selectedOrderForDispatch.orderNumber}
            </h3>
            <p className="text-xs text-slate-500">
              Delivery to: <span className="font-bold text-slate-700">{selectedOrderForDispatch.customerName}</span> ({selectedOrderForDispatch.customerAddress})
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">Select Available Rider / Staff</label>
              <select
                id="select-delivery-driver"
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              >
                {deliveryDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.role.toUpperCase()}) {d.phone ? `• ${d.phone}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrderForDispatch(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                id="confirm-dispatch-btn"
                onClick={handleAssignDriver}
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
