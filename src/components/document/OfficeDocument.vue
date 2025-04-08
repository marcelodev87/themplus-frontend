<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({
  name: 'OfficeDocument',
});

const showImage = ref<boolean>(false);
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
  <main>
    <p class="text-h5 text-bold"># Gerenciamento de Filiais</p>
    <p class="text-body1">
      Se sua organização opera com múltiplas filiais, esta seção permite a
      criação e o gerenciamento de cada unidade, proporcionando uma visão
      abrangente das atividades de cada filial, com determinadas restrições de
      acesso, conforme necessário.
    </p>
    <div style="position: relative; padding-bottom: 42.5%; height: 0">
      <iframe
        src="https://www.loom.com/embed/a9d3fc4e9e294216a1683f119e7e4dc0?sid=4f6ca6ab-8482-4530-beca-606c3e0558b7"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      ></iframe>
    </div>

    <p class="text-h6 q-mt-md"># Criando uma Nova Filial:</p>
    <p class="text-body1">
      Para adicionar uma nova filial, clique no botão "Filiais +" e preencha o
      formulário correspondente. É importante observar que o
      <strong>Nome e Endereço são campos obrigatórios</strong>. Caso a filial
      deva utilizar o mesmo endereço de e-mail e CPF/CNPJ da matriz, deixe estes
      campos em branco para herdar as informações da matriz.
    </p>
    <q-img
      @click="openShowImage('/images/document/form-office.png')"
      src="/images/document/form-office.png"
      style="width: 600px; max-width: 85vw"
    />

    <p class="text-h6 q-mt-md"># Funcionalidades e Diretrizes:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Primeiro Usuário:</strong> Após a criação da filial, um botão
          com um ícone de usuário será exibido. É necessário criar o primeiro
          usuário para esta filial. Este usuário será responsável por adicionar
          os demais usuários e personalizar as configurações da filial.
        </p>
      </li>
      <li>
        <p>
          <strong>Exclusão Definitiva:</strong> A exclusão de uma filial
          resultará na <strong>exclusão permanente</strong> de todos os dados
          associados a essa filial, sem possibilidade de recuperação. Por favor,
          proceda com cautela.
        </p>
      </li>
      <li>
        <p>
          <strong>Visão da Filial (Administradores da Matriz):</strong> Para
          administradores da matriz, a opção "Mudar visão" está disponível no
          menu do avatar do perfil. Ao selecionar uma filial através desta
          opção, o Dashboard, Movimentações e demais dados exibidos serão
          referentes à filial selecionada.
        </p>
        <q-img
          @click="openShowImage('/images/document/office-view.png')"
          src="/images/document/office-view.png"
          style="width: 900px; max-width: 85vw"
        />
        <p class="q-mt-md">
          Note que a filial selecionada é identificada na barra superior como
          <strong>"Modo Espectador"</strong>.
        </p>
        <p class="q-mt-md">
          O <strong>Modo Espectador</strong> restringe ações como adição, edição
          e exclusão, permitindo apenas a visualização dos dados.
        </p>
      </li>
    </ul>
    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
