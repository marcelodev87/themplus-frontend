<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({ name: 'AccountDocument' });

const showImage = ref(false);
const urlImage = ref<string | null>(null);

const openShowImage = (url: string) => {
  showImage.value = true;
  urlImage.value = url;
};
const closeShowImage = () => {
  showImage.value = false;
  urlImage.value = null;
};
</script>

<template>
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="account_balance_wallet" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Contas Bancárias</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Gerencie suas contas para rastreamento financeiro
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A página de Contas centraliza o controle das contas bancárias, incluindo a
      <em>"Caixinha"</em> pré-definida pelo Themplus. Acesse em
      <strong>Configurações → Contas</strong>. As contas estarão disponíveis nos
      formulários de movimentações e agendamentos.
    </p>

    <div class="doc-video-wrapper">
      <iframe
        src="https://www.loom.com/embed/23df90adcb3a4e6ab1f0408e03df71ce?sid=300fb592-508f-42eb-8595-a880fea5522b"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
      />
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="add_circle" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Adicionando uma conta bancária</span
        >
      </div>

      <p class="text-body2 text-grey-8 q-mb-md" style="line-height: 1.7">
        Clique em <strong>"Contas +"</strong>. Selecione um banco da lista ou
        digite o nome caso não encontre. Insira o número da conta e,
        opcionalmente, a agência. Adicione uma descrição para facilitar a
        identificação.
      </p>

      <q-img
        src="/images/document/form-account.png"
        class="doc-image"
        style="max-width: min(540px, 100%)"
        @click="openShowImage('/images/document/form-account.png')"
      />
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="info" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Informações importantes</span
        >
      </div>

      <div class="doc-callout doc-callout--info">
        <q-icon name="edit" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">
            Como excluir uma conta
          </p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            Para excluir, clique no ícone de <strong>lápis</strong> na coluna
            Ação para editar a conta. Dentro do formulário de edição você
            encontrará o botão para deletar.
          </p>
        </div>
      </div>

      <div class="doc-callout doc-callout--info">
        <q-icon name="archive" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">
            Inativação em vez de exclusão
          </p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            Ao tentar excluir uma conta utilizada em registros de Movimentação
            ou Agendamento, ela será automaticamente
            <strong>inativada</strong> para preservar a integridade dos dados.
            Um botão de reativação permitirá seu uso futuro.
          </p>
        </div>
      </div>

      <div class="doc-feature-card q-pa-md">
        <div class="row no-wrap items-start q-gutter-sm">
          <q-icon name="search" color="primary" size="20px" class="q-mt-xs" />
          <div>
            <p class="text-weight-bold text-body2 q-mb-xs">Localizar conta</p>
            <p
              class="text-caption text-grey-7 q-mb-none"
              style="line-height: 1.5"
            >
              Utilize a função de pesquisa para encontrar rapidamente uma conta
              específica na listagem.
            </p>
          </div>
        </div>
      </div>
    </div>

    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
