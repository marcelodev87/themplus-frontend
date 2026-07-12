<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'OrderDocument' });

const showImage = ref(false);
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
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon doc-header-icon--counter">
        <q-icon name="request_page" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Solicitações</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Gerencie pedidos de vínculo com organizações cliente
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A página de Solicitações oferece uma visão completa e organizada de todos
      os pedidos de vínculo de organizações do tipo <strong>cliente</strong>,
      permitindo um gerenciamento eficiente do seu pipeline de novos
      relacionamentos contábeis.
    </p>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="list_alt" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Visão geral das solicitações</span
        >
      </div>

      <q-img
        src="/images/document/order.png"
        class="doc-image"
        style="max-width: 100%"
        @click="openShowImage('/images/document/order.png')"
      />
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="add_circle" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Iniciando uma solicitação</span
        >
      </div>

      <p class="text-body2 text-grey-8 q-mb-md" style="line-height: 1.7">
        Clique em <strong>"Solicitações +"</strong>. Um modal será exibido com
        formulário de fácil preenchimento. Localize o cliente, selecione-o,
        adicione uma descrição e envie a solicitação.
      </p>

      <div class="doc-callout doc-callout--tip q-mb-md">
        <q-icon name="search" size="20px" class="q-mt-xs" />
        <p class="text-body2 q-mb-none">
          Utilize o <strong>ícone de lupa</strong> para uma busca rápida e
          precisa da organização desejada.
        </p>
      </div>

      <q-img
        src="/images/document/form-order.png"
        class="doc-image"
        style="max-width: 100%"
        @click="openShowImage('/images/document/form-order.png')"
      />
    </div>

    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
