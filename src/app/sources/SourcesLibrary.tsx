"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SourceCard } from "@/components/evidence/SourceCard";
import type { Source } from "@/lib/content-schema";

type Props = {
  sources: Source[];
};

export function SourcesLibrary({ sources }: Props) {
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState("all");

  const methods = useMemo(() => ["all", ...Array.from(new Set(sources.map((source) => source.method))).sort()], [
    sources
  ]);

  const filtered = sources.filter((source) => {
    const haystack = `${source.title} ${source.authors} ${source.finding} ${source.caveat}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (method === "all" || source.method === method);
  });

  return (
    <div className="space-y-6">
      <div className="border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_260px]">
          <label className="text-sm font-medium text-slate-800">
            Search sources
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full border-slate-300 pl-9 focus:border-sky-600 focus:ring-sky-600"
                placeholder="Try voucher, tutoring, NAEP, coaching"
              />
            </div>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Method
            <select value={method} onChange={(event) => setMethod(event.target.value)} className="mt-2 w-full border-slate-300 focus:border-sky-600 focus:ring-sky-600">
              {methods.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All methods" : option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </div>
  );
}
