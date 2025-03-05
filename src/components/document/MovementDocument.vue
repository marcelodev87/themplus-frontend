<script setup lang="ts">
defineOptions({
  name: 'MovementDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold">
      # Gerenciamento de Movimentações Financeiras
    </p>
    <p class="text-body1">
      A página de Movimentações oferece um controle centralizado de todas as
      transações financeiras da sua organização, proporcionando visibilidade e
      flexibilidade através de recursos de filtragem avançados.
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

    <p class="text-h6 q-mt-md"># Registro Simplificado de Movimentações:</p>
    <p class="text-body1">
      Para registrar uma nova transação, clique no botão "Entrada +" para
      lançamentos de entrada (receitas) ou no botão "Saída -" para lançamentos
      de saída (despesas). O sistema guiará você através do processo.
    </p>
    <q-img
      src="/images/document/form-movement.png"
      style="width: 600px; max-width: 95vw"
    />

    <p class="text-h6 q-mt-md"># Refinando sua Análise com Filtros:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Visualização de Entradas:</strong> Isole as transações de
          entrada para uma análise focada nas receitas da sua organização.
        </p>
      </li>
      <li>
        <p>
          <strong>Visualização de Saídas:</strong> Concentre-se nas transações
          de saída para um controle preciso das despesas.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtro por Período:</strong> Selecione um período específico
          para analisar as movimentações financeiras relevantes para aquele
          intervalo de tempo. Somente períodos com movimentações registradas
          serão exibidos.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtro por Categoria:</strong> Refine sua análise
          categorizando as movimentações para obter insights sobre áreas
          específicas do seu negócio.
        </p>
      </li>
      <li>
        <p>
          <strong>Pesquisa Inteligente:</strong> Encontre rapidamente
          movimentações específicas através da função de pesquisa.
        </p>
      </li>
    </ul>
    <p class="text-h6 q-mt-md"># Considerações Importantes:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Integridade Contábil:</strong> Para garantir a integridade dos
          seus dados financeiros, o sistema restringe a criação, edição ou
          exclusão de movimentações em períodos que já foram enviados à
          contabilidade. Lançamentos futuros que incluam meses já entregues à
          contabilidade serão automaticamente ignorados para esses meses.
        </p>
      </li>
    </ul>
  </main>
</template>
