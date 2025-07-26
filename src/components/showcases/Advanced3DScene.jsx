// Advanced 3D Scene with Three.js
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Advanced3DScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cubeRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframe, setWireframe] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f23);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    
    // Geometry and materials
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00d4ff,
      shininess: 100,
      wireframe: false
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    scene.add(cube);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xff4444, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cubeRef.current = cube;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (isRotating && cubeRef.current) {
        cubeRef.current.rotation.x += 0.01;
        cubeRef.current.rotation.y += 0.01;
      }
      
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
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  
  useEffect(() => {
    if (cubeRef.current) {
      cubeRef.current.material.wireframe = wireframe;
    }
  }, [wireframe]);

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

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-3">3D WebGL Scene</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isRotating
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 text-gray-200'
            }`}
          >
            {isRotating ? 'Stop' : 'Start'} Rotation
          </button>
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              wireframe
                ? 'bg-purple-600 text-white'
                : 'bg-gray-600 text-gray-200'
            }`}
          >
            {wireframe ? 'Solid' : 'Wireframe'}
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
        className="w-full h-96" 
        style={{ minHeight: '400px' }}
      />
      <div className="p-3 bg-gray-800 text-xs text-gray-300">
        <p>WebGL-powered 3D scene with Three.js • Real-time lighting • Shadow mapping</p>
      </div>
    </div>
  );
};

export default Advanced3DScene;
