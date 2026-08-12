import type { ResearchDesign } from "@/lib/content-schema";
import clsx from "clsx";

type Props = {
  method: ResearchDesign | string;
  muted?: boolean;
};

export function MethodBadge({ method, muted = false }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex border px-2.5 py-1 text-xs font-medium",
        muted ? "border-slate-200 bg-slate-50 text-slate-600" : "border-slate-200 bg-white text-slate-800"
      )}
    >
      {method}
    </span>
  );
}
