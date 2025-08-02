import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  StarIcon,
} from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  featured?: boolean;
}

interface Props {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const TestimonialCarousel: React.FC<Props> = ({
  testimonials,
  autoPlay = true,
  interval = 5000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [direction, setDirection] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, testimonials.length, interval]);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Testimonial Display */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800 md:p-12">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                handleNext();
              } else if (swipe > swipeConfidenceThreshold) {
                handlePrevious();
              }
            }}
            className="flex flex-col items-center gap-8 md:flex-row md:items-start"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="h-24 w-24 rounded-full object-cover shadow-lg md:h-32 md:w-32"
                />
                {currentTestimonial.featured && (
                  <div className="absolute -right-2 -top-2 rounded-full bg-yellow-400 p-2 text-yellow-900 shadow-lg">
                    <StarIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              {/* Quote */}
              <div className="relative mb-6">
                <svg
                  className="text-primary-200 dark:text-primary-800 absolute -left-4 -top-4 h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2H8c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2h-2c0-2.2 1.8-4 4-4V8z" />
                </svg>
                <blockquote className="text-lg italic leading-relaxed text-gray-700 dark:text-gray-300 md:text-xl">
                  "{currentTestimonial.content}"
                </blockquote>
              </div>

              {/* Rating */}
              <div className="mb-4 flex justify-center md:justify-start">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < currentTestimonial.rating
                        ? 'fill-current text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Author Info */}
              <div>
                <h4 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                  {currentTestimonial.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentTestimonial.role} at {currentTestimonial.company}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 flex items-center justify-between">
        {/* Previous/Next Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            className="group rounded-full border border-gray-200 bg-white p-3 shadow-md transition-all duration-200 hover:bg-gray-50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="group-hover:text-primary-600 dark:group-hover:text-primary-400 h-5 w-5 text-gray-600 transition-colors duration-200 dark:text-gray-400" />
          </button>
          <button
            onClick={handleNext}
            className="group rounded-full border border-gray-200 bg-white p-3 shadow-md transition-all duration-200 hover:bg-gray-50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="group-hover:text-primary-600 dark:group-hover:text-primary-400 h-5 w-5 text-gray-600 transition-colors duration-200 dark:text-gray-400" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-3 w-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-primary-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="bg-primary-600 hover:bg-primary-700 group rounded-full p-3 text-white shadow-md transition-all duration-200 hover:shadow-lg"
          aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
        >
          {isPlaying ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {isPlaying && (
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="bg-primary-600 h-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: interval / 1000, ease: 'linear' }}
            key={`${currentIndex}-${isPlaying}`}
          />
        </div>
      )}

      {/* Testimonial Counter */}
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {currentIndex + 1} of {testimonials.length}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
