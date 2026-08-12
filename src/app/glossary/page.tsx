import { GlossaryLibrary } from "./GlossaryLibrary";
import { getGlossary } from "@/lib/content-loaders";

export default function GlossaryPage() {
  const entries = getGlossary().sort((a, b) => a.section.localeCompare(b.section) || a.term.localeCompare(b.term));

  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">Glossary</p>
          <h1 className="mt-3 text-4xl font-semibold">Terms used in the evidence records</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">These definitions explain the data, study designs, outcomes, and limits shown throughout the collection. A dataset is not causal on its own; causal inference depends on the study design and comparison group.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:px-8"><GlossaryLibrary entries={entries} /></section>
    </main>
  );
}
