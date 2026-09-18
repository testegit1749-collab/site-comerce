import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Garantia",
  description: "Garantia Eli Luz contra defeitos de fabricação: banho ouro 18k e acabamento hipoalergênico com atendimento direto no WhatsApp.",
};

export default function GarantiaPage() {
  return (
    <InfoPage eyebrow="Compre tranquila" title="Garantia" accent="total">
      <p>
        Todas as peças da <strong>Eli Luz</strong> passam por conferência antes do envio e têm{" "}
        <strong>garantia contra defeitos de fabricação</strong> — fechos, soldas, cravejamento
        e banho.
      </p>
      <p>
        Se a sua peça apresentar qualquer defeito, fale com a gente no{" "}
        <strong>WhatsApp com fotos e o código do produto</strong>. Vamos avaliar e resolver:
        reparo, troca por peça igual ou vale-compras, o que for melhor para você.
      </p>
      <p>
        <strong>Cuidados que prolongam o brilho:</strong> evite contato com perfumes, cremes,
        água do mar e piscina; guarde cada peça separadamente e limpe com flanela seca.
        O desgaste natural do banho pelo uso diário não é coberto, mas oferecemos
        rebanho com condição especial — é só chamar.
      </p>
    </InfoPage>
  );
}
