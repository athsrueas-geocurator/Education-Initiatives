import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { EvidenceStrength } from "@/lib/content-schema";
import { EvidenceStrengthBadge } from "../evidence/EvidenceStrengthBadge";

type Props = {
  claim: string;
  caveat: string;
  href: string;
  evidenceStrength: EvidenceStrength;
};

export function ShockCard({ claim, caveat, href, evidenceStrength }: Props) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-rule bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-dossier"
    >
      <div className="flex items-start justify-between gap-4">
        <EvidenceStrengthBadge strength={evidenceStrength} compact />
        <ArrowUpRight className="h-5 w-5 text-muted transition group-hover:text-evidence" />
      </div>
      <h3 className="mt-6 font-serif text-2xl leading-tight text-ink">{claim}</h3>
      <p className="mt-4 text-sm leading-6 text-muted">{caveat}</p>
    </Link>
  );
}
