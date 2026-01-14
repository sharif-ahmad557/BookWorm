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
} from "recharts";
import { FaTrophy, FaBookReader, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2"; // SweetAlert ইম্পোর্ট
import toast from "react-hot-toast";

export default function UserCharts() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ডাটা ফেস করার ফাংশনটি আলাদা করলাম যাতে রিলোড করা যায়
  const fetchStats = async () => {
    if (user?.email) {
      try {
        const res = await fetch(`/api/user/stats?email=${user.email}`);
        if (res.ok) {
          const d = await res.json();
          setData(d);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  // গোল এডিট করার ফাংশন
  const handleEditGoal = async () => {
    const { value: newGoal } = await Swal.fire({
      title: "Set Reading Goal",
      input: "number",
      inputLabel: "How many books do you want to read this year?",
      inputValue: data.readingGoal || 50,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return "You need to write a valid number!";
        }
      },
    });

    if (newGoal) {
      try {
        const res = await fetch("/api/user/goal", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, target: newGoal }),
        });

        if (res.ok) {
          toast.success("Reading goal updated!");
          fetchStats(); // ডাটা রিফ্রেশ
        }
      } catch (error) {
        toast.error("Failed to update goal");
      }
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center text-gray-500 animate-pulse">
        Loading your stats...
      </div>
    );
  if (!data) return null;

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <div className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 flex items-center gap-3">
          <FaTrophy className="text-yellow-500" /> Your 2026 Reading Challenge
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Goal Progress Card (Updated with Edit Button) */}
          <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-600 relative group">
            {/* Edit Button */}
            <button
              onClick={handleEditGoal}
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition-colors p-2"
              title="Edit Goal"
            >
              <FaEdit size={20} />
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
                  className="text-blue-600 progress-ring__circle stroke-current transition-all duration-1000 ease-out"
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
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {data.booksRead} / {data.readingGoal || 50} Books Read
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Keep it up! You're on track.
            </p>
          </div>

          {/* 2. Monthly Activity (Bar Chart) */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-6">
              Monthly Activity
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyData}>
                  <XAxis dataKey="name" stroke="#8884d8" fontSize={12} />
                  <YAxis stroke="#8884d8" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="books"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Genre Distribution (Pie Chart) */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 md:col-span-3 lg:col-span-3">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-6 text-center">
              Your Favorite Genres
            </h3>
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
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <FaBookReader size={40} className="mb-2 opacity-50" />
                  <p>Read some books to see your taste profile!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
