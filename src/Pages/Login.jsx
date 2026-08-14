import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, LogIn, CheckCircle } from 'lucide-react';
import { loginAdmin } from '../../redux/slicer/adminSlice'; // adjust path

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { admin, loading, error: reduxError } = useSelector(
  (state) => state.admin
);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  setLocalError("");

  if (!email || !password) {
    setLocalError("Please fill in all fields");
    return;
  }

  try {
    await dispatch(
      loginAdmin({ email, password })
    ).unwrap();

    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

    navigate("/admin");
  } catch (error) {
    console.log(error);
  }
};
   

  // Redirect on success
useEffect(() => {
  if (admin) {
    navigate("/admin");
  }
}, [admin, navigate]);

  const displayError = localError || reduxError;

  return (
    <div className="min-h-screen w-full bg-[#0b0e1a] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans overflow-x-hidden">
      {/* Background (unchanged) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl shadow-purple-500/5">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
              <span className="text-white font-bold text-2xl">FF</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-400 mt-1">Sign in to your admin account</p>
          </div>

          {displayError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fastfood.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border transition flex items-center justify-center ${
                    rememberMe
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {rememberMe && <CheckCircle size={12} className="text-white" />}
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-purple-400 hover:text-purple-300 transition"
                onClick={() => {/* Handle forgot password */}}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-purple-400 hover:text-purple-300 transition font-medium"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-3">
              © {new Date().getFullYear()} FastFood Admin. All rights reserved.
            </p>
          </div>
        </div>

        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl -z-10"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl -z-10"></div>
      </div>
    </div>
  );
};

export default Login;