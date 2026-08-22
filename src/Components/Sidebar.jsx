import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  FolderOpen,
  Layers,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  Tags,
  CreditCard,
  Truck,
  Star,
  Image,
  BarChart3,
  LogOut,
  Loader2,
} from 'lucide-react';
import { logoutAdmin } from '../../redux/slicer/adminSlice'; // adjust path

const menuItems = [
  { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { title: 'Categories', path: '/admin/categories', icon: FolderOpen },
  // { title: 'Subcategories', path: '/admin/subcategories', icon: Layers },
  { title: 'Products', path: '/admin/products', icon: UtensilsCrossed },
  { title: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  // { title: 'Offers', path: '/admin/offers', icon: ShoppingBag },
  { title: 'Gallery', path: '/admin/gallery', icon: ShoppingBag },
  { title: 'Customers', path: '/admin/customers', icon: Users },
  { title: 'Payments', path: '/admin/payments', icon: CreditCard },
  { title: 'Delivery', path: '/admin/delivery', icon: Truck },
  { title: 'Banner', path: '/admin/banner', icon: Image },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin, loading: logoutLoading } = useSelector((state) => state.admin);
  console.log("Current Admin:", admin);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => {
    if (isDesktop) {
      setIsCollapsed(!isCollapsed);
    } else {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  const getBadge = (title) => {
    if (title === 'Orders') return '12';
    if (title === 'Reviews') return '5';
    if (title === 'Offers') return '3';
    return null;
  };

 const handleLogout = async () => {
  try {
    await dispatch(logoutAdmin()).unwrap();

    navigate("/login", { replace: true });

  } catch (error) {
    console.log(error);
  }
};

  const sidebarClasses = `
    relative bg-gradient-to-b from-[#0f1322] to-[#1a1f35]
    border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${!isDesktop ? 'fixed inset-y-0 left-0 z-50 shadow-2xl' : 'sticky top-0'}
    h-screen overflow-visible shadow-2xl shadow-purple-500/5
  `;

  return (
    <>
      {!isDesktop && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Brand / Logo */}
        <div
          onClick={toggleCollapse}
          className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 
            ${isCollapsed ? 'justify-center' : ''} cursor-pointer select-none
            hover:bg-white/5 transition-colors duration-200 rounded-t-xl`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 
            flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0
            ring-2 ring-white/10"
          >
            <span className="text-white font-bold text-lg">FF</span>
          </div>
          {!isCollapsed && isDesktop && (
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-none">
                FastFood
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Panel</span>
            </div>
          )}
          {!isCollapsed && !isDesktop && isMobileOpen && (
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-none">
                FastFood
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const badge = getBadge(item.title);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (!isDesktop && isMobileOpen) setIsMobileOpen(false);
                }}
                className={({ isActive }) => `
                  relative flex items-center gap-3 px-4 py-2.5 rounded-xl 
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-white shadow-sm shadow-purple-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                  ${isCollapsed ? 'justify-center px-3' : ''}
                `}
              >
                {/* Rounded pill indicator — market standard */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 
                    rounded-full bg-gradient-to-b from-purple-500 to-pink-500 
                    shadow-[0_0_16px_rgba(168,85,247,0.5)]"
                  />
                )}

                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'group-hover:text-white'} transition-colors`} />

                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.title}</span>
                    {badge && (
                      <span className="text-xs font-bold bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-white/5 p-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col' : ''}`}>
            <div className="relative flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${admin?.name || 'Admin'}&background=7C3AED&color=fff&size=40`}
                alt="Admin"
                className="w-10 h-10 rounded-full ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/20"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f1322]"></span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{admin?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate capitalize">{admin?.role || 'administrator'}</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400 transition disabled:opacity-50"
              >
                {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-3 p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400 transition disabled:opacity-50"
            >
              {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            </button>
          )}
        </div>
      </aside>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Sidebar;