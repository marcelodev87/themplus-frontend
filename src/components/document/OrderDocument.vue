<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({
  name: 'OrderDocument',
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
    <p class="text-h5 text-bold">
      # Gerenciamento Centralizado de Solicitações de Cliente
    </p>
    <p class="text-body1">
      A página de Solicitações oferece uma visão completa e organizada de todos
      os pedidos de vínculo de organizações do tipo "cliente", permitindo um
      gerenciamento eficiente do seu pipeline de novos relacionamentos.
    </p>
    <q-img
      @click="openShowImage('/images/document/order.png')"
      src="/images/document/order.png"
      style="width: 1000px; max-width: 95vw"
    />
    <p class="text-h6 q-mt-md">
      # Iniciando uma Solicitação de Cliente com Simplicidade:
    </p>
    <p class="text-body1">
      Para iniciar uma solicitação de vínculo, clique no botão "Solicitações +".
      Um modal intuitivo será exibido, contendo um formulário de fácil
      preenchimento. Localize o cliente desejado, selecione-o, adicione uma
      descrição concisa e envie sua solicitação.
      <strong
        >Utilize o ícone de lupa para uma pesquisa rápida e precisa da
        organização desejada.</strong
      >
    </p>
    <q-img
      @click="openShowImage('/images/document/form-order.png')"
      src="/images/document/form-order.png"
      style="width: 1000px; max-width: 95vw"
    />
    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
