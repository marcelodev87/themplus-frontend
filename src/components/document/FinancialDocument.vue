<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'FinancialDocument' });

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

const actions = [
  {
    icon: 'settings_applications',
    title: 'Configurações de acesso',
    text: 'Gerencie as permissões concedidas a escritórios de contabilidade para acessar e interagir com os dados da sua organização.',
  },
  {
    icon: 'connect_without_contact',
    title: 'Solicitações de vinculação',
    text: 'Visualize e gerencie convites de conexão enviados por organizações contábeis.',
  },
  {
    icon: 'contact_phone',
    title: 'Informações do contador',
    text: 'Exibido após a vinculação, permite acessar detalhes de contato e informações do seu parceiro contábil.',
  },
];
</script>

<template>
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="account_balance" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Contabilidade</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Gerencie a entrega mensal das movimentações ao contador
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A página de Contabilidade exibe as movimentações financeiras organizadas
      mensalmente, com indicação clara do status: <strong>Entregue</strong> ou
      <strong>Não entregue</strong>. Permite o envio organizado das informações
      para análise e processamento pela sua organização contábil parceira.
    </p>

    <div class="doc-video-wrapper">
      <iframe
        src="https://www.loom.com/embed/db5886a49f7c4457b037d3dfd0cf75db?sid=28f8e576-4f68-401d-af98-00b8a9e0d838"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
      />
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="tune" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Funcionalidades da tela</span
        >
      </div>

      <q-img
        src="/images/document/financial.png"
        class="doc-image q-mb-md"
        style="max-width: 100%"
        @click="openShowImage('/images/document/financial.png')"
      />

      <div class="row q-col-gutter-sm">
        <div v-for="(a, i) in actions" :key="a.title" class="col-12">
          <div class="doc-feature-card q-pa-md">
            <div class="row no-wrap items-start q-gutter-sm">
              <div class="doc-step-number" style="background: #1976d2">
                {{ i + 1 }}
              </div>
              <q-icon
                :name="a.icon"
                color="primary"
                size="20px"
                class="q-mt-xs"
              />
              <div>
                <p class="text-weight-bold text-body2 q-mb-xs">{{ a.title }}</p>
                <p
                  class="text-caption text-grey-7 q-mb-none"
                  style="line-height: 1.5"
                >
                  {{ a.text }}
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
            Bloqueio após entrega
          </p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            Após <strong>entregar</strong> uma lista de movimentações, o
            lançamento de novas transações para o período correspondente será
            bloqueado, a menos que o mês seja reaberto pela organização
            contábil.
          </p>
        </div>
      </div>

      <div class="doc-callout doc-callout--danger">
        <q-icon name="admin_panel_settings" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">
            Atenção às permissões de acesso
          </p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            O gerenciamento de permissões em
            <strong>"Configurações de Acesso"</strong>
            concede à organização contábil a capacidade de realizar ações em seu
            nome. Avalie cuidadosamente o impacto antes de conceder permissões.
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
