import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Guia de medidas",
  description: "Descubra seu tamanho de anel, pulseira e colar com o guia de medidas Eli Luz.",
};

const ANEIS: [string, string][] = [
  ["12", "51,5 mm"], ["13", "52,8 mm"], ["14", "54,1 mm"], ["15", "55,4 mm"],
  ["16", "56,7 mm"], ["17", "58,0 mm"], ["18", "59,3 mm"], ["19", "60,6 mm"],
  ["20", "61,9 mm"], ["21", "63,2 mm"], ["22", "64,5 mm"],
];

export default function MedidasPage() {
  return (
    <InfoPage eyebrow="Acerte no tamanho" title="Guia de" accent="medidas">
      <p>
        <strong>Anéis:</strong> meça a circunferência interna de um anel que sirva bem com
        régua ou fita métrica e compare na tabela. Na dúvida entre dois tamanhos, prefira
        o maior para anéis largos.
      </p>
      <div className="overflow-hidden rounded-2xl border border-[#e7dcc6]">
        <table className="w-full bg-white text-sm">
          <thead>
            <tr className="bg-[#141210] text-left text-[#f2dbbb]">
              <th className="px-4 py-3 font-semibold">Tamanho (BR)</th>
              <th className="px-4 py-3 font-semibold">Circunferência interna</th>
            </tr>
          </thead>
          <tbody>
            {ANEIS.map(([t, c]) => (
              <tr key={t} className="border-t border-[#f1ebe1]">
                <td className="px-4 py-2.5 font-semibold">{t}</td>
                <td className="px-4 py-2.5 text-[#6f6a61]">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <strong>Pulseiras:</strong> meça o pulso com fita e some 1,5–2 cm de folga. Medidas
        mais comuns: 16 cm (fino), 18 cm (médio), 20 cm (folgado).
      </p>
      <p>
        <strong>Colares:</strong> 40 cm (choker, na base do pescoço), 45 cm (clássico, na
        clavícula), 55–60 cm (longo, sobre o busto). A maioria dos nossos colares tem
        extensor de 5 cm para ajuste fino.
      </p>
    </InfoPage>
  );
}
