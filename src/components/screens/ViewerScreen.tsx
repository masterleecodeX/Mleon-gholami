import { Suspense, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Capsule, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';

function PlaceholderModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Subtle breathing animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Abstract Head Shape (Capsule) */}
      <Capsule args={[1, 1.5, 32, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial 
          color="#f3f4f6" 
          envMapIntensity={1} 
          clearcoat={0.8} 
          clearcoatRoughness={0.2} 
          roughness={0.4} 
          metalness={0.1}
          distort={0.1}
          speed={1}
        />
      </Capsule>
      {/* Front indicator (Face area) */}
      <mesh position={[0, 0.2, 0.95]}>
        <planeGeometry args={[1, 1.2]} />
        <meshStandardMaterial color="#e5e7eb" opacity={0.5} transparent />
      </mesh>
    </group>
  );
}

export function ViewerScreen() {
  const { setAppState, scanResult } = useAppStore();
  const controlsRef = useRef<any>(null);

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };
  
  // Safe default for coverage display
  const cvg = scanResult?.coverage || {
    FRONT: 100, LEFT: 100, RIGHT: 100, TOP: 100, BACK: 100, CHIN: 100, LEFT_EAR: 100, RIGHT_EAR: 100
  };

  return (
    <div className="relative w-full h-full bg-white flex flex-col md:flex-row">
      
      {/* 3D Canvas Area */}
      <div className="flex-1 relative h-[60vh] md:h-full bg-[#fafafa]">
        <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-neutral-400">Loading viewer...</div>}>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <PlaceholderModel />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <OrbitControls 
              ref={controlsRef}
              enablePan={false}
              minDistance={3}
              maxDistance={10}
              autoRotate={false}
            />
          </Canvas>
        </Suspense>
        
        {/* Placeholder Notice */}
        <div className="absolute top-safe-top left-0 w-full p-6 pointer-events-none">
          <div className="bg-neutral-900/5 backdrop-blur-md border border-neutral-900/10 rounded-2xl p-3 inline-block">
            <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Development Placeholder</p>
            <p className="text-sm text-neutral-500 mt-1 max-w-xs">Backend API disconnected. Showing abstract topology.</p>
          </div>
        </div>
      </div>
      
      {/* Info & Controls Panel */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-neutral-100 flex flex-col h-[40vh] md:h-full overflow-y-auto">
        <div className="p-6 flex-1">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-1">3D Scan</h2>
          <p className="text-neutral-500 mb-8">Coverage 100%</p>
          
          <div className="space-y-3 mb-10">
            {Object.entries(cvg).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center text-sm">
                <span className="text-neutral-600 capitalize">{key.replace('_', ' ').toLowerCase()}</span>
                <span className="font-medium text-neutral-900">{Math.round(val as number)}%</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3">
             <button 
               onClick={resetView}
               className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl font-medium transition-colors text-sm"
             >
               <RotateCcw className="w-4 h-4" />
               Reset View
             </button>
          </div>
        </div>
        
        <div className="p-6 border-t border-neutral-100">
          <button 
             onClick={() => setAppState('CAMERA_PERMISSION')}
             className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium transition-colors mb-3 shadow-sm"
          >
             Scan Again
          </button>
          <button 
             onClick={() => setAppState('IDLE')}
             className="w-full py-3 bg-transparent text-neutral-500 hover:text-neutral-800 rounded-xl font-medium transition-colors text-sm"
          >
             Back to Home
          </button>
        </div>
      </div>

    </div>
  );
}
