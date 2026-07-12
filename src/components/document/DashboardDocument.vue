<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'DashboardDocument' });

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
    icon: 'filter_list',
    title: 'Filtragem inteligente',
    text: 'Analise dados por período específico ou por mês. O filtro exibe apenas os meses com movimentações registradas.',
  },
  {
    icon: 'label',
    title: 'Categorização detalhada',
    text: 'Visualize com "Todas as categorias" ou refine selecionando categorias específicas, impactando os gráficos exibidos.',
  },
  {
    icon: 'picture_as_pdf',
    title: 'Exportação profissional',
    text: 'Exporte os dados do painel para PDF formatado, preservando todos os filtros aplicados. Ideal para relatórios.',
  },
  {
    icon: 'swap_vert',
    title: 'Análise de movimentações',
    text: 'Acompanhe o total de entradas e saídas. O saldo final apresenta a diferença, revelando a saúde financeira.',
  },
  {
    icon: 'calendar_month',
    title: 'Controle de agendamentos',
    text: 'Monitore agendamentos de entrada e saída com o saldo resultante. Ideal para planejamento e projeção.',
  },
  {
    icon: 'people',
    title: 'Gestão de usuários',
    text: 'Veja a contagem de usuários comuns, administradores e o total de usuários cadastrados na organização.',
  },
  {
    icon: 'emoji_events',
    title: 'Ranking de contas (TOP 3)',
    text: 'Identifique as contas com maiores saldos através do ranking das 3 primeiras posições.',
  },
  {
    icon: 'bar_chart',
    title: 'Gráfico movimentações × categoria',
    text: 'Entradas ou saídas distribuídas por categoria em barras horizontais, com proporção relativa ao total.',
  },
  {
    icon: 'stacked_bar_chart',
    title: 'Gráfico agendamentos × categoria',
    text: 'Agendamentos categorizados em barras horizontais, mostrando a proporção de cada categoria.',
  },
  {
    icon: 'public',
    title: 'Visão global',
    text: 'Informações abrangentes sobre movimentações da organização sem restrição de período, para análises de longo prazo.',
  },
];
</script>

<template>
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="dashboard" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Dashboard</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Painel de controle com visão estratégica da organização
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      O Dashboard oferece uma visão consolidada das informações mais relevantes,
      permitindo uma análise rápida e eficiente do panorama financeiro da sua
      organização através de gráficos, indicadores e filtros inteligentes.
    </p>

    <q-img
      src="/images/document/dashboard.png"
      class="doc-image"
      style="max-width: 100%"
      @click="openShowImage('/images/document/dashboard.png')"
    />

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="tune" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Recursos disponíveis</span
        >
      </div>

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
