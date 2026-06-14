"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { voiceBus } from "@/lib/voice-bus";
import { person } from "@/content/profile";
import { asset } from "@/lib/utils";

const AVATAR = person.avatar;
const ANIMS = person.animations;
const DRACO = asset("/draco/");
useGLTF.preload(AVATAR, DRACO);
useGLTF.preload(ANIMS, DRACO);

type Morph = { mesh: THREE.Mesh; index: number };
function findMorphs(root: THREE.Object3D, names: string[]): Morph[] {
  const out: Morph[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    const dict = mesh.morphTargetDictionary;
    if (!dict || !mesh.morphTargetInfluences) return;
    for (const n of names) if (n in dict) out.push({ mesh, index: dict[n] });
  });
  return out;
}

// Ready Player Me stylized human. Idles, switches to a Talking clip while the
// intro/assistant speaks, with procedural mouth movement + natural blinking.
export default function Avatar() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(AVATAR, DRACO);
  const { animations } = useGLTF(ANIMS, DRACO);
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const clips = useMemo(() => {
    for (const c of animations) c.tracks = c.tracks.filter((t) => !t.name.includes("_end"));
    return animations;
  }, [animations]);
  const { actions, names } = useAnimations(clips, group);

  const current = useRef("");
  const blink = useRef({ next: 1.5, t: 0, closing: false, value: 0 });
  const mouthRefs = useRef<Morph[]>([]);
  const blinkRefs = useRef<Morph[]>([]);
  const smileRefs = useRef<Morph[]>([]);
  const head = useRef<THREE.Object3D | null>(null);

  const play = (name: string) => {
    if (current.current === name) return;
    const next = actions[name] ?? actions[names[0]];
    if (!next) return;
    const prev = current.current ? actions[current.current] : null;
    next.reset().fadeIn(0.4).play();
    prev?.fadeOut(0.4);
    current.current = name;
  };

  useEffect(() => {
    mouthRefs.current = findMorphs(cloned, ["AH", "OH", "CH"]);
    blinkRefs.current = findMorphs(cloned, ["eye_close", "eye closed.L", "eye closed.R"]);
    smileRefs.current = findMorphs(cloned, ["mouthSmile"]);
    cloned.traverse((o) => {
      if (/Head$/i.test(o.name) && !head.current) head.current = o;
      const mesh = o as THREE.SkinnedMesh;
      if (mesh.isMesh) mesh.frustumCulled = false;
    });
  }, [cloned]);

  useEffect(() => {
    if (names.length) play(names.includes("Idle") ? "Idle" : names[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names.join(",")]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const talking = voiceBus.isTalking();

    if (talking) {
      if (current.current !== "Talking" && current.current !== "Talking2") play("Talking");
    } else if (current.current !== "Idle" && names.includes("Idle")) {
      play("Idle");
    }

    // Blink
    const b = blink.current;
    b.t += delta;
    if (!b.closing && b.t > b.next) {
      b.closing = true;
      b.t = 0;
    }
    if (b.closing) {
      const phase = b.t / 0.18;
      b.value = phase < 0.5 ? phase * 2 : Math.max(0, 1 - (phase - 0.5) * 2);
      if (b.t > 0.18) {
        b.closing = false;
        b.t = 0;
        b.next = 2 + Math.random() * 3.5;
        b.value = 0;
      }
    }
    for (const m of blinkRefs.current) {
      if (m.mesh.morphTargetInfluences) m.mesh.morphTargetInfluences[m.index] = b.value;
    }

    // Procedural mouth while talking
    const mouth = talking ? (Math.sin(t * 11) * 0.5 + 0.5) * 0.6 + 0.08 : 0;
    mouthRefs.current.forEach((m, i) => {
      if (!m.mesh.morphTargetInfluences) return;
      const w = i === 0 ? mouth : mouth * 0.3;
      m.mesh.morphTargetInfluences[m.index] = THREE.MathUtils.lerp(
        m.mesh.morphTargetInfluences[m.index],
        w,
        0.5
      );
    });
    for (const m of smileRefs.current) {
      if (m.mesh.morphTargetInfluences) m.mesh.morphTargetInfluences[m.index] = 0.12;
    }

    // Eye contact
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, state.pointer.x * 0.3, 0.08);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -state.pointer.y * 0.18, 0.08);
    }

    // Breathing / sway
    if (group.current) {
      group.current.position.y = -1.62 + Math.sin(t * 1.1) * 0.012;
      group.current.rotation.y = Math.sin(t * 0.35) * 0.03;
    }
  });

  return (
    <group ref={group} position={[0, -1.62, 0]} dispose={null}>
      <primitive object={cloned} />
    </group>
  );
}
