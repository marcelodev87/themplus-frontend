<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'OfficeDocument' });

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
        <q-icon name="business" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Filiais</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Gerencie múltiplas unidades da sua organização
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      Se sua organização opera com múltiplas filiais, esta seção permite a
      criação e o gerenciamento de cada unidade, proporcionando visão abrangente
      das atividades com as devidas restrições de acesso.
    </p>

    <!-- Video -->
    <div class="doc-video-wrapper">
      <iframe
        src="https://www.loom.com/embed/a9d3fc4e9e294216a1683f119e7e4dc0?sid=4f6ca6ab-8482-4530-beca-606c3e0558b7"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
      />
    </div>

    <!-- Creating branch -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="add_business" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Criando uma nova filial</span
        >
      </div>

      <p class="text-body2 text-grey-8 q-mb-md" style="line-height: 1.7">
        Clique em <strong>"Filiais +"</strong> e preencha o formulário.
        <strong>Nome e Endereço são campos obrigatórios.</strong> Deixe e-mail e
        CPF/CNPJ em branco para herdar as informações da matriz.
      </p>

      <q-img
        src="/images/document/form-office.png"
        class="doc-image"
        style="max-width: min(540px, 100%)"
        @click="openShowImage('/images/document/form-office.png')"
      />
    </div>

    <!-- Features -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="tune" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Funcionalidades e diretrizes</span
        >
      </div>

      <div class="doc-callout doc-callout--tip">
        <q-icon name="person_add" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">
            Primeiro usuário da filial
          </p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            Após criar a filial, um botão com ícone de usuário será exibido. É
            necessário criar o <strong>primeiro usuário</strong> para a filial —
            ele será responsável por adicionar os demais e personalizar as
            configurações da unidade.
          </p>
        </div>
      </div>

      <div class="doc-callout doc-callout--danger">
        <q-icon name="delete_forever" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">Exclusão definitiva</p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            A exclusão de uma filial resultará na
            <strong>exclusão permanente</strong> de todos os dados associados,
            sem possibilidade de recuperação. Proceda com cautela.
          </p>
        </div>
      </div>
    </div>

    <!-- Spectator mode -->
    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="visibility" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Visão da filial (Modo Espectador)</span
        >
      </div>

      <p class="text-body2 text-grey-8 q-mb-md" style="line-height: 1.7">
        Para administradores da matriz, a opção
        <strong>"Mudar visão"</strong> está disponível no menu do avatar. Ao
        selecionar uma filial, o Dashboard, Movimentações e demais dados
        exibirão informações daquela filial.
      </p>

      <q-img
        src="/images/document/office-view.png"
        class="doc-image"
        style="max-width: 100%"
        @click="openShowImage('/images/document/office-view.png')"
      />

      <div class="doc-callout doc-callout--info q-mt-md">
        <q-icon name="info" size="20px" class="q-mt-xs" />
        <p class="text-body2 q-mb-none" style="line-height: 1.6">
          A filial selecionada é identificada na barra superior como
          <strong>"Modo Espectador"</strong>. Neste modo, ações de adição,
          edição e exclusão são restritas — apenas visualização é permitida.
        </p>
      </div>
    </div>

    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
