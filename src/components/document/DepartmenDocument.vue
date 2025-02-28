<script setup lang="ts">
defineOptions({
  name: 'DepartmentDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Departamentos</p>
    <p class="text-body1">
      Na página de Departamentos, contamos com todos os departamentos criados
      pela sua organização. A medida que sua organização é preenchida com novos
      usuários, é bem importante categorizá-los para uma melhor organização de
      sua equipe.Ela pode ser encontrada clicando em "configurações" no menu
      lateral esquerdo e em seguida, você poderá visualizar a opção de
      departamentos.
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

    <p class="text-h6 q-mt-md"># Criando um departamento:</p>
    <p class="text-body1">
      Para cadastrar uma novo departamento, clique no botão "Departamentos +".
      Você poderá selecionar o nível hierarquico que deseja criar o
      departamento. Por exemplo, posso criar uma departamento chamado
      Supervisão, e em seguida criar um sub-departamento chamado Supervisão
      Setor Infantil.
    </p>
    <div class="column">
      <q-img src="/images/document/department.png" width="600px" />
      <q-img
        src="/images/document/form-department.png"
        width="600px"
        class="q-mt-md"
      />
    </div>

    <p class="text-h6 q-mt-md"># Utilizando os departamentos:</p>
    <p>
      Agora você poderá utilizar os departamentos existentes nos usuários, seja
      criando novos ou editando os existentes.
      <q-img
        src="/images/document/use-department.png"
        width="600px"
        class="q-mt-md"
      />
    </p>
  </main>
</template>
