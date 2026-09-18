"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { whatsappLink, floatingMessage } from "@/lib/utils";

export function FloatingWhatsApp() {
  const { settings } = useStore();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappLink(settings.whatsapp, floatingMessage(settings.brandName))}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className={`wa-float fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_32px_-6px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <MessageCircle size={26} fill="currentColor" strokeWidth={1.5} />
    </a>
  );
}
