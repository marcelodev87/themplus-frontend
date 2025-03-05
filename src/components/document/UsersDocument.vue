<script setup lang="ts">
defineOptions({
  name: 'UsersDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Usuários</p>
    <p class="text-body1">
      Na página de Usuários,poderá ser realizado toda a admnistração de usuários
      de forma fácil e intuitiva da sua organização. A tela de usuários pode ser
      encontrada clicando em "configurações" no menu lateral esquerdo e em
      seguida, você poderá visualizar a opção de usuários, lembrando que deve
      ser <strong>administrador</strong>.
    </p>
    <div style="position: relative; padding-bottom: 42.5%; height: 0">
      <iframe
        src="https://www.loom.com/embed/602351f4b2084158889dcbcac37fcefc?sid=0a658d6c-4c7e-458d-b59b-1e300fa285e9"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      ></iframe>
    </div>

    <p class="text-h6 q-mt-md"># Criando um usuário:</p>
    <p class="text-body1">
      Basta clicar no botão de " Usuários + " e preencher o formulário
      solicitado.
    </p>
    <q-img src="/images/document/form-user.png" width="600px" />

    <p class="text-h6 q-mt-md"># Funcionalidades e Regras:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Export:</strong> Permite exportar a lista de usuários
          existentes no formato de planilha '.xlsx'.
        </p>
      </li>
      <li>
        <p>
          <strong>Edição:</strong> Administradores poderão editar usuários
          comuns. Caso seja preciso editar um usuário administrador, o proprio
          usuário deve fazer o seu login e editar no avatar do seu perfil.
        </p>
      </li>
      <li>
        <p>
          <strong>Exclusão:</strong> Administradores poderão excluir todos
          usuários, menos o usuário principal que criou a organização
          originalmente.
        </p>
      </li>
      <li>
        <p>
          <strong>Inativação e Reativação:</strong> Imagine que um usuário de
          sua organização tire férias e você deseja que ele fique sem permissão
          de fazer login durante esse período, basta inativá-lo e ao voltar pode
          reativa-lo. A inativação garante que o usuário não seja excluido do
          sistema, mas que fique inoperente temporariamente.
        </p>
      </li>
    </ul>
  </main>
</template>
