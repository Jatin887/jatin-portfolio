"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Sparkles,
  ContactShadows,
  Float,
  PerspectiveCamera,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Avatar from "./Avatar";
import { useReducedMotion, useIsMobile } from "@/hooks/useMedia";

function HoloPlatform() {
  return (
    <group position={[0, -1.62, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.6, 64]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.72, 64]} />
        <meshBasicMaterial color="#a855f7" toneMapped={false} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[0.55, 64]} />
        <meshBasicMaterial color="#0ea5e9" toneMapped={false} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

export default function AvatarCanvas() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows={false}
      className="!touch-pan-y"
    >
      <PerspectiveCamera makeDefault fov={28} position={[0, 0.05, 2.7]} />
      <color attach="background" args={["#05060a"]} />
      <fog attach="fog" args={["#05060a", 4.5, 10]} />

      {/* Lighting */}
      <ambientLight intensity={1.6} />
      {/* strong frontal fill so the face/body read clearly */}
      <directionalLight position={[0, 0.8, 3]} intensity={3.2} color="#ffffff" />
      <directionalLight position={[2.5, 2.5, 2]} intensity={3} color="#cfe8ff" />
      <directionalLight position={[-3, 1.5, 1]} intensity={2.2} color="#c4b5fd" />
      <pointLight position={[1.8, 0.2, 2]} intensity={8} color="#38bdf8" distance={9} />
      <pointLight position={[-1.8, 0.4, 2]} intensity={6} color="#a855f7" distance={9} />
      <spotLight position={[0, 3, 2]} angle={0.6} penumbra={1} intensity={3.5} color="#ffffff" />

      <Suspense fallback={null}>
        <Environment resolution={256}>
          <Lightformer intensity={2} color="#38bdf8" position={[-2, 1, 2]} scale={[3, 3, 1]} />
          <Lightformer intensity={2.4} color="#a855f7" position={[2, 1, 1]} scale={[3, 4, 1]} />
          <Lightformer intensity={1.2} color="#ffffff" position={[0, -1, 2]} scale={[5, 2, 1]} />
        </Environment>

        <Float
          speed={reduced ? 0 : 1.2}
          rotationIntensity={reduced ? 0 : 0.15}
          floatIntensity={reduced ? 0 : 0.25}
        >
          <Avatar />
        </Float>

        <HoloPlatform />

        {!reduced && (
          <Sparkles
            count={mobile ? 40 : 90}
            scale={[4, 4, 2]}
            position={[0, 0, 0]}
            size={2}
            speed={0.3}
            color="#7dd3fc"
            opacity={0.6}
          />
        )}

        <ContactShadows
          position={[0, -1.62, 0]}
          opacity={0.5}
          scale={6}
          blur={2.6}
          far={2}
          color="#0a0f1f"
        />
      </Suspense>

      {!reduced && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={0.7} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
