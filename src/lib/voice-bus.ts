// Lightweight singleton that carries lip-sync + speaking state between the
// assistant / greeting (writers) and the 3D avatar (reader). Avoids prop
// drilling across separate React trees / the R3F canvas boundary.

type Listener = () => void;

let mouth = 0; // 0..1 jaw openness
let talking = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export const voiceBus = {
  setMouth(v: number) {
    mouth = Math.max(0, Math.min(1, v));
  },
  getMouth() {
    return mouth;
  },
  setTalking(v: boolean) {
    if (talking !== v) {
      talking = v;
      if (!v) mouth = 0;
      emit();
    }
  },
  isTalking() {
    return talking;
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
