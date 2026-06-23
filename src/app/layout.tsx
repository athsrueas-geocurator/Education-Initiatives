import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Education Evidence Dossier",
  description: "A guided tour through U.S. education reform evidence, mechanisms, and philosophical dichotomies."
};

const navItems = [
  ["Continuums", "/continuums"],
  ["Initiatives", "/initiatives"],
  ["Methods", "/methods"],
  ["Sources", "/sources"],
  ["About", "/about"]
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex shrink-0 items-center gap-3 font-semibold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper">
                <BookOpenCheck className="h-5 w-5" />
              </span>
              <span className="hidden sm:inline">Education Evidence Dossier</span>
            </Link>
            <nav className="flex min-w-0 flex-wrap items-center justify-end gap-1 text-sm font-medium text-muted">
              {navItems.map(([label, href]) => (
                <Link key={href} href={href} className="rounded-full px-3 py-2 hover:bg-white hover:text-ink">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-rule bg-ink text-paper">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-paper/70 sm:px-6 lg:px-8">
            The evidence rarely says the slogan is right. It usually says this mechanism worked, under these
            conditions, on these outcomes, with these tradeoffs.
          </div>
        </footer>
      </body>
    </html>
  );
}
