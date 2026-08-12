"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { GlossaryEntry } from "@/lib/content-schema";

type Props = { entries: GlossaryEntry[] };

export function GlossaryLibrary({ entries }: Props) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");
  const sections = useMemo(() => Array.from(new Set(entries.map((entry) => entry.section))).sort(), [entries]);
  const filtered = entries.filter((entry) => {
    const matchesQuery = `${entry.term} ${entry.definition}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (section === "all" || entry.section === section);
  });
  const groups = Map.groupBy(filtered, (entry) => entry.section);

  return (
    <div>
      <div className="grid gap-3 border border-slate-200 bg-slate-50 p-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <label className="relative block">
          <span className="sr-only">Search glossary</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-slate-300 bg-white py-2.5 pl-10 text-sm focus:border-sky-600 focus:ring-sky-600" placeholder="Search terms and definitions" />
        </label>
        <label>
          <span className="sr-only">Filter glossary section</span>
          <select value={section} onChange={(event) => setSection(event.target.value)} className="w-full border-slate-300 bg-white py-2.5 text-sm text-slate-700 focus:border-sky-600 focus:ring-sky-600">
            <option value="all">All sections</option>
            {sections.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm text-slate-500"><span className="font-mono tabular-nums text-slate-950">{filtered.length}</span> terms shown</p>
      <div className="mt-7 space-y-10">
        {Array.from(groups.entries()).map(([group, terms]) => (
          <section key={group}>
            <h2 className="border-b border-slate-200 pb-3 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">{group}</h2>
            <dl className="divide-y divide-slate-200">
              {terms.map((entry) => (
                <div key={`${entry.section}-${entry.term}`} className="grid gap-2 py-5 md:grid-cols-[minmax(190px,0.75fr)_minmax(0,2fr)] md:gap-8">
                  <dt className="font-semibold text-slate-950">{entry.term}</dt>
                  <dd className="text-sm leading-7 text-slate-700">{entry.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
