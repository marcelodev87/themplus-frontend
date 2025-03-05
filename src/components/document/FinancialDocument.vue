<script setup lang="ts">
defineOptions({
  name: 'FinancialDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Visão Geral da Contabilidade</p>
    <p class="text-body1">
      A página de Contabilidade oferece uma visão abrangente das movimentações
      financeiras, organizadas mensalmente, com indicação clara do status:
      'Entregue' ou 'Não entregue'.
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

    <p class="text-h6 q-mt-md"># Propósito da Seção</p>
    <p class="text-body1">
      Esta seção exibe as movimentações financeiras agrupadas por mês,
      permitindo o envio organizado dessas informações. Ao submeter a lista, ela
      se torna acessível a uma organização contábil parceira para análise e
      processamento.
    </p>

    <p class="text-h6 q-mt-md"># Compreendendo as Funcionalidades:</p>
    <q-img src="/images/document/financial.png" width="1000px" />
    <ol class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Configurações de Acesso:</strong> Gerencie as permissões
          concedidas a escritórios de contabilidade para acessar e interagir com
          os dados da sua organização.
        </p>
      </li>
      <li>
        <p>
          <strong>Solicitações de Vinculação:</strong> Visualize e gerencie
          convites de conexão enviados por organizações contábeis.
        </p>
      </li>
      <li>
        <p>
          <strong>Informações do Contador:</strong> Exibido após a vinculação
          com uma organização contábil, este botão permite acessar os detalhes
          de contato e informações relevantes do seu parceiro contábil.
        </p>
      </li>
    </ol>
    <p class="text-h6 q-mt-md"># Considerações Importantes:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          Após <strong>entregar</strong> uma lista de movimentações, o
          lançamento de novas transações para o período correspondente será
          bloqueado, a menos que o mês seja reaberto pela organização contábil,
          permitindo modificações adicionais.
        </p>
      </li>
      <li>
        <p>
          O <strong>gerenciamento de permissões</strong> na seção "Configurações
          de Acesso" concede à organização contábil parceira a capacidade de
          realizar determinadas ações em nome da sua organização. Avalie
          cuidadosamente o impacto dessas permissões antes de concedê-las.
        </p>
      </li>
    </ul>
  </main>
</template>
