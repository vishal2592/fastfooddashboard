import React from 'react';
import {
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ChevronRight,
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      label: 'Total Orders',
      value: '1,248',
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingBag,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Revenue',
      value: '₦84,250',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      label: 'Customers',
      value: '856',
      change: '+5.4%',
      trend: 'up',
      icon: Users,
      gradient: 'from-teal-400 to-emerald-500',
    },
    {
      label: 'Products',
      value: '48',
      change: '+3.2%',
      trend: 'up',
      icon: Package,
      gradient: 'from-amber-400 to-orange-500',
    },
  ];

  const salesData = [
    { label: 'May 1', value: 30 },
    { label: 'May 5', value: 45 },
    { label: 'May 10', value: 28 },
    { label: 'May 15', value: 60 },
    { label: 'May 20', value: 75 },
    { label: 'May 25', value: 50 },
    { label: 'May 30', value: 85 },
  ];
  const maxSales = Math.max(...salesData.map(d => d.value));

  const orderStatus = [
    { label: 'Completed', percentage: 65, count: 161, color: 'from-emerald-400 to-green-500' },
    { label: 'Preparing', percentage: 20, count: 50, color: 'from-yellow-400 to-orange-500' },
    { label: 'Pending', percentage: 10, count: 25, color: 'from-red-400 to-rose-500' },
    { label: 'Cancelled', percentage: 5, count: 12, color: 'from-gray-400 to-gray-500' },
  ];

  const recentOrders = [
    { id: '#1024', customer: 'Rahul Kumar', items: 'Cheese Burger x1', amount: '₦450', status: 'Completed', time: '10:30 AM' },
    { id: '#1023', customer: 'Amit Sharma', items: 'Pizza x1', amount: '₦650', status: 'Preparing', time: '10:20 AM' },
    { id: '#1022', customer: 'Priya Singh', items: 'Burger Combo x1', amount: '₦320', status: 'Pending', time: '10:10 AM' },
    { id: '#1021', customer: 'Rohit Kumar', items: 'French Fries x1', amount: '₦180', status: 'Completed', time: '10:00 AM' },
    { id: '#1020', customer: 'Neha Patel', items: 'Cold Coffee x1', amount: '₦150', status: 'Cancelled', time: '09:50 AM' },
  ];

  const popularProducts = [
    { name: 'Cheese Burger', orders: 245 },
    { name: 'Chicken Pizza', orders: 198 },
    { name: 'French Fries', orders: 176 },
    { name: 'Cold Coffee', orders: 142 },
  ];

  const statusColors = {
    Completed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Preparing: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Pending: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    Cancelled: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };

  const barGradients = [
    { from: '#8B5CF6', to: '#EC4899' },
    { from: '#22D3EE', to: '#3B82F6' },
    { from: '#34D399', to: '#10B981' },
    { from: '#FBBF24', to: '#F97316' },
    { from: '#F87171', to: '#F43F5E' },
    { from: '#818CF8', to: '#8B5CF6' },
    { from: '#F472B6', to: '#F43F5E' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0b0e1a] p-2 sm:p-3 md:p-4 lg:p-6 font-sans text-gray-100 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6 md:mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 md:p-5 hover:border-purple-500/40 transition duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20`}>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span
                  className={`flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded-full ${
                    stat.trend === 'up'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-2 md:mt-4 relative z-10">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 md:mt-2 relative z-10">vs last month</p>
            </div>
          ))}
        </div>

        {/* Two‑column: Sales Chart + Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-200">Sales Overview</h2>
              <span className="text-[10px] sm:text-xs text-gray-400 bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/5">Last 30 days</span>
            </div>
            <div className="relative w-full h-40 xs:h-48 sm:h-56 md:h-64">
              {/* Y‑axis */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[8px] sm:text-[10px] md:text-xs text-gray-500 w-5 sm:w-7 md:w-10">
                <span>100K</span>
                <span>80K</span>
                <span>60K</span>
                <span>40K</span>
                <span>20K</span>
                <span>0K</span>
              </div>
              {/* Grid lines */}
              <div className="absolute left-5 sm:left-7 md:left-10 right-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-white/5 w-full"></div>
                <div className="border-b border-white/5 w-full"></div>
                <div className="border-b border-white/5 w-full"></div>
                <div className="border-b border-white/5 w-full"></div>
                <div className="border-b border-white/5 w-full"></div>
                <div className="border-b border-white/5 w-full"></div>
              </div>
              {/* Bars */}
              <div className="absolute left-5 sm:left-7 md:left-10 right-0 top-0 bottom-0 flex items-end justify-between gap-0.5 sm:gap-1 md:gap-1.5">
                {salesData.map((item, idx) => {
                  const barHeightPercent = (item.value / maxSales) * 100;
                  const gradient = barGradients[idx % barGradients.length];
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                      <div
                        className="w-full max-w-[16px] xs:max-w-[20px] sm:max-w-[28px] md:max-w-[36px] rounded-t-md transition-all duration-700 relative"
                        style={{
                          height: `${Math.max(barHeightPercent, 4)}%`,
                          background: `linear-gradient(to top, ${gradient.from}, ${gradient.to})`,
                          boxShadow: `0 0 16px ${gradient.from}60`,
                          minHeight: '4px',
                        }}
                      >
                        <div className="absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 text-[6px] sm:text-[8px] md:text-[10px] font-medium text-white whitespace-nowrap">
                          {item.value}K
                        </div>
                      </div>
                      <span className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-400 mt-0.5 sm:mt-1 md:mt-1.5">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 md:p-5">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-200 mb-3 sm:mb-4">Order Status</h2>
            <div className="space-y-3 sm:space-y-4">
              {orderStatus.map((status, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="font-medium text-gray-300">{status.label}</span>
                    <span className="text-gray-400 font-semibold">{status.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 sm:h-2.5 mt-1">
                    <div
                      className={`h-2 sm:h-2.5 rounded-full bg-gradient-to-r ${status.color} transition-all duration-1000`}
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{status.count} orders</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 md:mb-8 overflow-x-auto">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-200">Recent Orders</h2>
            <button className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <table className="w-full min-w-[400px] sm:min-w-[480px] md:min-w-[640px]">
            <thead>
              <tr className="text-left text-[10px] sm:text-xs uppercase text-gray-400 border-b border-white/5">
                <th className="pb-2 font-medium">Order</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium hidden xs:table-cell">Items</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium hidden sm:table-cell">Time</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-2 sm:py-3 text-xs sm:text-sm font-medium text-purple-400">{order.id}</td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-200">{order.customer}</td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-400 hidden xs:table-cell">{order.items}</td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white">{order.amount}</td>
                  <td className="py-2 sm:py-3">
                    <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-400 hidden sm:table-cell">{order.time}</td>
                  <td className="py-2 sm:py-3 text-gray-400 hover:text-white">
                    <MoreVertical size={14} className="cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popular Products */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 sm:p-4 md:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-200">🔥 Popular Products</h2>
            <span className="text-[10px] sm:text-xs text-gray-400 bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/5">This week</span>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {popularProducts.map((product, idx) => {
              const maxOrders = popularProducts[0].orders;
              const width = (product.orders / maxOrders) * 100;
              const colors = ['from-purple-500 to-pink-500', 'from-cyan-400 to-blue-500', 'from-teal-400 to-emerald-500', 'from-amber-400 to-orange-500'];
              return (
                <div key={idx}>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="font-medium text-gray-200">{product.name}</span>
                    <span className="text-gray-400">{product.orders} Orders</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 mt-1">
                    <div
                      className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${colors[idx % colors.length]} transition-all duration-700`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;