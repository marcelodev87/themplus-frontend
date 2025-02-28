<script setup lang="ts">
defineOptions({
  name: 'CategoryDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Categoria</p>
    <p class="text-body1">
      Na página de Categorias, contamos com todas as categorias pré-definidas
      que já vem no próprio Themplus + aquelas que você pode criar mediante sua
      necessidade. Ela pode ser encontrada clicando em "configurações" no menu
      lateral esquerdo e em seguida, você poderá visualizar a opção de
      categorias. As categorias aparecerão em formularios de movimentações e
      agendamentos.
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

    <p class="text-h6 q-mt-md"># Criando uma categoria:</p>
    <p class="text-body1">
      Basta clicar no botão de " Categoria + " e digitar um nome para sua
      categoria personalizada e selecionar se vai ser do tipo "Entrada" ou
      "Saída".
    </p>
    <div class="text-body1 column q-gutter-y-md">
      <q-img src="/images/document/category1.png" width="600px" />
      <q-img
        src="/images/document/form-category.png"
        width="600px"
        class="q-mt-md"
      />
    </div>
    <p class="text-h6 q-mt-md"># Brincando com os filtros:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Padão:</strong> Ao ativar, visualizará apenas as categorias
          pré-definidas no sistema tanto de entrada, como de saída, onde não
          podem serem editadas ou excluídas.
        </p>
      </li>
      <li>
        <p>
          <strong>Criados:</strong> Ao ativar, visualizará apenas as categorias
          que foram criadas pela sua organização, e ao contrário das padrões,
          essas você poderá editar ou excluir.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtrar tipo:</strong> Pode alternar entre mostrar apenas
          categorias do tipo entrada, saída ou Todas as categorias.
        </p>
      </li>
      <li>
        <p><strong>Pesquisar:</strong> Pesquise por uma categoria.</p>
      </li>
    </ul>
    <p class="text-h6 q-mt-md"># Observações:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          Ao tentar <strong>excluir uma categoria</strong> que foi utilizada em
          algum registro de Movimentações ou Agendamentos, a mesma será
          <strong>inativada</strong> e <strong>não deletada</strong>. Portanto,
          a categoria terá um novo botão para reativá-la e poder utilizar ela
          novamente nos formulários de Movimentação e Agendamento.
        </p>
        <p>
          A coluna de <strong>alerta</strong> é quando sua organização já tem um
          escritório de contabilidade vinculada, e o próprio cadastra alertas
          para suas categorias, consequentemente, ao realizar um movimentação
          que aquela categoria contenha um alerta, aparecerá uma confirmação de
          leitura antes de salvar a nova movimentação.
        </p>
      </li>
    </ul>
  </main>
</template>
