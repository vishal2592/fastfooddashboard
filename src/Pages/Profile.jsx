import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Save,
  X,
  Edit2,
  Bell,
  Shield,
  LogOut,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { getAdminProfile } from '../../redux/slicer/adminSlice'; // adjust path

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin, loading, error, success } = useSelector((state) => state.admin);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91 98765 43210', // placeholder – not in model
    address: '123 Food Street, City, State 12345', // placeholder
    bio: 'Restaurant Manager | Passionate about food quality and customer satisfaction.', // placeholder
  });
  const [avatar, setAvatar] = useState(
    admin?.name
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=7C3AED&color=fff&size=128`
      : 'https://ui-avatars.com/api/?name=Admin+User&background=7C3AED&color=fff&size=128'
  );
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch profile on mount
  // useEffect(() => {
  //   dispatch(getAdminProfile());
  // }, [dispatch]);

  // Update formData when admin data loads
  useEffect(() => {
    if (admin) {
      setFormData((prev) => ({
        ...prev,
        name: admin.name || prev.name,
        email: admin.email || prev.email,
        // phone and address are not in model, keep placeholder
      }));
      // Update avatar if name changes
      if (admin.name) {
        setAvatar(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=7C3AED&color=fff&size=128`
        );
      }
    }
  }, [admin]);

  // Redirect if not authenticated (optional)
  useEffect(() => {
    if (error && error === 'Unauthorized') {
      navigate('/login');
    }
  }, [error, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    // For now, only update local state – you can add an API call later
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Revert to the original admin data
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        phone: formData.phone, // keep placeholder
        address: formData.address,
        bio: formData.bio,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0e1a] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-red-400 mb-2">Failed to load profile</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => dispatch(getAdminProfile())}
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
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-sm text-gray-400">Manage your account settings and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* Success message */}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400">
            <CheckCircle size={18} />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 pb-6 border-b border-white/5">
            <div className="relative flex-shrink-0">
              <img
                src={avatar}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full ring-4 ring-purple-500/40 shadow-lg shadow-purple-500/20 object-cover"
              />
              {isEditing && (
                <>
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/30 hover:scale-110 transition"
                  >
                    <Camera size={16} className="text-white" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {!isEditing ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-200">{formData.name}</h2>
                  <p className="text-gray-400">{formData.email}</p>
                  {admin?.role && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full">
                      {admin.role}
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-1">{formData.bio}</p>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                {!isEditing ? (
                  <p className="flex items-center gap-2 text-gray-200">
                    <Mail size={16} className="text-gray-400" />
                    {formData.email}
                  </p>
                ) : (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                {!isEditing ? (
                  <p className="flex items-center gap-2 text-gray-200">
                    <Phone size={16} className="text-gray-400" />
                    {formData.phone}
                  </p>
                ) : (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Address</label>
                {!isEditing ? (
                  <p className="flex items-center gap-2 text-gray-200">
                    <MapPin size={16} className="text-gray-400" />
                    {formData.address}
                  </p>
                ) : (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Change Password */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                <Lock size={18} className="text-purple-400" />
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-sm text-purple-400 hover:text-purple-300 transition"
              >
                {showPasswordSection ? 'Hide' : 'Change'}
              </button>
            </div>
            {showPasswordSection && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition">
                  Update Password
                </button>
              </div>
            )}
          </div>

          {/* Notification Preferences */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2 mb-4">
              <Bell size={18} className="text-purple-400" />
              Notification Preferences
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300 text-sm">Email Notifications</span>
                <button
                  onClick={() => handleNotificationToggle('emailNotifications')}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    notifications.emailNotifications ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      notifications.emailNotifications ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300 text-sm">Order Updates</span>
                <button
                  onClick={() => handleNotificationToggle('orderUpdates')}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    notifications.orderUpdates ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      notifications.orderUpdates ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300 text-sm">Promotional Emails</span>
                <button
                  onClick={() => handleNotificationToggle('promotionalEmails')}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    notifications.promotionalEmails ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      notifications.promotionalEmails ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-red-500/20 p-6">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle size={18} />
            <h3 className="text-lg font-semibold">Danger Zone</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 transition border border-red-500/30">
            <LogOut size={18} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;