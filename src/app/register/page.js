"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaBookOpen,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Register() {
  const { createUser, updateUserProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // পাসওয়ার্ড দেখার জন্য

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
      const result = await createUser(email, password);
      const user = result.user;

      await updateUserProfile(name, photoURL);

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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-10">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 m-4 bg-white/10 border border-white/20 rounded-3xl shadow-2xl backdrop-blur-lg"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg cursor-pointer"
          >
            <FaBookOpen className="text-3xl text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Join the Community
          </h2>
          <p className="text-blue-200 text-sm">
            Start your magical reading journey today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaUser className="text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input
              name="name"
              type="text"
              required
              placeholder="Full Name"
              className="w-full py-3.5 pl-12 pr-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-900/70 transition-all duration-300"
            />
          </div>

          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              className="w-full py-3.5 pl-12 pr-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-900/70 transition-all duration-300"
            />
          </div>

          {/* Password Input with Toggle */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              placeholder="Password (Min 6 chars)"
              className="w-full py-3.5 pl-12 pr-12 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-900/70 transition-all duration-300"
            />
            {/* Eye Icon Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Photo URL Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaCamera className="text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input
              name="photoURL"
              type="url"
              placeholder="Profile Photo URL (Optional)"
              className="w-full py-3.5 pl-12 pr-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-900/70 transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Creating Account...
              </span>
            ) : (
              "Register Now"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-gray-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
