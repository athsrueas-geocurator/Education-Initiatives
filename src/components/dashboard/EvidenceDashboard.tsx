"use client";

import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { evidenceLabels } from "@/lib/evidence-normalization";
import type { EvidenceStrength, Initiative, Source } from "@/lib/content-schema";

type Props = {
  initiatives: Initiative[];
  sources: Source[];
};

const strengthOrder: EvidenceStrength[] = [
  "strong-causal",
  "promising-causal-quasi",
  "mixed-conditional",
  "limited-descriptive",
  "not-outcome-intervention"
];

const strengthClass: Record<EvidenceStrength, string> = {
  "strong-causal": "bg-emerald-600",
  "promising-causal-quasi": "bg-sky-600",
  "mixed-conditional": "bg-amber-500",
  "limited-descriptive": "bg-slate-400",
  "not-outcome-intervention": "bg-slate-700"
};

function countBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function Bars({ entries, className = "bg-slate-700" }: { entries: Array<[string, number]>; className?: string }) {
  const max = Math.max(...entries.map(([, count]) => count), 1);
  return (
    <div className="space-y-3">
      {entries.map(([label, count]) => (
        <div key={label} className="grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-3 text-sm">
          <div className="min-w-0">
            <div className="mb-1 flex justify-between gap-3 text-slate-700">
              <span className="truncate">{label}</span>
            </div>
            <div className="h-2 overflow-hidden bg-slate-100">
              <div className={`h-full ${className}`} style={{ width: `${(count / max) * 100}%` }} />
            </div>
          </div>
          <span className="text-right font-mono text-xs tabular-nums text-slate-500">{count}</span>
        </div>
      ))}
    </div>
  );
}

