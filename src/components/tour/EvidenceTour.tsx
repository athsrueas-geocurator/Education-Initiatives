import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { evidenceLabels } from "@/lib/evidence-normalization";
import type { Initiative, Source } from "@/lib/content-schema";
import { TourNavigation } from "./TourNavigation";

type TourStop = {
  number: string;
  statement: string;
  detail: string;
  initiativeSlugs: string[];
};

const stops: TourStop[] = [
  {
    number: "01",
    statement: "Tutoring beats most education innovation.",
    detail: "Frequent, curriculum-aligned tutoring is one of the clearest short-run learning interventions in the collection.",
    initiativeSlugs: ["high-dosage-tutoring", "saga-style-and-tech-infused-tutoring"]
  },
  {
    number: "02",
    statement: "Money matters. The argument is where it goes.",
    detail: "Causal finance studies reject the idea that sustained, targeted school funding is irrelevant to student outcomes.",
    initiativeSlugs: ["school-finance-reforms-adequacy-and-equity-funding"]
  },
  {
    number: "03",
    statement: "Rigor without support is policy theater.",
    detail: "Ending low tracks can widen access while still increasing failures when schools do not build the instructional capacity to carry students through.",
    initiativeSlugs: ["algebra-for-all-college-preparatory-curriculum-for-all", "double-dose-algebra-chicago"]
  },
  {
    number: "04",
    statement: "Career pathways deserve more respect.",
    detail: "Career Academies have unusually strong long-run labor-market evidence, especially compared with broad claims about generic college readiness.",
    initiativeSlugs: ["career-academies", "early-college-high-schools"]
  },
  {
    number: "05",
    statement: "Teacher bonuses are not school improvement.",
    detail: "The collection is stronger on sustained coaching and feedback than on simple test-score bonuses.",
    initiativeSlugs: ["teacher-merit-pay-point-and-similar-incentives", "teacher-coaching", "dc-impact-teacher-evaluation-with-consequences"]
  },
  {
    number: "06",
    statement: "AI has not earned the right to replace adults.",
    detail: "The K-12 AI record is early and uneven. Human-led tutoring has a much older and stronger causal base.",
    initiativeSlugs: ["generative-ai-tutoring-and-ai-school-pilots", "high-dosage-tutoring"]
  }
];

function SourcePreview({ source }: { source: Source }) {
  return (
    <a href={source.url} target="_blank" rel="noreferrer" className="group block border-t border-slate-200 py-3 first:border-t-0">
      <p className="text-xs font-medium text-slate-500">{source.method} · {source.year}</p>
      <p className="mt-1 text-sm font-medium leading-5 text-slate-900 group-hover:text-sky-700">“{source.title}” <ExternalLink className="ml-1 inline h-3.5 w-3.5" /></p>
    </a>
  );
}

function EvidenceLedger({ initiatives, sources }: { initiatives: Initiative[]; sources: Source[] }) {
  const sourceIds = Array.from(new Set(initiatives.flatMap((initiative) => initiative.sourceIds)));
  const linkedSources = sourceIds.map((id) => sources.find((source) => source.id === id)).filter((source): source is Source => Boolean(source));
  const strongCount = initiatives.filter((initiative) => initiative.evidenceStrength === "strong-causal").length;
  const max = Math.max(initiatives.length, 1);

  return (
    <aside className="border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Sources</p>
          <p className="mt-1 font-mono text-3xl tabular-nums text-slate-950">{linkedSources.length}</p>
          <p className="text-xs text-slate-500">linked source records</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Initiatives</p>
          <p className="font-mono text-2xl tabular-nums text-slate-950">{strongCount}/{initiatives.length}</p>
          <p className="text-xs text-slate-500">rated strong causal</p>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden bg-slate-100" aria-label={`${strongCount} of ${initiatives.length} initiatives rated strong causal`}><div className="h-full bg-sky-600" style={{ width: `${(strongCount / max) * 100}%` }} /></div>
      <p className="mt-3 text-xs leading-5 text-slate-500">The bar counts initiative assessments, not sources. More citations do not automatically make an effect causal.</p>
      <div className="mt-5">
        {linkedSources.slice(0, 3).map((source) => <SourcePreview key={source.id} source={source} />)}
      </div>
    </aside>
  );
}

export function EvidenceTour({ initiatives, sources }: { initiatives: Initiative[]; sources: Source[] }) {
  const initiativeMap = new Map(initiatives.map((initiative) => [initiative.slug, initiative]));

  return (
    <main className="bg-white">
      <section className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">Guided tour</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">Six conclusions this evidence collection can defend.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">Each stop pairs an editorial position with the initiative records and source titles behind it.</p>
          <a href="#stop-01" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-300"><ArrowDownRight className="h-4 w-4" /> Begin</a>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-[1180px] gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">How to read this</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Evidence is not a vote count.</h2>
          </div>
          <p className="text-sm leading-6 text-slate-600"><strong className="font-semibold text-slate-950">Strong causal</strong> means the study design can reasonably test whether the initiative caused a measured outcome, not merely whether the two moved together.</p>
          <p className="text-sm leading-6 text-slate-600"><strong className="font-semibold text-slate-950">Not strong causal</strong> does not mean false or useless. It means this collection cannot make as direct a cause-and-effect claim. <Link href="/methods" className="font-medium text-sky-700 hover:text-sky-900">Study designs</Link></p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <TourNavigation stops={stops} />
        <div>
          {stops.map((stop) => {
            const records = stop.initiativeSlugs.map((slug) => initiativeMap.get(slug)).filter((initiative): initiative is Initiative => Boolean(initiative));
            return (
              <section key={stop.number} id={`stop-${stop.number}`} className="scroll-mt-20 border-b border-slate-200 last:border-b-0">
                <div className="mx-auto max-w-[1180px] grid gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8 lg:py-20">
                  <div>
                    <p className="border-l-2 border-sky-600 pl-3 font-mono text-sm text-sky-700">{stop.number}</p>
                    <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">{stop.statement}</h2>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{stop.detail}</p>
                    <div className="mt-9 grid gap-3">
                      {records.map((initiative) => (
                        <Link key={initiative.slug} href={`/initiatives/${initiative.slug}`} className="group border-l-2 border-slate-200 py-2 pl-4 hover:border-sky-600">
                          <p className="text-xs font-medium text-slate-500">{initiative.category} · {evidenceLabels[initiative.evidenceStrength]}</p>
                          <p className="mt-1 font-semibold text-slate-950 group-hover:text-sky-700">{initiative.name} <ArrowUpRight className="ml-1 inline h-4 w-4" /></p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{initiative.oneLineFinding}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="lg:pt-10"><EvidenceLedger initiatives={records} sources={sources} /></div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
