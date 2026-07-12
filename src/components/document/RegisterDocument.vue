<script setup lang="ts">
defineOptions({ name: 'RegisterDocument' });
</script>

<template>
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="assignment" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">
          Monitoramento de Atividades
        </p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Acompanhe as ações dos usuários e obtenha insights da organização
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      A seção de Atividades exibe um registro completo das ações realizadas
      pelos usuários dentro da sua organização, garantindo rastreabilidade e
      transparência em todas as operações.
    </p>

    <div class="doc-video-wrapper">
      <iframe
        src="https://www.loom.com/embed/e2a2ecd61b18438c80f9f8cb178c8a59?sid=13248a08-6268-4920-9490-0ddb7c9a4281"
        allowfullscreen
        webkitallowfullscreen
        mozallowfullscreen
      />
    </div>

    <div class="doc-section">
      <div class="doc-section-title">
        <q-icon name="info" color="primary" size="18px" />
        <span class="text-subtitle1 text-weight-bold"
          >Restrições importantes</span
        >
      </div>

      <div class="doc-callout doc-callout--warning">
        <q-icon name="schedule" size="22px" class="q-mt-xs" />
        <div>
          <p class="text-body2 text-weight-bold q-mb-xs">Período de retenção</p>
          <p class="text-body2 q-mb-none" style="line-height: 1.6">
            Os registros de atividades são mantidos por um
            <strong>período máximo de 60 dias</strong>. Ações mais antigas são
            automaticamente excluídas do sistema.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
