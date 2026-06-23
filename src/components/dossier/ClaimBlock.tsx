type Props = {
  label: string;
  title: string;
  body: string;
};

export function ClaimBlock({ label, title, body }: Props) {
  return (
    <section className="border-t border-rule py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">{label}</p>
      <h2 className="mt-3 font-serif text-3xl text-ink">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{body}</p>
    </section>
  );
}
