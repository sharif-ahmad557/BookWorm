import Link from "next/link";

export default function Logo({ className = "", textSize = "text-2xl" }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      {/* Icon Part */}
      <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white"
        >
          {/* Book Pages */}
          <path
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Animated Worm/Dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900 shadow-sm animate-bounce"></div>
      </div>

      {/* Text Part */}
      <div className={`font-bold ${textSize} tracking-tight`}>
        <span className="text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
          Book
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Worm
        </span>
      </div>
    </Link>
  );
}
