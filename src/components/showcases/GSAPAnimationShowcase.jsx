// GSAP Animation Showcase - SSR Safe and Performance Optimized
import { useEffect, useRef, useState } from 'react';

const GSAPAnimationShowcase = () => {
  const containerRef = useRef(null);
  const boxesRef = useRef([]);
  const titleRef = useRef(null);
  const [currentAnimation, setCurrentAnimation] = useState('none');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [gsap, setGsap] = useState(null);

  const colors = [
    '#3B82F6',
    '#10B981',
    '#8B5CF6',
    '#EF4444',
    '#F59E0B',
    '#EC4899',
  ];

  // SSR-safe mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dynamic GSAP import for SSR safety
  useEffect(() => {
    if (!isMounted) return;

    const loadGSAP = async () => {
      try {
        const gsapModule = await import('gsap');
        setGsap(gsapModule.gsap);
      } catch (error) {
        console.error('Failed to load GSAP:', error);
      }
    };

    loadGSAP();
  }, [isMounted]);

  // Use GSAP context for safe and automatic cleanup
  useEffect(() => {
    if (!gsap || !isMounted) return;

    const ctx = gsap.context(() => {
      // Set initial states for all elements
      gsap.set(boxesRef.current, {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        borderRadius: '8px',
      });
      // Set initial background colors using a function
      boxesRef.current.forEach((box, index) => {
        if (box) {
          gsap.set(box, { backgroundColor: colors[index % colors.length] });
        }
      });
      if (titleRef.current) {
        gsap.set(titleRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          color: '#374151',
        });
      }
    }, containerRef);

    return () => ctx.revert(); // Cleanup GSAP animations on component unmount
  }, [gsap, isMounted]);

  const onAnimationComplete = () => {
    setIsAnimating(false);
    setCurrentAnimation('none');
  };

  const createMasterTimeline = () => {
    const tl = gsap.timeline({ onComplete: onAnimationComplete });
    return tl;
  };

  const animations = {
    stagger: () => {
      const tl = createMasterTimeline();
      tl.from(boxesRef.current, {
        opacity: 0,
        y: 80,
        rotation: -90,
        scale: 0.2,
        duration: 0.8,
        stagger: 0.08,
        ease: 'back.out(1.7)',
      });
    },
    wave: () => {
      const tl = createMasterTimeline();
      tl.fromTo(
        boxesRef.current,
        { y: 0 },
        {
          y: -35,
          duration: 0.7,
          stagger: {
            each: 0.1,
            from: 'center',
            grid: 'auto',
          },
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        }
      );
    },
    spiral: () => {
      const tl = createMasterTimeline();
      tl.to(boxesRef.current, {
        rotation: (i) => (i % 2 === 0 ? 360 : -360) * 2.5,
        scale: 1.2,
        x: (i) => Math.cos(i * 0.8) * 90,
        y: (i) => Math.sin(i * 0.8) * 90,
        duration: 2.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
      });
    },
    morphing: () => {
      const tl = createMasterTimeline();
      tl.to(boxesRef.current, {
        borderRadius: '50%',
        backgroundColor: '#10B981',
        scale: 1.2,
        duration: 0.5,
        stagger: 0.05,
      })
        .to(boxesRef.current, {
          borderRadius: '10px',
          backgroundColor: '#8B5CF6',
          scale: 0.8,
          duration: 0.5,
          stagger: 0.05,
        })
        .to(boxesRef.current, {
          borderRadius: '8px',
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          // Animate back to original colors
          backgroundColor: (i) => colors[i % colors.length],
        });
    },
    physics: () => {
      const tl = createMasterTimeline();
      boxesRef.current.forEach((box) => {
        tl.to(
          box,
          {
            y: -250,
            x: (Math.random() - 0.5) * 350,
            rotation: Math.random() * 480,
            duration: 1.2,
            ease: 'power2.out',
          },
          0
        ); // Start all at the same time
        tl.to(
          box,
          {
            y: 0,
            x: 0,
            rotation: 0,
            duration: 1.2,
            ease: 'bounce.out',
          },
          '>-0.2'
        ); // Stagger the return
      });
    },
    text: () => {
      const tl = createMasterTimeline();
      tl.to(titleRef.current, {
        scale: 1.25,
        color: '#10B981',
        duration: 0.4,
        ease: 'power2.out',
      })
        .to(titleRef.current, {
          rotationX: 360,
          duration: 0.8,
          ease: 'power2.inOut',
        })
        .to(titleRef.current, {
          scale: 1,
          color: '#374151',
          duration: 0.4,
          ease: 'power2.inOut',
        });
    },
  };

  const resetAllElements = (onCompleteCallback) => {
    gsap.killTweensOf(boxesRef.current);
    gsap.killTweensOf(titleRef.current);

    const tl = gsap.timeline({ onComplete: onCompleteCallback });

    tl.to(
      boxesRef.current,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        borderRadius: '8px',
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: 0.03,
        // Ensure colors are reset correctly
        backgroundColor: (i) => colors[i % colors.length],
      },
      0
    );

    tl.to(
      titleRef.current,
      {
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        color: '#374151',
        duration: 0.6,
        ease: 'power2.inOut',
      },
      0
    );
  };

  const runAnimation = (type) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentAnimation(type);

    resetAllElements(() => {
      if (animations[type]) {
        animations[type]();
      } else {
        onAnimationComplete();
      }
    });
  };

  const handleReset = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentAnimation('reset');
    resetAllElements(onAnimationComplete);
  };

  const animationButtons = [
    { key: 'stagger', label: 'Stagger In', color: 'bg-blue-500' },
    { key: 'wave', label: 'Wave', color: 'bg-green-500' },
    { key: 'spiral', label: 'Spiral', color: 'bg-purple-500' },
    { key: 'morphing', label: 'Morphing', color: 'bg-pink-500' },
    { key: 'physics', label: 'Physics', color: 'bg-orange-500' },
    { key: 'text', label: 'Text Animation', color: 'bg-indigo-500' },
  ];

  return (
    <div
      ref={containerRef}
      className='w-full rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-2xl dark:from-gray-800 dark:to-gray-900'
    >
      <div className='mb-8 text-center'>
        <h3
          ref={titleRef}
          className='mb-2 text-3xl font-bold text-gray-800 dark:text-white'
        >
          GSAP Animation Studio
        </h3>
        <p className='text-gray-600 dark:text-gray-300'>
          Professional animations with GreenSock Animation Platform
        </p>
      </div>

      {/* Animation Controls */}
      <div className='mb-8 flex flex-wrap justify-center gap-3'>
        {animationButtons.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => runAnimation(key)}
            disabled={isAnimating}
            className={`px-4 py-2 ${color} rounded-lg text-sm font-medium text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {label}
          </button>
        ))}
        <button
          key='reset'
          onClick={handleReset}
          disabled={isAnimating}
          className='rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50'
        >
          Reset
        </button>
      </div>

      {/* Animation Stage */}
      <div className='relative mb-6 h-96 overflow-hidden rounded-lg bg-white shadow-inner dark:bg-gray-700'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='grid grid-cols-6 gap-4'>
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                ref={(el) => (boxesRef.current[index] = el)}
                className='h-12 w-12 rounded-lg shadow-lg'
                style={{
                  opacity: 0, // Initially hidden, revealed by useEffect
                }}
              />
            ))}
          </div>
        </div>
        {/* Stage indicators */}
        <div className='absolute left-4 top-4'>
          <div className='rounded-lg bg-black bg-opacity-20 px-3 py-1 backdrop-blur-sm'>
            <span className='font-mono text-sm text-white'>
              Animation Stage
            </span>
          </div>
        </div>
        `
        <div className='absolute bottom-4 right-4'>
          `` ``
          <div className='rounded-lg bg-black bg-opacity-20 px-3 py-1 backdrop-blur-sm'>
            `` ```
            <span className='font-mono text-sm text-white'>
              `` `````
              {isAnimating ? `Running: ${currentAnimation}` : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
        {[
          { icon: '⚡', title: 'High Performance', desc: '60fps animations' },
          {
            icon: '🎬',
            title: 'Timeline Control',
            desc: 'Sequence animations',
          },
          { icon: '🔄', title: 'Advanced Easing', desc: 'Custom ease curves' },
          {
            icon: '🎯',
            title: 'Precise Control',
            desc: 'Pixel-perfect timing',
          },
        ].map((feature, index) => (
          <div
            key={index}
            className='rounded-lg bg-white p-4 text-center shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800'
          >
            <div className='mb-2 text-2xl'>{feature.icon}</div>
            <h4 className='mb-1 text-sm font-semibold text-gray-800 dark:text-white'>
              {feature.title}
            </h4>
            <p className='text-xs text-gray-600 dark:text-gray-400'>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Code Example */}
      <div className='rounded-lg bg-gray-900 p-4'>
        <div className='font-mono text-sm text-green-400'>
          `<span className='text-gray-500'>// GSAP Animation Example</span>``
          <br />`<span className='text-blue-400'>gsap</span>.````
          <span className='text-yellow-400'>to</span>`````
          <span className='text-white'>(elements, {`{`}</span>
          <br />
          <span className='ml-4 text-purple-400'>y</span>
          <span className='text-white'>: -35,</span>
          <br />
          <span className='ml-4 text-purple-400'>duration</span>
          <span className='text-white'>: 0.7,</span>
          <br />
          <span className='ml-4 text-purple-400'>stagger</span>
          <span className='text-white'>: 0.1,</span>
          <br />`<span className='ml-4 text-purple-400'>ease</span>``
          <span className='text-white'>: </span>```
          <span className='text-green-300'>"back.out(1.7)"</span>```
          <br />
          `` `````
          <span className='text-white'>{`});`}</span>
        </div>
      </div>

      <div className='mt-4 text-center text-sm text-gray-500 dark:text-gray-400'>
        Industry-standard animations • Used by major brands • Optimized
        performance
      </div>
    </div>
  );
};
export default GSAPAnimationShowcase;
