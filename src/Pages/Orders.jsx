import React, { useState, useEffect } from 'react';
import {
  Plus,
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
  User,
  Package,
  Calendar,
  DollarSign,
  Clock,
  History,
  RefreshCw,
} from 'lucide-react';

const Orders = () => {
  // Dummy order data – each order has a `completionTime` if status is 'Completed'
  const initialOrders = [
    { id: '#1024', customer: 'Rahul Kumar', items: ['Cheese Burger x1', 'French Fries x1'], total: 12.48, status: 'Completed', time: '2026-08-07 10:30 AM', address: '123 Main St, City', completionTime: Date.now() - 3600000 }, // 1 hour ago
    { id: '#1023', customer: 'Amit Sharma', items: ['Chicken Pizza x1', 'Cold Coffee x1'], total: 13.48, status: 'Processing', time: '2026-08-07 10:20 AM', address: '456 Oak Ave, Town', completionTime: null },
    { id: '#1022', customer: 'Priya Singh', items: ['Veg Burger Combo x1'], total: 7.99, status: 'Pending', time: '2026-08-07 10:10 AM', address: '789 Pine Ln, Village', completionTime: null },
    { id: '#1021', customer: 'Rohit Kumar', items: ['French Fries x2', 'Milkshake x1'], total: 8.97, status: 'Completed', time: '2026-08-07 10:00 AM', address: '321 Elm St, City', completionTime: Date.now() - 7200000 }, // 2 hours ago – will be removed
    { id: '#1020', customer: 'Neha Patel', items: ['Cold Coffee x1'], total: 3.99, status: 'Cancelled', time: '2026-08-07 09:50 AM', address: '654 Maple Dr, Town', completionTime: null },
    { id: '#1019', customer: 'Deepak Singh', items: ['Chicken Wrap x2', 'Onion Rings x1'], total: 15.97, status: 'Processing', time: '2026-08-07 09:30 AM', address: '987 Cedar Rd, Village', completionTime: null },
    { id: '#1018', customer: 'Sneha Reddy', items: ['Cheese Burger x2', 'Cold Coffee x2'], total: 18.96, status: 'Completed', time: '2026-08-07 09:15 AM', address: '147 Birch Blvd, City', completionTime: Date.now() - 900000 }, // 15 min ago
    { id: '#1017', customer: 'Vikram Patel', items: ['Chicken Pizza x1', 'French Fries x1'], total: 11.48, status: 'Pending', time: '2026-08-07 08:55 AM', address: '258 Willow Way, Town', completionTime: null },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [completedHistory, setCompletedHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('active'); // 'active' or 'history'

  const itemsPerPage = 5;

  // Auto‑remove completed orders older than 2 hours
  useEffect(() => {
    const checkAndMoveCompletedOrders = () => {
      const now = Date.now();
      const twoHours = 2 * 60 * 60 * 1000;

      // Separate completed orders that are older than 2 hours
      const toRemove = [];
      const remaining = orders.filter(order => {
        if (order.status === 'Completed' && order.completionTime) {
          const age = now - order.completionTime;
          if (age >= twoHours) {
            toRemove.push(order);
            return false;
          }
        }
        return true;
      });

      // If any orders were removed, update states
      if (toRemove.length > 0) {
        // Add to history
        setCompletedHistory(prev => [...prev, ...toRemove]);
        // Update orders
        setOrders(remaining);
      }
    };

    // Run check immediately
    checkAndMoveCompletedOrders();

    // Set interval to check every 30 seconds
    const interval = setInterval(checkAndMoveCompletedOrders, 30000);

    return () => clearInterval(interval);
  }, [orders]);

  // Filter orders (for active view)
  const filteredActiveOrders = orders.filter(order => {
    const matchSearch = order.customer.toLowerCase().includes(search.toLowerCase()) ||
                        order.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || order.status === filter;
    return matchSearch && matchFilter;
  });

  // Filter history (for history view)
  const filteredHistory = completedHistory.filter(order => {
    const matchSearch = order.customer.toLowerCase().includes(search.toLowerCase()) ||
                        order.id.toLowerCase().includes(search.toLowerCase());
    // History filter: we only show 'Completed' status, but we can allow All as well
    const matchFilter = filter === 'All' || filter === 'Completed' || order.status === filter;
    return matchSearch && matchFilter;
  });

  // Current data based on view
  const currentData = view === 'active' ? filteredActiveOrders : filteredHistory;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      if (view === 'active') {
        setOrders(orders.filter(o => o.id !== id));
      } else {
        setCompletedHistory(completedHistory.filter(o => o.id !== id));
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Simulate marking an order as completed (for testing)
  const handleMarkCompleted = (id) => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        return {
          ...order,
          status: 'Completed',
          completionTime: Date.now(),
        };
      }
      return order;
    }));
  };

  // Status color mapping
  const statusColors = {
    Completed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Processing: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Pending: 'bg-red-500/20 text-red-400 border border-red-500/30',
    Cancelled: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };

  // Render table rows
  const renderRows = (data) => {
    return data.map((order) => (
      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
        <td className="py-3 px-4 text-sm font-medium text-purple-400">{order.id}</td>
        <td className="py-3 px-4 text-sm text-gray-200">{order.customer}</td>
        <td className="py-3 px-4 text-sm text-gray-400">
          {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </td>
        <td className="py-3 px-4 text-sm font-semibold text-white">${order.total.toFixed(2)}</td>
        <td className="py-3 px-4">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </td>
        <td className="py-3 px-4 text-sm text-gray-400">{order.time}</td>
        <td className="py-3 px-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleView(order)}
              className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
            >
              <Eye size={16} />
            </button>
            {view === 'active' && (
              <button
                onClick={() => handleMarkCompleted(order.id)}
                className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition"
                title="Mark as Completed"
              >
                <Clock size={16} />
              </button>
            )}
            <button
              onClick={() => handleDelete(order.id)}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="min-h-screen bg-[#0b0e1a] p-3 sm:p-4 md:p-6 lg:p-8 text-gray-100 font-sans overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Orders
            </h1>
            <p className="text-sm text-gray-400">Manage your orders – completed orders auto‑archive after 2 hours</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* View toggle */}
            <div className="flex border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setView('active')}
                className={`px-4 py-2 text-sm font-medium transition ${
                  view === 'active'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Package size={16} />
                  Active Orders
                </div>
              </button>
              <button
                onClick={() => setView('history')}
                className={`px-4 py-2 text-sm font-medium transition ${
                  view === 'history'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <History size={16} />
                  Completed History
                  {completedHistory.length > 0 && (
                    <span className="ml-1 text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                      {completedHistory.length}
                    </span>
                  )}
                </div>
              </button>
            </div>
            {view === 'active' && (
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
              >
                <Plus size={18} />
                New Order
              </button>
            )}
          </div>
        </div>

        {/* Info banner */}
        {view === 'active' && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2 text-blue-400 text-sm">
            <RefreshCw size={16} className="animate-spin" />
            <span>Completed orders will be automatically moved to history after 2 hours.</span>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Search ${view === 'active' ? 'orders' : 'completed orders'} by ID or customer...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
            >
              <option value="All">All Status</option>
              {view === 'active' ? (
                <>
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </>
              ) : (
                <option value="Completed">Completed</option>
              )}
            </select>
            <div className="flex border border-white/10 rounded-xl overflow-hidden">
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

        {/* Orders Display */}
        {viewMode === 'table' ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full min-w-[768px]">
              <thead className="border-b border-white/5">
                <tr className="text-left text-xs uppercase text-gray-400">
                  <th className="py-3 px-4 font-medium">Order ID</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Items</th>
                  <th className="py-3 px-4 font-medium">Total</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Date/Time</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? renderRows(paginatedData) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400">
                      {view === 'active' ? 'No active orders found' : 'No completed orders in history'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((order) => (
              <div key={order.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-purple-500/30 transition">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-400">{order.id}</span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-200">{order.customer}</p>
                  <p className="text-xs text-gray-400">{order.items.length} items</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-white">${order.total.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">{order.time}</span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleView(order)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                  >
                    <Eye size={16} /> View
                  </button>
                  {view === 'active' && (
                    <button
                      onClick={() => handleMarkCompleted(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                    >
                      <Clock size={16} /> Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {paginatedData.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-400">
                {view === 'active' ? 'No active orders found' : 'No completed orders in history'}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <p className="text-xs sm:text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, currentData.length)} of {currentData.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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

        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Order Details</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="text-lg font-semibold text-purple-400">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Customer</p>
                  <p className="text-lg font-semibold text-gray-200">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Items</p>
                  <ul className="list-disc list-inside text-gray-200">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-lg font-bold text-white">${selectedOrder.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date/Time</p>
                  <p className="text-sm text-gray-200">{selectedOrder.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Delivery Address</p>
                  <p className="text-sm text-gray-200">{selectedOrder.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;