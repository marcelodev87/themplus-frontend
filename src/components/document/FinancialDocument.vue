<script setup lang="ts">
defineOptions({
  name: 'FinancialDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Contabilidade</p>
    <p class="text-body1">
      Na página de Contabilidade, contamos com todas as movimentações criadas
      separadas por mês, mostrando o status de 'Entregue' ou 'Não entregue'.
    </p>
    <div
      style="position: relative; padding-bottom: 52.7086383601757%; height: 0"
    >
      <iframe
        src="https://www.loom.com/embed/db5886a49f7c4457b037d3dfd0cf75db?sid=28f8e576-4f68-401d-af98-00b8a9e0d838"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      ></iframe>
    </div>

    <p class="text-h6 q-mt-md"># Para que serve essa seção?</p>
    <p class="text-body1">
      As movimentações criadas são mostradas nessa seção separadas pelo mês de
      movimentação, onde você poderá entregar essa lista, consequentemente, se
      tornando visivel para uma organização de contabilidade poder fazer suas
      análises.
    </p>

    <p class="text-h6 q-mt-md"># Entendendo as funcionalidades:</p>
    <q-img src="/images/document/financial.png" width="1000px" />
    <ol class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Configurações:</strong> Poderá gerenciar permissões em que um
          escritório de contabilidade tem póder sobre sua organização.
        </p>
      </li>
      <li>
        <p>
          <strong>Solicitações:</strong> Aqui visualizará todos os convites de
          vínculo feito por organizações de contabilidade.
        </p>
      </li>
      <li>
        <p>
          <strong>Dados do contador:</strong> Esse botão só aparece quando sua
          organização está vinculada a uma organização de contabilidade. Aqui
          você poderá ver os dados da organização de contabilidade em que está
          vinculado.
        </p>
      </li>
    </ol>
    <p class="text-h6 q-mt-md"># Observações:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          Ao <strong>entregar</strong> uma lista de movimentações, não poderá
          lançar movimentações nesse período, a menos que solicite ao escritório
          de contabilidade para reabrir o mês, permitindo novas alterações.
        </p>
      </li>
      <li>
        <p>
          O <strong>gerenciamento de permissões</strong> em "configurações", faz
          com que a organização tenha algumas ações sobre sua organização.
          Preste atenção ao manuseio dessas informações.
        </p>
      </li>
    </ul>
  </main>
</template>
