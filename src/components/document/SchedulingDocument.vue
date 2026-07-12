<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'SchedulingDocument' });

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
    title: 'Agendamentos de entrada',
    text: 'Concentre-se nos recebimentos programados para otimizar o fluxo de caixa.',
  },
  {
    icon: 'arrow_downward',
    title: 'Agendamentos de saída',
    text: 'Gerencie pagamentos futuros para manter a saúde financeira da organização.',
  },
  {
    icon: 'date_range',
    title: 'Filtro por período',
    text: 'Selecione um intervalo de tempo para visualizar apenas os agendamentos relevantes.',
  },
  {
    icon: 'label',
    title: 'Filtro por categoria',
    text: 'Categorize os agendamentos para análise mais detalhada e controle aprimorado.',
  },
  {
    icon: 'search',
    title: 'Pesquisa personalizada',
    text: 'Localize agendamentos específicos rapidamente através da função de busca.',
  },
];
</script>

<template>
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="calendar_month" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Agendamentos Financeiros</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Planeje seus compromissos financeiros futuros
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A página de Agendamentos oferece uma visão abrangente e organizada de
      todos os seus compromissos financeiros futuros, com filtros intuitivos
      para uma gestão otimizada do fluxo de caixa.
    </p>

    <div class="doc-video-wrapper">
      <iframe
        src="https://www.loom.com/embed/6cf8545f0a7e4825936718df35c1f55c?sid=535bac27-9c9e-4aab-a34b-a8857acd5d80"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
      />
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="add_circle" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Criando um agendamento</span
        >
      </div>

      <p class="text-body2 text-grey-8 q-mb-md" style="line-height: 1.7">
        Clique em <strong>"Entrada +"</strong> para agendar um recebimento ou
        <strong>"Saída –"</strong> para agendar um pagamento futuro.
      </p>

      <q-img
        src="/images/document/form-scheduling.png"
        class="doc-image"
        style="max-width: min(540px, 100%)"
        @click="openShowImage('/images/document/form-scheduling.png')"
      />
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="filter_list" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold">Filtros avançados</span>
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
          >Restrições importantes</span
        >
      </div>

      <div class="doc-callout doc-callout--warning">
        <q-icon name="update" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">
            Somente datas futuras
          </p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            O sistema permite apenas o agendamento de eventos financeiros
            <strong>futuros</strong>, garantindo a precisão do planejamento.
          </p>
        </div>
      </div>

      <div class="doc-callout doc-callout--warning">
        <q-icon name="lock" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">
            Integridade com contabilidade
          </p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            Agendamentos para
            <strong>meses já entregues à contabilidade</strong>
            não são permitidos, mantendo a consistência dos dados contábeis.
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
