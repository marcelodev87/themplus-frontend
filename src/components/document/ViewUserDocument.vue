<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'ViewUserDocument' });

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
    text: 'Espaço dinâmico com banners informativos e atualizações relevantes para sua organização.',
  },
  {
    icon: 'dashboard',
    title: 'Dashboard',
    text: 'Painéis interativos com gráficos e indicadores-chave do desempenho da sua organização.',
  },
  {
    icon: 'swap_vert',
    title: 'Movimentações',
    text: 'Gerencie transações financeiras: visualize, crie, edite ou exclua lançamentos de forma intuitiva.',
  },
  {
    icon: 'calendar_month',
    title: 'Agendamentos',
    text: 'Organize atividades e compromissos futuros. Crie, visualize, edite ou exclua agendamentos.',
  },
  {
    icon: 'account_balance',
    title: 'Contabilidade',
    text: 'Centralize a comunicação com sua organização contábil, facilitando troca de informações.',
  },
  {
    icon: 'assignment',
    title: 'Atividades',
    text: 'Monitore as ações dos usuários da sua organização, garantindo transparência e controle.',
  },
];

const settingsFeatures = [
  {
    icon: 'label',
    title: 'Categorias',
    text: 'Defina e gerencie categorias para classificar transações financeiras.',
  },
  {
    icon: 'account_balance_wallet',
    title: 'Contas',
    text: 'Gerencie contas bancárias e financeiras, mantendo controle sobre seus recursos.',
  },
  {
    icon: 'lan',
    title: 'Departamentos',
    text: 'Organize sua estrutura interna, definindo e gerenciando departamentos.',
  },
  {
    icon: 'business',
    title: 'Filiais',
    text: 'Gerencie as diferentes filiais, centralizando informações e controle.',
  },
  {
    icon: 'people',
    title: 'Usuários',
    text: 'Adicione, gerencie e controle o acesso dos usuários ao Themplus.',
  },
];
</script>

<template>
  <main class="doc-content">
    <!-- Header -->
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="visibility" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Visão Cliente</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Explorando as funcionalidades disponíveis para organizações cliente
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      O Themplus oferece experiências distintas, adaptadas ao seu perfil:
      <strong>Cliente</strong> ou <strong>Contador</strong>. Esta seção detalha
      as funcionalidades e recursos disponíveis para organizações cadastradas
      como "Cliente".
    </p>

    <q-img
      src="/images/document/view-user.png"
      class="doc-image"
      style="max-width: 100%"
      @click="openShowImage('/images/document/view-user.png')"
    />

    <!-- Main features -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="tune" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Funcionalidades principais</span
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

    <!-- Settings features -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="settings" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Configurações disponíveis</span
        >
      </div>
      <p class="text-body2 text-grey-7 q-mb-md">
        Personalize o Themplus para atender às necessidades específicas da sua
        organização:
      </p>

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
