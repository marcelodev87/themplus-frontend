<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({
  name: 'EnterpriseByCounterDocument',
});

const showImage = ref<boolean>(false);
const urlImage = ref<string | null>(null);

const openShowImage = (url: string) => {
  showImage.value = true;
  urlImage.value = url;
};
const closeShowImage = () => {
  showImage.value = false;
  urlImage.value = null;
};
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Cadastro e Vinculação de Organizações</p>
    <p class="text-body1">
      A página de Cadastro de Organizações permite registrar novas entidades e,
      simultaneamente, estabelecer um vínculo direto com elas, agilizando o
      processo de configuração inicial.
    </p>

    <q-img
      @click="openShowImage('/images/document/form-enterprise-counter.png')"
      src="/images/document/form-enterprise-counter.png"
      style="width: 1000px; max-width: 95vw"
    />
    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
