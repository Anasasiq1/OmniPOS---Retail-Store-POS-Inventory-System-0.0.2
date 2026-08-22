import React, { useState } from 'react';
import {
  Users,
  Plus,
  Shield,
  UserCheck,
  UserX,
  Edit2,
  Trash2,
  X,
  Lock,
  Phone,
  Mail,
  UserCheck2,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { User, UserRole } from '../../types';
import { DataTable, Column } from '../Common/DataTable';

export const StaffManagement: React.FC = () => {
  const {
    currentUser,
    tenantUsers,
    currentTenant,
    addTenantUser,
    updateTenantUser,
    deleteTenantUser,
    toggleTenantUserStatus,
  } = usePOS();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const openAddModal = () => {
    setName('');
    setUsername('');
    setRole('staff');
    setEmail('');
    setPhone('+91 ');
    setPassword('');
    setEditingUser(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setUsername(user.username);
    setRole(user.role);
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setPassword('');
    setIsAddModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    if (editingUser) {
      updateTenantUser(editingUser.id, {
        name,
        username,
        role,
        email,
        phone,
      });
    } else {
      addTenantUser({
        name,
        username,
        role,
        email,
        phone,
        password,
      });
    }

    setIsAddModalOpen(false);
    setEditingUser(null);
  };

  const isStoreAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin';

  const columns: Column<User>[] = [
    {
      header: 'Staff Member',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0 ${
              u.avatarColor || 'bg-slate-900'
            }`}
          >
            {(u.name || u.username || 'User').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{u.name}</span>
            <span className="text-[11px] font-mono text-slate-500">@{u.username}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'System Role & Access Tier',
      render: (u) => {
        let badgeColor = 'bg-slate-100 text-slate-700';
        let desc = 'POS & Cashier checkout only';
        if (u.role === 'superadmin') {
          badgeColor = 'bg-amber-100 text-amber-900 font-bold border border-amber-300';
          desc = 'Full SaaS Master Access';
        } else if (u.role === 'admin') {
          badgeColor = 'bg-indigo-100 text-indigo-900 font-bold border border-indigo-200';
          desc = 'Store Owner (Full Tenant Control)';
        } else if (u.role === 'manager') {
          badgeColor = 'bg-purple-100 text-purple-900 font-bold border border-purple-200';
          desc = 'Inventory, Khata & Daily Reports';
        }

        return (
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] uppercase tracking-wider ${badgeColor}`}>
              {u.role}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{desc}</span>
          </div>
        );
      },
    },
    {
      header: 'Contact Info',
      render: (u) => (
        <div className="space-y-0.5">
          {u.email && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Mail className="w-3 h-3 text-slate-400" />
              <span>{u.email}</span>
            </div>
          )}
          {u.phone && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{u.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Assigned Store Tenant',
      render: (u) => (
        <span className="text-xs font-semibold text-slate-700">
          {u.tenantName || currentTenant?.name || 'Global'}
        </span>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-100 p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Staff & Access Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage floor managers, cashiers, POS operators, and role permissions for {currentTenant?.name}.
          </p>
        </div>

        {isStoreAdmin && (
          <button
            id="add-staff-btn"
            onClick={openAddModal}
            className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Account</span>
          </button>
        )}
      </div>

      {/* Role Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Store Admin (Owner)</span>
            <Shield className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-500">Full control over inventory, store settings, staff accounts, and financial Khata.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Floor Manager</span>
            <UserCheck2 className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-500">Operational authority: edit stock, view sales analytics, and manage Khata debtors.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-sky-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Staff / Cashier</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-500">Fast barcode checkout, table order creation, and offline bill sync. Zero settings access.</p>
        </div>
      </div>

      {/* Universal DataTable for Users */}
      <DataTable
        data={tenantUsers}
        columns={columns}
        searchPlaceholder="Search staff name, username, email, phone..."
        searchFilter={(u, q) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.phone && u.phone.includes(q))
        }
        onEdit={openEditModal}
        onDelete={(u) => deleteTenantUser(u.id)}
        onToggleStatus={(u) => toggleTenantUserStatus(u.id)}
        canEdit={isStoreAdmin}
        canDelete={isStoreAdmin}
        canToggle={isStoreAdmin}
        deleteConfirmTitle="Delete User Account"
        deleteConfirmMessage={(u) => `Are you sure you want to remove '${u.name}' (@${u.username}) from your store?`}
        emptyMessage="No staff members registered."
      />

      {/* Add / Edit User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveUser}
            className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingUser ? 'Edit Staff Member' : 'Register New Staff Member'}
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arun Prakash"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Username (Login ID) *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. arun_pos"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Role / Permission Level</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none"
              >
                <option value="staff">Staff / Cashier (POS & Tables only)</option>
                <option value="manager">Floor Manager (Inventory + Khata + Reports)</option>
                {currentUser.role === 'superadmin' && <option value="admin">Store Admin (Tenant Owner)</option>}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98470 00000"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@store.com"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            {!editingUser && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Initial Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty for default '123456'"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 h-10 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                {editingUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
