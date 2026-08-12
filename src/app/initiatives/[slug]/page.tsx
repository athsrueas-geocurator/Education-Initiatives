import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SourceDrawer } from "@/components/evidence/SourceDrawer";
import { EvidenceStrengthBadge } from "@/components/evidence/EvidenceStrengthBadge";
import { MethodBadge } from "@/components/evidence/MethodBadge";
import {
  getInitiative,
  getInitiatives,
  getSourcesByIds
} from "@/lib/content-loaders";
import { rankSources } from "@/lib/source-ranking";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getInitiatives().map((initiative) => ({ slug: initiative.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  return {
    title: initiative ? `${initiative.name} | Education Evidence Dossier` : "Initiative"
  };
}

export default async function InitiativeDetailPage({ params }: Props) {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  if (!initiative) notFound();

  const sources = rankSources(getSourcesByIds(initiative.sourceIds));
  const facts = [
    ["Years / scale", initiative.years],
    ["Category", initiative.category],
    ["Target population", initiative.targetPopulation],
    ["Inputs changed", initiative.inputVariablesChanged],
    ["Outputs measured", initiative.outputsMeasured],
    ["Evaluation designs", initiative.evaluationDesigns],
    ["Data limits", initiative.normalizationIssues]
  ];

  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/initiatives" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" /> All initiatives</Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">{initiative.category}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight">{initiative.name}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{initiative.oneLineFinding}</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          <section className="border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Study-design assessment</p>
            <div className="flex flex-wrap gap-2">
              <EvidenceStrengthBadge strength={initiative.evidenceStrength} />
              {initiative.methodTags.map((method) => (
                <MethodBadge key={method} method={method} />
              ))}
            </div>
            <h2 className="mt-6 text-xl font-semibold text-slate-950">What changed</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{initiative.theoryOfAction}</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {facts.map(([label, value]) => (
              <div key={label} className="border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
                <p className="mt-3 text-sm leading-6 text-slate-800">{value || "Not specified in the source collection."}</p>
              </div>
            ))}
          </section>

          <SourceDrawer sources={sources} title="Linked sources" />
        </div>
      </section>
    </main>
  );
}
