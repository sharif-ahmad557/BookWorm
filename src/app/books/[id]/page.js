"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaBookOpen, FaStar, FaPenNib, FaList } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentShelf, setCurrentShelf] = useState("");
  const [updating, setUpdating] = useState(false);

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
      toast.error("Please login to add books to your library");
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

      if (!res.ok) throw new Error("Failed to update shelf");

      setCurrentShelf(newShelf);
      toast.success(
        `Book moved to ${newShelf.replace(/([A-Z])/g, " $1").trim()} shelf!`
      );
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!book)
    return (
      <div className="text-center py-20 text-2xl text-gray-500">
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
            {/* Cover Image */}
            <div className="md:w-1/3 p-8 bg-gray-100 dark:bg-gray-700/50 flex justify-center items-start">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-64 rounded-lg shadow-2xl object-cover"
              />
            </div>

            {/* Details */}
            <div className="md:w-2/3 p-8 md:p-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {book.genre?.name}
                </span>
                <div className="flex items-center text-yellow-400 text-sm font-bold gap-1">
                  <FaStar />
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

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <select
                    value={currentShelf}
                    onChange={handleShelfChange}
                    disabled={updating}
                    className={`appearance-none w-full md:w-auto px-6 py-3 pr-10 rounded-lg font-medium shadow-md outline-none cursor-pointer transition text-white
                        ${
                          currentShelf
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }
                        ${updating ? "opacity-70 cursor-wait" : ""}`}
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
                  {/* Dropdown Arrow Fix */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                <button className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2">
                  <FaBookOpen /> Preview
                </button>
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
      </div>
    </div>
  );
}
