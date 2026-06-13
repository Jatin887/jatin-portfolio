"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { voiceBus } from "@/lib/voice-bus";
import { asset } from "@/lib/utils";
import { person } from "@/content/profile";

const AVATAR = person.avatar;
const ANIMS = person.animations;
const DRACO = asset("/draco/");

useGLTF.preload(AVATAR, DRACO);
useGLTF.preload(ANIMS, DRACO);

type MorphTarget = { mesh: THREE.Mesh; index: number };

function findMorphs(root: THREE.Object3D, names: string[]): MorphTarget[] {
  const out: MorphTarget[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    const dict = mesh.morphTargetDictionary;
    if (!dict || !mesh.morphTargetInfluences) return;
    for (const n of names) {
      if (n in dict) out.push({ mesh, index: dict[n] });
    }
  });
  return out;
}

export default function Avatar({ talkingHint = false }: { talkingHint?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations: avatarAnims } = useGLTF(AVATAR, DRACO);
  const { animations } = useGLTF(ANIMS, DRACO);

  // Clone so the cached scene isn't mutated across mounts.
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const allAnims = useMemo(() => {
    const clips = [...animations, ...avatarAnims];
    // Drop tracks for Mixamo leaf "_end" tip bones that the avatar skeleton lacks
    // (otherwise three logs a PropertyBinding warning per track).
    for (const clip of clips) {
      clip.tracks = clip.tracks.filter((t) => !t.name.includes("_end"));
    }
    return clips;
  }, [animations, avatarAnims]);
  const { actions, names } = useAnimations(allAnims, group);

  const blink = useRef({ next: 1.5, t: 0, closing: false, value: 0 });
  const mouthRefs = useRef<MorphTarget[]>([]);
  const blinkRefs = useRef<MorphTarget[]>([]);
  const smileRefs = useRef<MorphTarget[]>([]);
  const head = useRef<THREE.Object3D | null>(null);
  const current = useRef<string>("");

  useEffect(() => {
    mouthRefs.current = findMorphs(cloned, ["AH", "OH", "CH"]);
    blinkRefs.current = findMorphs(cloned, ["eye_close", "eye closed.L", "eye closed.R"]);
    smileRefs.current = findMorphs(cloned, ["mouthSmile"]);
    cloned.traverse((o) => {
      if (/Head$/i.test(o.name) && !head.current) head.current = o;
    });
  }, [cloned]);

  // Drive animation clip based on talking state.
  const play = (name: string) => {
    if (current.current === name) return;
    const next = actions[name] ?? actions[names[0]];
    if (!next) return;
    const prev = current.current ? actions[current.current] : null;
    next.reset().fadeIn(0.4).play();
    if (prev) prev.fadeOut(0.4);
    current.current = name;
  };

  useEffect(() => {
    // Start idle once actions are ready.
    if (names.length) play(names.includes("Idle") ? "Idle" : names[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names.join(",")]);

  useFrame((state, delta) => {
    const talking = voiceBus.isTalking() || talkingHint;

    // Animation selection
    if (talking) {
      const want = names.includes("Talking") ? "Talking" : names[0];
      if (current.current !== want && current.current !== "Talking2") play(want);
    } else if (current.current !== "Idle" && names.includes("Idle")) {
      play("Idle");
    }

    // ----- Blink -----
    const b = blink.current;
    b.t += delta;
    if (!b.closing && b.t > b.next) {
      b.closing = true;
      b.t = 0;
    }
    if (b.closing) {
      // quick close then open over ~0.18s
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

    // ----- Lip sync -----
    const mouth = voiceBus.getMouth();
    const jitter = talking ? (Math.sin(state.clock.elapsedTime * 30) * 0.5 + 0.5) * 0.15 : 0;
    const ah = THREE.MathUtils.clamp(mouth + jitter, 0, 1);
    mouthRefs.current.forEach((m, i) => {
      if (!m.mesh.morphTargetInfluences) return;
      const w = i === 0 ? ah : i === 1 ? ah * 0.35 : ah * 0.2;
      m.mesh.morphTargetInfluences[m.index] =
        m.mesh.morphTargetInfluences[m.index] * 0.5 + w * 0.5;
    });
    // subtle resting smile
    for (const m of smileRefs.current) {
      if (m.mesh.morphTargetInfluences)
        m.mesh.morphTargetInfluences[m.index] = 0.12 + (talking ? 0.05 : 0);
    }

    // ----- Eye contact: head follows pointer -----
    if (head.current) {
      const px = state.pointer.x;
      const py = state.pointer.y;
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, px * 0.35, 0.08);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -py * 0.2, 0.08);
    }

    // ----- Breathing / idle sway on the whole group -----
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.position.y = -1.62 + Math.sin(t * 1.1) * 0.012;
      group.current.rotation.y = Math.sin(t * 0.35) * 0.04;
    }
  });

  return (
    <group ref={group} position={[0, -1.62, 0]} dispose={null}>
      <primitive object={cloned} />
    </group>
  );
}
