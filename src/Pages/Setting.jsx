import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Globe,
  Store,
  CreditCard,
  Palette,
  Save,
  CheckCircle,
  Shield,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Percent,
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@fastfood.com',
    phone: '+91 98765 43210',
    address: '123 Food Street, City, State 12345',
    bio: 'Restaurant Manager',
  });
  const [storeData, setStoreData] = useState({
    storeName: 'FastFood Restaurant',
    storeEmail: 'info@fastfood.com',
    storePhone: '+91 98765 43211',
    storeAddress: '123 Food Street, City, State 12345',
    currency: '₦',
    taxRate: '10',
    timezone: 'Africa/Lagos',
  });
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    twoFactorAuth: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Change Password</h3>
              <div className="space-y-4 max-w-md">
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
                <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition">
                  Update Password
                </button>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-gray-300">Enable 2FA for enhanced security</p>
                  <p className="text-sm text-gray-400">Protect your account with an extra layer of security</p>
                </div>
                <button
                  onClick={() => handlePreferenceToggle('twoFactorAuth')}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    preferences.twoFactorAuth ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      preferences.twoFactorAuth ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case 'store':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Store Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={storeData.storeName}
                  onChange={handleStoreChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Store Email</label>
                <input
                  type="email"
                  name="storeEmail"
                  value={storeData.storeEmail}
                  onChange={handleStoreChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Store Phone</label>
                <input
                  type="text"
                  name="storePhone"
                  value={storeData.storePhone}
                  onChange={handleStoreChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Store Address</label>
                <input
                  type="text"
                  name="storeAddress"
                  value={storeData.storeAddress}
                  onChange={handleStoreChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                />
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Payment Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
                <select
                  name="currency"
                  value={storeData.currency}
                  onChange={handleStoreChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                >
                  <option value="₦">₦ (Naira)</option>
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (Euro)</option>
                  <option value="£">£ (GBP)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  name="taxRate"
                  value={storeData.taxRate}
                  onChange={handleStoreChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Time Zone</label>
                <select
                  name="timezone"
                  value={storeData.timezone}
                  onChange={handleStoreChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                >
                  <option value="Africa/Lagos">Africa/Lagos</option>
                  <option value="Africa/Cairo">Africa/Cairo</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Asia/Dubai">Asia/Dubai</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Appearance</h3>
              <div className="space-y-3 max-w-md">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Theme</span>
                  <select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Language</h3>
              <div className="space-y-3 max-w-md">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Language</span>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Notifications</h3>
              <div className="space-y-3 max-w-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive emails about account activity</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle('emailNotifications')}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                      preferences.emailNotifications ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                        preferences.emailNotifications ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Order Updates</p>
                    <p className="text-sm text-gray-400">Get notified about order status changes</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle('orderUpdates')}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                      preferences.orderUpdates ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                        preferences.orderUpdates ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Promotional Emails</p>
                    <p className="text-sm text-gray-400">Receive special offers and promotions</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle('promotionalEmails')}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                      preferences.promotionalEmails ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                        preferences.promotionalEmails ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e1a] p-3 sm:p-4 md:p-6 lg:p-8 text-gray-100 font-sans overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-sm text-gray-400">Manage your account and store preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400">
            <CheckCircle size={18} />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {/* Settings Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-2 sticky top-20">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium
                        ${isActive
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-white shadow-sm shadow-purple-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {isActive && (
                        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]" />
                      )}
                      <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : ''}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;