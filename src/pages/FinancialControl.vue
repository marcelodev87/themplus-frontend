<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useFinancialStore } from 'src/stores/financial-store';
import { onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';

defineOptions({
  name: 'FinancialControl',
});

const { listDelivery, loadingDelivery, filledData } =
  storeToRefs(useFinancialStore());
const { getDelivery, updateDelivery } = useFinancialStore();

const filterDelivery = ref<string>('');
const showAlertDataEnterprise = ref<boolean>(false);
const columnsDelivery = reactive<QuasarTable[]>([
  {
    name: 'month_year',
    label: 'Mês / Ano',
    field: 'month_year',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date_delivery',
    label: 'Data de entrega',
    field: 'date_delivery',
    align: 'left',
    sortable: true,
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const finalize = async (monthYear: string): Promise<void> => {
  await updateDelivery(monthYear);
};
const fetchDelivery = async () => {
  await getDelivery();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const convertMonthYear = (monthYear: string): string => {
  const months: { [key: string]: string } = {
    '01': 'Janeiro',
    '02': 'Fevereiro',
    '03': 'Março',
    '04': 'Abril',
    '05': 'Maio',
    '06': 'Junho',
    '07': 'Julho',
    '08': 'Agosto',
    '09': 'Setembro',
    '10': 'Outubro',
    '11': 'Novembro',
    '12': 'Dezembro',
  };

  const [month, year] = monthYear.split('/');

  const monthName = months[month as keyof typeof months] || 'Mês Inválido';

  return `${monthName} ${year}`;
};
const formatDateToBrazilian = (dateTime: string | null | undefined) => {
  if (!dateTime) {
    return '';
  }

  const [datePart] = dateTime.split(' ');
  const [year, month, day] = datePart.split('-');

  return `${day}/${month}/${year}`;
};

watch(
  filledData,
  () => {
    showAlertDataEnterprise.value = !filledData.value;
  },
  { immediate: true }
);

onMounted(async () => {
  fetchDelivery();
});
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-5">
        <TitlePage title="Controle contábil" />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md">
        <q-table
          :rows="loadingDelivery ? [] : listDelivery"
          :columns="columnsDelivery"
          :filter="filterDelivery"
          :loading="loadingDelivery"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhuma entrega para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de entregas</span>
            <q-space />
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="month_year" :props="props" class="text-left">
                {{ convertMonthYear(props.row.month_year) }}
              </q-td>
              <q-td key="status" :props="props" class="text-left">
                <q-badge
                  rounded
                  :color="props.row.status ? 'green' : 'red'"
                  :label="props.row.status ? 'Entregue' : 'Não entregue'"
                />
              </q-td>
              <q-td key="date_delivery" :props="props" class="text-left">
                {{ formatDateToBrazilian(props.row.date_delivery) }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  v-if="props.row.status === false"
                  @click="finalize(props.row.month_year)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="check_circle"
                >
                  <q-tooltip> Entregar </q-tooltip>
                </q-btn>
                <q-btn v-else size="sm" flat round color="black" icon="replay">
                  <q-tooltip> Reabrir </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
