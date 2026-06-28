<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'DepartmentDocument' });

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
    <!-- Header -->
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="lan" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">
          Gerenciamento de Departamentos
        </p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Organize a estrutura interna da sua organização
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A página de Departamentos oferece uma visão geral de todos os
      departamentos criados para sua organização. Categorizar os usuários em
      departamentos otimiza a organização e a estrutura interna. Acesse em
      <strong>Configurações → Departamentos</strong> no menu lateral.
    </p>

    <!-- Video -->
    <div class="doc-video-wrapper">
      <iframe
        src="https://www.loom.com/embed/d2edfe1c7cdd40eb870670c6755aa364?sid=b6bc942d-d9b6-4f99-a8b4-b91bb4640aaf"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
      />
    </div>

    <!-- Creating departments -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="add_circle" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Criando um novo departamento</span
        >
      </div>

      <p class="text-body2 text-grey-8 q-mb-md" style="line-height: 1.7">
        Clique no botão <strong>"Departamentos +"</strong> para cadastrar um
        novo departamento. Você pode definir o nível hierárquico — por exemplo,
        criar um departamento <em>"Supervisão"</em> e, em seguida, um
        sub-departamento <em>"Supervisão Setor Infantil"</em> subordinado a ele.
      </p>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-img
            src="/images/document/department.png"
            class="doc-image"
            @click="openShowImage('/images/document/department.png')"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-img
            src="/images/document/form-department.png"
            class="doc-image"
            @click="openShowImage('/images/document/form-department.png')"
          />
        </div>
      </div>
    </div>

    <!-- Usage -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="how_to_use" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Utilização dos departamentos</span
        >
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-12">
          <div class="doc-feature-card q-pa-md">
            <div class="row no-wrap items-start q-gutter-sm">
              <q-icon
                name="person_add"
                color="primary"
                size="20px"
                class="q-mt-xs"
              />
              <div>
                <p class="text-weight-bold text-body2 q-mb-xs">
                  Associar a usuários
                </p>
                <p
                  class="text-caption text-grey-7 q-mb-sm"
                  style="line-height: 1.5"
                >
                  Associe departamentos aos usuários ao criar ou editar perfis
                  existentes.
                </p>
                <q-img
                  src="/images/document/use-department.png"
                  class="doc-image"
                  style="max-width: min(500px, 100%)"
                  @click="openShowImage('/images/document/use-department.png')"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="doc-feature-card q-pa-md">
            <div class="row no-wrap items-start q-gutter-sm">
              <q-icon
                name="manage_accounts"
                color="primary"
                size="20px"
                class="q-mt-xs"
              />
              <div>
                <p class="text-weight-bold text-body2 q-mb-xs">
                  Alterar próprio departamento
                </p>
                <p
                  class="text-caption text-grey-7 q-mb-none"
                  style="line-height: 1.5"
                >
                  Caso você possua
                  <strong>privilégios de administrador</strong>, pode alterar
                  seu departamento clicando no avatar do seu perfil, localizado
                  no canto superior direito.
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
