// pages/Offers.jsx
import React, { useState } from 'react';
import {
  FaPlus,
  FaTrashAlt,
  FaTag,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaSpinner,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ── Dummy initial offers ──────────────────────────────────────
const initialOffers = [
  {
    id: 1,
    code: 'SAVE20',
    description: '20% off on all burgers',
    discount: 20,
    expiry: '2025-12-31',
    status: 'active', // 'active' or 'expired'
  },
  {
    id: 2,
    code: 'PIZZA50',
    description: 'Buy one get one free on large pizzas',
    discount: 50,
    expiry: '2025-11-15',
    status: 'active',
  },
  {
    id: 3,
    code: 'FREESHIP',
    description: 'Free delivery on orders above ₹500',
    discount: null,
    expiry: '2025-10-01',
    status: 'expired',
  },
  {
    id: 4,
    code: 'WEEKEND10',
    description: '10% off every weekend',
    discount: 10,
    expiry: '2025-12-31',
    status: 'active',
  },
  {
    id: 5,
    code: 'FAMILY15',
    description: '15% off on family meals',
    discount: 15,
    expiry: '2025-09-15',
    status: 'expired',
  },
];
// ──────────────────────────────────────────────────────────────

const Offers = () => {
  const [offers, setOffers] = useState(initialOffers);
  const [showModal, setShowModal] = useState(false);
  const [nextId, setNextId] = useState(offers.length + 1);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: '',
    expiry: '',
    status: 'active',
  });
  const [submitting, setSubmitting] = useState(false);

  // ── Handle form input changes ──
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Add new offer ──
  const handleAddOffer = () => {
    // Basic validation
    if (!formData.code.trim() || !formData.description.trim() || !formData.expiry) {
      toast.warning('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newOffer = {
        id: nextId,
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discount: formData.discount ? parseInt(formData.discount) : null,
        expiry: formData.expiry,
        status: formData.status,
      };

      setOffers((prev) => [newOffer, ...prev]);
      setNextId((prev) => prev + 1);
      setSubmitting(false);
      setShowModal(false);
      setFormData({ code: '', description: '', discount: '', expiry: '', status: 'active' });

      toast.success(`Offer "${newOffer.code}" added successfully! 🎉`);
    }, 800);
  };

  // ── Delete offer ──
  const handleDelete = (id, code) => {
    if (!window.confirm(`Delete offer "${code}"?`)) return;

    setOffers((prev) => prev.filter((offer) => offer.id !== id));
    toast.success(`Offer "${code}" deleted.`);
  };

  // ── Toggle status (active/expired) ──
  const toggleStatus = (id) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === id
          ? { ...offer, status: offer.status === 'active' ? 'expired' : 'active' }
          : offer
      )
    );
    const offer = offers.find((o) => o.id === id);
    toast.info(`Offer "${offer.code}" ${offer.status === 'active' ? 'deactivated' : 'activated'}.`);
  };

  // ── Close modal ──
  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    setFormData({ code: '', description: '', discount: '', expiry: '', status: 'active' });
  };

  // ── Format date ──
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // ── Check if expired ──
  const isExpired = (expiry) => {
    return new Date(expiry) < new Date();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                <span className="text-red-600">Offers</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {offers.length} {offers.length === 1 ? 'offer' : 'offers'} available
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition shadow-lg hover:shadow-xl"
            >
              <FaPlus className="text-sm" />
              Add Offer
            </button>
          </div>

          {/* Offers Grid */}
          {offers.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTag className="text-4xl text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No offers yet</h2>
              <p className="text-gray-500 text-sm mb-6">Create your first offer to attract customers.</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition shadow-lg"
              >
                <FaPlus />
                Add Offer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => {
                const expired = isExpired(offer.expiry);
                const statusColor =
                  offer.status === 'active' && !expired
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500';

                return (
                  <div
                    key={offer.id}
                    className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-4 border-red-500"
                  >
                    {/* Status badge */}
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                    >
                      {offer.status === 'active' && !expired ? 'Active' : 'Inactive'}
                    </div>

                    <div className="p-5">
                      {/* Code */}
                      <div className="flex items-center gap-2 mb-2">
                        <FaTag className="text-red-500" />
                        <span className="text-xl font-bold text-gray-800 tracking-wider">
                          {offer.code}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3">{offer.description}</p>

                      {/* Discount */}
                      {offer.discount && (
                        <div className="flex items-center gap-1 text-sm font-semibold text-red-600 mb-2">
                          <span>{offer.discount}% OFF</span>
                        </div>
                      )}

                      {/* Expiry */}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaCalendarAlt />
                        <span>Expires: {formatDate(offer.expiry)}</span>
                        {expired && (
                          <span className="ml-2 text-red-500 text-xs font-medium">(Expired)</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => toggleStatus(offer.id)}
                          className={`text-xs font-medium px-3 py-1 rounded-full transition ${
                            offer.status === 'active' && !expired
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          {offer.status === 'active' && !expired ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                          onClick={() => handleDelete(offer.id, offer.code)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <FaTrashAlt className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Offer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              disabled={submitting}
            >
              <FaTimes className="text-xl" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Offer</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddOffer();
              }}
            >
              {/* Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., SAVE20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={submitting}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., 20% off on all burgers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={submitting}
                  required
                />
              </div>

              {/* Discount (optional) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="e.g., 20"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={submitting}
                />
              </div>

              {/* Expiry */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={submitting}
                  required
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={submitting}
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Add Offer
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Offers;