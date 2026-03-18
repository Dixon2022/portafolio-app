"use client";

import { Children, type ReactNode, useMemo, useState } from "react";

interface AdminPanelsProps {
  labels: string[];
  children: ReactNode;
}

export function AdminPanels({ labels, children }: AdminPanelsProps) {
  const sections = useMemo(() => Children.toArray(children), [children]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (sections.length === 0) {
    return null;
  }

  const safeActiveIndex = Math.min(activeIndex, sections.length - 1);

  return (
    <section className="grid gap-4 rounded-[28px] border border-stone-300/60 bg-white/55 p-3 shadow-[0_16px_34px_-30px_rgba(28,25,23,0.5)] backdrop-blur md:p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav className="flex flex-col gap-2">
          {labels.map((label, index) => {
            const isActive = index === safeActiveIndex;

            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={
                  isActive
                    ? "w-full rounded-2xl border border-stone-900 bg-stone-900 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white"
                    : "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-600 hover:border-stone-400"
                }
              >
                {label}
              </button>
            );
          })}
      </nav>

      <div className="max-h-[calc(100vh-21rem)] overflow-y-auto pr-1">
        {sections[safeActiveIndex]}
      </div>
    </section>
  );
}
