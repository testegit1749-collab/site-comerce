import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Trocas e devoluções",
  description: "Como trocar ou devolver sua peça Eli Luz: prazo, condições e atendimento direto no WhatsApp.",
};

export default function TrocasPage() {
  return (
    <InfoPage eyebrow="Sem complicação" title="Trocas e" accent="devoluções">
      <p>
        <strong>Arrependimento:</strong> você tem até <strong>7 dias após o recebimento</strong>{" "}
        para desistir da compra, com reembolso integral. É só chamar no WhatsApp.
      </p>
      <p>
        <strong>Trocas por tamanho ou modelo:</strong> aceitamos em até{" "}
        <strong>7 dias</strong>, desde que a peça esteja <strong>sem sinais de uso</strong>,
        com etiqueta e embalagem original. O frete de retorno é por conta da cliente e o
        reenvio por nossa conta na primeira troca.
      </p>
      <p>
        <strong>Peça com defeito:</strong> segue direto para a nossa{" "}
        <strong>garantia</strong> — sem prazo curto e sem burocracia. Envie fotos e o código
        da peça no WhatsApp que resolvemos rapidinho.
      </p>
    </InfoPage>
  );
}
