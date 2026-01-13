"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Register() {
  const { createUser, updateUserProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photoURL =
      form.photoURL.value ||
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=100&q=80";

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      // ১. ফায়ারবেসে ইউজার তৈরি
      const result = await createUser(email, password);
      const user = result.user;

      // ২. প্রোফাইল আপডেট
      await updateUserProfile(name, photoURL);

      // ৩. মঙ্গোডিবিতে ডাটা সেভ
      const response = await fetch("/api/auth/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          photoURL,
          firebaseUid: user.uid,
        }),
      });

      if (!response.ok) throw new Error("Failed to save user to database");

      // ৪. সফল হলে সরাসরি লাইব্রেরি পেজে পাঠানো (নতুন ইউজার = সাধারণ ইউজার)
      toast.success("Registration successful! Welcome to BookWorm.");
      router.replace("/my-library");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full flex bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Library"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-600/40 mix-blend-multiply"></div>
          <div className="absolute bottom-10 left-10 text-white p-4">
            <h2 className="text-3xl font-bold mb-2">Join the Community</h2>
            <p className="text-lg">
              Track your reading journey and discover your next favorite book.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center md:text-left">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Photo URL (Optional)
              </label>
              <input
                name="photoURL"
                type="url"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
