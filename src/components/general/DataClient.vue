<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useReportStore } from 'src/stores/report-store';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { useAuthStore } from 'src/stores/auth-store';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import { useMovementStore } from 'src/stores/movement-store';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import DataEnterprise from '../info/DataEnterprise.vue';

defineOptions({
  name: 'DataClient',
});

const {
  getReports,
  reopenByCounter,
  finalizeReportCounter,
  undoReportCounter,
  detailsReport,
} = useReportStore();
const { loadingReport, listReport, listMovement, entepriseInspected } =
  storeToRefs(useReportStore());
const { user } = storeToRefs(useAuthStore());
const { downloadFile } = useMovementStore();

const props = defineProps<{
  open: boolean;
  idClient: string | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const showConfirmAction = ref<boolean>(false);
const modeTable = ref<'reports' | 'details'>('reports');
const dataReopenId = ref<string | null>(null);
const dataFinalizeId = ref<string | null>(null);
const dataUndoId = ref<string | null>(null);
const dataDetailsReport = ref<string | null>(null);
const actionSelected = ref<string | null>(null);
const columnsDataClient = reactive<QuasarTable[]>([
  {
    name: 'month_year',
    label: 'Período',
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
const columnsMovement = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Banco',
    field: 'account.name',
    align: 'left',
  },
  {
    name: 'account_number',
    label: 'Conta',
    field: 'account.account_number',
    align: 'left',
  },
  {
    name: 'agency_number',
    label: 'Agência',
    field: 'account.agency_number',
    align: 'left',
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category.name',
    align: 'left',
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    align: 'left',
  },
  {
    name: 'date_movement',
    label: 'Data de movimentação',
    field: 'date_movement',
    align: 'left',
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
  },
  {
    name: 'receipt',
    label: 'Arquivo',
    field: 'receipt',
    align: 'left',
    style:
      'max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
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
  dataFinalizeId.value = null;
  dataReopenId.value = null;
  actionSelected.value = null;
  dataUndoId.value = null;
  dataDetailsReport.value = null;
  modeTable.value = 'reports';
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
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  if (actionSelected.value === 'reopen') {
    await reopenByCounter(dataReopenId.value ?? '');
  } else if (actionSelected.value === 'finalize') {
    await finalizeReportCounter(dataFinalizeId.value ?? '');
  } else {
    await undoReportCounter(dataUndoId.value ?? '');
  }
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (
  action: 'reopen' | 'finalize' | 'undo',
  id: string
): void => {
  if (action === 'reopen') {
    dataReopenId.value = id;
    actionSelected.value = 'reopen';
  } else if (action === 'finalize') {
    dataFinalizeId.value = id;
    actionSelected.value = 'finalize';
  } else {
    dataUndoId.value = id;
    actionSelected.value = 'undo';
  }
  showConfirmAction.value = true;
};
const searchDetails = async (id: string) => {
  dataDetailsReport.value = id;
  modeTable.value = 'details';
};
const download = async (file: string) => {
  await downloadFile(file.split('receipts/')[1]);
};

watch(modeTable, async () => {
  if (modeTable.value === 'details') {
    await detailsReport(dataDetailsReport.value ?? '');
  }
});
watch(
  open,
  async () => {
    if (open.value) {
      clear();
      await fetchReports();
    }
  },
  { immediate: true }
);
</script>
<template>
  <section v-show="open">
    <div class="bg-grey-2 q-pa-md">
      <div v-if="entepriseInspected">
        <DataEnterprise :enterprise="entepriseInspected" />
      </div>
      <div class="q-py-sm q-gutter-y-sm">
        <q-table
          v-if="modeTable === 'reports'"
          :rows="loadingReport ? [] : listReport"
          :columns="columnsDataClient"
          :loading="loadingReport"
          flat
          dense
          row-key="name"
          no-data-label="Nenhum período para mostrar"
          virtual-scroll
          :rows-per-page-options="[12]"
          bordered
        >
          <template v-slot:top>
            <span v-if="modeTable === 'reports'" class="text-subtitle2"
              >Períodos de movimentações</span
            >
            <span v-else class="text-subtitle2"></span>
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
                  v-show="props.row.check_counter === user?.enterprise_id"
                  name="verified"
                  color="green"
                  size="20px"
                >
                  <q-tooltip> Verificado pela sua organização </q-tooltip>
                </q-icon>
                <q-icon
                  v-show="
                    props.row.check_counter !== user?.enterprise_id &&
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
                <q-btn
                  v-show="
                    props.row.check_counter === null ||
                    props.row.check_counter === user?.enterprise_id
                  "
                  @click="searchDetails(props.row.id)"
                  :disable="loadingReport"
                  icon="search"
                  size="sm"
                  flat
                  round
                  color="black"
                >
                  <q-tooltip> Analisar </q-tooltip>
                </q-btn>
                <q-btn
                  v-show="props.row.check_counter === null"
                  @click="openConfirmAction('reopen', props.row.id)"
                  icon="replay"
                  size="sm"
                  flat
                  round
                  color="orange"
                  :disable="loadingReport"
                >
                  <q-tooltip> Reabrir </q-tooltip>
                </q-btn>
                <q-btn
                  v-show="props.row.check_counter === null"
                  @click="openConfirmAction('finalize', props.row.id)"
                  icon="task_alt"
                  size="sm"
                  flat
                  round
                  color="green"
                  :disable="loadingReport"
                >
                  <q-tooltip> Finalizar </q-tooltip>
                </q-btn>
                <q-btn
                  v-show="props.row.check_counter === user?.enterprise_id"
                  @click="openConfirmAction('undo', props.row.id)"
                  icon="cancel"
                  size="sm"
                  flat
                  round
                  color="red"
                  :disable="loadingReport"
                >
                  <q-tooltip> Desafazer verificação </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-table
          v-else
          :rows="loadingReport ? [] : listMovement"
          :columns="columnsMovement"
          :loading="loadingReport"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma movimentação para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de movimentações</span>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              style="height: 28px"
              :class="props.row.type === 'entrada' ? 'text-green' : 'text-red'"
            >
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.account.name }}
              </q-td>
              <q-td key="account_number" :props="props" class="text-left">
                {{ props.row.account.account_number }}
              </q-td>
              <q-td key="agency_number" :props="props" class="text-left">
                {{ props.row.account.agency_number }}
              </q-td>
              <q-td key="category" :props="props" class="text-left">
                {{ props.row.category.name }}
              </q-td>
              <q-td key="value" :props="props" class="text-left">
                {{ `${formatCurrencyBRL(props.row.value)}` }}
              </q-td>
              <q-td key="date_movement" :props="props" class="text-left">
                {{ formatDate(props.row.date_movement) }}
              </q-td>
              <q-td key="description" :props="props" class="text-left">
                {{ props.row.description }}
              </q-td>
              <q-td
                @click="download(props.row.receipt)"
                key="receipt"
                :props="props"
                class="text-left"
                :class="props.row.receipt ? 'cursor-pointer' : ''"
              >
                <q-tooltip v-if="props.row.receipt">
                  {{ props.row.receipt }}
                </q-tooltip>
                {{ props.row.receipt }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div>
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
          <q-btn
            v-show="modeTable === 'details'"
            @click="modeTable = 'reports'"
            color="red"
            label="Voltar"
            size="md"
            unelevated
            no-caps
            icon-right="undo"
          />
        </div>
      </div>
      <ConfirmAction
        :open="showConfirmAction"
        label-action="Continuar"
        :title="
          actionSelected === 'finalize'
            ? 'Confirmação de verificação de relatório'
            : actionSelected === 'reopen'
              ? 'Confirmação de reabertura de relatório'
              : 'Confirmação de reversão verificação de entrega'
        "
        message="Este processo é irreversível. Caso tenha certeza, clique em 'Continuar' para prosseguir."
        @update:open="closeConfirmAction"
        @update:ok="closeConfirmActionOk"
      />
      <q-inner-loading
        :showing="loadingReport"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </div>
  </section>
</template>
