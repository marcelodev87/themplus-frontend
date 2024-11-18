<script setup lang="ts">
import { type ICardDashboard } from 'src/ts/interfaces/data/Dashboard';
import CardDashboard from 'src/components/shared/CardDashboard.vue';
import { useDashboardStore } from 'src/stores/dashboard-store';
import { computed, onMounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';

defineOptions({
  name: 'Dashboard',
});

const { getDashboard } = useDashboardStore();
const { loadingDashboard, listCategoryDashboard, listMonthYear } =
  storeToRefs(useDashboardStore());

const filterMonthYear = ref('');
const columnsCategoriesDashboard = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Categoria',
    field: 'name',
    align: 'left',
    style: 'min-width: 100px; max-width: 30%',
  },
  {
    name: 'value',
    label: 'Valor R$',
    field: 'value',
    align: 'left',
    style: 'width: 70%',
  },
]);

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
const categoriesEntry = computed(() => {
  return listCategoryDashboard.value
    ?.filter((item) => item.type === 'entrada')
    .sort((a, b) => Number(b.value) - Number(a.value));
});

const categoriesOut = computed(() => {
  return listCategoryDashboard.value
    ?.filter((item) => item.type !== 'entrada')
    .sort((a, b) => Number(b.value) - Number(a.value));
});
const totalValueEntryCategory = computed(() => {
  if (!categoriesEntry.value || categoriesEntry.value.length === 0) {
    return 0;
  }

  return categoriesEntry.value.reduce((total, product) => {
    const productValue = Number(product.value) || 0;
    return total + productValue;
  }, 0);
});
const totalValueOutCategory = computed(() => {
  if (!categoriesOut.value || categoriesOut.value.length === 0) {
    return 0;
  }

  return categoriesOut.value.reduce((total, product) => {
    const productValue = Number(product.value) || 0;
    return total + productValue;
  }, 0);
});

const fetchInformationsDashboard = async () => {
  await getDashboard();
};
const checkCurrentMonthYear = () => {
  const currentDate = new Date();
  const currentMonthYear = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

  if (listMonthYear.value.includes(currentMonthYear)) {
    filterMonthYear.value = currentMonthYear;
  } else {
    filterMonthYear.value = '';
  }
};
const getCurrentMonthYear = () => {
  const currentDate = new Date();
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  return `${monthNames[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;
};

onMounted(async () => {
  await fetchInformationsDashboard();
  checkCurrentMonthYear();
});
</script>
<template>
  <section>
    <header class="row justify-between items-center no-wrap bg-grey-1 q-pa-sm">
      <span class="text-h6">{{ getCurrentMonthYear() }}</span>
      <q-separator />
      <q-select
        v-model="filterMonthYear"
        :options="listMonthYear"
        label="Filtrar momento"
        filled
        dense
        options-dense
        bg-color="grey-1"
        label-color="black"
        style="min-width: 200px"
      >
        <template v-slot:prepend>
          <q-icon name="calendar_today" color="black" size="20px" />
        </template>
      </q-select>
    </header>
    <main class="q-pa-sm q-gutter-y-md">
      <div class="row justify-between">
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
      <div class="row justify-between q-mt-sm">
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
      <div class="q-gutter-y-sm q-mt">
        <q-table
          :rows="loadingDashboard ? [] : (categoriesEntry ?? [])"
          :columns="columnsCategoriesDashboard"
          :loading="loadingDashboard"
          style="max-height: 400px"
          flat
          bordered
          dense
          row-key="id"
          no-data-label="Nenhuma categoria de entrada para mostrar"
        >
          <template v-slot:top>
            <span class="text-subtitle2"
              >Movimentações de entrada x categoria</span
            >
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="value" :props="props" class="text-left">
                <q-linear-progress
                  :value="
                    (Number(props.row.value) || 0) /
                    (Number(totalValueEntryCategory) || 1)
                  "
                  size="20px"
                  class="q-my-sm"
                  rounded
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge
                      color="white"
                      text-color="black"
                      :label="`R$ ${props.row.value}`"
                    />
                  </div>
                </q-linear-progress>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-table
          :rows="loadingDashboard ? [] : (categoriesOut ?? [])"
          :columns="columnsCategoriesDashboard"
          :loading="loadingDashboard"
          style="max-height: 400px"
          flat
          bordered
          dense
          row-key="id"
          no-data-label="Nenhuma categoria de saída para mostrar"
        >
          <template v-slot:top>
            <span class="text-subtitle2"
              >Movimentações de saída x categoria</span
            >
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="value" :props="props" class="text-left">
                <q-linear-progress
                  :value="
                    (Number(props.row.value) || 0) /
                    (Number(totalValueOutCategory) || 1)
                  "
                  size="20px"
                  rounded
                  class="q-my-sm"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge
                      color="white"
                      text-color="black"
                      :label="`R$ ${props.row.value}`"
                    />
                  </div>
                </q-linear-progress>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </main>
  </section>
</template>
