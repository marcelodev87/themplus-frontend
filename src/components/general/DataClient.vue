<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useReportStore } from 'src/stores/report-store';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { useEnterpriseStore } from 'src/stores/enterprise-store';

defineOptions({
  name: 'DataClient',
});

const { getReports } = useReportStore();
const { loadingReport, listReport } = storeToRefs(useReportStore());
const { enterprise } = storeToRefs(useEnterpriseStore());

const props = defineProps<{
  open: boolean;
  idClient: string | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const filterDataClient = ref<string>('');
const columnsDataClient = reactive<QuasarTable[]>([
  {
    name: 'month_year',
    label: 'Período de movimentação',
    field: 'month_year',
    align: 'left',
  },
  {
    name: 'date_delivery',
    label: 'Data de entrega',
    field: 'date_delivery',
    align: 'left',
  },
  {
    name: 'check_counter',
    label: 'Verificado',
    field: 'check_counter',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const fetchReports = async () => {
  await getReports(props.idClient ?? '');
};
const clear = (): void => {
  filterDataClient.value = '';
};
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
};
const convertMonthYear = (monthYear: string): string => {
  const months: { [key: string]: string } = {
    '1': 'Janeiro',
    '2': 'Fevereiro',
    '3': 'Março',
    '4': 'Abril',
    '5': 'Maio',
    '6': 'Junho',
    '7': 'Julho',
    '8': 'Agosto',
    '9': 'Setembro',
    '10': 'Outubro',
    '11': 'Novembro',
    '12': 'Dezembro',
  };

  const [month, year] = monthYear.split('/');

  const monthName = months[month as keyof typeof months] || 'Mês Inválido';

  return `${monthName} ${year}`;
};

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchReports();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="min-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Informações de entrega de relatório" />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-table
          :rows="loadingReport ? [] : listReport"
          :columns="columnsDataClient"
          :filter="filterDataClient"
          :loading="loadingReport"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhum período para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Períodos de movimentações</span>
            <q-space />
            <q-input filled v-model="filterDataClient" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="month_year" :props="props" class="text-left">
                {{ convertMonthYear(props.row.month_year) }}
              </q-td>
              <q-td key="total_movements" :props="props" class="text-left">
                {{ props.row.total_movements }}
              </q-td>
              <q-td key="date_delivery" :props="props" class="text-left">
                {{ formatDate(props.row.date_delivery) }}
              </q-td>
              <q-td key="check_counter" :props="props" class="text-left">
                <q-icon
                  v-show="props.row.check_counter === enterprise?.id"
                  name="verified"
                  color="green"
                  size="20px"
                >
                  <q-tooltip> Verificado pela sua organização </q-tooltip>
                </q-icon>
                <q-icon
                  v-show="
                    props.row.check_counter !== enterprise?.id &&
                    props.row.check_counter !== null
                  "
                  name="verified"
                  color="red"
                  size="20px"
                >
                  <q-tooltip> Verificado por outra organização </q-tooltip>
                </q-icon>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn icon="search" size="sm" flat round color="black">
                  <q-tooltip> Analisar </q-tooltip>
                </q-btn>
                <q-btn icon="replay" size="sm" flat round color="orange">
                  <q-tooltip> Reabrir </q-tooltip>
                </q-btn>
                <q-btn icon="task_alt" size="sm" flat round color="green">
                  <q-tooltip> Finalizar </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="open = false"
            color="red"
            label="Fechar"
            size="md"
            flat
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
