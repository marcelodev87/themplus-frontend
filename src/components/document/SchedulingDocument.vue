<script setup lang="ts">
defineOptions({
  name: 'SchedulingDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Agendamentos</p>
    <p class="text-body1">
      Na página de agendamentos, contamos com todas os agendamentos lançados
      pela sua organização, onde conta com diversos filtros.
    </p>
    <div
      style="position: relative; padding-bottom: 52.7086383601757%; height: 0"
    >
      <iframe
        src="https://www.loom.com/embed/6cf8545f0a7e4825936718df35c1f55c?sid=535bac27-9c9e-4aab-a34b-a8857acd5d80"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      ></iframe>
    </div>

    <p class="text-h6 q-mt-md"># Criando um agendamento:</p>
    <p class="text-body1">
      Basta clicar no botão "Entrada +" caso queira lançar um agendamento do
      tipo 'Entrada' ou clique no botão "Saída - " caso queira lançar um
      agendamento do tipo 'Saída'.
    </p>
    <q-img src="/images/document/form-scheduling.png" width="600px" />

    <p class="text-h6 q-mt-md"># Brincando com os filtros:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Entradas:</strong> Ao ativar, visualizará apenas os
          agendamentos do tipo "Entrada" daquele período.
        </p>
      </li>
      <li>
        <p>
          <strong>Saídas:</strong> Ao ativar, visualizará apenas os agendamentos
          do tipo "Saída" daquele período.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtrar momento:</strong> Aparecerá apenas a listagem de
          períodos onde contém agendamentos criados.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtrar categoria:</strong> Poderá filtrar os agendamentos
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
          <strong>Não poderá</strong> lançar agendamento em um data passada.
        </p>
      </li>
      <li>
        <p>
          <strong>Não poderá</strong> lançar agendamento em um data em que a
          lista do mês já foi entregue no menu de contabilidade.
        </p>
      </li>
    </ul>
  </main>
</template>
