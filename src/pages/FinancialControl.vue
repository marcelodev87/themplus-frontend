<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useFinancialStore } from 'src/stores/financial-store';
import { onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import InviteCounter from 'src/components/shared/InviteCounter.vue';
import { useOrderStore } from 'src/stores/order-store';
import CounterInfo from 'src/components/info/CounterInfo.vue';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useMovementStore } from 'src/stores/movement-store';
import { Movement } from 'src/ts/interfaces/data/Movement';
import FormEntry from 'src/components/forms/FormEntry.vue';
import FormOut from 'src/components/forms/FormOut.vue';
import FormSettingsCounter from 'src/components/forms/FormSettingsCounter.vue';

defineOptions({
  name: 'FinancialControl',
});

const { user } = storeToRefs(useAuthStore());
const { enterpriseHeadquarters } = storeToRefs(useEnterpriseStore());
const { hasCounter } = storeToRefs(useOrderStore());
const {
  listDelivery,
  loadingDelivery,
  filledData,
  orderCount,
  listMovementFinancial,
} = storeToRefs(useFinancialStore());
const { getDelivery, updateDelivery, getMovementsWithObservations } =
  useFinancialStore();
const { downloadFile } = useMovementStore();

const mode = ref<'reports' | 'observations'>('reports');
const filterDelivery = ref<string>('');
const showCounterInfo = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const selectedDataEdit = ref<Movement | null>(null);
const showInviteCounter = ref<boolean>(false);
const showConfirmAction = ref<boolean>(false);
const showFormEntry = ref<boolean>(false);
const showFormOut = ref<boolean>(false);
const showFormSettingsCounter = ref<boolean>(false);
const dataMonthYear = ref<string | null>(null);
const dateSelected = ref<string | null>(null);
const columnsDelivery = reactive<QuasarTable[]>([
  {
    name: 'month_year',
    label: 'Mês / Ano',
    field: 'month_year',
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
  },
  {
    name: 'date_delivery',
    label: 'Data de entrega',
    field: 'date_delivery',
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
    field: 'observation',
    align: 'left',
    style:
      'max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const fetchDelivery = async () => {
  await getDelivery();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  await updateDelivery(dataMonthYear.value ?? '');
  dataMonthYear.value = null;
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
};
const openConfirmAction = (): void => {
  showConfirmAction.value = true;
};
const openFormSettingsCounter = (): void => {
  showFormSettingsCounter.value = true;
};
const closeFormSettingsCounter = (): void => {
  showFormSettingsCounter.value = false;
};
const openInviteCounter = (): void => {
  showInviteCounter.value = true;
};
const closeInviteCounter = (): void => {
  showInviteCounter.value = false;
};
const openCounterInfo = (): void => {
  showCounterInfo.value = true;
};
const closeCounterInfo = (): void => {
  showCounterInfo.value = false;
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

  const [datePart, timePart] = dateTime.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes, seconds] = timePart.split(':');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
const finalize = async (monthYear: string): Promise<void> => {
  dataMonthYear.value = monthYear;
  openConfirmAction();
};
const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');

  return `${day}/${month}/${year}`;
};
const openFormEntry = (): void => {
  showFormEntry.value = true;
};
const closeFormEntry = async () => {
  showFormEntry.value = false;
  await getMovementsWithObservations(dateSelected.value!.replace(/\//g, '-'));
};
const openFormOut = (): void => {
  showFormOut.value = true;
};
const closeFormOut = async () => {
  showFormOut.value = false;
  await getMovementsWithObservations(dateSelected.value!.replace(/\//g, '-'));
};
const download = async (url: string) => {
  await downloadFile(url);
};
const handleEdit = (movement: Movement) => {
  selectedDataEdit.value = movement;
  if (selectedDataEdit.value.type === 'entrada') {
    openFormEntry();
  } else {
    openFormOut();
  }
};
const openTableMovements = async (date: string) => {
  mode.value = 'observations';
  dateSelected.value = date;
  await getMovementsWithObservations(date.replace(/\//g, '-'));
};
const closeTableMovements = async () => {
  mode.value = 'reports';
};
const clear = () => {
  mode.value = 'reports';
  dateSelected.value = null;
};

watch(
  filledData,
  () => {
    if (!filledData.value) {
      showAlertDataEnterprise.value = true;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  clear();
  fetchDelivery();
});
</script>
<template>
  <section>
    <header
      :class="
        !$q.screen.lt.sm
          ? 'row justify-between no-wrap bg-grey-1'
          : 'column justify-between no-wrap bg-grey-1'
      "
    >
      <div :class="!$q.screen.lt.sm ? 'col-4' : 'col-12'">
        <TitlePage title="Controle contábil" />
      </div>
      <div
        class="row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm column'"
        v-if="!$q.screen.lt.sm"
      >
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
          @click="openFormSettingsCounter"
          icon-right="settings"
          label="Configurações"
          unelevated
          no-caps
          flat
        />
        <q-btn
          v-show="
            enterpriseHeadquarters &&
            !loadingDelivery &&
            user?.enterprise_id === user?.view_enterprise_id
          "
          @click="openInviteCounter"
          color="black"
          icon-right="person_add"
          label="Solicitações"
          class="q-mr-sm"
          unelevated
          no-caps
          flat
        >
          <q-badge
            v-show="orderCount > 0"
            color="red"
            rounded
            floating
            :label="orderCount"
          />
        </q-btn>
        <q-btn
          v-show="
            hasCounter !== null &&
            user?.enterprise_id === user?.view_enterprise_id
          "
          @click="openCounterInfo"
          icon-right="visibility"
          label="Dados do contador"
          class="q-mr-sm"
          unelevated
          no-caps
          flat
        />
      </div>
      <q-expansion-item
        v-else
        expand-separator
        icon="settings"
        label="Ações"
        class="border-form"
      >
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
          @click="openFormSettingsCounter"
          icon-right="settings"
          label="Configurações"
          unelevated
          no-caps
          flat
          class="q-mt-sm full-width"
        />
        <q-btn
          v-show="
            enterpriseHeadquarters &&
            !loadingDelivery &&
            user?.enterprise_id === user?.view_enterprise_id
          "
          @click="openInviteCounter"
          color="black"
          icon-right="person_add"
          label="Solicitações"
          unelevated
          no-caps
          flat
          class="q-mt-sm full-width"
        >
          <q-badge
            v-show="orderCount > 0"
            color="red"
            rounded
            floating
            :label="orderCount"
          />
        </q-btn>
        <q-btn
          v-show="
            hasCounter !== null &&
            user?.enterprise_id === user?.view_enterprise_id
          "
          @click="openCounterInfo"
          icon-right="visibility"
          label="Dados do contador"
          unelevated
          no-caps
          flat
          class="q-mt-sm full-width"
        />
      </q-expansion-item>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md">
        <q-table
          v-if="mode === 'reports'"
          :rows="loadingDelivery ? [] : listDelivery"
          :columns="columnsDelivery"
          :filter="filterDelivery"
          :loading="loadingDelivery"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma entrega para mostrar"
          virtual-scroll
          :rows-per-page-options="[12]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de entregas</span>
            <q-space />
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="month_year" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  convertMonthYear(props.row.month_year)
                }}</span>
              </q-td>
              <q-td key="status" :props="props" class="text-left">
                <q-badge
                  rounded
                  :color="props.row.status ? 'green' : 'red'"
                  :label="props.row.status ? 'Entregue' : 'Não entregue'"
                />
              </q-td>
              <q-td key="date_delivery" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  formatDateToBrazilian(props.row.date_delivery)
                }}</span>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  v-show="
                    props.row.status === false &&
                    user?.enterprise_id === user?.view_enterprise_id &&
                    props.row.has_observation
                  "
                  @click="openTableMovements(props.row.month_year)"
                  size="sm"
                  flat
                  round
                  color="warning"
                  icon="error"
                >
                  <q-tooltip> Anotações </q-tooltip>
                </q-btn>
                <q-btn
                  v-show="
                    props.row.status === false &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  @click="finalize(props.row.month_year)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="check_circle"
                >
                  <q-tooltip> Entregar </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-table
          v-else
          :rows="loadingDelivery ? [] : listMovementFinancial"
          :columns="columnsMovement"
          :loading="loadingDelivery"
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
                :class="props.row.receipt ? 'cursor-pointer hover' : ''"
              >
                <q-icon
                  v-if="props.row.receipt"
                  name="attach_file"
                  size="20px"
                />
              </q-td>
              <q-td key="observation" :props="props" class="text-left">
                {{ props.row.observation }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="q-mt-sm row justify-end">
          <q-btn
            v-show="mode === 'observations'"
            @click="closeTableMovements"
            color="red"
            label="Voltar"
            size="md"
            unelevated
            no-caps
          />
        </div>
        <InviteCounter
          :open="showInviteCounter"
          @update:open="closeInviteCounter"
        />
        <CounterInfo :open="showCounterInfo" @update:open="closeCounterInfo" />
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Continuar"
          title="Confirmação de entrega de movimentações"
          message="Caso entregue as movimentações, não será possível realizar qualquer ação sobre movimentações do mês do relatório que está sendo entregue. Se responsabiliza e declara que as informações das movimentações são verdadeiras. Caso tenha certeza, clique em 'Continuar' para prosseguir."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
        <FormEntry
          :open="showFormEntry"
          type="client"
          :data-edit="selectedDataEdit"
          title="Atualize uma entrada"
          mode="movement"
          @update:open="closeFormEntry"
        />
        <FormOut
          :open="showFormOut"
          type="client"
          :data-edit="selectedDataEdit"
          title="Atualize uma saída"
          mode="movement"
          @update:open="closeFormOut"
        />
        <FormSettingsCounter
          :open="showFormSettingsCounter"
          @update:open="closeFormSettingsCounter"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
