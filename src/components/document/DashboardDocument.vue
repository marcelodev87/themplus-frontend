<script setup lang="ts">
defineOptions({
  name: 'DashboardDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Dashboard</p>
    <p class="text-body1">
      Na página de Dashboard, contamos com diversas informações para que você
      possa encontrar informações úteis com facilidade.
    </p>
    <q-img src="/images/document/dashboard.png" width="600px" />
    <p class="text-body1 q-mt-md">
      Contamos com diversas informações e filtros, sendo elas:
    </p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Tipo de filtro:</strong> Período ou por mês, sendo que ao
          selecionar por "Filtro por mês", o filtro ao lado direito irá aparecer
          na lista, apenas os meses que contém movimentações lançadas.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtro por categoria:</strong> Deixe como "Todas categorias"
          ou filtre alguma desejada. A categoria selecionada filtrará varios
          gráficos que dispõe de categoria.
        </p>
      </li>
      <li>
        <p>
          <strong>Função Export:</strong> Ao clicar no botão, o Themplus irá
          gerar um arquivo PDF para download, onde conterá os dados da tela
          atual, ou seja, manterá os dados com os filtros atuais.
        </p>
      </li>
      <li>
        <p>
          <strong>Movimentações:</strong> Mostra informações do valor total de
          movimentações que foram lançadas como entrada e saída, e no final,
          mostra o saldo, que é o cálculo de ( valor total entrada ou saída -
          valor total entrada ou saída ).
        </p>
      </li>
      <li>
        <p>
          <strong>Agendamentos:</strong> Mostra informações do valor total de
          agendamentos que foram lançadas como entrada e saída, e no final,
          mostra o saldo, que é o cálculo de ( valor total entrada ou saída -
          valor total entrada ou saída ).
        </p>
      </li>
      <li>
        <p>
          <strong>Usuários:</strong> Mostra informações sobre a quantidade de
          usuários que sua organização tem cadastrado, categorizando em usuários
          comuns e administradores, e no final que é o total de usuários ( Total
          de Administradores + Total de Usuário comuns ).
        </p>
      </li>
      <li>
        <p>
          <strong>Contas TOP 3:</strong> Mostra um ranking de contas cadastradas
          na sua organização, com 3 posições. São consideradas as contas com os
          melhores valores em relação as outras.
        </p>
      </li>
      <li>
        <p>
          <strong>Movimentações de (entrada ou saída) x categoria:</strong> Aqui
          dispõe de um gráfico de barras horizontais, onde mostra todas as
          movimentações de ( entrada ou saída ) com base nos filtros,
          categorizadas em "categorias". A barra é preenchida proporcionalmente
          ao total que foi lançado. Ex: Se foi lançado no mês R$ 1000,00 e R$
          200,00 é do tipo "Campanha", a barra estará preenchida em 20%.
        </p>
      </li>
      <li>
        <p>
          <strong>Agendamentos de (entrada ou saída) x categoria:</strong> Aqui
          dispõe de um gráfico de barras horizontais, onde mostra todas os
          agendamentos de ( entrada ou saída ) com base nos filtros,
          categorizadas em "categorias". A barra é preenchida proporcionalmente
          ao total que foi lançado. Ex: Se foi agendado no mês R$ 500,00 e R$
          250,00 é do tipo "Doações", a barra estará preenchida em 50%.
        </p>
      </li>
      <li>
        <p>
          <strong>Dados gerais da organização:</strong> Ao clicar, poderá
          visualizar informações gerais de sua organização sobre movimentações,
          ignorando períodos, ou seja, contabilizando todos os meses.
        </p>
      </li>
    </ul>
  </main>
</template>
