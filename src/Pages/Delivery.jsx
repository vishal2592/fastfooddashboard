import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  User,
  MapPin,
  DollarSign,
  Plus,
} from 'lucide-react';

const Delivery = () => {
  // Dummy delivery data
  const initialDeliveries = [
    { id: 'DEL-001', customer: 'Rahul Kumar', address: '123 Main St, City', items: 3, total: 450, rider: 'Amit', status: 'Delivered', date: '2026-08-10 10:30 AM' },
    { id: 'DEL-002', customer: 'Amit Sharma', address: '456 Oak Ave, Town', items: 2, total: 650, rider: 'Suresh', status: 'In Transit', date: '2026-08-10 09:20 AM' },
    { id: 'DEL-003', customer: 'Priya Singh', address: '789 Pine Ln, Village', items: 1, total: 320, rider: 'Pending', status: 'Pending', date: '2026-08-09 08:10 PM' },
    { id: 'DEL-004', customer: 'Rohit Kumar', address: '321 Elm St, City', items: 4, total: 180, rider: 'Amit', status: 'Delivered', date: '2026-08-09 06:45 PM' },
    { id: 'DEL-005', customer: 'Neha Patel', address: '654 Maple Dr, Town', items: 2, total: 150, rider: 'Suresh', status: 'Cancelled', date: '2026-08-08 12:00 PM' },
    { id: 'DEL-006', customer: 'Deepak Singh', address: '987 Cedar Rd, Village', items: 5, total: 280, rider: 'Pending', status: 'Pending', date: '2026-08-08 11:30 AM' },
    { id: 'DEL-007', customer: 'Sneha Reddy', address: '147 Birch Blvd, City', items: 3, total: 390, rider: 'Amit', status: 'In Transit', date: '2026-08-07 05:20 PM' },
    { id: 'DEL-008', customer: 'Vikram Patel', address: '258 Willow Way, Town', items: 2, total: 210, rider: 'Ravi', status: 'Delivered', date: '2026-08-07 04:00 PM' },
  ];

  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    address: '',
    items: '',
    total: '',
    rider: '',
    status: 'Pending',
  });
  const [editingId, setEditingId] = useState(null);

  const itemsPerPage = 5;

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((d) => {
    const matchSearch =
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.toLowerCase().includes(search.toLowerCase()) ||
      d.address.toLowerCase().includes(search.toLowerCase()) ||
      d.rider.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchDate =
      (!dateFrom || d.date.slice(0, 10) >= dateFrom) &&
      (!dateTo || d.date.slice(0, 10) <= dateTo);
    return matchSearch && matchStatus && matchDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleView = (delivery) => {
    setSelectedDelivery(delivery);
    setIsViewModalOpen(true);
  };

  const handleEdit = (delivery) => {
    setEditingId(delivery.id);
    setFormData({
      customer: delivery.customer,
      address: delivery.address,
      items: delivery.items.toString(),
      total: delivery.total.toString(),
      rider: delivery.rider,
      status: delivery.status,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      setDeliveries(deliveries.filter((d) => d.id !== id));
    }
  };

  const handleAdd = () => {
    setFormData({ customer: '', address: '', items: '', total: '', rider: '', status: 'Pending' });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = () => {
    const newDelivery = {
      id: `DEL-${String(deliveries.length + 1).padStart(3, '0')}`,
      customer: formData.customer,
      address: formData.address,
      items: parseInt(formData.items) || 0,
      total: parseFloat(formData.total) || 0,
      rider: formData.rider || 'Pending',
      status: formData.status,
      date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setDeliveries([...deliveries, newDelivery]);
    setIsAddModalOpen(false);
    setFormData({ customer: '', address: '', items: '', total: '', rider: '', status: 'Pending' });
  };

  const handleSaveEdit = () => {
    const updatedDeliveries = deliveries.map((d) =>
      d.id === editingId
        ? {
            ...d,
            customer: formData.customer,
            address: formData.address,
            items: parseInt(formData.items) || 0,
            total: parseFloat(formData.total) || 0,
            rider: formData.rider || 'Pending',
            status: formData.status,
          }
        : d
    );
    setDeliveries(updatedDeliveries);
    setIsEditModalOpen(false);
    setEditingId(null);
    setFormData({ customer: '', address: '', items: '', total: '', rider: '', status: 'Pending' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Status config
  const statusConfig = {
    'Delivered': { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle },
    'In Transit': { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Truck },
    'Pending': { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock },
    'Cancelled': { color: 'text-red-400', bg: 'bg-red-500/20', icon: XCircle },
  };

  // Summary stats
  const totalDeliveries = filteredDeliveries.length;
  const deliveredCount = filteredDeliveries.filter(d => d.status === 'Delivered').length;
  const inTransitCount = filteredDeliveries.filter(d => d.status === 'In Transit').length;
  const pendingCount = filteredDeliveries.filter(d => d.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#0b0e1a] p-3 sm:p-4 md:p-6 lg:p-8 text-gray-100 font-sans overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Deliveries
            </h1>
            <p className="text-sm text-gray-400">Manage all delivery orders</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
          >
            <Plus size={18} />
            Add Delivery
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <p className="text-xs text-gray-400">Total Deliveries</p>
            <p className="text-2xl font-bold text-white">{totalDeliveries}</p>
            <p className="text-xs text-gray-500">all orders</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <p className="text-xs text-gray-400">Delivered</p>
            <p className="text-2xl font-bold text-emerald-400">{deliveredCount}</p>
            <p className="text-xs text-gray-500">completed</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <p className="text-xs text-gray-400">In Transit</p>
            <p className="text-2xl font-bold text-blue-400">{inTransitCount}</p>
            <p className="text-xs text-gray-500">on the way</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <p className="text-xs text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
            <p className="text-xs text-gray-500">awaiting</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, customer, address, or rider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
            >
              <option value="All">All Status</option>
              <option value="Delivered">Delivered</option>
              <option value="In Transit">In Transit</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex items-center gap-1">
              <Calendar size={16} className="text-gray-400 ml-2" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition w-28 sm:w-36"
              />
              <span className="text-gray-500 text-xs">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition w-28 sm:w-36"
              />
            </div>
            <div className="flex border border-white/10 rounded-xl overflow-hidden ml-2">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white'}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Deliveries Display */}
        {viewMode === 'table' ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="border-b border-white/5">
                <tr className="text-left text-xs uppercase text-gray-400">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Address</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Items</th>
                  <th className="py-3 px-4 font-medium">Total</th>
                  <th className="py-3 px-4 font-medium hidden lg:table-cell">Rider</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeliveries.map((delivery) => {
                  const StatusIcon = statusConfig[delivery.status].icon;
                  return (
                    <tr key={delivery.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 px-4 text-sm font-medium text-purple-400">{delivery.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-200">{delivery.customer}</td>
                      <td className="py-3 px-4 text-sm text-gray-400 hidden sm:table-cell truncate max-w-32">{delivery.address}</td>
                      <td className="py-3 px-4 text-sm text-gray-300 hidden md:table-cell">{delivery.items}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-white">₦{delivery.total.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-gray-400 hidden lg:table-cell">{delivery.rider}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[delivery.status].bg} ${statusConfig[delivery.status].color}`}>
                          <StatusIcon size={12} />
                          {delivery.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleView(delivery)}
                            className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(delivery)}
                            className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(delivery.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedDeliveries.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-400">No deliveries found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedDeliveries.map((delivery) => {
              const StatusIcon = statusConfig[delivery.status].icon;
              return (
                <div key={delivery.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-purple-500/30 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-400">{delivery.id}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[delivery.status].bg} ${statusConfig[delivery.status].color}`}>
                      <StatusIcon size={12} />
                      {delivery.status}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-200 mt-2">{delivery.customer}</p>
                  <p className="text-xs text-gray-400 flex items-start gap-1">
                    <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                    <span>{delivery.address}</span>
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-xl font-bold text-white">₦{delivery.total.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 ml-2">{delivery.items} items</span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Truck size={12} />
                      {delivery.rider}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleView(delivery)}
                      className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(delivery)}
                      className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(delivery.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            {paginatedDeliveries.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400">No deliveries found</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <p className="text-xs sm:text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDeliveries.length)} of {filteredDeliveries.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs sm:text-sm font-medium transition ${
                    currentPage === page
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* View Delivery Modal */}
        {isViewModalOpen && selectedDelivery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Delivery Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Delivery ID</span>
                  <span className="text-sm font-medium text-purple-400">{selectedDelivery.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Customer</span>
                  <span className="text-sm text-gray-200">{selectedDelivery.customer}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-gray-400">Address</span>
                  <span className="text-sm text-gray-200 text-right flex-1">{selectedDelivery.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Items</span>
                  <span className="text-sm text-gray-200">{selectedDelivery.items}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total</span>
                  <span className="text-lg font-bold text-white">₦{selectedDelivery.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Assigned Rider</span>
                  <span className="text-sm text-gray-200">{selectedDelivery.rider}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[selectedDelivery.status].bg} ${statusConfig[selectedDelivery.status].color}`}>
                    {React.createElement(statusConfig[selectedDelivery.status].icon, { size: 12 })}
                    {selectedDelivery.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Date & Time</span>
                  <span className="text-sm text-gray-200">{selectedDelivery.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal (shared) */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">
                  {isAddModalOpen ? 'Add New Delivery' : 'Edit Delivery'}
                </h2>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Delivery Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Items</label>
                    <input
                      type="number"
                      value={formData.items}
                      onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Total (₦)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.total}
                      onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assigned Rider</label>
                  <input
                    type="text"
                    value={formData.rider}
                    onChange={(e) => setFormData({ ...formData, rider: e.target.value })}
                    placeholder="Rider name or 'Pending'"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                >
                  {isAddModalOpen ? 'Create' : 'Update'}
                </button>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="flex-1 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivery;