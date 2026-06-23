import { Circle, MoveHorizontal } from "lucide-react";

export function EvidenceScaleLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted">
      <span className="inline-flex items-center gap-1.5">
        <Circle className="h-3.5 w-3.5 fill-evidence text-evidence" />
        Synthesis dot
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MoveHorizontal className="h-3.5 w-3.5 text-amber" />
        Reasonable uncertainty band
      </span>
      <span>This is editorial synthesis, not a meta-analytic coefficient.</span>
    </div>
  );
}
