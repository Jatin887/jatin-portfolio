"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { skills } from "@/content/profile";
import { categoryColors } from "@/lib/categories";
import { fibonacciSphere } from "@/lib/utils";
import { useReducedMotion, useIsMobile } from "@/hooks/useMedia";

function TechLabel({
  position,
  name,
  proficiency,
  years,
  color,
}: {
  position: [number, number, number];
  name: string;
  proficiency: number;
  years: number;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Html position={position} center distanceFactor={8} zIndexRange={[10, 0]}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="cursor-pointer select-none rounded-full border px-3 py-1 text-center text-[12px] font-semibold backdrop-blur transition-all duration-200"
        style={{
          color,
          borderColor: hovered ? color : "rgba(255,255,255,0.12)",
          background: hovered ? "rgba(5,6,10,0.92)" : "rgba(5,6,10,0.55)",
          boxShadow: hovered ? `0 0 18px ${color}66` : "none",
          transform: hovered ? "scale(1.18)" : "scale(1)",
          whiteSpace: "nowrap",
        }}
      >
        {name}
        {hovered && (
          <div className="mt-1 border-t border-white/10 pt-1 text-[10px] font-normal text-muted">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1 w-12 overflow-hidden rounded bg-white/15">
                <span className="block h-full rounded" style={{ width: `${proficiency}%`, background: color }} />
              </span>
              <span style={{ color }}>{proficiency}%</span>
            </div>
            <div className="mt-0.5 text-faint">{years}+ yrs experience</div>
          </div>
        )}
      </div>
    </Html>
  );
}

function Cloud() {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const points = useMemo(() => fibonacciSphere(skills.length, 3.1), []);

  useFrame((_, delta) => {
    if (group.current && !reduced) {
      group.current.rotation.y += delta * 0.08;
      group.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={group}>
      {skills.map((s, i) => (
        <TechLabel
          key={s.name}
          position={points[i]}
          name={s.name}
          proficiency={s.proficiency}
          years={s.years}
          color={categoryColors[s.category]}
        />
      ))}
      {/* faint wireframe sphere */}
      <mesh>
        <sphereGeometry args={[3.1, 24, 24]} />
        <meshBasicMaterial color="#1b2540" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function TechSphereCanvas() {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  return (
    <Canvas dpr={[1, mobile ? 1.5 : 2]} camera={{ position: [0, 0, mobile ? 11.5 : 8], fov: mobile ? 50 : 45 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.8} />
      <Cloud />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reduced} autoRotateSpeed={0.4} />
    </Canvas>
  );
}
