"use client";

import { useState, useEffect } from "react";
import { FaYoutube, FaPlayCircle, FaVideoSlash } from "react-icons/fa";

export default function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const res = await fetch("/api/tutorials");
        const data = await res.json();
        setTutorials(data);
      } catch (error) {
        console.error("Failed to fetch tutorials", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 mb-4">
            BookWorm Video Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover reviews, reading tips, and recommendations curated just for
            you.
          </p>
        </div>

        {/* Loading State (Skeleton) */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-80 animate-pulse"
              >
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content Grid */}
        {!loading && tutorials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutorials.map((video) => (
              <div
                key={video._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-red-500/20"
              >
                {/* Video Player */}
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 text-sm font-semibold uppercase tracking-wider">
                    <FaYoutube /> Tutorial
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {video.description ||
                      "No description available for this video."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tutorials.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full mb-6 text-gray-400">
              <FaVideoSlash size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No Tutorials Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
              The admin hasn't uploaded any videos yet. Check back later for
              exciting book content!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
