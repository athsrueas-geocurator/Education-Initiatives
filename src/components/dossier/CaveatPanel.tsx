type Props = {
  title?: string;
  items: string[];
};

export function CaveatPanel({ title = "Common misreadings", items }: Props) {
  return (
    <section className="rounded-lg border border-amber/30 bg-amber/10 p-6">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item} className="border-l-2 border-amber pl-3 text-sm leading-6 text-ink">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
