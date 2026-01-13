"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FaArrowRight, FaStar } from "react-icons/fa";

export default function Recommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [reason, setReason] = useState("Top Rated Books");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const query = user?.email ? `?email=${user.email}` : "";
        const res = await fetch(`/api/recommendations${query}`);
        const data = await res.json();

        if (data.books) {
          setRecommendations(data.books);
          setReason(data.reason);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto py-24 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12">
        <div className="mb-6 md:mb-0">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Recommended For You
          </h2>
          <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full"></div>
          <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mt-3">
            {reason}
          </p>
        </div>
        <Link
          href="/books"
          className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md hover:shadow-lg"
        >
          View All{" "}
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 h-96 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendations.map((book) => (
            <Link key={book._id} href={`/books/${book._id}`}>
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden h-full flex flex-col border border-gray-100 dark:border-gray-700">
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-lg z-20 translate-y-[-100px] group-hover:translate-y-0 transition-transform duration-300">
                    <FaStar className="text-yellow-400" />
                    {book.averageRating?.toFixed(1) || "N/A"}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col relative z-20 bg-white dark:bg-gray-800">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">
                    {book.genre?.name || "Genre"}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    by {book.author}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-400">
                    <span>Details</span>
                    <FaArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-blue-500" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
