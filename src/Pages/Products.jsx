import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Upload,
  Trash,
  Package,
  DollarSign,
  Tag,
  Star,
  Percent,
  Loader2,
} from 'lucide-react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../redux/slicer/productSlice';
import { getCategories } from '../../redux/slicer/categorySlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error, success } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    originalPrice: '',
    discount: '0',
    discountedPrice: '',
    stock: '',
    status: 'Available',
    rating: '',
    image: null,          // File object
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const itemsPerPage = 5;

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  // Refetch products after any mutation success
  useEffect(() => {
    if (success) {
      dispatch(getProducts());
    }
  }, [success, dispatch]);

  // Auto-calculate discounted price when originalPrice or discount changes
  useEffect(() => {
    const original = parseFloat(formData.originalPrice) || 0;
    const disc = parseFloat(formData.discount) || 0;
    const discounted = original - (original * disc / 100);
    setFormData(prev => ({
      ...prev,
      discountedPrice: discounted.toFixed(2),
    }));
  }, [formData.originalPrice, formData.discount]);

  // Filter & pagination
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: '',
      originalPrice: '',
      discount: '0',
      discountedPrice: '',
      stock: '',
      status: 'Available',
      rating: '',
      image: null,
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      category: product.category?._id || product.category || '',
      originalPrice: product.originalPrice?.toString() || '',
      discount: product.discount?.toString() || '0',
      discountedPrice: product.discountedPrice?.toString() || '',
      stock: product.stock?.toString() || '',
      status: product.status || 'Available',
      rating: product.rating?.toString() || '',
      image: null, // will use existing image if not replaced
    });
    setImagePreview(product.image?.url || product.image || null);
    setIsModalOpen(true);
  };

  const handleView = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('originalPrice', formData.originalPrice);
    data.append('discount', formData.discount);
    data.append('stock', formData.stock);
    data.append('status', formData.status);
    data.append('rating', formData.rating);
    if (formData.image) {
      data.append('image', formData.image);
    }

    if (editingId) {
      dispatch(updateProduct({ id: editingId, formData: data }));
    } else {
      dispatch(createProduct(data));
    }
    setIsModalOpen(false);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // Status colors
  const statusColors = {
    Available: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Unavailable: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    'Low Stock': 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  // Render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
        ))}
        {halfStar === 1 && <Star size={14} className="fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i + fullStars + halfStar} size={14} className="text-gray-500" />
        ))}
        <span className="text-xs text-gray-400 ml-1">{rating?.toFixed(1) || '0.0'}</span>
      </div>
    );
  };

  // Reusable Image Upload Field
  const ImageUploadField = () => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">Product Image</label>
      <div className="flex items-center gap-3">
        {imagePreview ? (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-1 ring-white/10 flex-shrink-0">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-0 right-0 p-1 bg-red-500/80 text-white rounded-bl-lg hover:bg-red-600 transition"
            >
              <Trash size={14} />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 text-xs ring-1 ring-white/10 flex-shrink-0">
            No image
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
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
      {!imagePreview && <p className="text-xs text-gray-500 mt-1">No image selected (optional)</p>}
    </div>
  );

  // Loading and error states
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0e1a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0e1a] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-400">Failed to load products</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => dispatch(getProducts())}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e1a] p-3 text-gray-100 font-sans overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-sm text-gray-400">Manage your menu items</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
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
              <option value="Low Stock">Low Stock</option>
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

        {/* Table / Grid */}
        {viewMode === 'table' ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-white/5">
                <tr className="text-left text-xs uppercase text-gray-400">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Image</th>
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Category</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Discount</th>
                  <th className="py-3 px-4 font-medium hidden lg:table-cell">Rating</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Stock</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-sm text-gray-400">#{product._id.slice(-4)}</td>
                    <td className="py-3 px-4">
                      <img
                        src={product.image?.url || product.image || 'https://via.placeholder.com/40?text=No+Image'}
                        alt={product.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover ring-1 ring-white/10"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-200">{product.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-400 hidden sm:table-cell">
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {product.discount > 0 ? (
                        <div>
                          <span className="text-gray-500 line-through text-xs mr-1">₹{product.originalPrice?.toFixed(2)}</span>
                          <span className="font-semibold text-emerald-400">₹{product.discountedPrice?.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-white">₹{product.originalPrice?.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300 hidden md:table-cell">
                      {product.discount > 0 ? `${product.discount}%` : '—'}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">{renderStars(product.rating)}</td>
                    <td className="py-3 px-4 text-sm text-gray-300 hidden md:table-cell">{product.stock}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${statusColors[product.status]}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button onClick={() => handleView(product)} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(product)} className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedProducts.length === 0 && (
                  <tr>
                    <td colSpan="10" className="py-8 text-center text-gray-400">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {paginatedProducts.map((product) => (
              <div key={product._id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 hover:border-purple-500/30 transition">
                <div className="relative">
                  <img
                    src={product.image?.url || product.image || 'https://via.placeholder.com/300x160?text=No+Image'}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 object-cover rounded-xl"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                  <span className={`absolute top-2 right-2 text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${statusColors[product.status]}`}>
                    {product.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-200 mt-2">{product.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    {product.discount > 0 ? (
                      <div>
                        <span className="text-gray-500 line-through text-xs">₹{product.originalPrice?.toFixed(2)}</span>
                        <span className="text-lg font-bold text-emerald-400 ml-1">₹{product.discountedPrice?.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-white">₹{product.originalPrice?.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">Stock: {product.stock}</div>
                </div>
                <div className="mt-1">{renderStars(product.rating)}</div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <button onClick={() => handleView(product)} className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition text-xs sm:text-sm">
                    <Eye size={14} /> View
                  </button>
                  <button onClick={() => handleEdit(product)} className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition text-xs sm:text-sm">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs sm:text-sm">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {paginatedProducts.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-400">No products found</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <p className="text-xs sm:text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
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

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <ImageUploadField />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Discounted Price (auto‑calculated)</label>
                  <input
                    type="text"
                    value={formData.discountedPrice}
                    readOnly
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Rating (out of 5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                    />
                  </div>
                </div>
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
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : (editingId ? 'Update' : 'Create')}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && viewingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Product Details</h2>
                <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={viewingProduct.image?.url || viewingProduct.image || 'https://via.placeholder.com/64?text=No+Image'}
                    alt={viewingProduct.name}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-200">{viewingProduct.name}</p>
                    <p className="text-sm text-gray-400">#{viewingProduct._id.slice(-4)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-gray-200 flex items-center gap-2">
                    <Tag size={16} className="text-gray-400" />
                    {typeof viewingProduct.category === 'object' ? viewingProduct.category.name : viewingProduct.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <div>
                    {viewingProduct.discount > 0 ? (
                      <div>
                        <span className="text-gray-500 line-through text-sm mr-2">₹{viewingProduct.originalPrice?.toFixed(2)}</span>
                        <span className="text-lg font-bold text-emerald-400">₹{viewingProduct.discountedPrice?.toFixed(2)}</span>
                        <span className="text-xs text-red-400 ml-2">({viewingProduct.discount}% off)</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-white">₹{viewingProduct.originalPrice?.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Stock</p>
                  <p className="text-gray-200 flex items-center gap-2">
                    <Package size={16} className="text-gray-400" />
                    {viewingProduct.stock}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rating</p>
                  <div className="flex items-center gap-2">{renderStars(viewingProduct.rating)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[viewingProduct.status]}`}>
                    {viewingProduct.status}
                  </span>
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

export default Products;