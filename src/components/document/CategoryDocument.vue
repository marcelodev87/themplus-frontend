<script setup lang="ts">
defineOptions({
  name: 'CategoryDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Gerenciamento de Categorias</p>
    <p class="text-body1">
      A página de Categorias centraliza o controle das categorias financeiras,
      abrangendo tanto as opções pré-definidas pelo Themplus quanto as
      categorias personalizadas que você pode criar para atender às necessidades
      específicas da sua organização. Acesse esta seção navegando até
      "Configurações" no menu lateral esquerdo e selecionando a opção
      "Categorias". As categorias definidas estarão disponíveis para seleção nos
      formulários de movimentações e agendamentos.
    </p>
    <div style="position: relative; padding-bottom: 42.5%; height: 0">
      <iframe
        src="https://www.loom.com/embed/747a3ebd3b8d4a32a9d61a5608399e4c?sid=e040f5e2-f938-4276-87c4-4a857e439019"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 98%; height: 100%"
      ></iframe>
    </div>

    <p class="text-h6 q-mt-md"># Criando Categorias Personalizadas:</p>
    <p class="text-body1">
      Para criar uma categoria sob medida, clique no botão "Categoria +", digite
      um nome descritivo e selecione o tipo apropriado: "Entrada" ou "Saída".
    </p>
    <div class="text-body1 column q-gutter-y-md">
      <q-img
        src="/images/document/category1.png"
        style="width: 1000px; max-width: 95vw"
      />
      <q-img
        src="/images/document/form-category.png"
        style="width: 1000px; max-width: 95vw"
        class="q-mt-md"
      />
    </div>
    <p class="text-h6 q-mt-md"># Explorando as Opções de Filtragem:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Categorias Padrão:</strong> Ative este filtro para visualizar
          exclusivamente as categorias pré-definidas pelo sistema, tanto de
          entrada quanto de saída. Estas categorias não podem ser editadas ou
          excluídas.
        </p>
      </li>
      <li>
        <p>
          <strong>Categorias Criadas:</strong> Ative este filtro para visualizar
          apenas as categorias criadas pela sua organização. Ao contrário das
          categorias padrão, estas podem ser editadas ou excluídas conforme
          necessário.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtrar por Tipo:</strong> Utilize esta opção para exibir
          apenas categorias do tipo entrada, saída ou todas as categorias.
        </p>
      </li>
      <li>
        <p>
          <strong>Pesquisa Inteligente:</strong> Localize rapidamente uma
          categoria específica através da função de pesquisa.
        </p>
      </li>
    </ul>
    <p class="text-h6 q-mt-md"># Pontos Relevantes:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          Ao tentar <strong>excluir uma categoria</strong> que tenha sido
          utilizada em registros de Movimentações ou Agendamentos, a categoria
          será automaticamente <strong>inativada</strong>, preservando a
          integridade dos dados. Em vez da exclusão permanente, a categoria
          exibirá um botão de reativação, permitindo seu uso futuro em
          formulários de Movimentação e Agendamento.
        </p>
        <p>
          A coluna de <strong>Alerta de Contabilidade</strong> exibe alertas
          cadastrados pelo seu escritório de contabilidade vinculado. Ao
          realizar uma movimentação que utilize uma categoria com alerta, uma
          confirmação de leitura será exibida antes de salvar a nova
          movimentação, garantindo a devida atenção às informações relevantes.
        </p>
      </li>
    </ul>
  </main>
</template>
