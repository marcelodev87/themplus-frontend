<script setup lang="ts">
defineOptions({
  name: 'OfficeDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Filiais</p>
    <p class="text-body1">
      Caso sua organização tenha filiais, você poderá criar filiais nessa
      página, onde poderá observar todas as suas atividades com certas
      limitações.
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

    <p class="text-h6 q-mt-md"># Criando uma filial:</p>
    <p class="text-body1">
      Basta clicar no botão de " Filiais + " e preencher o formulário
      solicitado. Vale ressaltar que
      <strong>nome e endereço são obrigatórios</strong>, caso a filial deseje
      ter o mesmo e-mail e cpf/cnpj da matriz, deve-se deixar em branco.
    </p>
    <q-img src="/images/document/form-office.png" width="600px" />

    <p class="text-h6 q-mt-md"># Funcionalidades e Regras:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Criação:</strong> Após a filial ser criada, deve notar que
          aparecerá um botão com icone de usuario, onde você deve criar esse
          primeiro usuário na filial.Este usuário inserido, será responsável por
          incluir os demais usuários e ajustar as demais configurações.
        </p>
      </li>
      <li>
        <p>
          <strong>Exclusão:</strong> Ao tentar excluir uma filial, todos os
          dados vinculados a essa filial serão
          <strong>excluídos permanetemente</strong> e não será possível
          reverter.
        </p>
      </li>
      <li>
        <p>
          <strong>Observar:</strong> Para usuários administradores da matriz, no
          avatar do perfil, existe uma opção "Mudar visão". Clicando nessa
          opção, você poderá selecionar uma filial e a partir desse momento os
          dados que visualizará como Dashboard, Movimentações, etc serão
          referentes a filial selecionada.
        </p>
        <q-img src="/images/document/office-view.png" width="600px" />
        <p class="q-mt-md">
          Note que a filial selecionada, fica marcada na barra superior como
          <strong> "modo espectador"</strong> .
        </p>
        <p class="q-mt-md">
          O <strong>modo espectador</strong> não permite realizar ações como
          adição, edição e exclusão, deixando somente como observação.
        </p>
      </li>
    </ul>
  </main>
</template>
