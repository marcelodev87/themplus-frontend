<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'MovementDocument' });

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

const filters = [
  {
    icon: 'arrow_upward',
    title: 'Entradas',
    text: 'Isole transações de entrada para análise focada nas receitas da organização.',
  },
  {
    icon: 'arrow_downward',
    title: 'Saídas',
    text: 'Concentre-se nas transações de saída para controle preciso das despesas.',
  },
  {
    icon: 'date_range',
    title: 'Filtro por período',
    text: 'Selecione um período específico. Somente períodos com movimentações registradas são exibidos.',
  },
  {
    icon: 'label',
    title: 'Filtro por categoria',
    text: 'Categorize as movimentações para obter insights sobre áreas específicas do negócio.',
  },
  {
    icon: 'search',
    title: 'Pesquisa inteligente',
    text: 'Encontre rapidamente movimentações específicas através da função de busca.',
  },
];
</script>

<template>
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="swap_vert" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">
          Movimentações Financeiras
        </p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Controle centralizado de todas as transações da organização
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A página de Movimentações oferece controle completo sobre as transações
      financeiras da sua organização, com recursos avançados de filtragem e
      visualização para uma gestão eficiente.
    </p>

    <div class="doc-video-wrapper">
      <iframe
        src="https://www.loom.com/embed/a3953213cf72425cab616386936a4cdb?sid=c993fba8-8d24-4511-b236-57cdb79d6dc8"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
      />
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="add_circle" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Registrando uma movimentação</span
        >
      </div>

      <p class="text-body2 text-grey-8 q-mb-md" style="line-height: 1.7">
        Clique em <strong>"Entrada +"</strong> para lançamentos de receita ou
        <strong>"Saída –"</strong> para lançamentos de despesa. O sistema guiará
        você pelo processo de preenchimento.
      </p>

      <q-img
        src="/images/document/form-movement.png"
        class="doc-image"
        style="max-width: min(540px, 100%)"
        @click="openShowImage('/images/document/form-movement.png')"
      />
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="filter_list" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold">Filtros disponíveis</span>
      </div>

      <div class="row q-col-gutter-sm">
        <div v-for="f in filters" :key="f.title" class="col-12 col-sm-6">
          <div class="doc-feature-card q-pa-md full-height">
            <div class="row no-wrap items-start q-gutter-sm">
              <q-icon
                :name="f.icon"
                color="primary"
                size="20px"
                class="q-mt-xs"
              />
              <div>
                <p class="text-weight-bold text-body2 q-mb-xs">{{ f.title }}</p>
                <p
                  class="text-caption text-grey-7 q-mb-none"
                  style="line-height: 1.5"
                >
                  {{ f.text }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="warning" color="warning" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Considerações importantes</span
        >
      </div>

      <div class="doc-callout doc-callout--warning">
        <q-icon name="lock" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">
            Integridade contábil
          </p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            O sistema restringe a criação, edição ou exclusão de movimentações
            em
            <strong>períodos já enviados à contabilidade</strong>. Lançamentos
            futuros que incluam meses já entregues serão automaticamente
            ignorados para esses meses.
          </p>
        </div>
      </div>

      <div class="doc-callout doc-callout--info">
        <q-icon name="smartphone" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">Pré-movimentações</p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            O botão <strong>"Pré-movimentações"</strong> aparece quando existem
            lançamentos prévios realizados via WhatsApp pelo assistente. Você
            pode excluir a pré-movimentação ou completar as informações
            restantes para concluir o lançamento.
          </p>
        </div>
      </div>
    </div>

    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
