<script setup lang="ts">
import { useDashboardStore } from 'src/stores/dashboard-store';
import { computed, onMounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';

defineOptions({
  name: 'Dashboard',
});

const { getDashboard } = useDashboardStore();
const {
  loadingDashboard,
  listCategoryDashboard,
  listMonthYear,
  movementsDashboard,
  schedulingsDashboard,
  usersDashboard,
  accountsDashboard,
} = storeToRefs(useDashboardStore());

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
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-gutter-y-md">
        <div class="row justify-between q-mt-sm">
          <q-card flat bordered class="q-mt-sm" style="width: 24%">
            <q-card-section>
              <div class="text-h6">Movimentações</div>
            </q-card-section>

            <q-card-section class="q-pt-none row justify-between">
              <span>Valor de entrada:</span>
              <span>{{
                movementsDashboard?.entry_value
                  ? `R$ ${Number(movementsDashboard.entry_value)}`
                  : ''
              }}</span>
            </q-card-section>
            <q-card-section class="q-pt-none row justify-between">
              <span> Valor de saída:</span>
              <span
                >{{
                  movementsDashboard?.out_value
                    ? `R$ ${Number(movementsDashboard.out_value)}`
                    : ''
                }}
              </span>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="row justify-between">
              <span>Saldo:</span>
              <span>{{
                movementsDashboard?.out_value && movementsDashboard?.entry_value
                  ? `R$ ${
                      Number(movementsDashboard.entry_value) -
                      Number(movementsDashboard.out_value)
                    }`
                  : ''
              }}</span>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="q-mt-sm" style="width: 24%">
            <q-card-section>
              <div class="text-h6">Agendamentos</div>
            </q-card-section>

            <q-card-section class="q-pt-none row justify-between">
              <span>Valor de entrada:</span>
              <span>{{
                schedulingsDashboard?.entry_value
                  ? `R$ ${Number(schedulingsDashboard.entry_value)}`
                  : ''
              }}</span>
            </q-card-section>
            <q-card-section class="q-pt-none row justify-between">
              <span>Valor de saída:</span>
              <span>{{
                schedulingsDashboard?.out_value
                  ? `R$ ${Number(schedulingsDashboard.out_value)}`
                  : ''
              }}</span>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="row justify-between">
              <span>Saldo:</span>
              <span>{{
                schedulingsDashboard?.out_value &&
                schedulingsDashboard?.entry_value
                  ? `R$ ${
                      Number(schedulingsDashboard.entry_value) -
                      Number(schedulingsDashboard.out_value)
                    }`
                  : ''
              }}</span>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="q-mt-sm" style="width: 24%">
            <q-card-section>
              <div class="text-h6">Usuários</div>
            </q-card-section>

            <q-card-section class="q-pt-none row justify-between">
              <span>Administradores:</span>
              <span>{{ usersDashboard?.amount_admins ?? '' }}</span>
            </q-card-section>
            <q-card-section class="q-pt-none row justify-between">
              <span>Usuários comuns:</span>
              <span>{{ usersDashboard?.amount_common_users ?? '' }}</span>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="row justify-between">
              <span>Total de usuários:</span>
              <span>{{ usersDashboard?.amount_users ?? '' }}</span>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="q-mt-sm" style="width: 24%">
            <q-card-section class="row justify-between items-center">
              <span class="text-h6">Contas </span>
              <span class="text-body2 text-bold">TOP 3</span>
            </q-card-section>

            <q-card-section
              v-for="(item, index) in accountsDashboard?.accounts"
              class="q-pt-none row justify-between"
              :key="index"
            >
              <span>{{ item.name }}:</span>
              <span>{{ `R$ ${item.balance}` }}</span>
            </q-card-section>
          </q-card>
        </div>
        <div class="q-gutter-y-sm q-mt-sm q-mb-lg">
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
            virtual-scroll
            :rows-per-page-options="[5]"
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
            virtual-scroll
            :rows-per-page-options="[5]"
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
    </q-scroll-area>
  </section>
</template>
