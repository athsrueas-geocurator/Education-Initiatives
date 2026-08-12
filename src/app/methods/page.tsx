import { MethodBadge } from "@/components/evidence/MethodBadge";
import { getMethods } from "@/lib/content-loaders";

const featured = [
  "RCT",
  "Lottery",
  "Regression discontinuity",
  "Difference-in-differences",
  "Event study",
  "Matched comparison",
  "Meta-analysis",
  "NAEP",
  "SEDA",
  "Effect sizes",
  "ITT vs TOT",
  "Cost-effectiveness",
  "Fidelity and implementation risk"
];

export default function MethodsPage() {
  const methods = getMethods();
  const groups = Map.groupBy(methods, (method) => method.section);

  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">Research metadata</p>
          <h1 className="mt-3 text-4xl font-semibold">Study designs and data terms</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Definitions used in the source records and initiative table.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap gap-2">
          {featured.map((item) => (
            <MethodBadge key={item} method={item} />
          ))}
        </div>
        <div className="grid gap-8">
          {Array.from(groups.entries()).map(([section, items]) => (
            <section key={section} className="border-t border-slate-200 pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">{section}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <article key={`${item.section}-${item.item}`} className="border border-slate-200 bg-white p-5">
                    <h2 className="text-lg font-semibold text-slate-950">{item.item}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.definition}</p>
                    {item.urls.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.urls.slice(0, 3).map((url) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-slate-300 px-3 py-1 text-xs font-medium text-sky-700 hover:border-sky-700"
                          >
                            Source
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
