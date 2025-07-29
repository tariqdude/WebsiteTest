// Advanced 3D Scene with Three.js - Maximum Enhanced with Analytics and Controls
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Palette,
  Grid3X3,
  Lightbulb,
  Settings,
  Eye,
  Camera,
  Layers,
  Maximize,
  Info,
} from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useSSRSafeSimple } from '../../lib/hooks/useSSRSafeSimple.js';

const Advanced3DScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const cubeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const statsRef = useRef({ fps: 0, frameCount: 0, lastTime: 0 });

  // Enhanced state management
  const [isRotating, setIsRotating] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [currentColor, setCurrentColor] = useState('#00d4ff');
  const [lightIntensity, setLightIntensity] = useState(1);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [cameraMode, setCameraMode] = useState('orbital');
  const [showStats, setShowStats] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [renderStats, setRenderStats] = useState({
    fps: 0,
    triangles: 0,
    vertices: 0,
    drawCalls: 0,
  });

  const { isReady, deviceInfo, safeExecute, safeInterval } = useSSRSafeSimple();

  // Predefined color palette
  const colorPalette = [
    '#00d4ff',
    '#ff4444',
    '#44ff44',
    '#ffaa00',
    '#aa44ff',
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#f39c12',
    '#9b59b6',
    '#1dd1a1',
    '#feca57',
    '#ff9ff3',
    '#54a0ff',
    '#5f27cd',
  ];

  // Enhanced geometry presets
  const geometryPresets = [
    { name: 'Cube', type: 'box', params: [2, 2, 2] },
    { name: 'Sphere', type: 'sphere', params: [1.5, 32, 32] },
    { name: 'Torus', type: 'torus', params: [1, 0.4, 16, 100] },
    { name: 'Octahedron', type: 'octahedron', params: [1.5] },
    { name: 'Dodecahedron', type: 'dodecahedron', params: [1.5] },
    { name: 'Icosahedron', type: 'icosahedron', params: [1.5] },
  ];

  const [currentGeometry, setCurrentGeometry] = useState(0);

  // Enhanced initialization with performance monitoring
  const initThreeJS = useCallback(() => {
    const mount = mountRef.current;
    if (!mount || !isReady) return;

    // Clean up existing scene
    if (rendererRef.current) {
      cleanup();
    }

    // Scene setup with enhanced features
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f23);
    scene.fog = new THREE.Fog(0x0f0f23, 10, 50);
    sceneRef.current = scene;

    // Enhanced camera with smooth positioning
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // High-performance renderer with advanced settings
    const renderer = new THREE.WebGLRenderer({
      antialias: !deviceInfo.isMobile, // Disable AA on mobile for performance
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });

    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, deviceInfo.isMobile ? 1.5 : 2)
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced controls with device-specific settings
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI;
    controls.autoRotate = cameraMode === 'auto';
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // Create enhanced geometry
    createGeometry(scene, geometryPresets[currentGeometry]);

    // Advanced lighting setup
    setupLighting(scene);

    // Start animation loop with performance monitoring
    startAnimationLoop(scene, camera, renderer, controls);

    // Enhanced resize handler
    const handleResize = safeExecute(() => {
      if (!camera || !renderer || !mount) return;

      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, [isReady, deviceInfo, currentGeometry, cameraMode, safeExecute]);

  // Enhanced geometry creation
  const createGeometry = useCallback(
    (scene, preset) => {
      // Remove existing cube
      if (cubeRef.current) {
        scene.remove(cubeRef.current);
        cubeRef.current.geometry.dispose();
        cubeRef.current.material.dispose();
      }

      let geometry;
      switch (preset.type) {
        case 'sphere':
          geometry = new THREE.SphereGeometry(...preset.params);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(...preset.params);
          break;
        case 'octahedron':
          geometry = new THREE.OctahedronGeometry(...preset.params);
          break;
        case 'dodecahedron':
          geometry = new THREE.DodecahedronGeometry(...preset.params);
          break;
        case 'icosahedron':
          geometry = new THREE.IcosahedronGeometry(...preset.params);
          break;
        default:
          geometry = new THREE.BoxGeometry(...preset.params);
      }

      const material = new THREE.MeshStandardMaterial({
        color: currentColor,
        metalness: 0.7,
        roughness: 0.2,
        wireframe: wireframe,
        transparent: true,
        opacity: 0.9,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      cubeRef.current = mesh;

      // Update render stats
      setRenderStats((prev) => ({
        ...prev,
        triangles: geometry.attributes.position.count / 3,
        vertices: geometry.attributes.position.count,
      }));
    },
    [currentColor, wireframe]
  );

  // Advanced lighting system
  const setupLighting = useCallback(
    (scene) => {
      // Clear existing lights
      const existingLights = scene.children.filter((child) => child.isLight);
      existingLights.forEach((light) => scene.remove(light));

      // Ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
      scene.add(ambientLight);

      // Main directional light
      const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        lightIntensity
      );
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.camera.left = -10;
      directionalLight.shadow.camera.right = 10;
      directionalLight.shadow.camera.top = 10;
      directionalLight.shadow.camera.bottom = -10;
      scene.add(directionalLight);

      // Rim lighting
      const rimLight = new THREE.DirectionalLight(
        0x4444ff,
        lightIntensity * 0.5
      );
      rimLight.position.set(-5, 5, -5);
      scene.add(rimLight);

      // Point lights for atmosphere
      const pointLight1 = new THREE.PointLight(
        0xff4444,
        lightIntensity * 0.6,
        20
      );
      pointLight1.position.set(-8, -8, -8);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(
        0x44ff44,
        lightIntensity * 0.4,
        15
      );
      pointLight2.position.set(8, -4, 8);
      scene.add(pointLight2);
    },
    [lightIntensity]
  );

  // Enhanced animation loop with performance monitoring
  const startAnimationLoop = useCallback(
    (scene, camera, renderer, controls) => {
      let lastTime = performance.now();
      let frameCount = 0;

      const animate = (currentTime) => {
        animationFrameRef.current = requestAnimationFrame(animate);

        // FPS calculation
        frameCount++;
        if (currentTime - lastTime >= 1000) {
          statsRef.current.fps = Math.round(
            (frameCount * 1000) / (currentTime - lastTime)
          );
          frameCount = 0;
          lastTime = currentTime;

          setRenderStats((prev) => ({
            ...prev,
            fps: statsRef.current.fps,
            drawCalls: renderer.info.render.calls,
          }));
        }

        // Object rotation
        if (isRotating && cubeRef.current) {
          cubeRef.current.rotation.x += rotationSpeed;
          cubeRef.current.rotation.y += rotationSpeed * 1.2;
          cubeRef.current.rotation.z += rotationSpeed * 0.8;
        }

        // Camera auto-rotation
        if (cameraMode === 'auto') {
          controls.autoRotate = true;
        } else {
          controls.autoRotate = false;
        }

        controls.update();
        renderer.render(scene, camera);
      };

      animate(performance.now());
    },
    [isRotating, rotationSpeed, cameraMode]
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const mount = mountRef.current;
    const renderer = rendererRef.current;

    if (mount && renderer && renderer.domElement) {
      mount.removeChild(renderer.domElement);
    }

    if (renderer) {
      renderer.dispose();
    }

    if (cubeRef.current) {
      cubeRef.current.geometry.dispose();
      cubeRef.current.material.dispose();
    }
  }, []);

  // Initialize scene
  useEffect(() => {
    initThreeJS();
    return cleanup;
  }, [initThreeJS, cleanup]);

  // Control functions
  const toggleRotation = useCallback(() => {
    setIsRotating((prev) => !prev);
  }, []);

  const toggleWireframe = useCallback(() => {
    setWireframe((prev) => {
      const newWireframe = !prev;
      if (cubeRef.current) {
        cubeRef.current.material.wireframe = newWireframe;
      }
      return newWireframe;
    });
  }, []);

  const resetRotation = useCallback(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.set(0, 0, 0);
    }
  }, []);

  const changeColor = useCallback((color) => {
    setCurrentColor(color);
    if (cubeRef.current) {
      cubeRef.current.material.color.setHex(parseInt(color.replace('#', '0x')));
    }
  }, []);

  const changeGeometry = useCallback(
    (index) => {
      setCurrentGeometry(index);
      if (sceneRef.current) {
        createGeometry(sceneRef.current, geometryPresets[index]);
      }
    },
    [createGeometry]
  );

  const toggleFullscreen = useCallback(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (!document.fullscreenElement) {
      mount.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Enhanced controls memoization
  const controlButtons = useMemo(
    () => [
      {
        icon: isRotating ? Pause : Play,
        label: isRotating ? 'Pause' : 'Play',
        onClick: toggleRotation,
        active: isRotating,
        color: 'green',
      },
      {
        icon: Grid3X3,
        label: wireframe ? 'Solid' : 'Wireframe',
        onClick: toggleWireframe,
        active: wireframe,
        color: 'purple',
      },
      {
        icon: RotateCcw,
        label: 'Reset',
        onClick: resetRotation,
        color: 'blue',
      },
      {
        icon: Eye,
        label: showStats ? 'Hide Stats' : 'Show Stats',
        onClick: () => setShowStats((prev) => !prev),
        active: showStats,
        color: 'indigo',
      },
      {
        icon: Maximize,
        label: 'Fullscreen',
        onClick: toggleFullscreen,
        color: 'gray',
      },
    ],
    [
      isRotating,
      wireframe,
      showStats,
      toggleRotation,
      toggleWireframe,
      resetRotation,
      toggleFullscreen,
    ]
  );

  return (
    <div className='w-full overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black shadow-2xl'>
      {/* Enhanced Header */}
      <div className='border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h3 className='mb-1 text-2xl font-bold text-white'>
              🎯 Advanced 3D Scene Engine
            </h3>
            <p className='text-sm text-gray-300'>
              WebGL • Three.js •{' '}
              {deviceInfo.isMobile ? 'Mobile Optimized' : 'Desktop Enhanced'}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                renderStats.fps >= 50
                  ? 'bg-green-600 text-white'
                  : renderStats.fps >= 30
                    ? 'bg-yellow-600 text-white'
                    : 'bg-red-600 text-white'
              }`}
            >
              {renderStats.fps} FPS
            </span>
          </div>
        </div>

        {/* Main Controls */}
        <div className='mb-4 flex flex-wrap gap-3'>
          {controlButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={button.onClick}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  button.active
                    ? `bg-${button.color}-600 text-white shadow-lg`
                    : `bg-gray-700 text-gray-200 hover:bg-${button.color}-600 hover:text-white`
                }`}
              >
                <Icon className='h-4 w-4' />
                {button.label}
              </motion.button>
            );
          })}
        </div>

        {/* Geometry Selection */}
        <div className='mb-4'>
          <label className='mb-2 block text-sm font-medium text-gray-300'>
            <Layers className='mr-1 inline h-4 w-4' />
            Geometry Type
          </label>
          <div className='flex flex-wrap gap-2'>
            {geometryPresets.map((preset, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeGeometry(index)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  currentGeometry === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {preset.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className='mb-4'>
          <label className='mb-2 block text-sm font-medium text-gray-300'>
            <Palette className='mr-1 inline h-4 w-4' />
            Color Palette
          </label>
          <div className='flex flex-wrap gap-2'>
            {colorPalette.map((color, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => changeColor(color)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  currentColor === color
                    ? 'scale-110 border-white'
                    : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Advanced Controls */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {/* Rotation Speed */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-300'>
              Rotation Speed
            </label>
            <input
              type='range'
              min='0.001'
              max='0.02'
              step='0.001'
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(Number(e.target.value))}
              className='w-full accent-blue-500'
            />
            <div className='text-xs text-gray-400'>
              {(rotationSpeed * 1000).toFixed(1)}°/frame
            </div>
          </div>

          {/* Light Intensity */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-300'>
              <Lightbulb className='mr-1 inline h-4 w-4' />
              Light Intensity
            </label>
            <input
              type='range'
              min='0.1'
              max='3'
              step='0.1'
              value={lightIntensity}
              onChange={(e) => {
                const newIntensity = Number(e.target.value);
                setLightIntensity(newIntensity);
                if (sceneRef.current) {
                  setupLighting(sceneRef.current);
                }
              }}
              className='w-full accent-yellow-500'
            />
            <div className='text-xs text-gray-400'>
              {lightIntensity.toFixed(1)}x
            </div>
          </div>

          {/* Camera Mode */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-300'>
              <Camera className='mr-1 inline h-4 w-4' />
              Camera Mode
            </label>
            <select
              value={cameraMode}
              onChange={(e) => setCameraMode(e.target.value)}
              className='w-full rounded bg-gray-700 px-2 py-1 text-sm text-white'
            >
              <option value='orbital'>Orbital</option>
              <option value='auto'>Auto Rotate</option>
              <option value='fixed'>Fixed</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className='relative'>
        <div
          ref={mountRef}
          className='h-96 w-full cursor-grab bg-gradient-to-b from-gray-900 to-black active:cursor-grabbing'
          style={{ minHeight: '500px' }}
        />

        {/* Performance Stats Overlay */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className='absolute right-4 top-4 rounded-lg border border-gray-600 bg-black/80 p-4 text-white backdrop-blur-sm'
            >
              <h4 className='mb-2 flex items-center gap-1 text-sm font-bold'>
                <Info className='h-4 w-4' />
                Performance Stats
              </h4>
              <div className='space-y-1 text-xs'>
                <div>
                  FPS: <span className='text-green-400'>{renderStats.fps}</span>
                </div>
                <div>
                  Triangles:{' '}
                  <span className='text-blue-400'>
                    {renderStats.triangles?.toLocaleString()}
                  </span>
                </div>
                <div>
                  Vertices:{' '}
                  <span className='text-purple-400'>
                    {renderStats.vertices?.toLocaleString()}
                  </span>
                </div>
                <div>
                  Draw Calls:{' '}
                  <span className='text-yellow-400'>
                    {renderStats.drawCalls}
                  </span>
                </div>
                <div>
                  Device:{' '}
                  <span className='text-gray-300'>
                    {deviceInfo.isMobile ? 'Mobile' : 'Desktop'}
                  </span>
                </div>
                <div>
                  Pixel Ratio:{' '}
                  <span className='text-gray-300'>
                    {deviceInfo.pixelRatio}x
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Footer */}
      <div className='border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 p-4'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='text-xs text-gray-300'>
            <span className='font-medium'>Advanced Features:</span>
            Real-time lighting • Shadow mapping • Post-processing • Device
            optimization • Performance monitoring
          </div>
          <div className='flex items-center gap-4 text-xs text-gray-400'>
            <span>Geometry: {geometryPresets[currentGeometry].name}</span>
            <span>•</span>
            <span>Material: PBR Standard</span>
            <span>•</span>
            <span>Renderer: WebGL 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advanced3DScene;
