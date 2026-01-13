"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBook,
  FaArrowLeft,
  FaMagic,
} from "react-icons/fa";

export default function ManageBooks() {
  const [view, setView] = useState("list"); // 'list' or 'form'
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    coverImage: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/admin/books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch("/api/admin/genres");
      const data = await res.json();
      setGenres(data);
    } catch (error) {
      console.error("Genre fetch error", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCover = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const url = `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80&random=${randomId}`;

    const keywords = formData.title || "book";
    const finalUrl = `https://source.unsplash.com/300x450/?book,${
      keywords.split(" ")[0]
    }`;

    setFormData({
      ...formData,
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
    });
    toast.success("Random cover applied!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.genre) return toast.error("Please select a genre");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/books/${editingId}`
        : "/api/admin/books";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save book");

      toast.success(editingId ? "Book updated!" : "Book added successfully!");
      setView("list");
      setFormData({
        title: "",
        author: "",
        description: "",
        genre: "",
        coverImage: "",
      });
      setEditingId(null);
      fetchBooks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
        Swal.fire("Deleted!", "Book has been deleted.", "success");
        fetchBooks();
      }
    });
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      genre: book.genre?._id || "",
      coverImage: book.coverImage,
    });
    setEditingId(book._id);
    setView("form");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FaBook /> Manage Books
        </h1>
        {view === "list" && (
          <button
            onClick={() => setView("form")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition"
          >
            <FaPlus /> Add New Book
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                  <tr>
                    <th className="p-4">Cover</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Genre</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {books.map((book) => (
                    <tr
                      key={book._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="p-4">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded shadow"
                        />
                      </td>
                      <td className="p-4 font-medium text-gray-800 dark:text-white">
                        {book.title}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {book.author}
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                          {book.genre?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {books.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No books found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">
                {editingId ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={() => {
                  setView("list");
                  setEditingId(null);
                  setFormData({
                    title: "",
                    author: "",
                    description: "",
                    genre: "",
                    coverImage: "",
                  });
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                <FaArrowLeft /> Back to List
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Book Title
                  </label>
                  <input
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Author
                  </label>
                  <input
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Genre
                  </label>
                  <select
                    name="genre"
                    required
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Genre</option>
                    {genres.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cover Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="coverImage"
                      required
                      value={formData.coverImage}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={generateCover}
                      title="Get Random Unsplash Image"
                      className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      <FaMagic />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-lg transform active:scale-95 transition"
              >
                {editingId ? "Update Book" : "Publish Book"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
