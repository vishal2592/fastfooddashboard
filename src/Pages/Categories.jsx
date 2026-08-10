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
  Package,
  Upload,
  Trash,
} from 'lucide-react';

const Categories = () => {
  // Dummy category data – statuses corrected to 'Available' / 'Unavailable'
  const initialCategories = [
    {
      id: 1,
      name: 'Burgers',
      description: 'All types of burgers including chicken, beef, and veg options',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop&crop=center',
      productCount: 12,
      status: 'Available',
      createdAt: '2026-01-15',
    },
    {
      id: 2,
      name: 'Pizzas',
      description: 'Authentic wood-fired pizzas with various toppings',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=150&fit=crop&crop=center',
      productCount: 8,
      status: 'Available',
      createdAt: '2026-02-10',
    },
    {
      id: 3,
      name: 'Sides',
      description: 'Fries, onion rings, nuggets, and other sides',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=150&h=150&fit=crop&crop=center',
      productCount: 6,
      status: 'Available',
      createdAt: '2026-03-05',
    },
    {
      id: 4,
      name: 'Beverages',
      description: 'Cold drinks, shakes, coffee and more',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop&crop=center',
      productCount: 9,
      status: 'Available',
      createdAt: '2026-04-12',
    },
    {
      id: 5,
      name: 'Wraps',
      description: 'Healthy wraps with fresh ingredients',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=150&h=150&fit=crop&crop=center',
      productCount: 5,
      status: 'Unavailable',
      createdAt: '2026-05-01',
    },
    {
      id: 6,
      name: 'Salads',
      description: 'Fresh garden salads with dressings',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=150&fit=crop&crop=center',
      productCount: 4,
      status: 'Available',
      createdAt: '2026-06-20',
    },
  ];

  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'Available',
  });
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const itemsPerPage = 5;

  // Filter categories
  const filteredCategories = categories.filter((cat) => {
    const matchSearch =
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || cat.status === filter;
    return matchSearch && matchFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleAdd = () => {
    setFormData({ name: '', description: '', image: '', status: 'Available' });
    setIsAddModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
      status: category.status,
    });
    setIsEditModalOpen(true);
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Remove image
  const removeImage = () => {
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveAdd = () => {
    const newCategory = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      image: formData.image || 'https://via.placeholder.com/150?text=Category',
      productCount: 0,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCategories([...categories, newCategory]);
    setIsAddModalOpen(false);
    setFormData({ name: '', description: '', image: '', status: 'Available' });
  };

  const handleSaveEdit = () => {
    const updatedCategories = categories.map((cat) =>
      cat.id === editingId
        ? {
            ...cat,
            name: formData.name,
            description: formData.description,
            image: formData.image || 'https://via.placeholder.com/150?text=Category',
            status: formData.status,
          }
        : cat
    );
    setCategories(updatedCategories);
    setIsEditModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', description: '', image: '', status: 'Available' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Status color mapping – corrected keys
  const statusColors = {
    Available: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Unavailable: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };

  // Reusable image upload field component (used in both modals)
  const ImageUploadField = () => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">Category Image</label>
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
      {!formData.image && (
        <p className="text-xs text-gray-500 mt-1">No image selected (optional)</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e1a] p-3 text-gray-100 font-sans overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Categories
            </h1>
            <p className="text-sm text-gray-400">Manage product categories</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search categories..."
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
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
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

        {/* Categories Display */}
        {viewMode === 'table' ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full min-w-[640px] md:min-w-[768px]">
              <thead className="border-b border-white/5">
                <tr className="text-left text-xs uppercase text-gray-400">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Image</th>
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Products</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Created</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((cat) => (
                  <tr key={cat.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-sm text-gray-400">#{cat.id}</td>
                    <td className="py-3 px-4">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover ring-1 ring-white/10"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=No+Image'; }}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-200">{cat.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-300 hidden sm:table-cell">{cat.productCount}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${statusColors[cat.status]}`}>
                        {cat.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400 hidden md:table-cell">{cat.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleView(cat)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedCategories.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400">No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {paginatedCategories.map((cat) => (
              <div key={cat.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 hover:border-purple-500/30 transition">
                <div className="relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-36 sm:h-40 object-cover rounded-xl"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x160?text=No+Image'; }}
                  />
                  <span className={`absolute top-2 right-2 text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${statusColors[cat.status]}`}>
                    {cat.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-200 mt-2">{cat.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{cat.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs sm:text-sm text-gray-400">{cat.productCount} products</span>
                  <span className="text-[10px] sm:text-xs text-gray-500">{cat.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleView(cat)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition text-xs sm:text-sm"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition text-xs sm:text-sm"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs sm:text-sm"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {paginatedCategories.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-400">No categories found</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <p className="text-xs sm:text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of {filteredCategories.length}
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

        {/* Add Category Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Add New Category</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
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
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleSaveAdd}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                >
                  Create Category
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

        {/* Edit Category Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Edit Category</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
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
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                >
                  Update Category
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

        {/* View Category Modal */}
        {isViewModalOpen && selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Category Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCategory.image}
                    alt={selectedCategory.name}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=No+Image'; }}
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-200">{selectedCategory.name}</p>
                    <p className="text-sm text-gray-400">#{selectedCategory.id}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-gray-200">{selectedCategory.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Products</p>
                  <p className="text-gray-200 flex items-center gap-2">
                    <Package size={16} className="text-gray-400" />
                    {selectedCategory.productCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[selectedCategory.status]}`}>
                    {selectedCategory.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-gray-200">{selectedCategory.createdAt}</p>
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

export default Categories;