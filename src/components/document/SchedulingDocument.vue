<script setup lang="ts">
defineOptions({
  name: 'SchedulingDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Gerenciamento de Agendamentos Financeiros</p>
    <p class="text-body1">
      A página de Agendamentos oferece uma visão abrangente e organizada de
      todos os seus compromissos financeiros futuros, equipada com filtros
      intuitivos para uma gestão otimizada.
    </p>
    <div
      style="position: relative; padding-bottom: 52.7086383601757%; height: 0"
    >
      <iframe
        src="https://www.loom.com/embed/6cf8545f0a7e4825936718df35c1f55c?sid=535bac27-9c9e-4aab-a34b-a8857acd5d80"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      ></iframe>
    </div>

    <p class="text-h6 q-mt-md"># Criando Agendamentos com Facilidade:</p>
    <p class="text-body1">
      Para programar um novo compromisso financeiro, clique no botão "Entrada +"
      para agendar um recebimento ou no botão "Saída -" para agendar um
      pagamento.
    </p>
    <q-img
      src="/images/document/form-scheduling.png"
      style="width: 600px; max-width: 95vw"
    />

    <p class="text-h6 q-mt-md">
      # Aprimorando sua Programação com Filtros Avançados:
    </p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Visualizar Agendamentos de Entrada:</strong> Concentre-se nos
          recebimentos programados para otimizar o fluxo de caixa.
        </p>
      </li>
      <li>
        <p>
          <strong>Visualizar Agendamentos de Saída:</strong> Gerencie seus
          pagamentos futuros para manter a saúde financeira da sua organização.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtrar por Período:</strong> Selecione um período específico
          para visualizar apenas os agendamentos relevantes para aquele
          intervalo de tempo.
        </p>
      </li>
      <li>
        <p>
          <strong>Filtrar por Categoria:</strong> Categorize seus agendamentos
          para uma análise mais detalhada e um controle financeiro aprimorado.
        </p>
      </li>
      <li>
        <p>
          <strong>Pesquisa Personalizada:</strong> Localize agendamentos
          específicos rapidamente através da função de pesquisa.
        </p>
      </li>
    </ul>
    <p class="text-h6 q-mt-md"># Restrições Importantes:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Agendamentos Futuros Apenas:</strong> O sistema permite apenas
          o agendamento de eventos financeiros futuros, garantindo a precisão do
          seu planejamento.
        </p>
      </li>
      <li>
        <p>
          <strong>Integridade com Contabilidade:</strong> Para manter a
          consistência com os dados contábeis, agendamentos para meses já
          entregues à contabilidade não são permitidos.
        </p>
      </li>
    </ul>
  </main>
</template>
