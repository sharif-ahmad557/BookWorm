"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaStar } from "react-icons/fa";
import Link from "next/link";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedGenre]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await fetch("/api/admin/genres");
      const data = await res.json();
      setGenres(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = `/api/books?search=${searchTerm}`;
      if (selectedGenre) url += `&genre=${selectedGenre}`;

      const res = await fetch(url);
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Explore Books
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-full w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Genre Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-full appearance-none bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <AnimatePresence>
            {books.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No books found matching your criteria.
              </div>
            )}
            {books.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      href={`/books/${book._id}`}
                      className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider mb-1">
                    {book.genre?.name}
                  </div>
                  <h3
                    className="font-bold text-gray-900 dark:text-white truncate"
                    title={book.title}
                  >
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {book.author}
                  </p>

                  {/* Rating Placeholder */}
                  <div className="flex items-center gap-1 mt-2 text-yellow-400 text-sm">
                    <FaStar />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {book.averageRating > 0
                        ? book.averageRating.toFixed(1)
                        : "New"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
