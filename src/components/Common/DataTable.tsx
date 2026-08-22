import React, { useState } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string; isActive?: boolean }> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onToggleStatus?: (item: T) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canToggle?: boolean;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: (item: T) => string;
  emptyMessage?: string;
  pageSize?: number;
  headerAction?: React.ReactNode;
}

export function DataTable<T extends { id: string; isActive?: boolean; name?: string }>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFilter,
  onEdit,
  onDelete,
  onToggleStatus,
  canEdit = true,
  canDelete = true,
  canToggle = true,
  deleteConfirmTitle = 'Confirm Deletion',
  deleteConfirmMessage = (item) => `Are you sure you want to delete this record? This action cannot be undone.`,
  emptyMessage = 'No records found.',
  pageSize = 8,
  headerAction,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  // Filter data based on search
  const filteredData = data.filter((item) => {
    if (!searchQuery.trim()) return true;
    if (searchFilter) return searchFilter(item, searchQuery.toLowerCase());

    // Default search across object values
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteConfirm = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Search & Actions Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-500 font-medium">
            Total: <strong className="text-slate-800">{filteredData.length}</strong> items
          </span>
          {headerAction}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {(canToggle || canEdit || canDelete) && (
                <th className="py-3 px-4 text-right">Actions & Status</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (canToggle || canEdit || canDelete ? 1 : 0)}
                  className="py-12 text-center text-slate-400 text-xs"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    item.isActive === false ? 'opacity-60 bg-slate-50/40' : ''
                  }`}
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className={`py-3 px-4 ${col.className || ''}`}>
                      {col.render
                        ? col.render(item)
                        : col.accessor
                        ? typeof col.accessor === 'function'
                          ? col.accessor(item)
                          : String(item[col.accessor] ?? '')
                        : null}
                    </td>
                  ))}

                  {/* Actions Column with Toggle, Edit, and Delete */}
                  {(canToggle || canEdit || canDelete) && (
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Universal Toggle Switch (Enable/Disable) */}
                        {canToggle && onToggleStatus && (
                          <div className="flex items-center gap-1.5 mr-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                item.isActive !== false ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            >
                              {item.isActive !== false ? 'Active' : 'Off'}
                            </span>
                            <button
                              type="button"
                              onClick={() => onToggleStatus(item)}
                              title={item.isActive !== false ? 'Disable item' : 'Enable item'}
                              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                                item.isActive !== false ? 'bg-emerald-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                  item.isActive !== false ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        )}

                        {/* Edit Button */}
                        {canEdit && onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            title="Edit Record"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Button (Opens Modal) */}
                        {canDelete && onDelete && (
                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            title="Delete Record"
                            className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50 text-xs">
          <span className="text-slate-500">
            Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
            <strong className="text-slate-800">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-base text-slate-900">{deleteConfirmTitle}</h3>
              <p className="text-xs text-slate-500 mt-1">{deleteConfirmMessage(itemToDelete)}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 h-10 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
