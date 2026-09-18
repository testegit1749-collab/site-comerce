"use client";

export function Marquee({
  items,
  dark = true,
  slow = false,
}: {
  items: string[];
  dark?: boolean;
  slow?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden border-y py-3.5 ${
        dark ? "border-white/10 bg-[#0a0b0d] text-[#e9d9b8]" : "border-[#e7dcc6] bg-[#141210] text-[#e9d9b8]"
      }`}
    >
      <div className={`flex w-max items-center gap-8 whitespace-nowrap ${slow ? "animate-marquee-slow" : "animate-marquee"}`}>
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-8" aria-hidden={half === 1}>
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-8 text-[12px] font-medium uppercase tracking-[0.28em]">
                {item}
                <span className="text-[#c49c6b]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
