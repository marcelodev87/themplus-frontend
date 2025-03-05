<script setup lang="ts">
defineOptions({
  name: 'ViewCounterDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Visão Contador</p>
    <p class="text-body1">
      No Themplus, você pode está cadastrado como um "Cliente" ou como
      "Contador". Nesta seção você verá quais opções existem para uma
      organização do tipo "Contador"
    </p>
    <q-img src="/images/document/view-counter.png" width="1000px" />

    <p class="text-h6 q-mt-md"># Entendendo as opções:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Feed:</strong> Seção onde mostra alguns banners informativo.
        </p>
      </li>
      <li>
        <p>
          <strong>Solicitações:</strong> Seção onde mostra suas solicitações
          pendentes para vínculo com organizações do tipo "cliente".
        </p>
      </li>
      <li>
        <p>
          <strong>Vínculos:</strong> Seção onde mostras as organizações do tipo
          "cliente" que sua organização está vinculada.
        </p>
      </li>
      <li>
        <p>
          <strong>Organização:</strong> Seção onde você pode registrar uma
          organização do tipo "cliente" e automaticamente se vincular a ela.
        </p>
      </li>
      <li>
        <p>
          <strong>Atividades:</strong> Seção onde é possível ver as ações de
          seus usuários dentro de sua organização.
        </p>
      </li>
      <li>
        <p><strong>Configurações:</strong></p>
        <ul>
          <li>
            <p>
              <strong>Departamentoa:</strong> Seção onde é possível ver seus
              departamentos, criar um novo, editar ou até mesmo excluir.
            </p>
          </li>
          <li>
            <p>
              <strong>Usuários:</strong> Seção onde é possível ver seus
              usuários, criar um novo, editar ou até mesmo excluir.
            </p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          <strong>Ajuda:</strong> Seção onde é possível ver a documentação do
          Themplus.
        </p>
      </li>
    </ul>
  </main>
</template>
