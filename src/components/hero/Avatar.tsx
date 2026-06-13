"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { voiceBus } from "@/lib/voice-bus";
import { person } from "@/content/profile";

const AVATAR = person.avatar;
useGLTF.preload(AVATAR);

// RobotExpressive (three.js, CC) — a friendly tech robot. Waves hello on entry,
// idles, and nods enthusiastically ("Yes") while the intro plays.
export default function Avatar() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(AVATAR);
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, group);
  const head = useRef<THREE.Object3D | null>(null);
  const current = useRef<string>("");
  const ready = useRef(false);

  const fadeTo = (name: string, dur = 0.4) => {
    const next = actions[name];
    if (!next || current.current === name) return;
    const prev = current.current ? actions[current.current] : null;
    next.reset().setEffectiveWeight(1).fadeIn(dur).play();
    prev?.fadeOut(dur);
    current.current = name;
  };

  useEffect(() => {
    cloned.traverse((o) => {
      if (o.name === "Head") head.current = o;
      const mesh = o as THREE.SkinnedMesh;
      if (mesh.isMesh) mesh.frustumCulled = false;
    });

    const wave = actions["Wave"];
    if (wave) {
      wave.reset().setLoop(THREE.LoopOnce, 1).play();
      wave.clampWhenFinished = true;
      current.current = "Wave";
      const id = setTimeout(() => {
        ready.current = true;
        fadeTo("Idle", 0.5);
      }, wave.getClip().duration * 1000 - 200);
      return () => clearTimeout(id);
    }
    actions["Idle"]?.play();
    current.current = "Idle";
    ready.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, cloned]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const talking = voiceBus.isTalking();

    if (ready.current) {
      if (talking && current.current !== "Yes") fadeTo("Yes", 0.3);
      else if (!talking && current.current !== "Idle") fadeTo("Idle", 0.4);
    }

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.25, 0.05);
      group.current.position.y = -1.7 + Math.sin(t * 1.2) * 0.03;
    }
    if (head.current) {
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -state.pointer.y * 0.18, 0.07);
    }
  });

  return (
    <group ref={group} position={[0, -1.7, 0]} scale={0.42} dispose={null}>
      <primitive object={cloned} />
    </group>
  );
}
