import React, { useState } from 'react';
import {
  Utensils,
  Calendar,
  Users,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Search,
  Filter,
  DollarSign,
  Trash2,
  Edit2,
  X,
  Sparkles,
  UserCheck,
  FileText,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { RestaurantTable, TableReservation } from '../../types';

export const TableManager: React.FC = () => {
  const {
    tables,
    addTable,
    updateTable,
    deleteTable,
    updateTableStatus,
    reservations,
    addReservation,
    seatReservation,
    cancelReservation,
    openPrintModal,
    orders,
  } = usePOS();

  const [activeTab, setActiveTab] = useState<'floor_plan' | 'reservations'>('floor_plan');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Table Modal
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [tableName, setTableName] = useState<string>('');
  const [capacity, setCapacity] = useState<number>(4);
  const [floor, setFloor] = useState<string>('Main Dining');

  // Reservation Modal
  const [isReservationModalOpen, setIsReservationModalOpen] = useState<boolean>(false);
  const [resCustomerName, setResCustomerName] = useState<string>('');
  const [resCustomerPhone, setResCustomerPhone] = useState<string>('');
  const [resDate, setResDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [resTimeSlot, setResTimeSlot] = useState<string>('07:30 PM - 09:30 PM');
  const [resGuestCount, setResGuestCount] = useState<number>(4);
  const [resTableId, setResTableId] = useState<string>(tables[0]?.id || '');
  const [resAdvance, setResAdvance] = useState<number>(0);
  const [resNotes, setNotes] = useState<string>('');

  const floors = ['All', ...Array.from(new Set(tables.map((t) => t.floor).filter(Boolean)))];

  const filteredTables = tables.filter((t) => {
    const matchesFloor = selectedFloor === 'All' || t.floor === selectedFloor;
    const matchesSearch =
      searchQuery === '' ||
      t.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFloor && matchesSearch;
  });

  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber) return;

    if (editingTable) {
      updateTable(editingTable.id, {
        number: tableNumber,
        name: tableName || `Table ${tableNumber}`,
        capacity,
        floor,
      });
    } else {
      addTable({
        number: tableNumber,
        name: tableName || `Table ${tableNumber}`,
        capacity,
        floor,
        status: 'available',
      });
    }

    setIsTableModalOpen(false);
    setEditingTable(null);
    setTableNumber('');
    setTableName('');
  };

  const handleSaveReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resCustomerName) return;

    const chosenTable = tables.find((t) => t.id === resTableId);

    addReservation({
      customerName: resCustomerName,
      customerPhone: resCustomerPhone,
      reservationDate: resDate,
      date: resDate,
      timeSlot: resTimeSlot,
      guestCount: resGuestCount,
      tableId: resTableId,
      tableNumber: chosenTable ? chosenTable.number : 'T-01',
      advanceDeposit: resAdvance,
      status: 'confirmed',
      notes: resNotes,
    });

    setIsReservationModalOpen(false);
    setResCustomerName('');
    setResCustomerPhone('');
    setResAdvance(0);
    setNotes('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Top Bar Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">Table Floor Plan & Reservations</h2>
            <p className="text-xs text-slate-500 font-medium">Manage restaurant seating capacity, occupancy, and advance guest reservations</p>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              id="view-floor-plan-tab"
              onClick={() => setActiveTab('floor_plan')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'floor_plan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" /> Floor Plan Layout
            </button>
            <button
              id="view-reservations-tab"
              onClick={() => setActiveTab('reservations')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'reservations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Table Reservations ({reservations.filter((r) => r.status === 'confirmed').length})
            </button>
          </div>

          {activeTab === 'floor_plan' ? (
            <button
              id="add-new-table-btn"
              onClick={() => {
                setEditingTable(null);
                setTableNumber(`T-0${tables.length + 1}`);
                setTableName(`Table 0${tables.length + 1}`);
                setIsTableModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Table</span>
            </button>
          ) : (
            <button
              id="book-new-reservation-btn"
              onClick={() => setIsReservationModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Book Table</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-500">Seating Metrics:</span>
          <span className="flex items-center gap-1.5 font-bold text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {availableCount} Available
          </span>
          <span className="flex items-center gap-1.5 font-bold text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" /> {occupiedCount} Occupied
          </span>
          <span className="flex items-center gap-1.5 font-bold text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> {reservedCount} Reserved
          </span>
        </div>

        {/* Floor Filter */}
        {activeTab === 'floor_plan' && (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Floor Section:</span>
            {floors.map((fl) => (
              <button
                key={fl}
                onClick={() => setSelectedFloor(fl || 'All')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedFloor === fl ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {fl}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {activeTab === 'floor_plan' ? (
          /* Floor Plan Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredTables.map((tbl) => {
              const isOccupied = tbl.status === 'occupied';
              const isReserved = tbl.status === 'reserved';

              return (
                <div
                  key={tbl.id}
                  id={`table-box-${tbl.number}`}
                  className={`bg-white rounded-2xl border p-4 flex flex-col justify-between transition-all shadow-2xs hover:shadow-md ${
                    isOccupied
                      ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20'
                      : isReserved
                      ? 'border-rose-300 ring-2 ring-rose-400/20 bg-rose-50/20'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {/* Top: Table Number & Status Pill */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-base text-slate-900">{tbl.number}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold">{tbl.name}</p>
                    </div>

                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        isOccupied
                          ? 'bg-amber-100 text-amber-900'
                          : isReserved
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {tbl.status}
                    </span>
                  </div>

                  {/* Middle: Capacity & Seating Avatar Graphics */}
                  <div className="py-4 my-2 border-y border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1 text-slate-600 font-bold text-xs">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>{tbl.capacity} Seats</span>
                    </div>

                    {isOccupied && tbl.currentTotal && (
                      <div className="mt-1.5 text-xs font-black text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                        Bill: ${tbl.currentTotal.toFixed(2)}
                      </div>
                    )}

                    {isReserved && tbl.reservedTime && (
                      <div className="mt-1.5 text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md">
                        Reserved for {tbl.reservedTime}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 gap-1">
                    <button
                      onClick={() => {
                        const newStatus = isOccupied ? 'available' : 'occupied';
                        updateTableStatus(tbl.id, newStatus, isOccupied ? undefined : 45.0);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                        isOccupied
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isOccupied ? 'Free Table' : 'Occupy'}
                    </button>

                    <button
                      onClick={() => {
                        setEditingTable(tbl);
                        setTableNumber(tbl.number);
                        setTableName(tbl.name);
                        setCapacity(tbl.capacity);
                        setFloor(tbl.floor || 'Main Dining');
                        setIsTableModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                      title="Edit Table"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteTable(tbl.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="Delete Table"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table Reservations List */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800">Confirmed & Advance Reservations</h3>
              <span className="text-xs font-semibold text-slate-500">Total: {reservations.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Reservation No</th>
                    <th className="p-3">Guest Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Date & Time Slot</th>
                    <th className="p-3">Table Assigned</th>
                    <th className="p-3">Guests</th>
                    <th className="p-3">Advance Deposit</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reservations.map((res) => {
                    const isSeated = res.status === 'seated';
                    const isCancelled = res.status === 'cancelled';

                    return (
                      <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{res.reservationNumber}</td>
                        <td className="p-3 font-semibold text-slate-800">{res.customerName}</td>
                        <td className="p-3 text-slate-600">{res.customerPhone || 'N/A'}</td>
                        <td className="p-3 font-semibold text-slate-700">
                          {res.date} • <span className="text-indigo-600">{res.timeSlot}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {res.tableNumber}
                          </span>
                        </td>
                        <td className="p-3 font-bold">{res.guestCount} Guests</td>
                        <td className="p-3 font-bold text-emerald-700">${res.advanceDeposit.toFixed(2)}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-md ${
                              isSeated
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCancelled
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {!isSeated && !isCancelled && (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                id={`seat-guest-btn-${res.id}`}
                                onClick={() => seatReservation(res.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors flex items-center gap-1"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Seat Guest</span>
                              </button>
                              <button
                                onClick={() => cancelReservation(res.id)}
                                className="px-2 py-1 text-slate-400 hover:text-rose-600 text-[11px] font-semibold"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {isSeated && (
                            <span className="text-[11px] font-bold text-emerald-700 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Dining Now
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Table Modal */}
      {isTableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">{editingTable ? 'Edit Table' : 'Add New Restaurant Table'}</h3>
              <button onClick={() => setIsTableModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTable} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Table Code / Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T-09 or VIP-01"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Window Booth Table 9"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Floor Section</label>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Main Dining">Main Dining</option>
                    <option value="Rooftop Terrace">Rooftop Terrace</option>
                    <option value="Private Lounge">Private Lounge</option>
                    <option value="Garden Patio">Garden Patio</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="save-table-btn"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  {editingTable ? 'Save Changes' : 'Create Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Reservation Modal */}
      {isReservationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Book Table Advance Reservation
              </h3>
              <button onClick={() => setIsReservationModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReservation} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={resCustomerName}
                    onChange={(e) => setResCustomerName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0199"
                    value={resCustomerPhone}
                    onChange={(e) => setResCustomerPhone(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={resDate}
                    onChange={(e) => setResDate(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={resTimeSlot}
                    onChange={(e) => setResTimeSlot(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM (Lunch)</option>
                    <option value="01:30 PM - 03:30 PM">01:30 PM - 03:30 PM (Lunch)</option>
                    <option value="06:30 PM - 08:30 PM">06:30 PM - 08:30 PM (Dinner)</option>
                    <option value="07:30 PM - 09:30 PM">07:30 PM - 09:30 PM (Dinner)</option>
                    <option value="08:30 PM - 10:30 PM">08:30 PM - 10:30 PM (Dinner)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Select Table</label>
                  <select
                    value={resTableId}
                    onChange={(e) => setResTableId(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.number} ({t.name} - {t.capacity} Seats)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Guest Count</label>
                  <input
                    type="number"
                    min="1"
                    value={resGuestCount}
                    onChange={(e) => setResGuestCount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Advance Deposit Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={resAdvance}
                  onChange={(e) => setResAdvance(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Special Occasion / Table Request</label>
                <input
                  type="text"
                  placeholder="e.g. Birthday celebration, High chair required"
                  value={resNotes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReservationModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="confirm-table-reservation-btn"
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
