"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function GlassCard({
  children,
  className,
  holo = true,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  holo?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-6",
        holo ? "holo-border" : "glass",
        hover && "holo-border-hover cursor-grow",
        className
      )}
    >
      {children}
    </div>
  );
}
