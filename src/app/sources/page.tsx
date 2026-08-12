import { getSources } from "@/lib/content-loaders";
import { rankSources } from "@/lib/source-ranking";
import { SourcesLibrary } from "./SourcesLibrary";

export default function SourcesPage() {
  const sources = rankSources(getSources());

  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">Source library</p>
          <h1 className="mt-3 text-4xl font-semibold">{sources.length} linked studies and records</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Search by title, author, finding, caveat, or recorded study design. Each record opens at the original source.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <SourcesLibrary sources={sources} />
      </section>
    </main>
  );
}
