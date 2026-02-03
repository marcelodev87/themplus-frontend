<script setup lang="ts">
import { ref, onMounted } from 'vue';

defineOptions({
  name: 'CardsNews',
});

const cards = ref([
  {
    img: '/images/banner/1.png',
    url: 'https://wa.me/5521985566260?text=Ol%C3%A1.%20Preciso%20melhorar%20a%20gest%C3%A3o%20financeira%20da%20minha%20Igreja%20e%20preciso%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Tesoureiro%20Expert',
    content: `
      <p>O <strong>Tesoureiro Expert</strong> é um serviço de gestão financeira terceirizada voltado para igrejas...</p>
      <p>Com uma abordagem profissional, <strong>ajuda pastores e líderes a tomarem decisões</strong> estratégicas...</p>
      <p>Com o Tesoureiro Expert, sua igreja ganha <strong>organização, transparência e segurança</strong> financeira!</p>
    `,
  },
  {
    img: '/images/banner/2.png',
    url: 'https://wa.me/5521999109966?text=Ol%C3%A1.%20Quero%20fazer%20a%20Identidade%20Visual%20da%20minha%20Igreja.%20Poderia%20me%20passar%20informa%C3%A7%C3%B5es%3F',
    content: `
      <p>A <strong>identidade visual</strong> para igrejas é fundamental para transmitir a essência do seu Ministério.</p>
      <p>Um design <strong>bem planejado</strong> fortalece a presença da igreja e passa uma imagem séria e acolhedora.</p>
      <p>Fortaleça a mensagem do seu Ministério criando uma identidade visual que <strong>reflita seus valores!</strong></p>
    `,
  },
  {
    img: '/images/banner/3.png',
    url: 'https://wa.me/5521985566260?text=Ol%C3%A1...',
    content: `
      <p>Um site para igrejas é uma ferramenta essencial para <strong>fortalecer a comunicação</strong>.</p>
      <p>Permite <strong>doações online</strong> e reforça a identidade da igreja no mundo digital.</p>
    `,
  },
  {
    img: '/images/banner/4.png',
    url: 'https://wa.me/5521999109966?text=Ol%C3%A1...',
    content: `
      <p>O Registro de Marca é essencial para garantir a proteção legal e a identidade exclusiva da sua igreja.</p>
      <p>Ter a marca registrada <strong>fortalece a credibilidade</strong> e evita problemas jurídicos.</p>
    `,
  },
]);

const openURL = (url: string) => {
  window.open(url, '_blank');
};

const shuffleCards = () => {
  for (let i = cards.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards.value[i], cards.value[j]] = [cards.value[j], cards.value[i]];
  }
};

onMounted(() => {
  shuffleCards();
});
</script>

<template>
  <div class="q-px-sm row justify-center">
    <div
      :class="
        !$q.screen.lt.md
          ? 'row justify-around full-width'
          : 'column items-center full-width'
      "
      style="flex-wrap: wrap"
    >
      <q-card
        v-for="(card, index) in cards"
        :key="index"
        class="q-pa-sm column items-center q-mt-md"
        :style="!$q.screen.lt.md ? 'width: 45%' : 'width: 95%'"
      >
        <q-img
          :src="card.img"
          class="hover cursor-pointer"
          @click="openURL(card.url)"
          width="90%"
        />

        <q-card-section
          class="text-body1 q-pa-none q-py-md"
          style="width: 90%"
          v-html="card.content"
        >
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
