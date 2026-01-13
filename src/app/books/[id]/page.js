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
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]); // রিভিউ স্টেট
  const [loading, setLoading] = useState(true);
  const [currentShelf, setCurrentShelf] = useState("");
  const [updating, setUpdating] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookRes = await fetch(`/api/books/${id}`);
        if (!bookRes.ok) throw new Error("Book not found");
        const bookData = await bookRes.json();
        setBook(bookData);

        if (user) {
          const shelfRes = await fetch(
            `/api/user/library?email=${user.email}&bookId=${id}`
          );
          const shelfData = await shelfRes.json();
          setCurrentShelf(shelfData.shelf || "");
        }

        const reviewsRes = await fetch(`/api/reviews?bookId=${id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  if (!book)
    return <div className="text-center py-20 text-2xl">Book not found 😕</div>;

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
                className="w-64 rounded-lg shadow-2xl object-cover"
              />
            </div>
            <div className="md:w-2/3 p-8 md:p-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {book.genre?.name}
                </span>
                <div className="flex items-center text-yellow-400 text-sm font-bold gap-1">
                  <FaStar />{" "}
                  <span>
                    {book.averageRating > 0
                      ? book.averageRating.toFixed(1)
                      : "New"}
                  </span>
                </div>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 flex items-center gap-2">
                <FaPenNib className="text-sm" /> {book.author}
              </p>

              <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <select
                    value={currentShelf}
                    onChange={handleShelfChange}
                    disabled={updating}
                    className={`appearance-none px-6 py-3 pr-10 rounded-lg font-medium shadow-md outline-none cursor-pointer transition text-white w-full md:w-auto ${
                      currentShelf ? "bg-green-600" : "bg-blue-600"
                    }`}
                  >
                    <option value="" disabled>
                      ➕ Add to Library
                    </option>
                    <option value="wantToRead">📅 Want to Read</option>
                    <option value="currentlyReading">
                      📖 Currently Reading
                    </option>
                    <option value="read">✅ Read</option>
                  </select>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaList className="text-blue-500" /> Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Review Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Review List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Community Reviews ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 italic">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-blue-500"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {review.user?.photoURL ? (
                        <img
                          src={review.user.photoURL}
                          alt="user"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <FaUserCircle className="text-2xl text-gray-400" />
                      )}
                      <div>
                        <p className="font-bold text-sm dark:text-white">
                          {review.user?.name || "Unknown User"}
                        </p>
                        <div className="flex text-yellow-400 text-xs">
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
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Write Review Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Write a Review
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              {user ? (
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-transform hover:scale-110 ${
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Review
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you think of this book?"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please login to write a review.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
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
