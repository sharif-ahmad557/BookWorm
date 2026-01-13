"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaStar, FaUser } from "react-icons/fa";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = async (reviewId, action) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, action }),
      });

      if (!res.ok) throw new Error("Action failed");

      toast.success(
        action === "approve" ? "Review Approved!" : "Review Rejected!"
      );

      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Pending Reviews
      </h1>

      {loading ? (
        <div className="text-center py-10">Loading reviews...</div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {reviews.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-xl text-gray-500">
                  No pending reviews. Good job! 🎉
                </p>
              </div>
            )}

            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6 border-l-4 border-yellow-400"
              >
                {/* Book Info */}
                <div className="flex items-center gap-4 md:w-1/4 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 pb-4 md:pb-0">
                  <img
                    src={review.book?.coverImage}
                    alt="Cover"
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2">
                      {review.book?.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Book ID: {review.book?._id.slice(-6)}
                    </p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {review.user?.photoURL ? (
                      <img
                        src={review.user.photoURL}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <FaUser className="text-gray-400" />
                    )}
                    <span className="text-sm font-semibold dark:text-gray-200">
                      {review.user?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({review.user?.email})
                    </span>
                  </div>

                  <div className="flex text-yellow-400 text-sm mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col justify-center gap-3 md:border-l border-gray-100 dark:border-gray-700 md:pl-6 pt-4 md:pt-0">
                  <button
                    onClick={() => handleAction(review._id, "approve")}
                    className="flex items-center justify-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-md transition font-medium text-sm"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(review._id, "reject")}
                    className="flex items-center justify-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-md transition font-medium text-sm"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
