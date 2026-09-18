"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : ["/placeholder.jpg"];
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#f1ebe1] card-shadow">
        <AnimatePresence mode="wait">
          <motion.img
            key={list[active]}
            src={list[active]}
            alt={name}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>
      {list.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-20 w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                i === active ? "border-[#c9a96a]" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Ver foto ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
