"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import {
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserShield,
  FaSignInAlt,
  FaUserPlus,
  FaChevronDown,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const profileRef = useRef(null);
  const joinRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    if (user?.email) {
      fetch(`/api/users/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.role === "admin") setIsAdmin(true);
          else setIsAdmin(false);
        })
        .catch((err) => console.error("Role fetch error:", err));
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (joinRef.current && !joinRef.current.contains(event.target)) {
        setIsJoinOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      setIsProfileOpen(false);
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  const navLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Browse Books", path: "/books" },
    ...(user ? [{ name: "My Library", path: "/my-library" }] : []),
    ...(user ? [{ name: "Tutorials", path: "/tutorials" }] : []),
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <Link href="/home" className="flex items-center gap-2">
            <img src="/Logo.png" alt="Logo" className="h-24 w-30" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative font-medium transition group py-2 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {link.name}
                  </span>
                  {/* Active Indicator Line */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:rotate-12 text-gray-600 dark:text-gray-300"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400 text-xl" />
              ) : (
                <FaMoon className="text-gray-600 text-xl" />
              )}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover group-hover:border-blue-500 transition-all shadow-sm"
                    />
                  ) : (
                    <FaUserCircle className="text-4xl text-gray-400 group-hover:text-blue-500 transition" />
                  )}
                  <FaChevronDown
                    className={`text-xs text-gray-500 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 py-2 transform origin-top-right transition-all animate-fade-in-up z-50">
                    <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-2">
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          <FaUserShield className="text-purple-500" /> Admin
                          Panel
                        </Link>
                      )}

                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <FaTachometerAlt className="text-blue-500" /> Dashboard
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Join Now Button & Dropdown
              <div className="relative" ref={joinRef}>
                <button
                  onClick={() => setIsJoinOpen(!isJoinOpen)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Join Now{" "}
                  <FaChevronDown
                    className={`text-xs transition-transform duration-200 ${
                      isJoinOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isJoinOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 py-2 transform origin-top-right transition-all animate-fade-in-up z-50">
                    <Link
                      href="/login"
                      onClick={() => setIsJoinOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                    >
                      <FaSignInAlt className="text-blue-500" /> Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsJoinOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-colors"
                    >
                      <FaUserPlus className="text-green-500" /> Register
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 focus:outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 animate-slide-in-top shadow-inner">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="block px-4 py-3 rounded-lg text-base font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={() => setIsOpen(false)}
              >
                Admin Panel
              </Link>
            )}

            {!user ? (
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <FaSignInAlt /> Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md"
                >
                  <FaUserPlus /> Register
                </Link>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <FaTachometerAlt /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
