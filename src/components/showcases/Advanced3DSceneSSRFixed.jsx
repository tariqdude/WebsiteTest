import { useEffect, useRef, useState } from 'react';

/**
 * Advanced 3D Scene - Completely SSR Safe Implementation
 * Uses dynamic imports, client-only rendering, and robust error handling
 */
const Advanced3DScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // SSR-safe mounting detection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Main Three.js initialization - client-only
  useEffect(() => {
    if (!isMounted || !mountRef.current) return;

    let THREE, scene, camera, renderer, cube, sphere, torus;

    const initThreeJS = async () => {
      try {
        // Dynamic import for complete SSR safety
        THREE = await import('three');
        
        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);

        // Camera setup
        camera = new THREE.PerspectiveCamera(
          75,
          mountRef.current.clientWidth / mountRef.current.clientHeight,
          0.1,
          1000
        );
        camera.position.z = 5;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(
          mountRef.current.clientWidth,
          mountRef.current.clientHeight
        );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Store refs for cleanup
        sceneRef.current = scene;
        rendererRef.current = renderer;

        // Add renderer to DOM
        mountRef.current.appendChild(renderer.domElement);

        // Create geometries and materials
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const torusGeometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100);

        const cubeMaterial = new THREE.MeshPhongMaterial({
          color: 0x00d4ff,
          shininess: 100,
        });
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: 0xff6b6b,
          shininess: 100,
        });
        const torusMaterial = new THREE.MeshPhongMaterial({
          color: 0x4ecdc4,
          shininess: 100,
        });

        // Create meshes
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        torus = new THREE.Mesh(torusGeometry, torusMaterial);

        // Position objects
        cube.position.x = -2;
        sphere.position.x = 0;
        torus.position.x = 2;

        // Enable shadows
        cube.castShadow = true;
        sphere.castShadow = true;
        torus.castShadow = true;

        // Add objects to scene
        scene.add(cube);
        scene.add(sphere);
        scene.add(torus);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Animation loop
        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate);

          // Rotate objects
          if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
          }
          if (sphere) {
            sphere.rotation.x += 0.015;
            sphere.rotation.y += 0.015;
          }
          if (torus) {
            torus.rotation.x += 0.005;
            torus.rotation.y += 0.02;
          }

          renderer.render(scene, camera);
        };

        animate();
        setIsLoading(false);
      } catch (err) {
        console.error('Three.js initialization failed:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initThreeJS();

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
        } catch (e) {
          console.warn('Cleanup warning:', e);
        }
      }
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [isMounted]);

  // Client-only resize handling - completely SSR safe
  useEffect(() => {
    if (!isMounted) return;

    // Define the resize handler inside the effect
    const handleResize = () => {
      if (rendererRef.current && mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        rendererRef.current.setSize(width, height);
        
        if (sceneRef.current && sceneRef.current.children.length > 0) {
          const camera = sceneRef.current.children.find(
            child => child.type === 'PerspectiveCamera'
          );
          if (camera) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
        }
      }
    };

    // Only run on client side - no window access during SSR
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', handleResize);
      
      return () => {
        if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
          window.removeEventListener('resize', handleResize);
        }
      };
    }
  }, [isMounted]);

  // SSR fallback - always rendered during server-side
  if (!isMounted) {
    return (
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg shadow-lg p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h3 className="text-2xl font-bold mb-2">3D Scene Loading</h3>
          <p className="text-purple-200">Preparing Three.js environment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">3D Scene Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎮 Advanced 3D Scene
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Interactive Three.js scene with rotating geometric shapes
        </p>
      </div>
      
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading 3D Scene...</p>
            </div>
          </div>
        )}
        <div
          ref={mountRef}
          className="w-full h-96 bg-gradient-to-br from-purple-900 to-blue-900"
        />
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>Features:</strong> Three.js WebGL rendering, shadows, lighting, animations
        </p>
      </div>
    </div>
  );
};

export default Advanced3DScene;
