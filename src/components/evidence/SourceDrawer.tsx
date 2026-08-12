import type { Source } from "@/lib/content-schema";
import { ChevronDown } from "lucide-react";
import { SourceCard } from "./SourceCard";

type Props = {
  sources: Source[];
  title?: string;
};

export function SourceDrawer({ sources, title = "Sources" }: Props) {
  return (
    <details className="group border border-slate-200 bg-white p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
        <span>
          {title} <span className="text-slate-500">({sources.length})</span>
        </span>
        <ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
      </summary>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </details>
  );
}
