"use client";

import { FaBook, FaUsers, FaComments, FaClipboardList } from "react-icons/fa";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Books",
      value: "120",
      icon: <FaBook />,
      color: "bg-blue-500",
    },
    {
      title: "Total Users",
      value: "45",
      icon: <FaUsers />,
      color: "bg-green-500",
    },
    {
      title: "Pending Reviews",
      value: "12",
      icon: <FaComments />,
      color: "bg-yellow-500",
    },
    {
      title: "Total Genres",
      value: "8",
      icon: <FaClipboardList />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center"
          >
            <div
              className={`${stat.color} p-4 rounded-full text-white text-xl mr-4`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Recent Activity
        </h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded text-gray-400">
          Chart will be implemented here
        </div>
      </div>
    </div>
  );
}
