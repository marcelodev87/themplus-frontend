<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({
  name: 'DashboardDocument',
});

const showImage = ref<boolean>(false);
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
  <main>
    <p class="text-h5 text-bold"># O Painel de Controle: Visão Estratégica</p>
    <p class="text-body1">
      O Painel de Controle (Dashboard) oferece uma visão consolidada das
      informações mais relevantes, permitindo uma análise rápida e eficiente do
      panorama financeiro da sua organização.
    </p>
    <q-img
      @click="openShowImage('/images/document/dashboard.png')"
      src="/images/document/dashboard.png"
      style="width: 1000px; max-width: 95vw"
    />
    <p class="text-body1 q-mt-md">
      Aproveite os diversos recursos de filtragem e visualização para obter
      insights valiosos:
    </p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Filtragem Inteligente:</strong> Analise dados por período
          específico ou concentre-se em um mês particular. Ao optar pelo "Filtro
          por mês", o sistema exibirá apenas os meses com movimentações
          registradas.
        </p>
      </li>
      <li>
        <p>
          <strong>Categorização Detalhada:</strong> Visualize o panorama
          completo com "Todas as categorias" ou refine sua análise selecionando
          categorias específicas. A categoria escolhida impactará os gráficos
          que apresentam dados categorizados.
        </p>
      </li>
      <li>
        <p>
          <strong>Exportação Profissional:</strong> Exporte os dados exibidos no
          painel para um arquivo PDF formatado, preservando os filtros
          aplicados. Ideal para relatórios e apresentações.
        </p>
      </li>
      <li>
        <p>
          <strong>Análise de Movimentações:</strong> Acompanhe o fluxo
          financeiro através do valor total de entradas e saídas. O saldo final
          apresenta a diferença entre esses valores, oferecendo uma visão clara
          da saúde financeira.
        </p>
      </li>
      <li>
        <p>
          <strong>Controle de Agendamentos:</strong> Monitore os agendamentos de
          entrada e saída, visualizando o saldo resultante. Ideal para o
          planejamento financeiro e projeção de resultados.
        </p>
      </li>
      <li>
        <p>
          <strong>Gestão de Usuários:</strong> Tenha uma visão geral da
          estrutura de usuários da sua organização, com a contagem de usuários
          comuns e administradores, além do total de usuários cadastrados.
        </p>
      </li>
      <li>
        <p>
          <strong>Ranking de Contas (TOP 3):</strong> Identifique as contas com
          os maiores saldos, através de um ranking das 3 primeiras posições.
          Permite identificar as áreas financeiramente mais significativas da
          organização.
        </p>
      </li>
      <li>
        <p>
          <strong>Gráfico de Movimentações x Categoria:</strong> Visualize as
          movimentações (entradas ou saídas) distribuídas por categoria em um
          gráfico de barras horizontais. O comprimento de cada barra representa
          a proporção do valor total da categoria em relação ao total de
          movimentações. Ex: Se 20% das movimentações do mês estão na categoria
          "Campanha", a barra correspondente estará preenchida em 20%.
        </p>
      </li>
      <li>
        <p>
          <strong>Gráfico de Agendamentos x Categoria:</strong> Analise os
          agendamentos (entradas ou saídas) categorizados, visualizados em um
          gráfico de barras horizontais. O comprimento de cada barra reflete a
          proporção do valor total da categoria em relação ao total de
          agendamentos. Ex: Se 50% dos agendamentos do mês são do tipo
          "Doações", a barra correspondente estará preenchida em 50%.
        </p>
      </li>
      <li>
        <p>
          <strong>Visão Global da Organização:</strong> Acesse informações
          abrangentes sobre as movimentações da sua organização, sem restrição
          de período. Ideal para análises de longo prazo e identificação de
          tendências.
        </p>
      </li>
    </ul>
    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
