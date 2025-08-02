import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  StarIcon
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
  className = '' 
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
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
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
            className="flex flex-col md:flex-row items-center md:items-start gap-8"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg"
                />
                {currentTestimonial.featured && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg">
                    <StarIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              {/* Quote */}
              <div className="relative mb-6">
                <svg 
                  className="absolute -top-4 -left-4 w-8 h-8 text-primary-200 dark:text-primary-800" 
                  fill="currentColor" 
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2H8c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2h-2c0-2.2 1.8-4 4-4V8z"/>
                </svg>
                <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{currentTestimonial.content}"
                </blockquote>
              </div>

              {/* Rating */}
              <div className="flex justify-center md:justify-start mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < currentTestimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Author Info */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
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
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Previous/Next Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 group"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-primary-600 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
          aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {isPlaying && (
        <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
          <motion.div
            className="bg-primary-600 h-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: interval / 1000, ease: "linear" }}
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
