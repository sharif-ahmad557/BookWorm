"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image:
         "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      
      title: "Discover Your Next Favorite Book",
      subtitle:
        "Join our community and track your reading journey effortlessly.",
      buttonText: "Browse Books",
      link: "/books",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Build Your Digital Library",
      subtitle:
        "Organize books into shelves: Read, Currently Reading, and Want to Read.",
      buttonText: "Start Tracking",
      link: "/register",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Get Smart Recommendations",
      subtitle: "AI-powered suggestions based on your unique reading habits.",
      buttonText: "See Recommendations",
      link: "/books",
    },
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden bg-gray-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[10000ms]"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight animate-fade-in-up">
              {slide.title}
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl drop-shadow-md animate-fade-in-up animation-delay-200">
              {slide.subtitle}
            </p>
            <Link
              href={slide.link}
              className="group bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 animate-fade-in-up animation-delay-400"
            >
              {slide.buttonText}{" "}
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-all hover:scale-110 hidden md:block"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-all hover:scale-110 hidden md:block"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-yellow-500 w-8"
                : "bg-white/50 hover:bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
