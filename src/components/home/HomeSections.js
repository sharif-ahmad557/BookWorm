"use client";

import {
  FaRocket,
  FaRegLightbulb,
  FaTrophy,
  FaLaptopCode,
  FaQuoteLeft,
  FaQuestionCircle,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa";

// 1. Features
export const FeaturesSection = () => (
  <div className="py-24 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Everything You Need to{" "}
          <span className="text-blue-600">Read More</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          From tracking pages to setting yearly goals, we've built the ultimate
          toolkit for book lovers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Track Every Page",
            desc: "Update your progress in real-time. Mark books as reading, read, or want to read.",
            icon: <FaRocket />,
            color: "bg-orange-500",
            bg: "bg-orange-50 dark:bg-gray-800",
          },
          {
            title: "Smart Insights",
            desc: "Our AI analyzes your reading history to suggest books you'll actually love.",
            icon: <FaRegLightbulb />,
            color: "bg-blue-500",
            bg: "bg-blue-50 dark:bg-gray-800",
          },
          {
            title: "Reading Challenges",
            desc: "Set a yearly reading goal. Visualize your streaks and celebrate milestones.",
            icon: <FaTrophy />,
            color: "bg-purple-500",
            bg: "bg-purple-50 dark:bg-gray-800",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className={`relative p-8 rounded-3xl ${feature.bg} border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-150 duration-700">
              <div className="text-9xl text-gray-900 dark:text-white">
                {feature.icon}
              </div>
            </div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 ${feature.color} shadow-lg group-hover:rotate-12 transition-transform duration-300`}
            >
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed z-10 relative">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 2. NEW: Reading Sanctuary (Image Based Section)
export const ReadingSanctuary = () => (
  <div className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="relative grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              className="rounded-2xl shadow-2xl transform translate-y-8 hover:-translate-y-2 transition duration-500"
              alt="Reading in cafe"
            />
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              className="rounded-2xl shadow-2xl transform hover:-translate-y-2 transition duration-500"
              alt="Cozy reading"
            />
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-wider mb-4">
            <FaHeart /> For the love of books
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Find Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
              Moment of Calm
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            In a busy world, reading is our sanctuary. BookWorm helps you carve
            out time for stories that matter. Whether it's 5 minutes or 5 hours,
            every page counts towards your journey.
          </p>
          <div className="flex gap-8">
            <div>
              <h4 className="text-3xl font-bold text-gray-900 dark:text-white">
                50K+
              </h4>
              <p className="text-sm text-gray-500">Daily Readers</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-gray-900 dark:text-white">
                1M+
              </h4>
              <p className="text-sm text-gray-500">Books Logged</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 3. Trending Genres (Improved)
export const TrendingGenres = () => {
  const genres = [
    {
      name: "Sci-Fi",
      color: "from-blue-500 to-indigo-600",
      img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Romance",
      color: "from-pink-500 to-rose-600",
      img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Mystery",
      color: "from-slate-700 to-slate-900",
      img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Fantasy",
      color: "from-purple-500 to-violet-600",
      img: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white text-center">
          Trending Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {genres.map((g, i) => (
            <div
              key={i}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${g.img})` }}
              ></div>

              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${g.color} opacity-80 group-hover:opacity-70 transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <h3 className="text-2xl font-bold text-white tracking-wider transform group-hover:-translate-y-2 transition-transform duration-300">
                  {g.name}
                </h3>
                <div className="w-8 h-1 bg-white rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <p className="text-white text-sm mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Explore Now
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. How It Works
export const HowItWorks = () => (
  <div className="py-24 bg-white dark:bg-gray-800">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
        Your Reading Journey
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent -z-10"></div>
        {[
          {
            step: "01",
            title: "Join the Club",
            desc: "Create your free account in less than 30 seconds.",
          },
          {
            step: "02",
            title: "Build Shelves",
            desc: "Add books to Read, Currently Reading, or Want to Read.",
          },
          {
            step: "03",
            title: "Track & Grow",
            desc: "Log your daily reading and watch your stats improve.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="relative bg-white dark:bg-gray-800 p-6 text-center group pt-10"
          >
            <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 border-4 border-blue-100 dark:border-gray-700 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-sm group-hover:scale-110 group-hover:border-blue-500 transition-all duration-300 z-10 relative">
              {item.step}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {item.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 5. App Showcase
export const AppShowcase = () => (
  <div className="py-24 bg-gray-900 text-white overflow-hidden relative">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
      <div className="md:w-1/2">
        <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold mb-6 border border-blue-500/30">
          📱 Mobile Optimized
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Read Anywhere,
          <br /> Anytime.
        </h2>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Whether you're on a crowded train or in a quiet park, BookWorm syncs
          your library across all devices. Never lose your page again.
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition flex items-center gap-2">
            <FaLaptopCode /> Web App
          </button>
          <button className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
            Mobile View
          </button>
        </div>
      </div>
      <div className="md:w-1/2 relative">
        <div className="absolute inset-0 bg-blue-500 rounded-full filter blur-[100px] opacity-20 animate-pulse"></div>
        <img
          src="https://images.unsplash.com/photo-1519337265831-281ec6cc8514?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="App mockup"
          className="relative z-10 rounded-xl shadow-2xl border-4 border-gray-800 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500"
        />
      </div>
    </div>
  </div>
);

// 6. Testimonials
export const Testimonials = () => (
  <div className="py-24 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
        Community Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: "Sarah Jenkins",
            role: "Fiction Addict",
            img: "https://randomuser.me/api/portraits/women/44.jpg",
          },
          {
            name: "Michael Chen",
            role: "Sci-Fi Fan",
            img: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            name: "Emma Watson",
            role: "Daily Reader",
            img: "https://randomuser.me/api/portraits/women/68.jpg",
          },
        ].map((user, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative"
          >
            <FaQuoteLeft className="text-blue-100 dark:text-gray-700 text-6xl absolute top-6 right-6" />
            <p className="text-gray-600 dark:text-gray-300 italic mb-8 relative z-10">
              "This app completely changed my reading habits. I went from
              reading 5 books a year to over 50! The recommendations are spot
              on."
            </p>
            <div className="flex items-center gap-4">
              <img
                src={user.img}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 7. FAQ
export const FAQSection = () => (
  <div className="py-24 bg-white dark:bg-gray-800">
    <div className="max-w-3xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {[
          "Is BookWorm completely free to use?",
          "Can I import my data from Goodreads?",
          "How does the AI recommendation work?",
          "Is there a mobile app available?",
        ].map((q, idx) => (
          <div
            key={idx}
            className="group bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-transparent hover:border-blue-500/30 cursor-pointer transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {q}
              </h3>
              <FaQuestionCircle className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 8. CTA (PREMIUM REDESIGN)
export const CTASection = () => (
  <div className="relative py-32 overflow-hidden">
    {/* Background Image with Dark Overlay */}
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1507842217343-583bb7260b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        alt="Library Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-blue-900/80"></div>
    </div>

    <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
      <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
        Start Your Chapter One
      </h2>
      <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
        Join a community of 10,000+ readers who are discovering, tracking, and
        sharing their favorite books every day.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="relative w-full max-w-md">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-xl"
          />
        </div>
        <button className="px-10 py-4 bg-yellow-400 text-gray-900 rounded-full font-bold text-lg hover:bg-yellow-300 hover:scale-105 transition-all shadow-[0_0_20px_rgba(250,204,21,0.4)] flex items-center gap-2">
          Get Started <FaArrowRight />
        </button>
      </div>
      <p className="mt-6 text-sm text-gray-400">
        No credit card required. Free forever for readers.
      </p>
    </div>
  </div>
);
