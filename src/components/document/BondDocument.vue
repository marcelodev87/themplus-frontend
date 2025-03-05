<script setup lang="ts">
defineOptions({
  name: 'BondDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Vínculos</p>
    <p class="text-body1">
      Na página de Vínculos, visualizamos todas as organizações que estão
      vinculadas a sua organização, isso inclui as filiais.
    </p>
    <q-img src="/images/document/bond.png" width="1000px" />
    <p class="text-h6 q-mt-md"># Entendendo as funcionalidades:</p>
    <p class="q-mt-md">
      Para cada organização na tabela, poderá aparecer as seguintes
      funcionalidades:
    </p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Alertas:</strong> Poderá cadastrar alertas para as categorias
          da organização cliente, consequentemente, o cliente ao lançar uma
          movimentação com uma categoria que contém o alerta, o mesmo terá que
          marcar a opção de lido, para poder lançar a movimentação.
        </p>
      </li>
      <li>
        <p>
          <strong>Usuários:</strong> Aqui você poderá gerenciar usuários da
          organização cliente ( adicionar, editar ou excluir ), mediante
          permissão dada da organização cliente.
        </p>
      </li>
      <li>
        <p>
          <strong>Analisar:</strong> Aqui poderá ver os relatórios entregue pela
          organização cliente.
        </p>
      </li>
      <li>
        <p>
          <strong>Excluir:</strong> Pode excluir o vínculo com a organização
          cliente.
        </p>
      </li>
    </ul>
  </main>
</template>
