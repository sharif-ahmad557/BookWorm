"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaStar,
  FaPenNib,
  FaList,
  FaUserCircle,
  FaBookmark,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function BookDetails() {
  const params = useParams();
  const id = params?.id;

  const { user } = useAuth();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentShelf, setCurrentShelf] = useState("");
  const [updating, setUpdating] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const bookRes = await fetch(`/api/books/${id}`);
        if (!bookRes.ok) throw new Error("Book not found");
        const bookData = await bookRes.json();
        setBook(bookData);

        const reviewsRes = await fetch(`/api/reviews?bookId=${id}`);
        const reviewsData = await reviewsRes.json();
        if (Array.isArray(reviewsData)) {
          setReviews(reviewsData);
        } else {
          setReviews([]);
        }

        if (user?.email) {
          const shelfRes = await fetch(
            `/api/user/library?email=${user.email}&bookId=${id}`
          );
          if (shelfRes.ok) {
            const shelfData = await shelfRes.json();
            setCurrentShelf(shelfData.shelf || "");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]); 

  const handleShelfChange = async (e) => {
    const newShelf = e.target.value;
    if (!user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch("/api/user/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          bookId: id,
          shelf: newShelf,
        }),
      });
      if (!res.ok) throw new Error();
      setCurrentShelf(newShelf);
      toast.success("Shelf updated!");
    } catch (error) {
      toast.error("Failed to update shelf");
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to write a review");
      router.push("/login");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: id,
          userEmail: user.email,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      toast.success("Review submitted! Waiting for admin approval.");
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );

  if (!book)
    return (
      <div className="text-center py-20 text-2xl dark:text-white">
        Book not found 😕
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-8 bg-gray-100 dark:bg-gray-700/50 flex justify-center items-start">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-64 rounded-lg shadow-2xl object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:w-2/3 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {book.genre?.name || "Fiction"}
                </span>
                <div className="flex items-center text-yellow-400 text-sm font-bold gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
                  <FaStar />{" "}
                  <span>
                    {book.averageRating > 0
                      ? book.averageRating.toFixed(1)
                      : "New"}
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
                {book.title}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 flex items-center gap-2">
                <span className="opacity-70">by</span>{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {book.author}
                </span>
              </p>

              {/* Shelf Selection */}
              <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="relative group">
                  <select
                    value={currentShelf}
                    onChange={handleShelfChange}
                    disabled={updating}
                    className={`appearance-none px-8 py-3 pr-12 rounded-xl font-bold shadow-lg outline-none cursor-pointer transition-all transform active:scale-95 w-full md:w-auto text-white border-2 border-transparent hover:border-white/20 ${
                      currentShelf
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <option
                      value=""
                      disabled
                      className="bg-white text-gray-900"
                    >
                      {updating ? "Updating..." : "➕ Add to Library"}
                    </option>
                    <option
                      value="wantToRead"
                      className="bg-white text-gray-900"
                    >
                      📅 Want to Read
                    </option>
                    <option
                      value="currentlyReading"
                      className="bg-white text-gray-900"
                    >
                      📖 Currently Reading
                    </option>
                    <option value="read" className="bg-white text-gray-900">
                      ✅ Read
                    </option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                    <FaBookmark />
                  </div>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaList className="text-blue-500" /> Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                  {book.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Review Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Review List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              Community Reviews{" "}
              <span className="bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded-full">
                {reviews.length}
              </span>
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 italic">
                    No reviews yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {review.userPhoto ? (
                          <img
                            src={review.userPhoto}
                            alt="user"
                            className="w-10 h-10 rounded-full border-2 border-blue-100"
                          />
                        ) : (
                          <FaUserCircle className="text-3xl text-gray-400" />
                        )}
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">
                            {review.userName || "BookWorm User"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Verified Reader
                          </p>
                        </div>
                      </div>
                      <div className="flex bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Write Review Form */}
          <div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl sticky top-24 border border-blue-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <FaPenNib className="text-blue-600" /> Write a Review
              </h2>
              {user ? (
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Your Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
                            star <= rating
                              ? "text-yellow-400 drop-shadow-sm"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Your Thoughts
                    </label>
                    <textarea
                      required
                      rows="5"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like or dislike? Who would you recommend this to?"
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {submittingReview ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle /> Submit Review
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 text-2xl">
                    <FaUserCircle />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Join the conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Log in to rate this book and share your opinion with the
                    community.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform hover:-translate-y-1"
                  >
                    Login Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
