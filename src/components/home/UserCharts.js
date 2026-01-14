"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { FaTrophy, FaBookReader, FaEdit, FaChartPie } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function UserCharts() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allGenres, setAllGenres] = useState([]);

  const fetchStats = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/user/stats?email=${user.email}`, {
        cache: "no-store",
      });
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllGenres = async () => {
    try {
      const res = await fetch("/api/admin/genres");
      if (res.ok) setAllGenres(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchAllGenres();
    }
  }, [user]);

  const handleEditGenres = async () => {
    if (allGenres.length === 0) return toast.error("No genres found.");

    const htmlContent = `
      <div style="text-align: left; max-height: 250px; overflow-y: auto; padding: 5px;">
        ${allGenres
          .map(
            (g) => `
          <div style="margin-bottom: 8px; display: flex; align-items: center;">
            <input type="checkbox" id="${g._id}" value="${g._id}" class="swal2-checkbox" style="margin-right: 10px; display: block;">
            <label for="${g._id}" style="cursor: pointer; font-size: 16px;">${g.name}</label>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    const { value: selectedIds } = await Swal.fire({
      title: "Customize Favorite Genres",
      html: htmlContent,
      showCancelButton: true,
      confirmButtonText: "Save Favorites",
      preConfirm: () => {
        return allGenres
          .filter((g) => document.getElementById(g._id).checked)
          .map((g) => g._id);
      },
    });

    if (selectedIds) {
      const loadingToast = toast.loading("Updating...");
      try {
        const res = await fetch("/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, genreIds: selectedIds }),
        });
        if (res.ok) {
          toast.success("Updated!", { id: loadingToast });
          await fetchStats();
        }
      } catch (e) {
        toast.error("Error", { id: loadingToast });
      }
    }
  };

  const handleEditGoal = async () => {
    const { value: newGoal } = await Swal.fire({
      title: "Set Annual Goal",
      input: "number",
      inputValue: data?.readingGoal || 50,
      showCancelButton: true,
    });

    if (newGoal) {
      const res = await fetch("/api/user/goal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, target: newGoal }),
      });
      if (res.ok) {
        toast.success("Goal Updated!");
        fetchStats();
      }
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center animate-pulse text-gray-500">
        Loading stats...
      </div>
    );
  if (!data) return null;

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-bold text-sm mb-1">{label}</p>
          <p className="text-blue-400 text-sm">
            📖 {payload[0].value} {payload[0].value === 1 ? "Book" : "Books"}{" "}
            Read
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 flex items-center gap-3">
          <FaTrophy className="text-yellow-500" /> Your Reading Activity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Goal Progress */}
          <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 relative flex flex-col items-center justify-center group">
            <button
              onClick={handleEditGoal}
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaEdit size={18} />
            </button>
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 dark:text-gray-600 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  className="text-blue-600 stroke-current transition-all duration-1000"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${
                    (data.progress > 100 ? 100 : data.progress) * 2.51
                  } 251.2`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold text-gray-800 dark:text-white">
                  {data.progress}%
                </span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              {data.booksRead} / {data.readingGoal}
            </h3>
            <p className="text-sm text-gray-500">Books Read</p>
          </div>

          {/* 2. Monthly Activity (IMPROVED) */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
              <FaBookReader className="text-green-500" /> Monthly Activity
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    strokeOpacity={0.1}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#8884d8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6B7280" }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                  />

                  <Bar
                    dataKey="books"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                    activeBar={{ fill: "#2563EB" }} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Genre Preference */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 md:col-span-3 lg:col-span-3 relative">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FaChartPie className="text-purple-500" /> Genre Preference
              </h3>
              <button
                onClick={handleEditGenres}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <FaEdit /> Customize
              </button>
            </div>
            <div className="h-72 w-full flex justify-center">
              {data.genreData && data.genreData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.genreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.genreData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        color: "#fff",
                        borderRadius: "8px",
                        border: "none",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                  <FaChartPie size={40} className="mb-2 opacity-50" />
                  <p>Customize to see data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
