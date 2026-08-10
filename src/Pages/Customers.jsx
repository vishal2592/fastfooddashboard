import React, { useState } from 'react';
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
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  Calendar,
  UserPlus,
} from 'lucide-react';

const Customers = () => {
  // Dummy customer data
  const initialCustomers = [
    { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', phone: '+91 98765 43210', orders: 12, spent: 345.50, status: 'Active', joined: '2026-01-15' },
    { id: 2, name: 'Amit Sharma', email: 'amit.sharma@example.com', phone: '+91 87654 32109', orders: 8, spent: 198.75, status: 'Active', joined: '2026-02-20' },
    { id: 3, name: 'Priya Singh', email: 'priya.singh@example.com', phone: '+91 76543 21098', orders: 5, spent: 125.00, status: 'Inactive', joined: '2025-12-10' },
    { id: 4, name: 'Rohit Kumar', email: 'rohit.k@example.com', phone: '+91 65432 10987', orders: 15, spent: 560.80, status: 'Active', joined: '2025-11-05' },
    { id: 5, name: 'Neha Patel', email: 'neha.p@example.com', phone: '+91 54321 09876', orders: 3, spent: 67.20, status: 'Active', joined: '2026-03-01' },
    { id: 6, name: 'Deepak Singh', email: 'deepak.s@example.com', phone: '+91 43210 98765', orders: 7, spent: 189.90, status: 'Inactive', joined: '2025-09-25' },
    { id: 7, name: 'Sneha Reddy', email: 'sneha.r@example.com', phone: '+91 32109 87654', orders: 10, spent: 276.30, status: 'Active', joined: '2026-04-12' },
    { id: 8, name: 'Vikram Patel', email: 'vikram.p@example.com', phone: '+91 21098 76543', orders: 6, spent: 154.00, status: 'Active', joined: '2026-02-28' },
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
  });

  const itemsPerPage = 5;

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchSearch = customer.name.toLowerCase().includes(search.toLowerCase()) ||
                        customer.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || customer.status === filter;
    return matchSearch && matchFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddCustomer = () => {
    // Add new customer
    const newCustomer = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      orders: 0,
      spent: 0,
      status: formData.status,
      joined: new Date().toISOString().split('T')[0],
    };
    setCustomers([...customers, newCustomer]);
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', phone: '', status: 'Active' });
  };

  // Status color mapping
  const statusColors = {
    Active: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Inactive: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };

  return (
    <div className="min-h-screen bg-[#0b0e1a] p-3 text-gray-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Customers
          </h1>
          <p className="text-sm text-gray-400">Manage your customer base</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
          >
            <UserPlus size={18} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search customers by name or email..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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

      {/* Customers Display */}
      {viewMode === 'table' ? (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-x-auto">
          <table className="w-full min-w-[768px]">
            <thead className="border-b border-white/5">
              <tr className="text-left text-xs uppercase text-gray-400">
                <th className="py-3 px-4 font-medium">ID</th>
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Phone</th>
                <th className="py-3 px-4 font-medium">Orders</th>
                <th className="py-3 px-4 font-medium">Spent</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Joined</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-3 px-4 text-sm text-gray-400">#{customer.id}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-200">{customer.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{customer.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{customer.phone}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{customer.orders}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-white">${customer.spent.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[customer.status]}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{customer.joined}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(customer)}
                        className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedCustomers.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-400">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCustomers.map((customer) => (
            <div key={customer.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-purple-500/30 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{customer.name}</p>
                    <p className="text-xs text-gray-400">{customer.email}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[customer.status]}`}>
                  {customer.status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Orders</p>
                  <p className="font-semibold text-gray-200">{customer.orders}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Spent</p>
                  <p className="font-semibold text-white">${customer.spent.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-gray-300">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                <button
                  onClick={() => handleView(customer)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
          {paginatedCustomers.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-400">No customers found</div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length}
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
                className={`w-8 h-8 rounded-xl text-sm font-medium transition ${
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

      {/* Customer Details Modal */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-200">Customer Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-200">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-400">#{selectedCustomer.id}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-gray-200 flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  {selectedCustomer.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-gray-200 flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  {selectedCustomer.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Orders</p>
                <p className="text-gray-200 flex items-center gap-2">
                  <ShoppingBag size={16} className="text-gray-400" />
                  {selectedCustomer.orders}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Spent</p>
                <p className="text-gray-200 flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  ${selectedCustomer.spent.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[selectedCustomer.status]}`}>
                  {selectedCustomer.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Joined</p>
                <p className="text-gray-200 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  {selectedCustomer.joined}
                </p>
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

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-200">Add New Customer</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleAddCustomer}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
              >
                Create Customer
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-xl hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;