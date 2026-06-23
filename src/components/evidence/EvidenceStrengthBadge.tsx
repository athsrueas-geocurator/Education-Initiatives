import { evidenceLabels, strengthTone } from "@/lib/evidence-normalization";
import type { EvidenceStrength } from "@/lib/content-schema";
import clsx from "clsx";

type Props = {
  strength: EvidenceStrength;
  compact?: boolean;
};

export function EvidenceStrengthBadge({ strength, compact = false }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
        strengthTone(strength),
        compact && "px-2 py-0.5 text-[10px]"
      )}
    >
      {evidenceLabels[strength]}
    </span>
  );
}
