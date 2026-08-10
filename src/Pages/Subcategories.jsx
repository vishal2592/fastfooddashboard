import React, { useState, useRef } from 'react';
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
  Upload,
  Trash,
  FolderOpen,
  Package,
} from 'lucide-react';

const Subcategories = () => {
  // Main categories (for dropdown)
  const mainCategories = ['Burgers', 'Pizzas', 'Sides', 'Beverages', 'Wraps', 'Salads'];

  // Dummy subcategory data – updated statuses
  const initialSubcategories = [
    { id: 1, name: 'Beef Burger', category: 'Burgers', description: 'Juicy beef patty with cheese', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop&crop=center', productCount: 5, status: 'Available', createdAt: '2026-07-01' },
    { id: 2, name: 'Chicken Burger', category: 'Burgers', description: 'Grilled chicken with lettuce', image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=150&h=150&fit=crop&crop=center', productCount: 4, status: 'Available', createdAt: '2026-07-05' },
    { id: 3, name: 'Margherita Pizza', category: 'Pizzas', description: 'Classic tomato and mozzarella', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=150&fit=crop&crop=center', productCount: 6, status: 'Available', createdAt: '2026-07-10' },
    { id: 4, name: 'Pepperoni Pizza', category: 'Pizzas', description: 'Spicy pepperoni with extra cheese', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=150&h=150&fit=crop&crop=center', productCount: 3, status: 'Unavailable', createdAt: '2026-07-12' },
    { id: 5, name: 'French Fries', category: 'Sides', description: 'Crispy golden fries with salt', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=150&h=150&fit=crop&crop=center', productCount: 8, status: 'Available', createdAt: '2026-07-15' },
    { id: 6, name: 'Onion Rings', category: 'Sides', description: 'Crispy battered onion rings', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=150&h=150&fit=crop&crop=center', productCount: 2, status: 'Available', createdAt: '2026-07-18' },
    { id: 7, name: 'Cold Coffee', category: 'Beverages', description: 'Chilled coffee with ice', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop&crop=center', productCount: 4, status: 'Low Stock', createdAt: '2026-07-20' },
    { id: 8, name: 'Milkshake', category: 'Beverages', description: 'Creamy vanilla milkshake', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=150&h=150&fit=crop&crop=center', productCount: 1, status: 'Low Stock', createdAt: '2026-07-22' },
  ];

  const [subcategories, setSubcategories] = useState(initialSubcategories);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingSubcategory, setViewingSubcategory] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    status: 'Available',
  });
  const fileInputRef = useRef(null);

  const itemsPerPage = 6;

  // Filter subcategories
  const filteredSubcategories = subcategories.filter((sub) => {
    const matchSearch =
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'All' || sub.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);
  const paginatedSubcategories = filteredSubcategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleAdd = () => {
    setFormData({ name: '', category: '', description: '', image: '', status: 'Available' });
    setIsAddModalOpen(true);
  };

  const handleEdit = (sub) => {
    setEditingId(sub.id);
    setFormData({
      name: sub.name,
      category: sub.category,
      description: sub.description,
      image: sub.image,
      status: sub.status,
    });
    setIsEditModalOpen(true);
  };

  const handleView = (sub) => {
    setViewingSubcategory(sub);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      setSubcategories(subcategories.filter((s) => s.id !== id));
    }
  };

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Save add
  const handleSaveAdd = () => {
    const newSubcategory = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      image: formData.image || 'https://via.placeholder.com/150?text=No+Image',
      productCount: 0,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSubcategories([...subcategories, newSubcategory]);
    setIsAddModalOpen(false);
    setFormData({ name: '', category: '', description: '', image: '', status: 'Available' });
  };

  // Save edit
  const handleSaveEdit = () => {
    const updatedSubcategories = subcategories.map((sub) =>
      sub.id === editingId
        ? {
            ...sub,
            name: formData.name,
            category: formData.category,
            description: formData.description,
            image: formData.image || 'https://via.placeholder.com/150?text=No+Image',
            status: formData.status,
          }
        : sub
    );
    setSubcategories(updatedSubcategories);
    setIsEditModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', category: '', description: '', image: '', status: 'Available' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Status colors – updated keys
  const statusColors = {
    Available: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Unavailable: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    'Low Stock': 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  // Image upload field
  const ImageUploadField = () => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
      <div className="flex items-center gap-3">
        {formData.image && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-1 ring-white/10 flex-shrink-0">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=Invalid'; }}
            />
            <button
              onClick={removeImage}
              className="absolute top-0 right-0 p-1 bg-red-500/80 text-white rounded-bl-lg hover:bg-red-600 transition"
            >
              <Trash size={14} />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={triggerFileInput}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-gray-300"
        >
          <Upload size={18} />
          <span className="text-sm">Choose Image</span>
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      {!formData.image && <p className="text-xs text-gray-500 mt-1">No image selected (optional)</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e1a] p-3 text-gray-100 font-sans overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Subcategories
            </h1>
            <p className="text-sm text-gray-400">Manage subcategories under main categories</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
            >
              <Plus size={18} />
              Add Subcategory
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
            >
              <option value="All">All Categories</option>
              {mainCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {paginatedSubcategories.map((sub) => (
              <div
                key={sub.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/30 transition group"
              >
                <div className="relative">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-40 sm:h-48 object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                  />
                  <span className={`absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full ${statusColors[sub.status]}`}>
                    {sub.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-200">{sub.name}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <FolderOpen size={14} className="text-purple-400" />
                    {sub.category}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-2 mt-1">{sub.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">{sub.productCount} products</span>
                    <span className="text-xs text-gray-500">{sub.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleView(sub)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition text-xs sm:text-sm"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      onClick={() => handleEdit(sub)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition text-xs sm:text-sm"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs sm:text-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {paginatedSubcategories.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400">No subcategories found</div>
            )}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="border-b border-white/5">
                <tr className="text-left text-xs uppercase text-gray-400">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Image</th>
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Category</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Products</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium hidden lg:table-cell">Created</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubcategories.map((sub) => (
                  <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-sm text-gray-400">#{sub.id}</td>
                    <td className="py-3 px-4">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover ring-1 ring-white/10"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=No+Image'; }}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-200">{sub.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-400 hidden sm:table-cell">{sub.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-300 hidden md:table-cell">{sub.productCount}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${statusColors[sub.status]}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400 hidden lg:table-cell">{sub.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleView(sub)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(sub)}
                          className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedSubcategories.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-400">No subcategories found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <p className="text-xs sm:text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSubcategories.length)} of {filteredSubcategories.length}
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

        {/* Add Modal – with proper max-height and margin */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl my-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Add New Subcategory</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Main Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  >
                    <option value="">Select a category</option>
                    {mainCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <ImageUploadField />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Low Stock">Low Stock</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleSaveAdd}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                >
                  Create Subcategory
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

        {/* Edit Modal – with proper max-height and margin */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl my-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Edit Subcategory</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Main Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  >
                    {mainCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <ImageUploadField />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Low Stock">Low Stock</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                >
                  Update Subcategory
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal – FIXED: added max-height, overflow, and margin */}
        {isViewModalOpen && viewingSubcategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl my-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Subcategory Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <img
                  src={viewingSubcategory.image}
                  alt={viewingSubcategory.name}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                />
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-lg font-semibold text-gray-200">{viewingSubcategory.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Main Category</p>
                  <p className="text-gray-200 flex items-center gap-2">
                    <FolderOpen size={16} className="text-purple-400" />
                    {viewingSubcategory.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-gray-200">{viewingSubcategory.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Products</p>
                  <p className="text-gray-200">{viewingSubcategory.productCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[viewingSubcategory.status]}`}>
                    {viewingSubcategory.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-gray-200">{viewingSubcategory.createdAt}</p>
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

export default Subcategories;