"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
  FaBookOpen,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const usefulLinks = [
    { name: "Home", path: "/" },
    { name: "Browse Books", path: "/books" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "About Us", path: "#" }, // Placeholder
    { name: "Contact", path: "#" }, // Placeholder
  ];

  const helpLinks = [
    { name: "FAQ", path: "#" },
    { name: "Privacy Policy", path: "#" },
    { name: "Terms of Service", path: "#" },
    { name: "Support Center", path: "#" },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-900 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* 1. Brand Info */}
          <div className="space-y-6">
            <Link
              href="/"
              className="text-3xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <FaBookOpen className="text-blue-600" /> BookWorm
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Your personal digital library. Track your reading journey,
              discover new worlds, and join a community of book lovers.
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { icon: <FaFacebookF />, url: "#" },
                { icon: <FaTwitter />, url: "#" },
                { icon: <FaInstagram />, url: "#" },
                { icon: <FaLinkedinIn />, url: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {usefulLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.path}
                    className="group flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    <FaArrowRight className="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-500" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Help & Support */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-purple-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {helpLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.path}
                    className="group flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                  >
                    <FaArrowRight className="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-purple-500" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-yellow-500 rounded-full"></span>
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-gray-800 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    Address
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    123 Library Avenue, Booktown,
                    <br />
                    NY 10012, United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-gray-800 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    Email
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    support@bookworm.app
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-gray-800 text-yellow-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 transition-colors">
                    Phone
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear}{" "}
            <span className="font-bold text-blue-600">BookWorm</span>. All
            rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Terms of Use
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