export function EvidenceDashboard({ initiatives, sources }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [strength, setStrength] = useState("all");
  const [method, setMethod] = useState("all");

  const categories = useMemo(() => Object.keys(countBy(initiatives, (initiative) => initiative.category)).sort(), [initiatives]);
  const methods = useMemo(
    () => Array.from(new Set(initiatives.flatMap((initiative) => initiative.methodTags))).sort(),
    [initiatives]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return initiatives.filter((initiative) => {
      const matchesQuery = !normalizedQuery || `${initiative.name} ${initiative.oneLineFinding} ${initiative.outputsMeasured} ${initiative.targetPopulation}`
        .toLowerCase()
        .includes(normalizedQuery);
      return (
        matchesQuery &&
        (category === "all" || initiative.category === category) &&
        (strength === "all" || initiative.evidenceStrength === strength) &&
        (method === "all" || initiative.methodTags.includes(method as Initiative["methodTags"][number]))
      );
    });
  }, [category, initiatives, method, query, strength]);

  const sourceCount = (initiative: Initiative) => initiative.sourceIds.filter((id) => sources.some((source) => source.id === id)).length;
  const initiativeStrengths = countBy(initiatives, (initiative) => initiative.evidenceStrength);
  const sourceMethods = countBy(sources, (source) => source.method);
  const categoriesByCount = Object.entries(countBy(initiatives, (initiative) => initiative.category)).sort((a, b) => b[1] - a[1]);
  const activeFilters = [category, strength, method].filter((value) => value !== "all").length + (query ? 1 : 0);

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">U.S. education initiatives</p>
          <div className="mt-4 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">What the evidence records say</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Browse the initiatives, studies, outcomes, and caveats in the collection. Every finding links back to its recorded source.
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-700 border-y border-slate-700 lg:border-y-0">
              <div className="px-4 py-3 first:pl-0">
                <p className="font-mono text-2xl tabular-nums">{initiatives.length}</p>
                <p className="mt-1 text-xs text-slate-400">initiatives</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-mono text-2xl tabular-nums">{sources.length}</p>
                <p className="mt-1 text-xs text-slate-400">sources</p>
              </div>
              <div className="px-4 py-3 pr-0">
                <p className="font-mono text-2xl tabular-nums">10</p>
                <p className="mt-1 text-xs text-slate-400">data collections</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <article className="border-t-2 border-emerald-600 pt-4">
          <h2 className="text-sm font-semibold text-slate-950">Initiatives by recorded evidence</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">The rating attached to each initiative record.</p>
          <div className="mt-6 space-y-3">
            {strengthOrder.map((item) => {
              const count = initiativeStrengths[item] ?? 0;
              const max = Math.max(...Object.values(initiativeStrengths), 1);
              return (
                <div key={item} className="grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-3 text-sm">
                  <div>
                    <div className="mb-1 flex justify-between gap-3 text-slate-700"><span>{evidenceLabels[item]}</span></div>
                    <div className="h-2 overflow-hidden bg-slate-100"><div className={`h-full ${strengthClass[item]}`} style={{ width: `${(count / max) * 100}%` }} /></div>
                  </div>
                  <span className="text-right font-mono text-xs tabular-nums text-slate-500">{count}</span>
                </div>
              );
            })}
          </div>
        </article>
        <article className="border-t-2 border-sky-600 pt-4">
          <h2 className="text-sm font-semibold text-slate-950">Study designs in the source library</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">One source may use one recorded design.</p>
          <div className="mt-6"><Bars entries={Object.entries(sourceMethods).sort((a, b) => b[1] - a[1]).slice(0, 6)} className="bg-sky-600" /></div>
        </article>
        <article className="border-t-2 border-amber-500 pt-4">
          <h2 className="text-sm font-semibold text-slate-950">Initiatives by category</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">The categories present in the dataset.</p>
          <div className="mt-6"><Bars entries={categoriesByCount.slice(0, 6)} className="bg-amber-500" /></div>
        </article>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Initiative records</h2>
              <p className="mt-1 text-sm text-slate-500"><span className="font-mono tabular-nums text-slate-950">{filtered.length}</span> of {initiatives.length} shown</p>
            </div>
            {activeFilters > 0 ? (
              <button onClick={() => { setQuery(""); setCategory("all"); setStrength("all"); setMethod("all"); }} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950">
                <X className="h-4 w-4" /> Clear filters
              </button>
            ) : null}
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_220px]">
            <label className="relative block">
              <span className="sr-only">Search initiative records</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-slate-300 bg-white py-2.5 pl-10 text-sm text-slate-950 placeholder:text-slate-400 focus:border-sky-600 focus:ring-sky-600" placeholder="Search initiative, outcome, or population" />
            </label>
            <label className="relative block">
              <span className="sr-only">Filter by category</span>
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full border-slate-300 bg-white py-2.5 pl-10 text-sm text-slate-700 focus:border-sky-600 focus:ring-sky-600">
                <option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="relative block">
              <span className="sr-only">Filter by evidence rating</span>
              <select value={strength} onChange={(event) => setStrength(event.target.value)} className="w-full border-slate-300 bg-white py-2.5 text-sm text-slate-700 focus:border-sky-600 focus:ring-sky-600">
                <option value="all">All evidence ratings</option>{strengthOrder.map((item) => <option key={item} value={item}>{evidenceLabels[item]}</option>)}
              </select>
            </label>
            <label className="relative block">
              <span className="sr-only">Filter by study design</span>
              <select value={method} onChange={(event) => setMethod(event.target.value)} className="w-full border-slate-300 bg-white py-2.5 text-sm text-slate-700 focus:border-sky-600 focus:ring-sky-600">
                <option value="all">All study designs</option>{methods.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-x-auto border border-slate-200">
          <table className="min-w-[1050px] w-full border-collapse text-left">
            <thead className="bg-slate-950 text-xs font-semibold uppercase tracking-[0.08em] text-slate-300">
              <tr><th className="px-5 py-3">Initiative</th><th className="px-5 py-3">Finding</th><th className="px-5 py-3">Evidence</th><th className="px-5 py-3">Study design</th><th className="px-5 py-3">Sources</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((initiative) => (
                <tr key={initiative.slug} className="align-top transition hover:bg-sky-50/70">
                  <td className="w-[23%] px-5 py-5">
                    <p className="text-xs font-medium text-slate-500">{initiative.category}</p>
                    <Link href={`/initiatives/${initiative.slug}`} className="mt-1 inline-flex items-start gap-2 font-semibold leading-5 text-slate-950 hover:text-sky-700"><span>{initiative.name}</span><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0" /></Link>
                    <p className="mt-2 text-xs text-slate-500">{initiative.years}</p>
                  </td>
                  <td className="w-[37%] px-5 py-5 text-sm leading-6 text-slate-700">{initiative.oneLineFinding}</td>
                  <td className="w-[15%] px-5 py-5"><span className="inline-flex border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700">{evidenceLabels[initiative.evidenceStrength]}</span></td>
                  <td className="w-[17%] px-5 py-5"><div className="flex flex-wrap gap-1.5">{initiative.methodTags.map((item) => <span key={item} className="border border-slate-200 px-2 py-1 text-xs text-slate-600">{item}</span>)}</div></td>
                  <td className="w-[8%] px-5 py-5 font-mono text-sm tabular-nums text-slate-600">{sourceCount(initiative)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
