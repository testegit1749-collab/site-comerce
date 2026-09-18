import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Marcellus } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { AdminFab } from "@/components/AdminFab";

const serif = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const serifAccent = Cormorant_Garamond({
  variable: "--font-serif-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: "italic",
});
const display = Marcellus({ variable: "--font-display", subsets: ["latin"], weight: "400" });
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Eli Luz — Bijuterias & Semijoias", template: "%s | Eli Luz" },
  description: "Catálogo digital Eli Luz de bijuterias e semijoias: brincos, colares, pulseiras, anéis e conjuntos. Peças delicadas com curadoria semanal.",
  openGraph: {
    title: "Eli Luz — Bijuterias & Semijoias",
    description: "Detalhes que transformam. Explore o catálogo e chame no WhatsApp.",
    type: "website",
    locale: "pt_BR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${serifAccent.variable} ${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <AdminFab />
        </StoreProvider>
      </body>
    </html>
  );
}
