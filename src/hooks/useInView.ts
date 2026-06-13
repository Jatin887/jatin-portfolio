"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref and whether it has entered the viewport.
 * `once` keeps it true after first intersection (used to gate mounting heavy 3D).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit & { once?: boolean } = {}
) {
  const { once = true, ...io } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15, ...io });

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, io.root, io.rootMargin, io.threshold]);

  return { ref, inView };
}
