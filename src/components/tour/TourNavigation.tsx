"use client";

import { useEffect, useState } from "react";

type Stop = {
  number: string;
  statement: string;
};

export function TourNavigation({ stops }: { stops: Stop[] }) {
  const [activeStop, setActiveStop] = useState(stops[0]?.number);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveStop(visible[0].target.id.replace("stop-", ""));
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    const sections = stops.map((stop) => document.getElementById(`stop-${stop.number}`)).filter((section): section is HTMLElement => Boolean(section));
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [stops]);

  return (
    <nav aria-label="Tour stops" className="border-b border-slate-200 bg-white lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] lg:self-start lg:border-b-0 lg:border-r">
      <div className="overflow-x-auto px-4 py-3 lg:overflow-visible lg:px-0 lg:py-8">
        <p className="hidden px-6 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:block">Tour stops</p>
        <div className="flex gap-4 lg:mt-5 lg:grid lg:gap-1">
          {stops.map((stop) => {
            const active = activeStop === stop.number;
            return (
              <a
                key={stop.number}
                href={`#stop-${stop.number}`}
                aria-current={active ? "location" : undefined}
                className={`group flex shrink-0 items-start gap-3 border-l-2 py-2 text-left transition lg:px-6 ${active ? "border-sky-600 bg-sky-50 text-slate-950" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-950"}`}
              >
                <span className={`font-mono text-xs tabular-nums ${active ? "text-sky-700" : "text-slate-400"}`}>{stop.number}</span>
                <span className="max-w-48 text-xs font-semibold leading-5">{stop.statement}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
