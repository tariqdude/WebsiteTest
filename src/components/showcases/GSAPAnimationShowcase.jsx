// GSAP Animation Showcase
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const GSAPAnimationShowcase = () => {
  const containerRef = useRef(null);
  const boxesRef = useRef([]);
  const titleRef = useRef(null);
  const [currentAnimation, setCurrentAnimation] = useState('none');

  useEffect(() => {
    // Initialize GSAP timeline
    const tl = gsap.timeline({ paused: true });
    
    // Set initial states
    gsap.set(boxesRef.current, { opacity: 0, y: 50, rotation: 0, scale: 1 });
    gsap.set(titleRef.current, { opacity: 1, y: 0 });

    return () => {
      tl.kill();
    };
  }, []);

  const animations = {
    stagger: () => {
      gsap.fromTo(
        boxesRef.current,
        { 
          opacity: 0, 
          y: 100, 
          rotation: -180,
          scale: 0 
        },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    },

    wave: () => {
      gsap.to(boxesRef.current, {
        y: -30,
        duration: 0.6,
        stagger: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    },

    spiral: () => {
      boxesRef.current.forEach((box, index) => {
        gsap.to(box, {
          rotation: 360 * 3,
          scale: 1.5,
          x: Math.cos(index * 0.5) * 100,
          y: Math.sin(index * 0.5) * 100,
          duration: 2,
          ease: "power2.inOut",
          delay: index * 0.1
        });
      });
    },

    morphing: () => {
      const tl = gsap.timeline();
      
      tl.to(boxesRef.current, {
        borderRadius: "50%",
        backgroundColor: "#10B981",
        scale: 1.2,
        duration: 0.5,
        stagger: 0.05
      })
      .to(boxesRef.current, {
        borderRadius: "10px",
        backgroundColor: "#8B5CF6",
        scale: 0.8,
        duration: 0.5,
        stagger: 0.05
      })
      .to(boxesRef.current, {
        borderRadius: "0px",
        backgroundColor: "#EF4444",
        scale: 1,
        duration: 0.5,
        stagger: 0.05
      });
    },

    physics: () => {
      boxesRef.current.forEach((box, index) => {
        gsap.to(box, {
          y: -200 - (Math.random() * 100),
          x: (Math.random() - 0.5) * 400,
          rotation: Math.random() * 720,
          duration: 1.5,
          ease: "power2.out"
        });
        
        gsap.to(box, {
          y: 0,
          duration: 1.5,
          delay: 1.5,
          ease: "bounce.out"
        });
      });
    },

    text: () => {
      const tl = gsap.timeline();
      
      tl.to(titleRef.current, {
        scale: 1.2,
        color: "#10B981",
        duration: 0.5,
        ease: "power2.out"
      })
      .to(titleRef.current, {
        rotationY: 180,
        duration: 0.8,
        ease: "power2.inOut"
      })
      .to(titleRef.current, {
        rotationY: 360,
        scale: 1,
        color: "#374151",
        duration: 0.8,
        ease: "power2.inOut"
      });
    },

    reset: () => {
      gsap.to(boxesRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        borderRadius: "8px",
        backgroundColor: "#3B82F6",
        duration: 0.8,
        ease: "power2.inOut"
      });
      
      gsap.to(titleRef.current, {
        scale: 1,
        rotationY: 0,
        color: "#374151",
        duration: 0.8,
        ease: "power2.inOut"
      });
    }
  };

  const runAnimation = (type) => {
    setCurrentAnimation(type);
    if (animations[type]) {
      animations[type]();
    }
  };

  const colors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#EC4899'
  ];

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl p-6">
      <div className="text-center mb-8">
        <h3 
          ref={titleRef}
          className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
        >
          GSAP Animation Studio
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Professional animations with GreenSock Animation Platform
        </p>
      </div>

      {/* Animation Controls */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          { key: 'stagger', label: 'Stagger In', color: 'bg-blue-500' },
          { key: 'wave', label: 'Wave', color: 'bg-green-500' },
          { key: 'spiral', label: 'Spiral', color: 'bg-purple-500' },
          { key: 'morphing', label: 'Morphing', color: 'bg-pink-500' },
          { key: 'physics', label: 'Physics', color: 'bg-orange-500' },
          { key: 'text', label: 'Text Animation', color: 'bg-indigo-500' },
          { key: 'reset', label: 'Reset', color: 'bg-gray-500' }
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => runAnimation(key)}
            disabled={currentAnimation === key}
            className={`px-4 py-2 ${color} text-white rounded-lg hover:opacity-80 transition-opacity duration-200 disabled:opacity-50 text-sm font-medium`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Animation Stage */}
      <div 
        ref={containerRef}
        className="relative h-96 bg-white dark:bg-gray-700 rounded-lg shadow-inner overflow-hidden mb-6"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                ref={el => boxesRef.current[index] = el}
                className="w-12 h-12 rounded-lg shadow-lg"
                style={{ 
                  backgroundColor: colors[index % colors.length],
                  opacity: 0
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Stage indicators */}
        <div className="absolute top-4 left-4">
          <div className="bg-black bg-opacity-20 rounded-lg px-3 py-1">
            <span className="text-sm font-mono text-white">
              Animation Stage
            </span>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4">
          <div className="bg-black bg-opacity-20 rounded-lg px-3 py-1">
            <span className="text-sm font-mono text-white">
              {currentAnimation !== 'none' ? `Running: ${currentAnimation}` : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: '⚡', title: 'High Performance', desc: '60fps animations' },
          { icon: '🎬', title: 'Timeline Control', desc: 'Sequence animations' },
          { icon: '🔄', title: 'Advanced Easing', desc: 'Custom ease curves' },
          { icon: '🎯', title: 'Precise Control', desc: 'Pixel-perfect timing' }
        ].map((feature, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl mb-2">{feature.icon}</div>
            <h4 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
              {feature.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-green-400 font-mono text-sm">
          <span className="text-gray-500">// GSAP Animation Example</span>
          <br />
          <span className="text-blue-400">gsap</span>.
          <span className="text-yellow-400">to</span>
          <span className="text-white">(elements, {`{`}</span>
          <br />
          <span className="ml-4 text-purple-400">y</span>
          <span className="text-white">: -30,</span>
          <br />
          <span className="ml-4 text-purple-400">duration</span>
          <span className="text-white">: 0.6,</span>
          <br />
          <span className="ml-4 text-purple-400">stagger</span>
          <span className="text-white">: 0.1,</span>
          <br />
          <span className="ml-4 text-purple-400">ease</span>
          <span className="text-white">: </span>
          <span className="text-green-300">"back.out(1.7)"</span>
          <br />
          <span className="text-white">{`});`}</span>
        </div>
      </div>

      <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        Industry-standard animations • Used by major brands • Optimized performance
      </div>
    </div>
  );
};

export default GSAPAnimationShowcase;
