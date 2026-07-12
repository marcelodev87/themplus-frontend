<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'StartDocument' });

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

const steps = [
  {
    text: 'Acesse a tela de login do Themplus para iniciar o processo de cadastro.',
    image: '/images/document/login.png',
  },
  {
    text: 'Clique em "Cadastrar" para ser direcionado à tela de criação de conta.',
    image: '/images/document/register-user.png',
  },
  {
    text: null,
    highlight: true,
    highlightText:
      'Defina seu perfil: selecione <strong>"Cliente"</strong> para acessar funcionalidades de cliente, ou <strong>"Contador"</strong> caso represente uma organização contábil. O campo <em>"Nome de sua organização"</em> deve refletir a denominação oficial da sua instituição.',
    image: null,
  },
  {
    text: 'Após a validação bem-sucedida dos seus dados, uma janela modal confirmará o cadastro.',
    image: '/images/document/register-success-user.png',
  },
  {
    text: null,
    highlight: true,
    highlightText:
      'É <strong>imprescindível clicar em "Continuar"</strong> para completar seu perfil com informações adicionais. Este passo garante a personalização completa da sua experiência. O modal persistirá até o preenchimento ser finalizado.',
    image: '/images/document/form-register.png',
  },
  {
    text: 'Parabéns! Ao concluir o cadastro, você estará pronto para explorar todo o potencial do Themplus.',
    image: null,
  },
];
</script>

<template>
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="rocket_launch" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Primeiros passos</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Seu cadastro facilitado no Themplus
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      Para iniciarmos sua jornada no Themplus, siga o passo a passo abaixo para
      realizar o cadastro e configurar sua conta com sucesso.
    </p>

    <div class="doc-section">
      <div v-for="(step, i) in steps" :key="i" class="step-row q-mb-lg">
        <div class="row no-wrap q-gutter-md items-start">
          <div class="doc-step-number">{{ i + 1 }}</div>
          <div class="col">
            <div
              v-if="step.highlight"
              class="doc-callout doc-callout--warning q-mt-none q-mb-sm"
            >
              <q-icon name="info" size="18px" class="q-mt-xs" />
              <p
                class="text-body2 q-mb-none"
                style="line-height: 1.6"
                v-html="step.highlightText"
              />
            </div>
            <p v-else class="text-body1 q-mb-sm">{{ step.text }}</p>

            <q-img
              v-if="step.image"
              :src="step.image"
              class="doc-image"
              style="max-width: min(560px, 100%)"
              @click="openShowImage(step.image!)"
            />
          </div>
        </div>

        <q-separator v-if="i < steps.length - 1" class="q-mt-lg" />
      </div>
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="web" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Visão geral após o cadastro</span
        >
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-img
            src="/images/document/themplus.png"
            class="doc-image"
            @click="openShowImage('/images/document/themplus.png')"
          >
            <div
              class="absolute-bottom text-caption text-center q-pa-xs bg-dark"
              style="opacity: 0.75"
            >
              Visão Cliente
            </div>
          </q-img>
        </div>
        <div class="col-12 col-sm-6">
          <q-img
            src="/images/document/themplus-counter.png"
            class="doc-image"
            @click="openShowImage('/images/document/themplus-counter.png')"
          >
            <div
              class="absolute-bottom text-caption text-center q-pa-xs bg-dark"
              style="opacity: 0.75"
            >
              Visão Contador
            </div>
          </q-img>
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
