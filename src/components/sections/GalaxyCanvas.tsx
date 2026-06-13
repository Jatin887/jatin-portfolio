"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Icosahedron } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { skills, type Skill } from "@/content/profile";
import { categoryColors, categoryOrder } from "@/lib/categories";
import { useReducedMotion, useIsMobile } from "@/hooks/useMedia";

interface Node {
  skill: Skill;
  base: THREE.Vector3;
  ring: number;
  angle: number;
  speed: number;
  color: string;
}

function buildNodes(): Node[] {
  const byCat = categoryOrder.map((c) => skills.filter((s) => s.category === c));
  const nodes: Node[] = [];
  byCat.forEach((group, ci) => {
    const radius = 2 + ci * 0.62;
    const tilt = (ci - 2.5) * 0.32;
    group.forEach((skill, i) => {
      const angle = (i / group.length) * Math.PI * 2 + ci * 0.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(angle) * Math.sin(tilt) * radius;
      nodes.push({
        skill,
        base: new THREE.Vector3(x, y, z),
        ring: radius,
        angle,
        speed: 0.06 + ci * 0.015,
        color: categoryColors[skill.category],
      });
    });
  });
  return nodes;
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.3;
      ref.current.rotation.x = s.clock.elapsedTime * 0.12;
      const p = 1 + Math.sin(s.clock.elapsedTime * 2) * 0.06;
      ref.current.scale.setScalar(p);
    }
  });
  return (
    <group>
      <Icosahedron ref={ref} args={[0.7, 1]}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={2.4}
          wireframe
        />
      </Icosahedron>
      <Icosahedron args={[0.5, 2]}>
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.6} />
      </Icosahedron>
      <pointLight color="#38bdf8" intensity={8} distance={8} />
    </group>
  );
}

function OrbitRing({ radius, tilt }: { radius: number; tilt: number }) {
  return (
    <mesh rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <ringGeometry args={[radius - 0.008, radius + 0.008, 96]} />
      <meshBasicMaterial color="#1e2a44" side={THREE.DoubleSide} transparent opacity={0.5} />
    </mesh>
  );
}

function SkillNode({
  node,
  selected,
  reduced,
  mobile,
  onSelect,
}: {
  node: Node;
  selected: boolean;
  reduced: boolean;
  mobile: boolean;
  onSelect: (s: Skill) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const size = 0.07 + (node.skill.proficiency / 100) * 0.13;

  useFrame((s) => {
    if (!ref.current) return;
    const t = reduced ? node.angle : node.angle + s.clock.elapsedTime * node.speed;
    const tilt = (node.ring - 2) * 0.5;
    ref.current.position.set(
      Math.cos(t) * node.ring,
      Math.sin(t) * Math.sin(tilt) * node.ring * 0.4,
      Math.sin(t) * node.ring
    );
    const target = hovered || selected ? 1.6 : 1;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
  });

  return (
    <group ref={ref}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.skill);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={selected ? 3 : hovered ? 2 : 1.2}
          toneMapped={false}
        />
      </mesh>
      <Html center distanceFactor={9} position={[0, size + 0.16, 0]} pointerEvents="none">
        <div
          className="whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium transition-opacity"
          style={{
            color: node.color,
            // On mobile, only the active node shows its label to avoid clutter.
            opacity: hovered || selected ? 1 : mobile ? 0 : 0.5,
            background: "rgba(5,6,10,0.7)",
            textShadow: `0 0 8px ${node.color}`,
          }}
        >
          {node.skill.name}
        </div>
      </Html>
    </group>
  );
}

export default function GalaxyCanvas({ onSelect, selected }: { onSelect: (s: Skill) => void; selected: Skill | null }) {
  const nodes = useMemo(buildNodes, []);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, mobile ? 1.2 : 1.5, mobile ? 10 : 7.5], fov: mobile ? 52 : 45 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <Core />
      {categoryOrder.map((_, ci) => (
        <OrbitRing key={ci} radius={2 + ci * 0.62} tilt={(ci - 2.5) * 0.18} />
      ))}
      {nodes.map((n) => (
        <SkillNode
          key={n.skill.name}
          node={n}
          reduced={reduced}
          mobile={mobile}
          selected={selected?.name === n.skill.name}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls
        enableZoom
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.5}
        minDistance={4.5}
        maxDistance={11}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.6}
      />
      {!reduced && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.25} intensity={1.1} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
