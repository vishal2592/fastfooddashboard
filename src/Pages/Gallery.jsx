// pages/Gallery.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaUpload,
  FaTrashAlt,
  FaImage,
  FaTimes,
  FaSpinner,
  FaImages,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAllImages,
  uploadImages,
  deleteGallery,
  resetGalleryState,
} from '../../redux/slicer/imageGallerySlice';

const Gallery = () => {
  const dispatch = useDispatch();
  const { galleries, loading, error, success, message } = useSelector(
    (state) => state.gallery
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch galleries on mount
  useEffect(() => {
    dispatch(getAllImages());
    // Reset state on unmount
    return () => dispatch(resetGalleryState());
  }, [dispatch]);

  // Show toast on success/error
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(resetGalleryState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetGalleryState());
    }
  }, [success, error, message, dispatch]);

  // Flatten all images from all galleries
  const allImages = galleries?.flatMap((gallery) =>
    gallery.images.map((img) => ({
      ...img,
      galleryId: gallery._id,
      galleryCreatedAt: gallery.createdAt,
    }))
  ) || [];

  // Handle file selection (multiple)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  // Upload handler
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warning('Please select at least one image.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('images', file); // key should match backend field name
    });

    try {
      await dispatch(uploadImages(formData)).unwrap();
      toast.success('Images uploaded successfully! 🎉');
      setShowModal(false);
      setSelectedFiles([]);
      setPreviews([]);
      // Refresh gallery
      dispatch(getAllImages());
    } catch (err) {
      toast.error(err || 'Failed to upload images.');
    } finally {
      setUploading(false);
    }
  };

  // Delete gallery containing the image
  const handleDeleteImage = async (galleryId, imageName) => {
    if (!window.confirm(`Delete this image and its gallery?`)) return;
    try {
      await dispatch(deleteGallery(galleryId)).unwrap();
      toast.success('Gallery deleted successfully.');
    } catch (err) {
      toast.error(err || 'Failed to delete gallery.');
    }
  };

  // Close modal
  const closeModal = () => {
    if (uploading) return;
    setShowModal(false);
    setSelectedFiles([]);
    setPreviews([]);
  };

  // Loading state
  if (loading && galleries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pt-20 pb-12 px-4 flex items-center justify-center">
        <FaSpinner className="text-4xl text-red-600 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error && galleries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => dispatch(getAllImages())}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                <span className="text-red-600">Gallery</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {allImages.length} {allImages.length === 1 ? 'image' : 'images'} in {galleries.length} {galleries.length === 1 ? 'gallery' : 'galleries'}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition shadow-lg hover:shadow-xl"
            >
              <FaUpload className="text-sm" />
              Upload Images
            </button>
          </div>

          {/* Image Grid */}
          {allImages.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaImage className="text-4xl text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No images yet</h2>
              <p className="text-gray-500 text-sm mb-6">Upload your first images to get started.</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition shadow-lg"
              >
                <FaUpload />
                Upload Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allImages.map((image, index) => (
                <div
                  key={`${image.galleryId}-${index}`}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square w-full overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.originalName || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteImage(image.galleryId, image.originalName || 'image')}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium truncate">
                      {image.originalName || 'Image'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              disabled={uploading}
            >
              <FaTimes className="text-xl" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Images</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose images (multiple allowed)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition"
                disabled={uploading}
              />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {previews.length} image{previews.length > 1 ? 's' : ''} selected
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((src, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img src={src} alt={`Preview ${idx+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 mt-2 text-center">
              Supported formats: JPG, PNG, GIF, WebP (max 5MB each)
            </p>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Gallery;