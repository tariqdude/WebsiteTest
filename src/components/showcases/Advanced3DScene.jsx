// Advanced 3D Scene with Three.js - Optimized and Refactored
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Advanced3DScene = () => {
  const mountRef = useRef(null);
  const isRotatingRef = useRef(true);
  const cubeRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const initThree = () => {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a2e); // Dark blue space color

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        mount.clientWidth / mount.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.appendChild(renderer.domElement);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 3;
      controls.maxDistance = 10;

      // Geometry and materials
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        metalness: 0.5,
        roughness: 0.3,
        wireframe: false
      });
      
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      scene.add(cube);
      cubeRef.current = cube;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xff4444, 0.8, 100);
      pointLight.position.set(-5, -5, -5);
      scene.add(pointLight);

      // Animation loop
      let animationFrameId;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        if (isRotatingRef.current && cube) {
          cube.rotation.x += 0.005;
          cube.rotation.y += 0.005;
        }
        
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (mount && renderer.domElement) {
          mount.removeChild(renderer.domElement);
        }
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    };

    initThree();
  }, []);

  const toggleRotation = () => {
    isRotatingRef.current = !isRotatingRef.current;
    // Force re-render to update button text
    mountRef.current.dispatchEvent(new Event('toggle-rotation'));
  };

  const toggleWireframe = () => {
    if (cubeRef.current) {
      cubeRef.current.material.wireframe = !cubeRef.current.material.wireframe;
      mountRef.current.dispatchEvent(new Event('toggle-wireframe'));
    }
  };

  const resetRotation = () => {
    if (cubeRef.current) {
      cubeRef.current.rotation.set(0, 0, 0);
    }
  };

  const changeColor = () => {
    if (cubeRef.current) {
      const colors = [0x00d4ff, 0xff4444, 0x44ff44, 0xffaa00, 0xaa44ff];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      cubeRef.current.material.color.setHex(randomColor);
    }
  };
  
  // Dummy state to trigger re-render for button text
  const [, setDummyState] = useState(0);
  useEffect(() => {
    const forceUpdate = () => setDummyState(s => s + 1);
    const mount = mountRef.current;
    mount.addEventListener('toggle-rotation', forceUpdate);
    mount.addEventListener('toggle-wireframe', forceUpdate);
    return () => {
      mount.removeEventListener('toggle-rotation', forceUpdate);
      mount.removeEventListener('toggle-wireframe', forceUpdate);
    }
  }, []);

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-3">Interactive 3D Scene</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={toggleRotation}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isRotatingRef.current
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 text-gray-200'
            }`}
          >
            {isRotatingRef.current ? 'Stop' : 'Start'} Rotation
          </button>
          <button
            onClick={toggleWireframe}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              cubeRef.current?.material.wireframe
                ? 'bg-purple-600 text-white'
                : 'bg-gray-600 text-gray-200'
            }`}
          >
            {cubeRef.current?.material.wireframe ? 'Solid' : 'Wireframe'}
          </button>
          <button
            onClick={resetRotation}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Reset Rotation
          </button>
          <button
            onClick={changeColor}
            className="px-3 py-1 bg-orange-600 text-white rounded text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            Random Color
          </button>
        </div>
      </div>
      <div 
        ref={mountRef} 
        className="w-full h-96 cursor-grab active:cursor-grabbing" 
        style={{ minHeight: '400px' }}
      />
      <div className="p-3 bg-gray-800 text-xs text-gray-300">
        <p>WebGL-powered 3D scene with Three.js • Orbit controls • Real-time lighting</p>
      </div>
    </div>
  );
};

export default Advanced3DScene;
