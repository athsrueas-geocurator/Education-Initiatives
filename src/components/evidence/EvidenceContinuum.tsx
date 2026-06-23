import type { ContinuumPosition, EvidenceStrength } from "@/lib/content-schema";
import { confidenceLabel } from "@/lib/evidence-normalization";
import { EvidenceStrengthBadge } from "./EvidenceStrengthBadge";
import { EvidenceScaleLegend } from "./EvidenceScaleLegend";
import clsx from "clsx";

type Props = {
  continuum: ContinuumPosition;
  evidenceStrength: EvidenceStrength;
  size?: "compact" | "full";
  showLegend?: boolean;
};

export function EvidenceContinuum({ continuum, evidenceStrength, size = "full", showLegend = true }: Props) {
  const bandWidth = continuum.uncertaintyHigh - continuum.uncertaintyLow;
  const isCompact = size === "compact";

  return (
    <div className={clsx("space-y-4", isCompact ? "text-sm" : "text-base")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <EvidenceStrengthBadge strength={evidenceStrength} compact={isCompact} />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {confidenceLabel(continuum.confidence)}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 text-xs font-semibold text-ink">
        <span>{continuum.leftPole}</span>
        <span className="text-muted">0-100</span>
        <span className="text-right">{continuum.rightPole}</span>
      </div>
      <div className="relative h-8 rounded-full border border-ink/15 bg-white shadow-inner">
        <div
          className="absolute top-1/2 h-5 -translate-y-1/2 rounded-full bg-amber/25"
          style={{ left: `${continuum.uncertaintyLow}%`, width: `${bandWidth}%` }}
        />
        <div
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-evidence shadow-dossier"
          style={{ left: `${continuum.position}%` }}
          aria-label={`Evidence synthesis at ${continuum.position} out of 100`}
        />
      </div>
      {!isCompact && <p className="max-w-3xl text-sm leading-6 text-muted">{continuum.explanation}</p>}
      {showLegend && !isCompact && <EvidenceScaleLegend />}
    </div>
  );
}
