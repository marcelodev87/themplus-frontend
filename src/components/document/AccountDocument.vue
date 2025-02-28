<script setup lang="ts">
defineOptions({
  name: 'AccountDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Contas</p>
    <p class="text-body1">
      Na página de Contas, contamos com todas as contas criadas e a "Caixinha"
      que já é pré-definidas no Themplus. Ela pode ser encontrada clicando em
      "configurações" no menu lateral esquerdo e em seguida, você poderá
      visualizar a opção de contas. As contas aparecerão em formulários de
      movimentações e agendamentos.
    </p>
    <div style="position: relative; padding-bottom: 42.5%; height: 0">
      <iframe
        src="https://www.loom.com/embed/23df90adcb3a4e6ab1f0408e03df71ce?sid=300fb592-508f-42eb-8595-a880fea5522b"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      ></iframe>
    </div>

    <p class="text-h6 q-mt-md"># Criando uma conta:</p>
    <p class="text-body1">
      Para cadastrar uma nova conta bancária, clique no botão "Contas +". Você
      poderá selecionar um banco já existente na nossa lista, ou, caso ele não
      esteja disponível, digitar o nome do banco desejado. Após isso, insira o
      número da conta e da agência (este último é opcional). Você também pode
      adicionar uma descrição para ajudar a identificar a conta.
    </p>
    <q-img src="/images/document/form-account.png" width="600px" />

    <p class="text-h6 q-mt-md"># Brincando com os filtros:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p><strong>Pesquisar:</strong> Pesquise por uma conta.</p>
      </li>
    </ul>
    <p class="text-h6 q-mt-md"># Observações:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          Para <strong>excluir uma conta</strong>, deve apertar no botão com um
          ícone de "lápis" na coluna de Ação. Ao abrir o formulário onde pode
          editar a conta, você visualizará um botaão na parte inferior para
          deletar.
        </p>
      </li>
      <li>
        <p>
          Ao tentar <strong>excluir uma conta</strong> que foi utilizada em
          algum registro de Movimentação ou Agendamento, a mesma será
          <strong>inativada</strong> e <strong>não deletada</strong>. Portanto,
          a conta terá um novo botão para reativá-la e poder utilizar ela
          novamente nos formulários de Movimentações e Agendamentos.
        </p>
      </li>
    </ul>
  </main>
</template>
