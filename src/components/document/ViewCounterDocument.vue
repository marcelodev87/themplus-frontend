<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'ViewCounterDocument' });

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

const mainFeatures = [
  {
    icon: 'campaign',
    title: 'Feed',
    text: 'Receba atualizações relevantes e informações importantes através de banners informativos personalizados.',
  },
  {
    icon: 'request_page',
    title: 'Solicitações',
    text: 'Gerencie facilmente suas solicitações pendentes de vinculação com organizações cliente.',
  },
  {
    icon: 'link',
    title: 'Vínculos',
    text: 'Visualize e gerencie as organizações cliente às quais sua organização contábil está conectada.',
  },
  {
    icon: 'add_business',
    title: 'Organização',
    text: 'Registre uma organização cliente e vincule-se automaticamente a ela, simplificando o processo de integração.',
  },
  {
    icon: 'assignment',
    title: 'Atividades',
    text: 'Monitore as ações dos usuários dentro da sua organização com transparência e controle total.',
  },
];

const settingsFeatures = [
  {
    icon: 'lan',
    title: 'Departamentos',
    text: 'Organize sua estrutura interna, definindo e gerenciando os departamentos da sua organização contábil.',
  },
  {
    icon: 'people',
    title: 'Usuários',
    text: 'Gerencie os usuários, controlando acesso e permissões para garantir a segurança dos dados.',
  },
];
</script>

<template>
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon doc-header-icon--counter">
        <q-icon name="analytics" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Visão Contador</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Ferramentas exclusivas para organizações contábeis
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      O Themplus oferece uma experiência personalizada para cada perfil de
      usuário. Esta seção explora as funcionalidades e recursos exclusivos
      disponíveis para organizações contábeis cadastradas como
      <strong>Contador</strong>.
    </p>

    <q-img
      src="/images/document/view-counter.png"
      class="doc-image"
      style="max-width: 100%"
      @click="openShowImage('/images/document/view-counter.png')"
    />

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="tune" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Ferramentas essenciais</span
        >
      </div>

      <div class="row q-col-gutter-sm">
        <div v-for="f in mainFeatures" :key="f.title" class="col-12 col-sm-6">
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
        <q-icon name="settings" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold">Configurações</span>
      </div>

      <div class="row q-col-gutter-sm">
        <div
          v-for="f in settingsFeatures"
          :key="f.title"
          class="col-12 col-sm-6"
        >
          <div class="doc-feature-card q-pa-md full-height">
            <div class="row no-wrap items-start q-gutter-sm">
              <q-icon
                :name="f.icon"
                color="secondary"
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

    <div class="doc-callout doc-callout--tip">
      <q-icon name="help_outline" size="20px" class="q-mt-xs" />
      <p class="text-body2 q-mb-none">
        Acesse o <strong>Painel de Ajuda</strong> a qualquer momento pelo menu
        de navegação para obter guias detalhados sobre cada funcionalidade.
      </p>
    </div>

    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
