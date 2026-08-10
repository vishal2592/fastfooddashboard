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
  Link as LinkIcon,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const Banner = () => {
  // Dummy banner data
  const initialBanners = [
    {
      id: 1,
      title: 'Summer Sale',
      description: 'Get up to 50% off on all burgers. Limited time offer!',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=300&fit=crop&crop=center',
      link: '/summer-sale',
      status: 'Active',
      position: 1,
      createdAt: '2026-07-15',
    },
    {
      id: 2,
      title: 'New Menu Launch',
      description: 'Introducing our new plant-based burgers. Try them today!',
      image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600&h=300&fit=crop&crop=center',
      link: '/new-menu',
      status: 'Active',
      position: 2,
      createdAt: '2026-07-20',
    },
    {
      id: 3,
      title: 'Free Delivery',
      description: 'Order above ₦5,000 and get free delivery. Use code FREEDEL',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=300&fit=crop&crop=center',
      link: '/free-delivery',
      status: 'Inactive',
      position: 3,
      createdAt: '2026-07-10',
    },
    {
      id: 4,
      title: 'Weekend Special',
      description: 'Buy 1 Get 1 Free on all pizzas this weekend!',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=300&fit=crop&crop=center',
      link: '/weekend-special',
      status: 'Active',
      position: 4,
      createdAt: '2026-07-25',
    },
  ];

  const [banners, setBanners] = useState(initialBanners);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingBanner, setViewingBanner] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    status: 'Active',
  });
  const fileInputRef = useRef(null);

  const itemsPerPage = 4;

  // Filter banners
  const filteredBanners = banners.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || b.status === filter;
    return matchSearch && matchFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleAdd = () => {
    setFormData({ title: '', description: '', image: '', link: '', status: 'Active' });
    setIsAddModalOpen(true);
  };

  const handleEdit = (banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
      link: banner.link,
      status: banner.status,
    });
    setIsEditModalOpen(true);
  };

  const handleView = (banner) => {
    setViewingBanner(banner);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter((b) => b.id !== id));
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
    const newBanner = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      image: formData.image || 'https://via.placeholder.com/600x300?text=No+Image',
      link: formData.link,
      status: formData.status,
      position: banners.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBanners([...banners, newBanner]);
    setIsAddModalOpen(false);
    setFormData({ title: '', description: '', image: '', link: '', status: 'Active' });
  };

  // Save edit
  const handleSaveEdit = () => {
    const updatedBanners = banners.map((b) =>
      b.id === editingId
        ? {
            ...b,
            title: formData.title,
            description: formData.description,
            image: formData.image || 'https://via.placeholder.com/600x300?text=No+Image',
            link: formData.link,
            status: formData.status,
          }
        : b
    );
    setBanners(updatedBanners);
    setIsEditModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', description: '', image: '', link: '', status: 'Active' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Status colors
  const statusColors = {
    Active: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Inactive: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };

  // Image upload field
  const ImageUploadField = () => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">Banner Image</label>
      <div className="flex items-center gap-3">
        {formData.image && (
          <div className="relative w-24 h-16 rounded-lg overflow-hidden ring-1 ring-white/10 flex-shrink-0">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/100x60?text=Invalid'; }}
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
      {!formData.image && <p className="text-xs text-gray-500 mt-1">Recommended size: 1200×600px</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e1a] p-3 text-gray-100 font-sans overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Banners
            </h1>
            <p className="text-sm text-gray-400">Manage promotional banners</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
            >
              <Plus size={18} />
              Add Banner
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search banners..."
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

        {/* Banners Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {paginatedBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/30 transition group"
              >
                <div className="relative">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-44 sm:h-48 object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/600x300?text=No+Image'; }}
                  />
                  <span
                    className={`absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full ${statusColors[banner.status]}`}
                  >
                    {banner.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-200">{banner.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{banner.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <LinkIcon size={14} />
                    <span className="truncate">{banner.link}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">#{banner.id}</span>
                    <span className="text-xs text-gray-500">{banner.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleView(banner)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition text-xs sm:text-sm"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition text-xs sm:text-sm"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs sm:text-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {paginatedBanners.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400">No banners found</div>
            )}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="border-b border-white/5">
                <tr className="text-left text-xs uppercase text-gray-400">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Image</th>
                  <th className="py-3 px-4 font-medium">Title</th>
                  <th className="py-3 px-4 font-medium hidden sm:table-cell">Link</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Created</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBanners.map((banner) => (
                  <tr key={banner.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-sm text-gray-400">#{banner.id}</td>
                    <td className="py-3 px-4">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-14 h-10 rounded-lg object-cover ring-1 ring-white/10"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/60x40?text=No+Image'; }}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-200">{banner.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-400 hidden sm:table-cell truncate max-w-[120px]">
                      {banner.link}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[banner.status]}`}>
                        {banner.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400 hidden md:table-cell">{banner.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleView(banner)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedBanners.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400">No banners found</td>
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBanners.length)} of {filteredBanners.length}
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

        {/* Add Banner Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Add New Banner</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Link (URL)</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/promotion"
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
                  onClick={handleSaveAdd}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                >
                  Create Banner
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

        {/* Edit Banner Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Edit Banner</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Link (URL)</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/promotion"
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
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                >
                  Update Banner
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

        {/* View Banner Modal */}
        {isViewModalOpen && viewingBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#141824] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Banner Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <img
                  src={viewingBanner.image}
                  alt={viewingBanner.title}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x300?text=No+Image'; }}
                />
                <div>
                  <p className="text-sm text-gray-400">Title</p>
                  <p className="text-lg font-semibold text-gray-200">{viewingBanner.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-gray-200">{viewingBanner.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Link</p>
                  <p className="text-gray-200 flex items-center gap-2">
                    <LinkIcon size={16} className="text-gray-400" />
                    {viewingBanner.link}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[viewingBanner.status]}`}>
                    {viewingBanner.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-gray-200">{viewingBanner.createdAt}</p>
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

export default Banner;