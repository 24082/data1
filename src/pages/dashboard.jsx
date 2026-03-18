import React, { useEffect, useState, useCallback } from "react";
import CountUp from "react-countup";
import api from "../services/httpService";
import { ShoppingCart, Package, Calendar, Zap, CalendarDays, MapPin, TrendingUp, BarChart2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#ef4444", "#9333ea", "#3b82f6"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const convertMonthlyData = (data) => {
    if (!Array.isArray(data)) return [];
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = data.find((d) => d.month === month);
      return { month: monthNames[i], quantity: found ? found.totalQuantity : 0 };
    });
  };

  const fetchLocations = useCallback(async () => {
    try {
      const res = await api.get("/api/location?isDefault=true&filter=false");
      const locationData = res.data?.data || [];
      setLocations(locationData);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  }, []);

  const fetchDashboard = useCallback(async (locationId) => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date().toISOString().split("T")[0];
      const params = new URLSearchParams();
      params.append("date", today);
      if (locationId) params.append("locationId", locationId);
      const res = await api.get(`/api/dashboard?${params.toString()}`);
      const dashboardData = res.data?.data;
      if (dashboardData) {
        setStats(dashboardData);
        setMonthlyData(convertMonthlyData(dashboardData.monthlyProductSales));
      }
    } catch (err) {
      console.error("Failed to fetch dashboard", err);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLocations(); }, [fetchLocations]);
  useEffect(() => {
    if (selectedLocation !== undefined) fetchDashboard(selectedLocation);
  }, [selectedLocation, fetchDashboard]);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSelectedLocation(value === "all" ? null : value);
  };

  const statCards = [
    {
      label: "Today's Orders",
      value: stats?.today?.totalOrders || 0,
      color: "border-orange-400",
      labelColor: "text-orange-500",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      decimals: 0,
    },
    {
      label: "Today's Sales (₹)",
      value: stats?.today?.totalAmount || 0,
      color: "border-red-400",
      labelColor: "text-red-500",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      icon: <Calendar className="w-6 h-6 text-red-500" />,
      decimals: 2,
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      color: "border-blue-400",
      labelColor: "text-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      icon: <ShoppingCart className="w-6 h-6 text-blue-600" />,
      decimals: 0,
    },
    {
      label: "Total Products",
      value: stats?.totalProducts || 0,
      color: "border-green-400",
      labelColor: "text-green-600",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      icon: <Package className="w-6 h-6 text-green-600" />,
      decimals: 0,
    },
    {
      label: "Monthly Sales (₹)",
      value: stats?.currentMonth?.totalAmount || 0,
      color: "border-purple-400",
      labelColor: "text-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      icon: <CalendarDays className="w-6 h-6 text-purple-600" />,
      decimals: 2,
    },
  ];

  const pieData = [
    { label: "Today's Sales", value: stats?.today?.totalOrders || 0, color: "#ef4444" },
    { label: "Monthly Sales", value: stats?.currentMonth?.totalOrders || 0, color: "#9333ea" },
    { label: "Overall Sales", value: stats?.overall?.totalOrders || 0, color: "#3b82f6" },
  ].filter(item => item.value > 0);

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Location Filter */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <select
            value={selectedLocation || "all"}
            onChange={handleLocationChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>{loc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm border-l-4 ${item.color} p-4 flex items-center justify-between hover:-translate-y-1 transition-transform duration-200`}
              >
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${item.labelColor} mb-1`}>
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    <CountUp
                      end={item.value}
                      duration={1.5}
                      separator=","
                      decimals={item.decimals}
                    />
                  </p>
                </div>
                <div className={`${item.iconBg} p-3 rounded-full`}>
                  {item.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-semibold text-gray-700">Monthly Product Sales</h2>
              </div>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="quantity" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Products Sold" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                  No monthly data available
                </div>
              )}
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-semibold text-gray-700">Sales Distribution</h2>
              </div>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="label"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                  No sales data available
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;