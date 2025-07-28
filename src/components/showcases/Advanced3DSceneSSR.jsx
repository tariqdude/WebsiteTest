import { useEffect, useRef, useState } from 'react';

const Advanced3DScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // SSR-safe mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mountRef.current) return;

    let THREE, scene, camera, renderer, cube, sphere, torus;

    const initThreeJS = async () => {
      try {
        // Dynamic import for SSR safety
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

  // Handle window resize
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      if (rendererRef.current && mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        rendererRef.current.setSize(width, height);

        if (sceneRef.current && sceneRef.current.children.length > 0) {
          // Find camera in scene
          const camera = sceneRef.current.children.find(
            (child) => child.type === 'PerspectiveCamera'
          );
          if (camera) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMounted]);

  // SSR fallback
  if (!isMounted) {
    return (
      <div className='flex min-h-[400px] items-center justify-center rounded-lg bg-gradient-to-br from-purple-900 to-blue-900 p-8 shadow-lg'>
        <div className='text-center text-white'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white'></div>
          <h3 className='mb-2 text-2xl font-bold'>3D Scene Loading</h3>
          <p className='text-purple-200'>Preparing Three.js environment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'>
        <strong className='font-bold'>3D Scene Error:</strong>
        <span className='block sm:inline'> {error}</span>
      </div>
    );
  }

  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800'>
      <div className='border-b border-gray-200 p-6 dark:border-gray-700'>
        <h3 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
          🎮 Advanced 3D Scene
        </h3>
        <p className='text-gray-600 dark:text-gray-300'>
          Interactive Three.js scene with rotating geometric shapes
        </p>
      </div>

      <div className='relative'>
        {isLoading && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50'>
            <div className='text-center text-white'>
              <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-white'></div>
              <p>Loading 3D Scene...</p>
            </div>
          </div>
        )}
        <div
          ref={mountRef}
          className='h-96 w-full bg-gradient-to-br from-purple-900 to-blue-900'
        />
      </div>

      <div className='bg-gray-50 p-4 dark:bg-gray-700'>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          <strong>Features:</strong> Three.js WebGL rendering, shadows,
          lighting, animations
        </p>
      </div>
    </div>
  );
};

export default Advanced3DScene;
