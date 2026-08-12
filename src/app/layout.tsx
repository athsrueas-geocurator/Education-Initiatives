import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Education Initiative Evidence",
  description: "A source-backed view of U.S. education initiatives, findings, study designs, and outcomes."
};

const navItems = [
  ["Initiatives", "/initiatives"],
  ["Sources", "/sources"],
  ["Methods", "/methods"],
  ["Glossary", "/glossary"],
  ["Data", "/about"]
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex shrink-0 items-center gap-3 font-semibold text-slate-950">
              <span className="grid h-8 w-8 place-items-center bg-slate-950 text-white">
                <BarChart3 className="h-4 w-4" />
              </span>
              <span className="hidden sm:inline">Education Initiative Evidence</span>
            </Link>
            <nav className="flex min-w-0 flex-wrap items-center justify-end gap-1 text-sm font-medium text-slate-600">
              {navItems.map(([label, href]) => (
                <Link key={href} href={href} className="px-3 py-2 hover:bg-slate-100 hover:text-slate-950">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-7 text-sm text-slate-500 sm:px-6 lg:px-8">
            Initiative records, source links, and research metadata are drawn from the local evidence collection.
          </div>
        </footer>
      </body>
    </html>
  );
}
