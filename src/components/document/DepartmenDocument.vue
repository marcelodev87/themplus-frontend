<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({
  name: 'DepartmentDocument',
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
    <p class="text-h5 text-bold"># Gerenciamento de Departamentos</p>
    <p class="text-body1">
      A página de Departamentos oferece uma visão geral de todos os
      departamentos criados para sua organização. À medida que sua equipe
      cresce, é fundamental categorizar os usuários em departamentos para
      otimizar a organização e a estrutura interna. Acesse esta funcionalidade
      navegando até "Configurações" no menu lateral esquerdo e selecionando a
      opção "Departamentos".
    </p>
    <div style="position: relative; padding-bottom: 42.5%; height: 0">
      <iframe
        src="https://www.loom.com/embed/d2edfe1c7cdd40eb870670c6755aa364?sid=b6bc942d-d9b6-4f99-a8b4-b91bb4640aaf"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      ></iframe>
    </div>

    <p class="text-h6 q-mt-md"># Criando um Novo Departamento:</p>
    <p class="text-body1">
      Para cadastrar um novo departamento, clique no botão "Departamentos +".
      Você pode definir o nível hierárquico do departamento que está criando.
      Por exemplo, você pode criar um departamento principal chamado
      "Supervisão" e, em seguida, criar um sub-departamento subordinado a ele,
      como "Supervisão Setor Infantil". Essa estrutura hierárquica permite uma
      organização refinada dos departamentos.
    </p>
    <div class="column">
      <q-img
        @click="openShowImage('/images/document/department.png')"
        src="/images/document/department.png"
        style="width: 600px; max-width: 95vw"
      />
      <q-img
        @click="openShowImage('/images/document/form-department.png')"
        src="/images/document/form-department.png"
        style="width: 600px; max-width: 95vw"
        class="q-mt-md"
      />
    </div>

    <p class="text-h6 q-mt-md"># Utilização dos Departamentos:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          Agora, você pode associar os departamentos existentes aos usuários,
          seja ao criar novos usuários ou ao editar os existentes.
          <q-img
            @click="openShowImage('/images/document/use-department.png')"
            src="/images/document/use-department.png"
            style="width: 600px; max-width: 85vw"
            class="q-mt-md"
          />
        </p>
      </li>
      <li>
        <p>
          Caso <strong>você possua privilégios de administrador</strong>, você
          pode <strong>alterar seu departamento</strong> clicando no avatar do
          seu perfil, localizado no canto superior direito.
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
