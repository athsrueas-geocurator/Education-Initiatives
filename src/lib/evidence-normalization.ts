import type { EvidenceStrength } from "./content-schema";

export const evidenceLabels: Record<EvidenceStrength, string> = {
  "strong-causal": "Strong causal",
  "promising-causal-quasi": "Promising causal/quasi",
  "mixed-conditional": "Mixed/conditional",
  "limited-descriptive": "Limited/descriptive",
  "not-outcome-intervention": "Not an outcome intervention"
};

export const evidenceDescriptions: Record<EvidenceStrength, string> = {
  "strong-causal": "Multiple strong causal designs or unusually clear outcome evidence.",
  "promising-causal-quasi": "Credible causal or quasi-causal evidence with narrower scope or replication limits.",
  "mixed-conditional": "Effects vary by outcome, implementation, setting, or student group.",
  "limited-descriptive": "Trend, implementation, or descriptive evidence without strong causal identification.",
  "not-outcome-intervention": "A framework or infrastructure item rather than a direct student intervention."
};

export function strengthTone(strength: EvidenceStrength): string {
  switch (strength) {
    case "strong-causal":
      return "bg-evidence text-white border-evidence";
    case "promising-causal-quasi":
      return "bg-blue text-white border-blue";
    case "mixed-conditional":
      return "bg-amber text-white border-amber";
    case "not-outcome-intervention":
      return "bg-ink text-white border-ink";
    default:
      return "bg-white text-ink border-rule";
  }
}

export function clampPosition(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function confidenceLabel(value: "high" | "medium" | "low"): string {
  return `${value[0].toUpperCase()}${value.slice(1)} confidence`;
}
