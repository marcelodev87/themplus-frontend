<script setup lang="ts">
defineOptions({
  name: 'OrderDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold">
      # Gerenciamento Centralizado de Solicitações de Cliente
    </p>
    <p class="text-body1">
      A página de Solicitações oferece uma visão completa e organizada de todos
      os pedidos de vínculo de organizações do tipo "cliente", permitindo um
      gerenciamento eficiente do seu pipeline de novos relacionamentos.
    </p>
    <q-img
      src="/images/document/order.png"
      style="width: 1000px; max-width: 95vw"
    />
    <p class="text-h6 q-mt-md">
      # Iniciando uma Solicitação de Cliente com Simplicidade:
    </p>
    <p class="text-body1">
      Para iniciar uma solicitação de vínculo, clique no botão "Solicitações +".
      Um modal intuitivo será exibido, contendo um formulário de fácil
      preenchimento. Localize o cliente desejado, selecione-o, adicione uma
      descrição concisa e envie sua solicitação.
      <strong
        >Utilize o ícone de lupa para uma pesquisa rápida e precisa da
        organização desejada.</strong
      >
    </p>
    <q-img
      src="/images/document/form-order.png"
      style="width: 1000px; max-width: 95vw"
    />
  </main>
</template>
