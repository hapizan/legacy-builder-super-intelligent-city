"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid, Sky } from "@react-three/drei"
import { Suspense } from "react"
import { CityModel } from "./city-model"
import { LoadingSpinner } from "./loading-spinner"
import * as THREE from "three"

export function DigitalTwinViewer() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 relative">
      {/* UI Overlay with instructions */}
      {/* 
      <div className="absolute top-4 left-4 z-10 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-2">🏢 Building Interior View</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Click</strong> any building for X-ray view</li>
          <li>• <strong>See through</strong> transparent walls</li>
          <li>• <strong>View</strong> lifts, stairs, water hosts, exits</li>
          <li>• <strong>Click again</strong> to return to city view</li>
        </ul>
        <div className="mt-3 text-xs opacity-75">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
            <span>Host Desks</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-orange-500 rounded-sm animate-pulse"></span>
            <span>Emergency Stairs</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-gray-500 rounded-sm"></span>
            <span>Lifts</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
            <span>Fire Hoses & Exits</span>
          </div>
        </div>
      </div>
      */}
      <Canvas 
        camera={{ position: [80, 60, 80], fov: 50 }} 
        shadows={{ type: THREE.PCFSoftShadowMap }}
        className="w-full h-full"
      >
        <Suspense fallback={<LoadingSpinner />}>
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.3} color="#e6f3ff" />
          
          {/* Main sun light */}
          <directionalLight
            position={[80, 60, 40]}
            intensity={1.2}
            color="#fff5e6"
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
            shadow-camera-near={0.1}
            shadow-camera-far={200}
            shadow-bias={-0.0001}
          />
          
          {/* Fill light for building details */}
          <directionalLight
            position={[-30, 40, -30]}
            intensity={0.4}
            color="#b3d9ff"
          />
          
          {/* Rim lighting */}
          <directionalLight
            position={[0, 20, -60]}
            intensity={0.3}
            color="#ffe6cc"
          />

          {/* Realistic sky and environment */}
          <Sky 
            distance={450000}
            sunPosition={[80, 60, 40]}
            inclination={0.52}
            azimuth={0.25}
            turbidity={2}
            rayleigh={0.5}
          />
          <Environment preset="dawn" />

          {/* Enhanced ground grid */}
          <Grid
            position={[0, -0.5, 0]}
            args={[300, 300]}
            cellSize={10}
            cellThickness={0.8}
            cellColor="#64748b"
            sectionSize={50}
            sectionThickness={1.5}
            sectionColor="#475569"
            fadeDistance={150}
            fadeStrength={1}
            infiniteGrid
          />

          {/* City Model */}
          <CityModel />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#f1f5f9', 100, 300]} />

          {/* Enhanced Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={300}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={0.1}
            panSpeed={1}
            rotateSpeed={0.5}
            zoomSpeed={1}
            enableDamping
            dampingFactor={0.05}
            target={[0, 10, 0]}
          />
        </Suspense>
      </Canvas>
      
      {/* Camera position indicator */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white p-2 rounded text-sm">
        <div>Use mouse to orbit, zoom, and pan</div>
        <div className="text-xs text-gray-300">Scroll: Zoom | Drag: Rotate | Right-click: Pan</div>
      </div>
    </div>
  )
}
