"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaTags } from "react-icons/fa";

export default function ManageGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchGenres = async () => {
    try {
      const res = await fetch("/api/admin/genres");
      const data = await res.json();
      setGenres(data);
    } catch (error) {
      toast.error("Failed to load genres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/genres/${editingId}`
        : "/api/admin/genres";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success(editingId ? "Genre updated!" : "Genre added!");
      setName("");
      setEditingId(null);
      fetchGenres();
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
        try {
          const res = await fetch(`/api/admin/genres/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            Swal.fire("Deleted!", "Genre has been deleted.", "success");
            fetchGenres();
          }
        } catch (error) {
          toast.error("Failed to delete");
        }
      }
    });
  };

  const handleEdit = (genre) => {
    setName(genre.name);
    setEditingId(genre._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <FaTags className="text-3xl text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Manage Genres
        </h1>
      </div>

      {/* Form Section */}
      <motion.form
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 flex gap-4 items-end"
      >
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Genre Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Science Fiction"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
          />
        </div>
        <button
          type="submit"
          className={`px-6 py-2 rounded-md font-medium text-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
            editingId
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editingId ? <FaEdit /> : <FaPlus />}
          {editingId ? "Update Genre" : "Add Genre"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setName("");
              setEditingId(null);
            }}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all"
          >
            Cancel
          </button>
        )}
      </motion.form>

      {/* List Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading genres...</div>
        ) : (
          <div className="grid grid-cols-1 divide-y dark:divide-gray-700">
            <AnimatePresence>
              {genres.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No genres found. Add some!
                </div>
              )}
              {genres.map((genre) => (
                <motion.div
                  key={genre._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                  className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">
                      {genre.name}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      /{genre.slug}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(genre)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(genre._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
