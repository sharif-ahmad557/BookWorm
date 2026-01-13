"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const { signIn, googleSignIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // রোল অনুযায়ী রিডাইরেক্ট করার ফাংশন
  const handleNavigation = async (email) => {
    try {
      // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী API কল করা হচ্ছে
      const res = await fetch(`/api/user/users/${email}`);

      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await res.json();

      // রোল চেক করা হচ্ছে
      if (userData?.role === "admin") {
        router.replace("/admin/dashboard"); // বা /admin
        toast.success(`Welcome back, Admin!`);
      } else {
        router.replace("/my-library");
        toast.success("Login Successful!");
      }
    } catch (error) {
      console.error("Role checking error:", error);
      // যদি ডাটাবেস ফেচ ফেইল করে, ডিফল্ট হিসেবে লাইব্রেরিতে পাঠাবো
      router.replace("/my-library");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      setLoading(true);
      await signIn(email, password);
      // লগইন সফল হলে রোল চেক করে রিডাইরেক্ট
      await handleNavigation(email);
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await googleSignIn();
      const user = result.user;

      // গুগল লগইনের পর ডাটাবেসে ইউজার সেভ/আপডেট করা
      const saveRes = await fetch("/api/auth/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          firebaseUid: user.uid,
        }),
      });

      if (saveRes.ok) {
        // সেভ হওয়ার পর রোল চেক করে রিডাইরেক্ট
        await handleNavigation(user.email);
      } else {
        throw new Error("Database sync failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full flex bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden md:block w-1/2 relative order-2">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Reading"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-purple-600/40 mix-blend-multiply"></div>
          <div className="absolute bottom-10 right-10 text-white p-4 text-right">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-lg">
              Pick up where you left off in your reading adventure.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 order-1">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center md:text-left">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <FaGoogle className="text-red-500" />
                Google
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
