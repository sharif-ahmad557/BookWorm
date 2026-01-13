"use client";

import {
  FaUserFriends,
  FaBookOpen,
  FaQuoteLeft,
  FaTrophy,
} from "react-icons/fa";

export default function Stats() {
  const stats = [
    { label: "Active Readers", value: "12K+", icon: <FaUserFriends /> },
    { label: "Books Tracked", value: "45K+", icon: <FaBookOpen /> },
    { label: "Reviews Added", value: "30K+", icon: <FaQuoteLeft /> },
    { label: "Reading Goals", value: "8K+", icon: <FaTrophy /> },
  ];

  return (
    <div className="py-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group p-6 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
          >
            <div className="text-4xl text-blue-600 dark:text-blue-400 mb-2 flex justify-center group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-500 dark:text-gray-300 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
