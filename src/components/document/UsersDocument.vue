<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'UsersDocument' });

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
    icon: 'download',
    title: 'Exportação de dados',
    text: 'Exporte a lista completa de usuários no formato de planilha .xlsx.',
  },
  {
    icon: 'edit',
    title: 'Edição de usuários',
    text: 'Administradores podem editar informações de usuários comuns. Para editar um perfil de administrador, o próprio deve acessar a seção de perfil no avatar.',
  },
  {
    icon: 'delete',
    title: 'Exclusão de usuários',
    text: 'Administradores podem excluir qualquer usuário, com exceção do usuário principal que criou a organização.',
  },
  {
    icon: 'toggle_off',
    title: 'Inativação e reativação',
    text: 'Suspenda temporariamente o acesso de um usuário (ex: durante férias) sem perder seus dados. Reative a conta ao retorno.',
  },
];
</script>

<template>
  <main class="doc-content">
    <!-- Header -->
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="people" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">
          Gerenciamento de Usuários
        </p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Administre os usuários da sua organização
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A página de Gerenciamento de Usuários oferece uma interface completa para
      administração dos usuários da sua organização. Acesse em
      <strong>Configurações → Usuários</strong> no menu lateral.
    </p>

    <!-- Video -->
    <div class="doc-video-wrapper">
      <iframe
        src="https://www.loom.com/embed/602351f4b2084158889dcbcac37fcefc?sid=0a658d6c-4c7e-458d-b59b-1e300fa285e9"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
      />
    </div>

    <!-- Adding user -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="person_add" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Adicionando um usuário</span
        >
      </div>

      <p class="text-body2 text-grey-8 q-mb-md">
        Clique no botão <strong>"Usuários +"</strong> e preencha o formulário
        apresentado com os dados do novo usuário.
      </p>

      <q-img
        src="/images/document/form-user.png"
        class="doc-image"
        style="max-width: 100%"
        @click="openShowImage('/images/document/form-user.png')"
      />
    </div>

    <!-- Features -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="tune" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Funcionalidades disponíveis</span
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
