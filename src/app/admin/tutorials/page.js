"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaTrash, FaYoutube, FaPlus } from "react-icons/fa";

export default function ManageTutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const res = await fetch("/api/tutorials");
      const data = await res.json();
      setTutorials(data);
    } catch (error) {
      toast.error("Failed to load tutorials");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Tutorial added successfully!");
        setFormData({ title: "", videoUrl: "", description: "" });
        fetchTutorials();
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Error adding tutorial");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/tutorials/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            Swal.fire("Deleted!", "Tutorial has been deleted.", "success");
            setTutorials(tutorials.filter((t) => t._id !== id));
          } else {
            const data = await res.json();
            toast.error(data.error || "Failed to delete");
          }
        } catch (error) {
          console.error(error);
          toast.error("Network error while deleting");
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3 animate-fade-in-down">
        <FaYoutube className="text-red-600" /> Manage Tutorials
      </h1>

      {/* Add Tutorial Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Add New Video
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Video Title
            </label>
            <input
              type="text"
              placeholder="e.g. How to Read More Books"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              YouTube URL
            </label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              required
              value={formData.videoUrl}
              onChange={(e) =>
                setFormData({ ...formData, videoUrl: e.target.value })
              }
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Description
            </label>
            <textarea
              placeholder="Short description..."
              rows="2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
            ></textarea>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transform active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Adding..."
              ) : (
                <>
                  <FaPlus /> Add Tutorial
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tutorials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((video) => (
          <div
            key={video._id}
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-red-500/30"
          >
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {video.description}
              </p>
              <button
                onClick={() => handleDelete(video._id)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaTrash /> Delete Video
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
