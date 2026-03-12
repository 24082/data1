import React, { useEffect, useState, useCallback } from "react";
import CountUp from "react-countup";
import api from "../services/api";

const Dashboard = () => {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await api.get("/api/location?isDefault=true&filter=false");
      const locationData = res.data?.data || [];
      setLocations(locationData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch locations");
    }
  }, []);

  const fetchDashboard = useCallback(async (locationId) => {
    try {
      setLoading(true);

      const today = new Date().toISOString().split("T")[0];

      const params = new URLSearchParams();
      params.append("date", today);

      if (locationId) {
        params.append("locationId", locationId);
      }

      const res = await api.get(`/api/dashboard?${params.toString()}`);
      const dashboardData = res.data?.data;

      if (dashboardData) {
        setStats(dashboardData);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard");
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    fetchDashboard(selectedLocation);
  }, [selectedLocation, fetchDashboard]);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSelectedLocation(value === "all" ? null : value);
  };

  const items = [
    {
      label: "Today's Orders",
      value: stats?.today?.totalOrders || 0,
      color: "border-orange-500"
    },
    {
      label: "Today's Sales (₹)",
      value: stats?.today?.totalAmount || 0,
      color: "border-red-500"
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      color: "border-blue-500"
    },
    {
      label: "Total Products",
      value: stats?.totalProducts || 0,
      color: "border-green-500"
    },
    {
      label: "Monthly Sales (₹)",
      value: stats?.currentMonth?.totalAmount || 0,
      color: "border-purple-500"
    }
  ];

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (

    <div className="p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Location Filter */}
      <div className="mb-6">
        <select
          className="border p-2 rounded"
          value={selectedLocation || "all"}
          onChange={handleLocationChange}
        >
          <option value="all">All Locations</option>

          {locations.map((loc) => (
            <option key={loc._id} value={loc._id}>
              {loc.name}
            </option>
          ))}

        </select>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">

            {items.map((item, index) => (

              <div
                key={index}
                className={`bg-white shadow rounded p-4 border-l-4 ${item.color} hover:-translate-y-1 transition`}
              >

                <p className="text-gray-600 text-sm">
                  {item.label}
                </p>

                <h2 className="text-2xl font-bold">

                  <CountUp
                    end={item.value}
                    duration={1.5}
                    separator=","
                  />

                </h2>

              </div>

            ))}

          </div>

          {/* Charts Section */}

          <div className="grid md:grid-cols-2 gap-8">

            {/* Bar Chart Placeholder */}
            <div className="bg-white shadow p-6 rounded">

              <h2 className="text-lg font-semibold mb-4">
                Monthly Product Sales Overview
              </h2>

              <div className="h-64 flex items-center justify-center text-gray-400">
                Bar Chart Here
              </div>

            </div>

            {/* Pie Chart Placeholder */}

            <div className="bg-white shadow p-6 rounded">

              <h2 className="text-lg font-semibold mb-4">
                Sales Distribution
              </h2>

              <div className="h-64 flex items-center justify-center text-gray-400">
                Pie Chart Here
              </div>

            </div>

          </div>

        </>
      )}

    </div>

  );

};

export default Dashboard;