import type { Source } from "@/lib/content-schema";
import { ExternalLink } from "lucide-react";
import { EvidenceStrengthBadge } from "./EvidenceStrengthBadge";
import { MethodBadge } from "./MethodBadge";

type Props = {
  source: Source;
};

export function SourceCard({ source }: Props) {
  return (
    <article className="border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <MethodBadge method={source.method} />
        <EvidenceStrengthBadge strength={source.evidenceStrength} compact />
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-tight text-slate-950">{source.title}</h3>
      <p className="mt-1 text-sm text-slate-500">
        {source.authors}
        {source.year ? `, ${source.year}` : ""}
      </p>
      <p className="mt-4 text-sm leading-6 text-slate-800">{source.finding}</p>
      <p className="mt-3 border-l-2 border-amber-500 pl-3 text-sm leading-6 text-slate-600">{source.caveat}</p>
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-slate-950"
      >
        Open source <ExternalLink className="h-4 w-4" />
      </a>
    </article>
  );
}
