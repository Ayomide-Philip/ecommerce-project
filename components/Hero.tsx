"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { img: "/images/dress.jpg", label: "Dresses" },
  { img: "/images/jacket.jpg", label: "Jackets" },
  { img: "/images/sneakers.jpg", label: "Sneakers" },
  { img: "/images/t-shirt.jpg", label: "T-Shirts" },
  { img: "/images/trousers.jpg", label: "Trousers" },
  { img: "/images/hoodie.jpg", label: "Hoodies" },
  { img: "/images/watch.jpg", label: "Accessories" },
];

const cardsPerView = { mobile: 1, tablet: 2, desktop: 5 };

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(cardsPerView.mobile);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(cardsPerView.desktop);
      } else if (window.innerWidth >= 640) {
        setVisibleCards(cardsPerView.tablet);
      } else {
        setVisibleCards(cardsPerView.mobile);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, slides.length - visibleCards);

  useEffect(() => {
    const autoAdvance = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(autoAdvance);
  }, [maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const carouselButtonClass =
    "glass inline-flex h-10 w-10 items-center justify-center rounded-full text-cloud/80 transition hover:bg-black/8 dark:text-cloud/85 dark:hover:bg-[rgba(244,244,242,0.08)] focus-visible:text-accent focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mt-24 sm:mt-26 lg:mt-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1/2 top-10 hidden h-72 w-72 -translate-x-1/2 bg-[radial-gradient(circle,rgba(61,107,255,0.08)_0%,rgba(11,11,13,0)_70%)] dark:block"
      />

      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        <div className="text-center space-y-4 sm:space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            New Arrivals, {new Date().getFullYear()}
          </p>
          <h1
            id="hero-heading"
            className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-medium leading-tight text-cloud"
          >
            Your Source for Trendsetting Fashion.
          </h1>
          <p className="mx-auto max-w-2xl text-black/70 dark:text-cloud/70">
            Whether you&apos;re looking for bold statements or timeless
            classics, our selection offers something for every fashion-forward
            individual. Stay stylish, stay ahead, and find your next favorite
            outfit here.
          </p>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cloud transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent"
            >
              New Collection
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex gap-4 sm:gap-5 lg:gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  style={{
                    width: `calc(100% / ${visibleCards})`,
                    flexShrink: 0,
                  }}
                  className="group aspect-4/5 rounded-4xl overflow-hidden glass border border-black/12 dark:border-[rgba(244,244,242,0.12)] shadow-lg transition hover:scale-105 hover:shadow-xl duration-300"
                >
                  <div className="relative h-full w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.img}
                      alt={slide.label}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 font-display text-lg font-medium text-white">
                      {slide.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 ${carouselButtonClass}`}
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 ${carouselButtonClass}`}
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 w-2 rounded-full transition ${
                  idx === currentIndex
                    ? "bg-accent w-6"
                    : "bg-cloud/40 hover:bg-cloud/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
