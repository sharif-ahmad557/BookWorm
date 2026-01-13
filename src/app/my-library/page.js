"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaBookReader,
  FaCheckCircle,
  FaBookmark,
  FaEdit,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function MyLibrary() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("currentlyReading");
  const [libraryData, setLibraryData] = useState({
    wantToRead: [],
    currentlyReading: [],
    read: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchLibrary = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user/my-library?email=${user.email}`);
      const data = await res.json();
      setLibraryData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [user]);

  const updateProgress = async (bookId, newProgress) => {
    toast.success(`Progress updated to ${newProgress}%`);
  };

  const tabs = [
    {
      id: "currentlyReading",
      label: "Currently Reading",
      icon: <FaBookReader />,
    },
    { id: "wantToRead", label: "Want to Read", icon: <FaBookmark /> },
    { id: "read", label: "Read", icon: <FaCheckCircle /> },
  ];

  if (loading)
    return <div className="p-10 text-center">Loading Library...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        My Library
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 px-4 font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            {tab.icon} {tab.label}
            <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-xs px-2 py-0.5 rounded-full">
              {libraryData[tab.id]?.length || 0}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {libraryData[activeTab]?.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-gray-500 mb-4">No books in this shelf yet.</p>
              <Link href="/books" className="text-blue-600 hover:underline">
                Browse books to add some!
              </Link>
            </div>
          ) : (
            libraryData[activeTab]?.map((item) => {
              const book = activeTab === "currentlyReading" ? item.book : item;
              const progress =
                activeTab === "currentlyReading" ? item.progress : 0;

              return (
                <div
                  key={book._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex gap-4"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-24 h-36 object-cover rounded-md shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {book.author}
                      </p>
                      <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded mt-2 inline-block">
                        {book.genre?.name}
                      </span>
                    </div>

                    {/* Progress Bar for Currently Reading */}
                    {activeTab === "currentlyReading" && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1 text-gray-600 dark:text-gray-300">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <button
                          onClick={() =>
                            updateProgress(
                              book._id,
                              Math.min(progress + 10, 100)
                            )
                          }
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <FaEdit /> Update Progress
                        </button>
                      </div>
                    )}

                    <Link
                      href={`/books/${book._id}`}
                      className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
