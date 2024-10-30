<script setup lang="ts">
import { type ICardDashboard } from 'src/ts/interfaces/data/Dashboard';
import CardDashboard from 'src/components/shared/CardDashboard.vue';
import DashboardFilter from 'src/components/headers/DashboardFilter.vue';
import { computed } from 'vue';

defineOptions({
  name: 'Dashboard',
});

const cardsDashboard = computed<Array<ICardDashboard>>(() => [
  {
    src: '/images/dinheiro.png',
    title: 'Entradas de Outubro',
    valueTitle: 'R$ 1820,00',
    width: '30%',
    color: 'bg-green-2',
  },
  {
    src: '/images/dinheiro.png',
    title: 'Saídas de Outubro',
    valueTitle: 'R$ 120,00',
    width: '30%',
    color: 'bg-red-2',
  },
  {
    src: '/images/dinheiro.png',
    title: 'Saldo de Outubro',
    valueTitle: 'R$ 1700,00',
    width: '30%',
    color: 'bg-blue-2',
  },
]);
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <DashboardFilter />
    </header>
    <main>
      <div class="row justify-between q-gutter-sm q-pa-md">
        <CardDashboard
          v-for="(item, index) in cardsDashboard"
          :key="index"
          :src="item.src"
          :title="item.title"
          :value-title="item.valueTitle"
          :width="item.width"
          :color="item.color"
        />
      </div>
      <div class="row justify-between q-gutter-sm q-pa-md">
        <CardDashboard
          v-for="(item, index) in cardsDashboard"
          :key="index"
          :src="item.src"
          :title="item.title"
          :value-title="item.valueTitle"
          :width="item.width"
          :color="item.color"
        />
      </div>
    </main>
  </section>
</template>
