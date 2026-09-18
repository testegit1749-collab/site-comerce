"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  dark = false,
  linkHref,
  linkLabel,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent?: string;
  dark?: boolean;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] ${dark ? "text-[#c49c6b]" : "text-[#8a6a35]"}`}>
            <span className={`inline-block h-px w-10 ${dark ? "bg-[#c49c6b]/60" : "bg-[#8a6a35]/50"}`} />
            {index} — {eyebrow}
          </p>
          <h2 className={`mt-4 font-serif-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl ${dark ? "text-white" : ""}`}>
            {title}{" "}
            {accent && <em className="gold-text font-accent">{accent}</em>}
          </h2>
        </div>
        {linkHref && (
          <Link
            href={linkHref}
            className={`group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all hover:gap-3 ${
              dark
                ? "border-white/20 text-white/85 hover:border-[#c49c6b] hover:text-white"
                : "border-[#141210]/15 text-[#141210] hover:border-[#141210] hover:bg-[#141210] hover:text-white"
            }`}
          >
            {linkLabel || "Ver tudo"}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>
    </Reveal>
  );
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#141210] hover:text-[#8a6a35]">
      {children}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
