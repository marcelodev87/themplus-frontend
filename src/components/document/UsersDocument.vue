<script setup lang="ts">
defineOptions({
  name: 'UsersDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Gerenciamento de Usuários</p>
    <p class="text-body1">
      A página de Gerenciamento de Usuários oferece uma interface intuitiva para
      a administração completa dos usuários da sua organização. Acesse esta tela
      navegando até "Configurações" no menu lateral esquerdo e selecionando a
      opção "Usuários".
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

    <p class="text-h6 q-mt-md"># Adicionando um Usuário:</p>
    <p class="text-body1">
      Para adicionar um novo usuário, clique no botão "Usuários +" e preencha o
      formulário apresentado.
    </p>
    <q-img src="/images/document/form-user.png" width="600px" />

    <p class="text-h6 q-mt-md"># Funcionalidades e Diretrizes:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Exportação de Dados:</strong> Exporte a lista completa de
          usuários no formato de planilha '.xlsx'.
        </p>
      </li>
      <li>
        <p>
          <strong>Edição de Usuários:</strong> Administradores podem editar as
          informações de usuários comuns. Para editar um perfil de
          administrador, o próprio administrador deve acessar a seção de perfil
          em seu avatar.
        </p>
      </li>
      <li>
        <p>
          <strong>Exclusão de Usuários:</strong> Administradores podem excluir
          qualquer usuário, com exceção do usuário principal que criou a
          organização.
        </p>
      </li>
      <li>
        <p>
          <strong>Inativação e Reativação de Contas:</strong> Para suspender
          temporariamente o acesso de um usuário (por exemplo, durante um
          período de férias), inative a conta. Reative a conta ao retorno do
          usuário. A inativação preserva os dados do usuário, impedindo apenas o
          acesso temporário ao sistema.
        </p>
      </li>
    </ul>
  </main>
</template>
