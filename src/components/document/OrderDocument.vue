<script setup lang="ts">
defineOptions({
  name: 'OrderDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Solicitações</p>
    <p class="text-body1">
      Na página de Solicitações, visualizamos todas as solicitações de vínculo
      com organizações do tipo "cliente".
    </p>
    <q-img src="/images/document/order.png" width="1000px" />
    <p class="text-h6 q-mt-md"># Criando uma solicitação:</p>
    <p class="text-body1">
      Basta clicar no botão "Solicitações +" e após isso, vai surgir um modal
      com um formulário, onde você pesquisa o cliente, seleciona, informa uma
      descrição e envia a solicitação.
      <strong>Clique na lupa para pesquisar a organização</strong>.
    </p>
    <q-img src="/images/document/form-order.png" width="1000px" />
  </main>
</template>
