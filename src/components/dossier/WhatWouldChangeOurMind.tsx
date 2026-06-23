import { Lightbulb } from "lucide-react";

type Props = {
  body: string;
};

export function WhatWouldChangeOurMind({ body }: Props) {
  return (
    <section className="rounded-lg border border-evidence/25 bg-evidence/10 p-6">
      <div className="flex items-center gap-3">
        <Lightbulb className="h-5 w-5 text-evidence" />
        <h2 className="font-serif text-2xl text-ink">What would change our mind?</h2>
      </div>
      <p className="mt-4 text-sm leading-7 text-ink">{body}</p>
    </section>
  );
}
