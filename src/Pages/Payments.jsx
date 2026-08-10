import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
  CreditCard,
  Banknote,
  Download,
} from 'lucide-react';

const Payments = () => {
  // Dummy payment data
  const initialPayments = [
    { id: 'PAY-001', customer: 'Rahul Kumar', email: 'rahul@example.com', amount: 450.00, method: 'Card', status: 'Completed', date: '2026-08-10 10:30 AM', reference: 'REF-1234' },
    { id: 'PAY-002', customer: 'Amit Sharma', email: 'amit@example.com', amount: 650.00, method: 'UPI', status: 'Pending', date: '2026-08-10 09:20 AM', reference: 'REF-5678' },
    { id: 'PAY-003', customer: 'Priya Singh', email: 'priya@example.com', amount: 320.00, method: 'Cash', status: 'Completed', date: '2026-08-09 08:10 PM', reference: 'REF-9012' },
    { id: 'PAY-004', customer: 'Rohit Kumar', email: 'rohit@example.com', amount: 180.00, method: 'Card', status: 'Failed', date: '2026-08-09 06:45 PM', reference: 'REF-3456' },
    { id: 'PAY-005', customer: 'Neha Patel', email: 'neha@example.com', amount: 150.00, method: 'UPI', status: 'Completed', date: '2026-08-08 12:00 PM', reference: 'REF-7890' },
    { id: 'PAY-006', customer: 'Deepak Singh', email: 'deepak@example.com', amount: 280.00, method: 'Card', status: 'Pending', date: '2026-08-08 11:30 AM', reference: 'REF-2345' },
    { id: 'PAY-007', customer: 'Sneha Reddy', email: 'sneha@example.com', amount: 390.00, method: 'Cash', status: 'Completed', date: '2026-08-07 05:20 PM', reference: 'REF-6789' },
    { id: 'PAY-008', customer: 'Vikram Patel', email: 'vikram@example.com', amount: 210.00, method: 'UPI', status: 'Completed', date: '2026-08-07 04:00 PM', reference: 'REF-0123' },
  ];

  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const itemsPerPage = 5;

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchDate =
      (!dateFrom || p.date.slice(0, 10) >= dateFrom) &&
      (!dateTo || p.date.slice(0, 10) <= dateTo);
    return matchSearch && matchStatus && matchDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleView = (payment) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Status colors and icons
  const statusConfig = {
    Completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle },
    Pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock },
    Failed: { color: 'text-red-400', bg: 'bg-red-500/20', icon: XCircle },
  };

  const methodIcons = {
    Card: <CreditCard size={16} className="text-purple-400" />,
    UPI: <Wallet size={16} className="text-cyan-400" />,
    Cash: <Banknote size={16} className="text-emerald-400" />,
  };

  // Summary stats
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const completedCount = filteredPayments.filter(p => p.status === 'Completed').length;
  const pendingCount = filteredPayments.filter(p => p.status === 'Pending').length;
  const failedCount = filteredPayments.filter(p => p.status === 'Failed').length;

  return (
    <div className="min-h-screen bg-[#0b0e1a] p-3 text-gray-100 font-sans overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Payments
            </h1>
            <p className="text-sm text-gray-400">Manage all payment transactions</p>
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-xl hover:bg-white/10 transition">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <p className="text-xs text-gray-400">Total Payments</p>
            <p className="text-2xl font-bold text-white">₦{totalAmount.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{filteredPayments.length} transactions</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <p className="text-xs text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
            <p className="text-xs text-gray-500">successful</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <p className="text-xs text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
            <p className="text-xs text-gray-500">awaiting</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <p className="text-xs text-gray-400">Failed</p>
            <p className="text-2xl font-bold text-red-400">{failedCount}</p>
            <p className="text-xs text-gray-500">declined</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, customer, or email..."
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
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
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

        {/* Payments Display */}
        {viewMode === 'table' ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="border-b border-white/5">
                <tr className="text-left text-xs uppercase text-gray-400">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Method</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Date</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((payment) => {
                  const StatusIcon = statusConfig[payment.status].icon;
                  return (
                    <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 px-4 text-sm font-medium text-purple-400">{payment.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-200">{payment.customer}</p>
                          <p className="text-xs text-gray-400">{payment.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400 hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          {methodIcons[payment.method]}
                          {payment.method}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-white">₦{payment.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[payment.status].bg} ${statusConfig[payment.status].color}`}>
                          <StatusIcon size={12} />
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400 hidden md:table-cell">{payment.date}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleView(payment)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {paginatedPayments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400">No payments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedPayments.map((payment) => {
              const StatusIcon = statusConfig[payment.status].icon;
              return (
                <div key={payment.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-purple-500/30 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-400">{payment.id}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[payment.status].bg} ${statusConfig[payment.status].color}`}>
                      <StatusIcon size={12} />
                      {payment.status}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-200 mt-2">{payment.customer}</p>
                  <p className="text-xs text-gray-400">{payment.email}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-xl font-bold text-white">₦{payment.amount.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 ml-2">{payment.method}</span>
                    </div>
                    <span className="text-xs text-gray-500">{payment.date}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-end">
                    <button
                      onClick={() => handleView(payment)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition text-sm"
                    >
                      <Eye size={16} /> View
                    </button>
                  </div>
                </div>
              );
            })}
            {paginatedPayments.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400">No payments found</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <p className="text-xs sm:text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length}
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

        {/* View Payment Modal */}
        {isViewModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Payment Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Transaction ID</span>
                  <span className="text-sm font-medium text-purple-400">{selectedPayment.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Reference</span>
                  <span className="text-sm text-gray-200">{selectedPayment.reference}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Customer</span>
                  <span className="text-sm text-gray-200">{selectedPayment.customer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Email</span>
                  <span className="text-sm text-gray-200">{selectedPayment.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="text-lg font-bold text-white">₦{selectedPayment.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Payment Method</span>
                  <span className="text-sm text-gray-200 flex items-center gap-1">
                    {methodIcons[selectedPayment.method]}
                    {selectedPayment.method}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[selectedPayment.status].bg} ${statusConfig[selectedPayment.status].color}`}>
                    {React.createElement(statusConfig[selectedPayment.status].icon, { size: 12 })}
                    {selectedPayment.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Date & Time</span>
                  <span className="text-sm text-gray-200">{selectedPayment.date}</span>
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
      </div>
    </div>
  );
};

export default Payments;