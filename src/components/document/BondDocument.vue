<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'BondDocument' });

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

const features = [
  {
    icon: 'tag',
    title: 'Código interno',
    text: 'Configure um código interno para cada organização, de acordo com a numeração do seu sistema contábil.',
  },
  {
    icon: 'notification_important',
    title: 'Alertas personalizados',
    text: 'Configure alertas por categoria de movimentação. O cliente confirmará a leitura do alerta antes de lançar a movimentação.',
  },
  {
    icon: 'manage_accounts',
    title: 'Gestão de usuários delegada',
    text: 'Adicione, edite ou exclua usuários da organização cliente, respeitando as permissões concedidas.',
  },
  {
    icon: 'assessment',
    title: 'Análise de relatórios',
    text: 'Acesse e analise os relatórios compartilhados pela organização cliente para insights e decisões estratégicas.',
  },
  {
    icon: 'link_off',
    title: 'Exclusão de vínculo',
    text: 'Remova o vínculo com a organização cliente de forma controlada e segura, quando necessário.',
  },
];
</script>

<template>
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon doc-header-icon--counter">
        <q-icon name="link" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Vínculos</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Gerencie as organizações vinculadas à sua contabilidade
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A página de Vínculos proporciona uma visão abrangente das organizações
      atualmente vinculadas à sua, incluindo todas as filiais. Essa
      centralização facilita o acompanhamento e a gestão de todos os
      relacionamentos contábeis.
    </p>

    <q-img
      src="/images/document/bond.png"
      class="doc-image"
      style="max-width: 100%"
      @click="openShowImage('/images/document/bond.png')"
    />

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="tune" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Ferramentas de gerenciamento</span
        >
      </div>

      <p class="text-body2 text-grey-7 q-mb-md">
        Para cada organização listada, as seguintes funcionalidades podem estar
        disponíveis:
      </p>

      <div class="row q-col-gutter-sm">
        <div v-for="f in features" :key="f.title" class="col-12 col-sm-6">
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

    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
