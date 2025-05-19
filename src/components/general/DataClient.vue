<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useReportStore } from 'src/stores/report-store';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { useAuthStore } from 'src/stores/auth-store';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import { useMovementStore } from 'src/stores/movement-store';
import { Movement } from 'src/ts/interfaces/data/Movement';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import DataEnterprise from '../info/DataEnterprise.vue';
import FormEntry from '../forms/FormEntry.vue';
import FormOut from '../forms/FormOut.vue';

defineOptions({
  name: 'DataClient',
});

const {
  getReports,
  reopenByCounter,
  finalizeReportCounter,
  undoReportCounter,
  detailsReport,
  excludeMovement,
  downloadReport,
} = useReportStore();
const {
  loadingReport,
  listReport,
  listMovement,
  entepriseInspected,
  permissions,
  finalizedReport,
} = storeToRefs(useReportStore());
const { user } = storeToRefs(useAuthStore());
const { downloadFile, saveObservations } = useMovementStore();
const { loadingMovement } = storeToRefs(useMovementStore());

const props = defineProps<{
  open: boolean;
  idClient: string | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const selectedDataEdit = ref<Movement | null>(null);
const showFormEntry = ref<boolean>(false);
const showFormOut = ref<boolean>(false);
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
  {
    name: 'observation',
    label: 'Observação',
    align: 'left',
    field: 'observation',
    style:
      'max-width:100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
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
  await getReports(props.idClient ?? '', String(new Date().getFullYear()));
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
  await downloadFile(file);
};
const clearObservations = (): void => {
  listMovement.value = listMovement.value.map((item) => {
    return {
      ...item,
      observation: null,
    };
  });
};
const updateObservations = async () => {
  const data: { id: string; observation: string | null }[] = [];
  listMovement.value.forEach((item) => {
    data.push({
      id: item.id,
      observation: item.observation,
    });
  });

  const response = await saveObservations(data);
  if (response?.status === 200) {
    modeTable.value = 'reports';
  }
};
const exclude = async (id: string) => {
  await excludeMovement(id);
};
const openFormEntry = (): void => {
  showFormEntry.value = true;
};
const closeFormEntry = (): void => {
  showFormEntry.value = false;
};
const openFormOut = (): void => {
  showFormOut.value = true;
};
const closeFormOut = (): void => {
  showFormOut.value = false;
};
const handleEdit = (movement: Movement) => {
  selectedDataEdit.value = movement;
  if (selectedDataEdit.value.type === 'entrada') {
    openFormEntry();
  } else {
    openFormOut();
  }
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
  <section v-show="open" class="q-pa-sm">
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
        row-key="index"
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
              <span class="text-subtitle2">{{
                convertMonthYear(props.row.month_year)
              }}</span>
            </q-td>
            <!-- <q-td key="total_movements" :props="props" class="text-left">
              {{ props.row.total_movements }}
            </q-td> -->
            <q-td key="date_delivery" :props="props" class="text-left">
              <span class="text-subtitle2">{{
                formatDate(props.row.date_delivery)
              }}</span>
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
                @click="downloadReport(props.row.id)"
                :disable="loadingReport"
                icon="download"
                size="sm"
                flat
                round
                color="primary"
              >
                <q-tooltip> Exportar </q-tooltip>
              </q-btn>
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
        :rows-per-page-options="[12]"
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
              <span class="text-subtitle2">{{ props.row.account.name }}</span>
            </q-td>
            <q-td key="account_number" :props="props" class="text-left">
              <span class="text-subtitle2">{{
                props.row.account.account_number
              }}</span>
            </q-td>
            <q-td key="agency_number" :props="props" class="text-left">
              <span class="text-subtitle2">{{
                props.row.account.agency_number
              }}</span>
            </q-td>
            <q-td key="category" :props="props" class="text-left">
              <span class="text-subtitle2">{{ props.row.category.name }}</span>
            </q-td>
            <q-td key="value" :props="props" class="text-left">
              <span class="text-subtitle2">{{
                `${formatCurrencyBRL(props.row.value)}`
              }}</span>
            </q-td>
            <q-td key="date_movement" :props="props" class="text-left">
              <span class="text-subtitle2">{{
                formatDate(props.row.date_movement)
              }}</span>
            </q-td>
            <q-td key="description" :props="props" class="text-left">
              <span class="text-subtitle2">{{ props.row.description }}</span>
            </q-td>
            <q-td
              @click="download(props.row.receipt)"
              key="receipt"
              :props="props"
              class="text-left"
              :class="props.row.receipt ? 'cursor-pointer' : ''"
            >
              <q-icon v-if="props.row.receipt" name="attach_file" size="20px" />
            </q-td>
            <q-td key="observation" :props="props">
              <q-icon name="edit" color="black" v-show="!finalizedReport" />
              <span class="text-subtitle2">{{ props.row.observation }}</span>
              <q-popup-edit
                v-model="props.row.observation"
                title="Escreva uma observação"
                v-if="!finalizedReport"
                auto-save
                v-slot="scope"
              >
                <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  style="min-width: 500px"
                  @keyup.enter="scope.set"
                  maxlength="400"
                >
                </q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="action" :props="props">
              <q-btn
                @click="handleEdit(props.row)"
                v-show="permissions?.allow_edit_movement && !finalizedReport"
                size="sm"
                flat
                round
                color="black"
                icon="edit"
                :disable="loadingReport || loadingMovement"
              />
              <q-btn
                @click="exclude(props.row.id)"
                v-show="permissions?.allow_delete_movement && !finalizedReport"
                size="sm"
                flat
                round
                color="red"
                icon="delete"
                :disable="loadingReport || loadingMovement"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div>
      <div class="row justify-end items-center q-gutter-x-sm">
        <q-btn
          v-show="modeTable === 'reports'"
          @click="open = false"
          color="red"
          label="Fechar"
          size="md"
          unelevated
          no-caps
        />
        <q-btn
          v-show="modeTable === 'details'"
          @click="modeTable = 'reports'"
          color="red"
          label="Voltar"
          size="md"
          flat
          unelevated
          no-caps
        />
        <q-btn
          v-show="modeTable === 'details'"
          @click="clearObservations"
          color="red"
          label="Limpar observações"
          size="md"
          unelevated
          no-caps
          :disable="loadingReport || loadingMovement"
        />
        <q-btn
          v-show="modeTable === 'details'"
          @click="updateObservations"
          :loading="loadingReport || loadingMovement"
          color="primary"
          label="Salvar"
          size="md"
          unelevated
          no-caps
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
    <FormEntry
      :open="showFormEntry"
      :data-edit="selectedDataEdit"
      type="counter"
      title="Atualize uma entrada"
      mode="movement"
      @update:open="closeFormEntry"
    />
    <FormOut
      :open="showFormOut"
      type="counter"
      :data-edit="selectedDataEdit"
      title="Atualize uma saída"
      mode="movement"
      @update:open="closeFormOut"
    />
    <q-inner-loading
      :showing="loadingReport"
      label="Carregando os dados..."
      label-class="black"
      label-style="font-size: 1.1em"
      color="primary"
      size="50px"
    />
  </section>
</template>
