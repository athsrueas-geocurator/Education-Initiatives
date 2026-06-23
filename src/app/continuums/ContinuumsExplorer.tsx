"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { EvidenceContinuum } from "@/components/evidence/EvidenceContinuum";
import { EvidenceStrengthBadge } from "@/components/evidence/EvidenceStrengthBadge";
import type { Dichotomy, EvidenceStrength } from "@/lib/content-schema";

type Props = {
  dichotomies: Dichotomy[];
};

const strengthOptions: Array<EvidenceStrength | "all"> = [
  "all",
  "strong-causal",
  "promising-causal-quasi",
  "mixed-conditional",
  "limited-descriptive",
  "not-outcome-intervention"
];

export function ContinuumsExplorer({ dichotomies }: Props) {
  const [topic, setTopic] = useState("all");
  const [strength, setStrength] = useState<EvidenceStrength | "all">("all");
  const [confidence, setConfidence] = useState("all");

  const topics = useMemo(() => ["all", ...Array.from(new Set(dichotomies.map((item) => item.topic))).sort()], [
    dichotomies
  ]);

  const filtered = dichotomies.filter((item) => {
    return (
      (topic === "all" || item.topic === topic) &&
      (strength === "all" || item.evidenceStrength === strength) &&
      (confidence === "all" || item.continuum.confidence === confidence)
    );
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-rule bg-white p-4">
        <div className="mb-4 flex items-center gap-2 font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4" />
          Filter scales
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-sm font-medium text-ink">
            Topic
            <select value={topic} onChange={(event) => setTopic(event.target.value)} className="mt-2 w-full rounded-md border-rule">
              {topics.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All topics" : option}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Evidence strength
            <select
              value={strength}
              onChange={(event) => setStrength(event.target.value as EvidenceStrength | "all")}
              className="mt-2 w-full rounded-md border-rule"
            >
              {strengthOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All strengths" : option}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Confidence
            <select
              value={confidence}
              onChange={(event) => setConfidence(event.target.value)}
              className="mt-2 w-full rounded-md border-rule"
            >
              <option value="all">All confidence levels</option>
              <option value="high">High confidence</option>
              <option value="medium">Medium confidence</option>
              <option value="low">Low confidence</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((dichotomy) => (
          <Link
            key={dichotomy.slug}
            href={`/continuums/${dichotomy.slug}`}
            className="group rounded-lg border border-rule bg-white p-5 shadow-sm transition hover:border-evidence hover:shadow-dossier"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">{dichotomy.topic}</p>
                <h2 className="mt-2 font-serif text-3xl text-ink">{dichotomy.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{dichotomy.whatEvidenceSuggests}</p>
              </div>
              <div className="flex items-center gap-3">
                <EvidenceStrengthBadge strength={dichotomy.evidenceStrength} compact />
                <ArrowRight className="h-5 w-5 text-muted transition group-hover:translate-x-1 group-hover:text-evidence" />
              </div>
            </div>
            <div className="mt-6">
              <EvidenceContinuum
                continuum={dichotomy.continuum}
                evidenceStrength={dichotomy.evidenceStrength}
                size="compact"
                showLegend={false}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
