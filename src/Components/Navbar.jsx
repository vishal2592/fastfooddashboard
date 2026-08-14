import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun,
  Home,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { logoutAdmin } from '../../redux/slicer/adminSlice'; // adjust path

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin, loading } = useSelector((state) => state.admin);
  console.log("Current Admin:", admin);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleDark = () => setIsDark(!isDark);

  const closeDropdown = () => {
    setIsProfileOpen(false);
  };

 const handleLogout = async () => {
  try {
    await dispatch(logoutAdmin()).unwrap();

    navigate("/login", { replace: true });

  } catch (error) {
    console.log(error);
  }
};

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0e1a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">FF</span>
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:block">
                FastFood
              </h2>
            </div>
          </div>

          {/* Center: Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search orders, customers, menu..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Actions + Profile */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-white/5 transition text-gray-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0b0e1a]"></span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition text-gray-400"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${admin?.name || 'Admin'}&background=7C3AED&color=fff&size=36`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full ring-2 ring-purple-500/40"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-200 leading-none">
                    {admin?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-400 leading-none mt-0.5">
                    {admin?.role || 'Administrator'}
                  </p>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </button>

              {/* Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#141824] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-sm font-medium text-white">{admin?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-400">{admin?.email || 'admin@fastfood.com'}</p>
                  </div>
                  <div className="py-1">
                    <DropdownItem
                      icon={<User size={16} />}
                      label="Profile"
                      to="/admin/profile"
                      onClick={closeDropdown}
                    />
                    <DropdownItem
                      icon={<Settings size={16} />}
                      label="Settings"
                      to="/admin/setting"
                      onClick={closeDropdown}
                    />
                  </div>
                  <div className="border-t border-white/5 py-1">
                    <DropdownItem
                      icon={<LogOut size={16} />}
                      label={loading ? 'Logging out...' : 'Logout'}
                      className="text-red-400 hover:bg-red-500/10"
                      onClick={handleLogout}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search (visible on small screens) */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
          />
        </div>
      </div>
    </nav>
  );
};

// Dropdown Item component – now supports `disabled` prop
const DropdownItem = ({ icon, label, className = '', to, onClick, disabled = false }) => {
  const content = (
    <>
      <span className="text-gray-400">{icon}</span>
      {label}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition ${className}`}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Navbar;