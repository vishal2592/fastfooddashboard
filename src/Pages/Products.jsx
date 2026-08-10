import React, { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';

const Products = () => {
  // Dummy product data – statuses updated to Available/Unavailable
  const initialProducts = [
    { id: 1, name: 'Cheese Burger', category: 'Burgers', originalPrice: 4.99, discount: 10, discountedPrice: 4.49, stock: 45, status: 'Available', rating: 4.5, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop&crop=center' },
    { id: 2, name: 'Chicken Pizza', category: 'Pizzas', originalPrice: 8.99, discount: 0, discountedPrice: 8.99, stock: 12, status: 'Available', rating: 4.8, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=150&fit=crop&crop=center' },
    { id: 3, name: 'French Fries', category: 'Sides', originalPrice: 2.49, discount: 0, discountedPrice: 2.49, stock: 78, status: 'Available', rating: 4.2, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=150&h=150&fit=crop&crop=center' },
    { id: 4, name: 'Cold Coffee', category: 'Beverages', originalPrice: 3.99, discount: 20, discountedPrice: 3.19, stock: 23, status: 'Unavailable', rating: 3.9, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop&crop=center' },
    { id: 5, name: 'Chicken Wrap', category: 'Wraps', originalPrice: 5.99, discount: 5, discountedPrice: 5.69, stock: 34, status: 'Available', rating: 4.6, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=150&h=150&fit=crop&crop=center' },
    { id: 6, name: 'Milkshake', category: 'Beverages', originalPrice: 4.49, discount: 0, discountedPrice: 4.49, stock: 9, status: 'Low Stock', rating: 4.0, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=150&h=150&fit=crop&crop=center' },
    { id: 7, name: 'Onion Rings', category: 'Sides', originalPrice: 3.49, discount: 0, discountedPrice: 3.49, stock: 56, status: 'Available', rating: 4.3, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=150&h=150&fit=crop&crop=center' },
    { id: 8, name: 'Veg Burger', category: 'Burgers', originalPrice: 3.99, discount: 15, discountedPrice: 3.39, stock: 31, status: 'Available', rating: 4.4, image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=150&h=150&fit=crop&crop=center' },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    originalPrice: '',
    discount: '0',
    discountedPrice: '',
    stock: '',
    status: 'Available',  // default changed to Available
    rating: '',
    image: '',
  });
  const fileInputRef = useRef(null);

  const itemsPerPage = 5;

  // Auto-calculate discounted price
  useEffect(() => {
    const original = parseFloat(formData.originalPrice) || 0;
    const disc = parseFloat(formData.discount) || 0;
    const discounted = original - (original * disc / 100);
    setFormData(prev => ({
      ...prev,
      discountedPrice: discounted.toFixed(2),
    }));
  }, [formData.originalPrice, formData.discount]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      originalPrice: '',
      discount: '0',
      discountedPrice: '',
      stock: '',
      status: 'Available',
      rating: '',
      image: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      originalPrice: product.originalPrice.toString(),
      discount: product.discount.toString(),
      discountedPrice: product.discountedPrice.toString(),
      stock: product.stock.toString(),
      status: product.status,
      rating: product.rating.toString(),
      image: product.image,
    });
    setIsModalOpen(true);
  };

  const handleView = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSave = () => {
    const newProduct = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.name,
      category: formData.category,
      originalPrice: parseFloat(formData.originalPrice) || 0,
      discount: parseFloat(formData.discount) || 0,
      discountedPrice: parseFloat(formData.discountedPrice) || 0,
      stock: parseInt(formData.stock) || 0,
      status: formData.status,
      rating: parseFloat(formData.rating) || 0,
      image: formData.image || 'https://via.placeholder.com/150?text=No+Image',
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)));
    } else {
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Image upload handlers
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

  // Status color mapping – updated keys
  const statusColors = {
    Available: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Unavailable: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    'Low Stock': 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  // Image upload field component
  const ImageUploadField = () => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">Product Image</label>
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

  // Render stars for rating
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
        <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

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
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* Filters & Search */}
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

        {/* Products Display */}
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
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-sm text-gray-400">#{product.id}</td>
                    <td className="py-3 px-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover ring-1 ring-white/10"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=No+Image'; }}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-200">{product.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-400 hidden sm:table-cell">{product.category}</td>
                    <td className="py-3 px-4 text-sm">
                      {product.discount > 0 ? (
                        <div>
                          <span className="text-gray-500 line-through text-xs mr-1">${product.originalPrice.toFixed(2)}</span>
                          <span className="font-semibold text-emerald-400">${product.discountedPrice.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-white">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300 hidden md:table-cell">{product.discount > 0 ? `${product.discount}%` : '—'}</td>
                    <td className="py-3 px-4 hidden lg:table-cell">{renderStars(product.rating)}</td>
                    <td className="py-3 px-4 text-sm text-gray-300 hidden md:table-cell">{product.stock}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${statusColors[product.status]}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleView(product)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                        >
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
              <div key={product.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 hover:border-purple-500/30 transition">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 object-cover rounded-xl"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x160?text=No+Image'; }}
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
                <p className="text-xs sm:text-sm text-gray-400">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    {product.discount > 0 ? (
                      <div>
                        <span className="text-gray-500 line-through text-xs">${product.originalPrice.toFixed(2)}</span>
                        <span className="text-lg font-bold text-emerald-400 ml-1">${product.discountedPrice.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-white">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">Stock: {product.stock}</div>
                </div>
                <div className="mt-1">{renderStars(product.rating)}</div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleView(product)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition text-xs sm:text-sm"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition text-xs sm:text-sm"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs sm:text-sm"
                  >
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
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
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
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <ImageUploadField />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Original Price ($)</label>
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
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                >
                  {editingProduct ? 'Update' : 'Create'}
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

        {/* View Product Modal */}
        {isViewModalOpen && viewingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Product Details</h2>
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
                    src={viewingProduct.image}
                    alt={viewingProduct.name}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=No+Image'; }}
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-200">{viewingProduct.name}</p>
                    <p className="text-sm text-gray-400">#{viewingProduct.id}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-gray-200 flex items-center gap-2">
                    <Tag size={16} className="text-gray-400" />
                    {viewingProduct.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <div>
                    {viewingProduct.discount > 0 ? (
                      <div>
                        <span className="text-gray-500 line-through text-sm mr-2">${viewingProduct.originalPrice.toFixed(2)}</span>
                        <span className="text-lg font-bold text-emerald-400">${viewingProduct.discountedPrice.toFixed(2)}</span>
                        <span className="text-xs text-red-400 ml-2">({viewingProduct.discount}% off)</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-white">${viewingProduct.originalPrice.toFixed(2)}</span>
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