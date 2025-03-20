<script setup lang="ts">
defineOptions({
  name: 'CardsNews',
});

const openURL = (url: string) => {
  window.open(url, '_blank');
};
</script>
<template>
  <div class="q-px-sm row justify-between">
    <div
      :class="
        !$q.screen.lt.md
          ? 'row justify-around full-width'
          : 'column items-center full-width'
      "
    >
      <q-card
        class="q-pa-sm column items-center q-mt-md"
        :style="!$q.screen.lt.md ? 'width: 40%' : 'width: 95%'"
      >
        <q-img
          src="/images/banner/1.png"
          class="hover cursor-pointer"
          @click="
            openURL(
              'https://wa.me/5521985566260?text=Ol%C3%A1.%20Preciso%20melhorar%20a%20gest%C3%A3o%20financeira%20da%20minha%20Igreja%20e%20preciso%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Tesoureiro%20Expert'
            )
          "
          width="90%"
        />

        <q-card-section class="text-body1 q-pa-none q-py-md" style="width: 90%">
          <p>
            O <strong>Tesoureiro Expert</strong> é um serviço de gestão
            financeira terceirizada voltado para igrejas que enfrentam desafios
            na administração da tesouraria.
          </p>
          <p>
            Com uma abordagem profissional,
            <strong>ajuda pastores e líderes a tomarem decisões</strong>
            estratégicas com base em dados, evita juros e multas por atrasos em
            contas, mantém a contabilidade sempre regularizada e fortalece o
            relacionamento da igreja com bancos e fornecedores.
          </p>
          <p>
            Com o Tesoureiro Expert, sua igreja ganha
            <strong>organização, transparência e segurança</strong> financeira
            para continuar crescendo!
          </p>
        </q-card-section>
      </q-card>
      <q-card
        class="q-pa-sm column items-center q-mt-md"
        :style="!$q.screen.lt.md ? 'width: 40%' : 'width: 95%'"
      >
        <q-img
          src="/images/banner/2.png"
          class="hover cursor-pointer"
          @click="
            openURL(
              'https://wa.me/5521999109966?text=Ol%C3%A1.%20Quero%20fazer%20a%20Identidade%20Visual%20da%20minha%20Igreja.%20Poderia%20me%20passar%20informa%C3%A7%C3%B5es%3F'
            )
          "
          width="90%"
        />

        <q-card-section class="text-body1 q-pa-none q-py-md" style="width: 90%">
          <p>
            A <strong>identidade visual</strong> para igrejas é fundamental para
            transmitir a essência, os valores e a missão do seu Ministério.
          </p>
          <p>
            Um design <strong>bem planejado</strong> — incluindo logotipo,
            cores, tipografia e materiais gráficos — fortalece a presença da
            igreja, cria unidade entre os membros e passa uma imagem séria e
            acolhedora.
          </p>
          <p>
            Além disso, uma identidade visual consistente facilita a comunicação
            nas redes sociais, sites e materiais impressos.
          </p>
          <p>
            Fortaleça a mensagem do seu Ministério criando uma identidade visual
            que <strong>reflita a missão e os valores da sua igreja!</strong>
          </p>
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
      <q-card
        class="q-pa-sm column items-center q-my-md"
        :style="!$q.screen.lt.md ? 'width: 40%' : 'width: 95%'"
      >
        <q-img
          src="/images/banner/3.png"
          class="hover cursor-pointer"
          @click="
            openURL(
              'https://wa.me/5521985566260?text=Ol%C3%A1.%20Preciso%20melhorar%20a%20gest%C3%A3o%20financeira%20da%20minha%20Igreja%20e%20preciso%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Tesoureiro%20Expert'
            )
          "
          width="90%"
        />

        <q-card-section class="text-body1 q-pa-none q-py-md" style="width: 90%">
          <p>
            Um site para igrejas é uma ferramenta essencial para
            <strong>fortalecer a comunicação</strong> , expandir o alcance e
            engajar membros e visitantes.
          </p>
          <p>
            Com um site bem estruturado, sua igreja pode compartilhar eventos,
            mensagens edificantes e informações importantes de forma acessível.
          </p>
          <p>
            Além disso, permite <strong>doações online</strong> e reforça a
            identidade da igreja no mundo digital.
          </p>
          <p>
            Sua igreja ainda não tem um site? Não perca a oportunidade de levar
            sua mensagem ainda mais longe!
          </p>
        </q-card-section>
      </q-card>
      <q-card
        class="q-pa-sm column items-center q-my-md"
        :style="!$q.screen.lt.md ? 'width: 40%' : 'width: 95%'"
      >
        <q-img
          src="/images/banner/4.png"
          class="hover cursor-pointer"
          @click="
            openURL(
              'https://wa.me/5521999109966?text=Ol%C3%A1.%20Quero%20fazer%20a%20Identidade%20Visual%20da%20minha%20Igreja.%20Poderia%20me%20passar%20informa%C3%A7%C3%B5es%3F'
            )
          "
          width="90%"
        />

        <q-card-section class="text-body1 q-pa-none q-py-md" style="width: 90%">
          <p>
            O Registro de Marca é essencial para garantir a proteção legal e a
            identidade exclusiva da sua igreja.
          </p>
          <p>
            Sem o registro, qualquer pessoa ou instituição pode reivindicar o
            nome, impedindo sua utilização e até forçando uma mudança
            inesperada.
          </p>
          <p>
            Além disso, ter a marca registrada
            <strong>fortalece a credibilidade</strong> da igreja e evita
            problemas jurídicos com outros ministérios.
          </p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
