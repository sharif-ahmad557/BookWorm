"use client";

import { useEffect, useState } from "react";
import { FaBook, FaUsers, FaComments, FaClipboardList } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-600">
        Loading Dashboard...
      </div>
    );
  }

  const { stats, chartData } = data || { stats: {}, chartData: [] };

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks || 0,
      icon: <FaBook />,
      color: "bg-blue-500",
    },
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: <FaUsers />,
      color: "bg-green-500",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews || 0,
      icon: <FaComments />,
      color: "bg-yellow-500",
    },
    {
      title: "Total Genres",
      value: stats.totalGenres || 0,
      icon: <FaClipboardList />,
      color: "bg-purple-500",
    },
  ];

  // Pie Chart Colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Dashboard Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center hover:shadow-lg transition-shadow"
          >
            <div
              className={`${stat.color} p-4 rounded-full text-white text-xl mr-4 shadow-md`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            Books per Genre
          </h2>
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#8884d8" fontSize={12} />
                  <YAxis stroke="#8884d8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#374151",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    name="Number of Books"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No book data available for charts
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart (Optional Visualization) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            Genre Distribution
          </h2>
          <div className="h-80 w-full flex justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Add books to see charts
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
