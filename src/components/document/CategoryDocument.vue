<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'CategoryDocument' });

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
    icon: 'verified',
    title: 'Categorias padrão',
    text: 'Visualize as categorias pré-definidas pelo sistema (entrada e saída). Não podem ser editadas ou excluídas.',
  },
  {
    icon: 'add_circle',
    title: 'Categorias criadas',
    text: 'Visualize apenas as categorias criadas pela sua organização. Podem ser editadas ou excluídas conforme necessário.',
  },
  {
    icon: 'filter_alt',
    title: 'Filtrar por tipo',
    text: 'Exiba somente categorias de entrada, saída ou todas juntas.',
  },
  {
    icon: 'search',
    title: 'Pesquisa inteligente',
    text: 'Localize rapidamente uma categoria específica através da função de busca.',
  },
];
</script>

<template>
  <main class="doc-content">
    <!-- Header -->
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="label" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Categorias</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Classifique suas transações financeiras com categorias personalizadas
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A página de Categorias centraliza o controle das categorias financeiras,
      abrangendo opções pré-definidas pelo Themplus e categorias personalizadas.
      Acesse em <strong>Configurações → Categorias</strong>. As categorias
      estarão disponíveis nos formulários de movimentações e agendamentos.
    </p>

    <!-- Video -->
    <div class="doc-video-wrapper">
      <iframe
        src="https://www.loom.com/embed/747a3ebd3b8d4a32a9d61a5608399e4c?sid=e040f5e2-f938-4276-87c4-4a857e439019"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
      />
    </div>

    <!-- Creating -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="add_circle" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Criando categorias personalizadas</span
        >
      </div>

      <p class="text-body2 text-grey-8 q-mb-md" style="line-height: 1.7">
        Clique em <strong>"Categoria +"</strong>, digite um nome descritivo e
        selecione o tipo: <strong>Entrada</strong> ou <strong>Saída</strong>.
      </p>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-img
            src="/images/document/category1.png"
            class="doc-image"
            @click="openShowImage('/images/document/category1.png')"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-img
            src="/images/document/form-category.png"
            class="doc-image"
            @click="openShowImage('/images/document/form-category.png')"
          />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="filter_list" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold">Opções de filtragem</span>
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

    <!-- Important notes -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="info" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold">Pontos relevantes</span>
      </div>

      <div class="doc-callout doc-callout--info">
        <q-icon name="archive" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">
            Inativação em vez de exclusão
          </p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            Ao excluir uma categoria usada em registros de Movimentações ou
            Agendamentos, ela será automaticamente
            <strong>inativada</strong> para preservar a integridade dos dados.
            Um botão de reativação será exibido permitindo seu uso futuro.
          </p>
        </div>
      </div>

      <div class="doc-callout doc-callout--warning">
        <q-icon name="notification_important" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">
            Alertas de contabilidade
          </p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            A coluna <strong>"Alerta de Contabilidade"</strong> exibe alertas
            cadastrados pelo escritório vinculado. Ao usar uma categoria com
            alerta, uma confirmação de leitura será exibida antes de salvar a
            movimentação.
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
