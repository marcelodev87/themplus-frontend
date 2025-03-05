<script setup lang="ts">
defineOptions({
  name: 'MovementDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Movimentações</p>
    <p class="text-body1">
      Na página de movimentações, contamos com todas as movimentações lançadas
      pela sua organização, onde conta com diversos filtros.
    </p>
    <div
      style="position: relative; padding-bottom: 56.22254758418741%; height: 0"
    >
      <iframe
        src="https://www.loom.com/embed/a3953213cf72425cab616386936a4cdb?sid=c993fba8-8d24-4511-b236-57cdb79d6dc8"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      ></iframe>
    </div>

    <p class="text-h6 q-mt-md"># Criando uma movimentação:</p>
    <p class="text-body1">
      Basta clicar no botão "Entrada +" caso queira lançar uma movimentação do
      tipo 'Entrada' ou clique no botão "Saída - " caso queira lançar uma
      movimentação do tipo 'Saída'.
    </p>
    <q-img src="/images/document/form-movement.png" width="600px" />

    <p class="text-h6 q-mt-md"># Brincando com os filtros:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Entradas:</strong> Ao ativar, visualizará apenas as
          movimentações do tipo "Entrada" daquele período.
        </p>
      </li>
      <li>
        <p>
          <strong>Saídas:</strong> Ao ativar, visualizará apenas as
          movimentações do tipo "Saída" daquele período.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtrar momento:</strong> Aparecerá apenas a listagem de
          períodos onde contém movimentações criadas.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtrar categoria:</strong> Poderá filtrar as movimentações
          pela categoria.
        </p>
      </li>
      <li>
        <p><strong>Pesquisar:</strong> Pesquise por uma movimentação.</p>
      </li>
    </ul>
    <p class="text-h6 q-mt-md"># Observações:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Não poderá</strong> lançar movimentação em um determinado
          período em que ja foi entregue na contabilidade. Caso, crie uma
          movimentação com lançamentos futuros e contenha algum mês que já foi
          entregue, será ignorado o lançamento para o mês que está entregue. O
          mês ja entregue não poderá criar, nem editar e nem excluir nada.
        </p>
      </li>
    </ul>
  </main>
</template>
