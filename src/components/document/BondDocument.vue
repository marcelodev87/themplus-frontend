<script setup lang="ts">
defineOptions({
  name: 'BondDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Gerenciamento de Vínculos Organizacionais</p>
    <p class="text-body1">
      A página de Vínculos proporciona uma visão abrangente das organizações
      atualmente vinculadas à sua, incluindo todas as filiais. Essa
      centralização facilita o acompanhamento e a gestão de seus
      relacionamentos.
    </p>
    <q-img
      src="/images/document/bond.png"
      style="width: 1000px; max-width: 95vw"
    />
    <p class="text-h6 q-mt-md">
      # Explorando as Funcionalidades de Gerenciamento:
    </p>
    <p class="q-mt-md">
      Para cada organização listada, as seguintes funcionalidades de
      gerenciamento poderão esta disponível:
    </p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Código Interno:</strong> Configure um código interno para cada
          organização, de acordo com as regras de sua organização.
        </p>
      </li>
      <li>
        <p>
          <strong>Alertas Personalizados:</strong> Configure alertas específicos
          para as categorias de movimentação de cada organização cliente. Quando
          o cliente registrar uma movimentação utilizando uma categoria com um
          alerta configurado, será necessário confirmar a leitura do alerta
          antes de concluir o lançamento da movimentação, garantindo a devida
          atenção às informações relevantes.
        </p>
      </li>
      <li>
        <p>
          <strong>Gestão de Usuários Delegada:</strong> Gerencie os usuários da
          organização cliente (adicione, edite ou exclua), respeitando as
          permissões concedidas pela própria organização cliente. Este recurso
          promove a colaboração e a autonomia.
        </p>
      </li>
      <li>
        <p>
          <strong>Análise Detalhada de Relatórios:</strong> Acesse e analise os
          relatórios compartilhados pela organização cliente, obtendo insights
          valiosos e facilitando a tomada de decisões estratégicas.
        </p>
      </li>
      <li>
        <p>
          <strong>Exclusão de Vínculo:</strong> Remova o vínculo com a
          organização cliente de forma controlada e segura, caso seja
          necessário.
        </p>
      </li>
    </ul>
  </main>
</template>
