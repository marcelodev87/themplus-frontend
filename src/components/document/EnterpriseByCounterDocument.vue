<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'EnterpriseByCounterDocument' });

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
        <q-icon name="add_business" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Organização</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Cadastre e vincule organizações cliente diretamente
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A página de Organização permite registrar novas entidades cliente e,
      simultaneamente, estabelecer um vínculo direto com elas, agilizando o
      processo de configuração inicial sem necessitar de uma solicitação
      separada.
    </p>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="help_outline" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold">Como funciona</span>
      </div>

      <div class="row q-col-gutter-sm q-mb-lg">
        <div class="col-12 col-sm-4">
          <div class="doc-feature-card q-pa-md full-height text-center">
            <q-icon name="edit_note" color="primary" size="32px" />
            <p class="text-weight-bold text-body2 q-mt-sm q-mb-xs">
              1. Preencha os dados
            </p>
            <p class="text-caption text-grey-7 q-mb-none">
              Informe os dados da nova organização cliente no formulário
            </p>
          </div>
        </div>
        <div class="col-12 col-sm-4">
          <div class="doc-feature-card q-pa-md full-height text-center">
            <q-icon name="link" color="primary" size="32px" />
            <p class="text-weight-bold text-body2 q-mt-sm q-mb-xs">
              2. Vínculo automático
            </p>
            <p class="text-caption text-grey-7 q-mb-none">
              Ao cadastrar, o vínculo com a organização é estabelecido
              automaticamente
            </p>
          </div>
        </div>
        <div class="col-12 col-sm-4">
          <div class="doc-feature-card q-pa-md full-height text-center">
            <q-icon name="check_circle" color="positive" size="32px" />
            <p class="text-weight-bold text-body2 q-mt-sm q-mb-xs">
              3. Pronto para usar
            </p>
            <p class="text-caption text-grey-7 q-mb-none">
              A organização já aparece nos Vínculos e está disponível para
              análise
            </p>
          </div>
        </div>
      </div>

      <q-img
        src="/images/document/form-enterprise-counter.png"
        class="doc-image"
        style="max-width: 100%"
        @click="openShowImage('/images/document/form-enterprise-counter.png')"
      />
    </div>

    <div class="doc-callout doc-callout--tip">
      <q-icon name="lightbulb" size="20px" class="q-mt-xs" />
      <p class="text-body2 q-mb-none">
        Use esta funcionalidade quando você já tem a organização cliente e
        deseja integrá-la ao Themplus de forma rápida, sem esperar por uma
        solicitação de vínculo da organização.
      </p>
    </div>

    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
