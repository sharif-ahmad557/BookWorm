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
  FaTrashAlt,
  FaBookOpen,
  FaLayerGroup,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

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
      if (res.ok) {
        const data = await res.json();
        setLibraryData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [user]);

  const handleUpdateProgress = async (bookId, currentProgress) => {
    const { value: newProgress } = await Swal.fire({
      title: "Update Progress",
      input: "range",
      inputLabel: "How much have you read?",
      inputAttributes: {
        min: 0,
        max: 100,
        step: 1,
      },
      inputValue: currentProgress || 0,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#3B82F6",
    });

    if (newProgress !== undefined) {

      setLibraryData((prev) => ({
        ...prev,
        currentlyReading: prev.currentlyReading.map((item) =>
          item.book._id === bookId
            ? { ...item, progress: parseInt(newProgress) }
            : item
        ),
      }));

      toast.success(`Progress updated to ${newProgress}%`);

    }
  };

  const handleRemoveBook = async (bookId, shelf) => {
    Swal.fire({
      title: "Remove Book?",
      text: "It will be removed from this shelf.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch("/api/user/library/remove", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, bookId, shelf }),
          });


          setLibraryData((prev) => ({
            ...prev,
            [shelf]: prev[shelf].filter((item) => {
              const id =
                shelf === "currentlyReading" ? item.book._id : item._id;
              return id !== bookId;
            }),
          }));

          toast.success("Book removed from shelf");
        } catch (error) {
          toast.error("Failed to remove");
        }
      }
    });
  };

  // এনিমেশন ভেরিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const tabs = [
    {
      id: "currentlyReading",
      label: "Reading",
      icon: <FaBookReader />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "wantToRead",
      label: "To Read",
      icon: <FaBookmark />,
      color: "text-orange-600 bg-orange-50",
    },
    {
      id: "read",
      label: "Finished",
      icon: <FaCheckCircle />,
      color: "text-green-600 bg-green-50",
    },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 1. Header & Stats Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 pt-8 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <span className="text-4xl">📚</span> My Library
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Manage your reading journey and track progress.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-xl">
                <FaBookReader />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {libraryData.currentlyReading?.length || 0}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reading Now
                </p>
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-300 text-xl">
                <FaBookmark />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {libraryData.wantToRead?.length || 0}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  On Wishlist
                </p>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 text-xl">
                <FaCheckCircle />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {libraryData.read?.length || 0}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* 2. Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 inline-flex gap-2 mb-8 overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? `${tab.color} shadow-sm`
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* 3. Content Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {libraryData[activeTab]?.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
                <FaLayerGroup className="text-6xl text-gray-200 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  This shelf is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added any books here yet.
                </p>
                <Link
                  href="/books"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2"
                >
                  <FaBookOpen /> Browse Books
                </Link>
              </div>
            ) : (
              libraryData[activeTab]?.map((item) => {
                // Currently reading এর স্ট্রাকচার আলাদা (item.book)
                const isReading = activeTab === "currentlyReading";
                const book = isReading ? item.book : item;
                const progress = isReading ? item.progress : 0;

                return (
                  <motion.div
                    key={book._id}
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow p-5 border border-gray-100 dark:border-gray-700 group relative"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveBook(book._id, activeTab)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from shelf"
                    >
                      <FaTrashAlt />
                    </button>

                    <div className="flex gap-5">
                      <Link href={`/books/${book._id}`}>
                        <div className="relative w-28 h-40 flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 flex flex-col">
                        <div className="mb-auto">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md mb-2 inline-block">
                            {book.genre?.name || "Genre"}
                          </span>
                          <Link href={`/books/${book._id}`}>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-snug mb-1 hover:text-blue-600 transition-colors line-clamp-2">
                              {book.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            by {book.author}
                          </p>
                        </div>

                        {/* Progress Bar (Only for Currently Reading) */}
                        {isReading && (
                          <div className="mt-4">
                            <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                              <span>Progress</span>
                              <span
                                className={
                                  progress === 100
                                    ? "text-green-500"
                                    : "text-blue-600"
                                }
                              >
                                {progress}%
                              </span>
                            </div>
                            <div
                              className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden cursor-pointer"
                              onClick={() =>
                                handleUpdateProgress(book._id, progress)
                              }
                            >
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  progress === 100
                                    ? "bg-green-500"
                                    : "bg-blue-600"
                                }`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <button
                              onClick={() =>
                                handleUpdateProgress(book._id, progress)
                              }
                              className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-semibold flex items-center gap-1"
                            >
                              <FaEdit /> Update
                            </button>
                          </div>
                        )}

                        {!isReading && (
                          <Link
                            href={`/books/${book._id}`}
                            className="mt-4 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            View Details <FaBookOpen className="text-xs" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
