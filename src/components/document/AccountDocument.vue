<script setup lang="ts">
defineOptions({
  name: 'AccountDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Gerenciamento de Contas</p>
    <p class="text-body1">
      A página de Contas centraliza o controle de suas contas bancárias,
      incluindo a "Caixinha" pré-definida pelo Themplus. Acesse esta seção
      navegando até "Configurações" no menu lateral esquerdo e selecionando a
      opção "Contas". As contas definidas estarão disponíveis para seleção nos
      formulários de movimentações e agendamentos, facilitando o rastreamento e
      a organização de suas finanças.
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

    <p class="text-h6 q-mt-md"># Adicionando uma Nova Conta Bancária:</p>
    <p class="text-body1">
      Para cadastrar uma nova conta bancária, clique no botão "Contas +". Você
      pode selecionar um banco já existente em nossa lista ou, caso não encontre
      o banco desejado, digitar o nome do banco. Em seguida, insira o número da
      conta e, opcionalmente, o número da agência. Adicione uma descrição para
      facilitar a identificação da conta.
    </p>
    <q-img
      src="/images/document/form-account.png"
      style="width: 600px; max-width: 95vw"
    />

    <p class="text-h6 q-mt-md"># Opções de Busca:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Localizar Conta:</strong> Utilize a função de pesquisa para
          encontrar rapidamente uma conta específica.
        </p>
      </li>
    </ul>
    <p class="text-h6 q-mt-md"># Informações Importantes:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          Para <strong>excluir uma conta</strong>, clique no ícone de "lápis" na
          coluna Ação para editar as informações da conta. Dentro do formulário
          de edição, você encontrará o botão para deletar a conta.
        </p>
      </li>
      <li>
        <p>
          Ao tentar <strong>excluir uma conta</strong> que tenha sido utilizada
          em registros de Movimentação ou Agendamento, a conta será
          automaticamente <strong>inativada</strong> para preservar a
          integridade dos dados. Em vez da exclusão permanente, a conta exibirá
          um botão de reativação, permitindo seu uso futuro em formulários de
          Movimentação e Agendamento.
        </p>
      </li>
    </ul>
  </main>
</template>
