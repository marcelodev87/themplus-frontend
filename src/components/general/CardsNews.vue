<script setup lang="ts">
defineOptions({
  name: 'CardsNews',
});

const openURL = (url: string) => {
  window.open(url, '_blank');
};
</script>
<template>
  <div class="q-px-sm row justify-between q-gutter-md">
    <div
      :class="
        !$q.screen.lt.md
          ? 'row justify-around full-width'
          : 'column items-center full-width'
      "
    >
      <q-card class="q-pa-md column items-center q-mt-md" style="width: 40%">
        <q-img
          src="/images/banner/1.png"
          class="hover cursor-pointer"
          @click="
            openURL(
              'https://wa.me/5521985566260?text=Ol%C3%A1.%20Preciso%20melhorar%20a%20gest%C3%A3o%20financeira%20da%20minha%20Igreja%20e%20preciso%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Tesoureiro%20Expert'
            )
          "
        />

        <q-card-section class="text-subtitle2">
          O Tesoureiro Expert é um serviço de gestão financeira terceirizada
          voltado para igrejas que enfrentam desafios na administração da
          tesouraria. Com uma abordagem profissional, ajuda pastores e líderes a
          tomarem decisões estratégicas com base em dados, evita juros e multas
          por atrasos em contas, mantém a contabilidade sempre regularizada e
          fortalece o relacionamento da igreja com bancos e fornecedores. Com o
          Tesoureiro Expert, sua igreja ganha organização, transparência e
          segurança financeira para continuar crescendo!
        </q-card-section>
      </q-card>
      <q-card class="q-pa-md column items-center q-mt-md" style="width: 40%">
        <q-img
          src="/images/banner/2.png"
          class="hover cursor-pointer"
          @click="
            openURL(
              'https://wa.me/5521999109966?text=Ol%C3%A1.%20Quero%20fazer%20a%20Identidade%20Visual%20da%20minha%20Igreja.%20Poderia%20me%20passar%20informa%C3%A7%C3%B5es%3F'
            )
          "
        />

        <q-card-section class="text-subtitle2">
          A identidade visual para igrejas é fundamental para transmitir a
          essência, os valores e a missão do seu Ministério. Um design bem
          planejado — incluindo logotipo, cores, tipografia e materiais gráficos
          — fortalece a presença da igreja, cria unidade entre os membros e
          passa uma imagem séria e acolhedora. Além disso, uma identidade visual
          consistente facilita a comunicação nas redes sociais, sites e
          materiais impressos. Fortaleça a mensagem do seu Ministério criando
          uma identidade visual que reflita a missão e os valores da sua igreja!
        </q-card-section>
      </q-card>
    </div>
    <div
      :class="
        !$q.screen.lt.md
          ? 'row justify-around full-width'
          : 'column items-center full-width'
      "
    >
      <q-card class="q-pa-md column items-center q-mt-md" style="width: 40%">
        <q-img
          src="/images/banner/3.png"
          class="hover cursor-pointer"
          @click="
            openURL(
              'https://wa.me/5521985566260?text=Ol%C3%A1.%20Preciso%20melhorar%20a%20gest%C3%A3o%20financeira%20da%20minha%20Igreja%20e%20preciso%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Tesoureiro%20Expert'
            )
          "
        />

        <q-card-section class="text-subtitle2">
          Um site para igrejas é uma ferramenta essencial para fortalecer a
          comunicação, expandir o alcance e engajar membros e visitantes. Com um
          site bem estruturado, sua igreja pode compartilhar eventos, mensagens
          edificantes e informações importantes de forma acessível. Além disso,
          permite doações online e reforça a identidade da igreja no mundo
          digital. Sua igreja ainda não tem um site? Não perca a oportunidade de
          levar sua mensagem ainda mais longe!
        </q-card-section>
      </q-card>
      <q-card class="q-pa-md column items-center q-mt-md" style="width: 40%">
        <q-img
          src="/images/banner/4.png"
          class="hover cursor-pointer"
          @click="
            openURL(
              'https://wa.me/5521999109966?text=Ol%C3%A1.%20Quero%20fazer%20a%20Identidade%20Visual%20da%20minha%20Igreja.%20Poderia%20me%20passar%20informa%C3%A7%C3%B5es%3F'
            )
          "
        />

        <q-card-section class="text-subtitle2">
          O Registro de Marca é essencial para garantir a proteção legal e a
          identidade exclusiva da sua igreja. Sem o registro, qualquer pessoa ou
          instituição pode reivindicar o nome, impedindo sua utilização e até
          forçando uma mudança inesperada. Além disso, ter a marca registrada
          fortalece a credibilidade da igreja e evita problemas jurídicos com
          outros ministérios.
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
