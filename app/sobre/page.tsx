import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: "Conheça a Eli Luz: curadoria de bijuterias e semijoias delicadas, banho ouro 18k e atendimento próximo no WhatsApp.",
};

export default function SobrePage() {
  return (
    <InfoPage eyebrow="Nossa história" title="Sobre" accent="nós">
      <p>
        A <strong>Eli Luz</strong> nasceu do amor por detalhes: aquela peça delicada que transforma
        o humor do dia, que acompanha do trabalho à festa e que faz você se sentir iluminada
        sem esforço.
      </p>
      <p>
        Trabalhamos com <strong>curadoria semanal</strong> — garimpamos tendências, testamos
        acabamento e só colocamos no catálogo aquilo que usaríamos. A maioria das peças tem{" "}
        <strong>banho ouro 18k</strong> e materiais hipoalergênicos, para brilhar com conforto.
      </p>
      <p>
        Por aqui o atendimento é de verdade: você fala direto com a gente no{" "}
        <strong>WhatsApp</strong>, recebe fotos reais, tira dúvidas de tamanho e acompanha
        reposições e novidades em primeira mão.
      </p>
      <p>
        Seja bem-vinda à nossa vitrine. Escolha com calma, pergunte à vontade — e encontre
        a peça que parece ter sido feita para você.
      </p>
    </InfoPage>
  );
}
