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
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import { useAuthStore } from 'src/stores/auth-store';

defineOptions({
  name: 'FinancialControl',
});

const { user } = storeToRefs(useAuthStore());
const { enterpriseHeadquarters } = storeToRefs(useEnterpriseStore());
const { hasCounter } = storeToRefs(useOrderStore());
const { listDelivery, loadingDelivery, filledData, orderCount } =
  storeToRefs(useFinancialStore());
const { getDelivery, updateDelivery } = useFinancialStore();

const filterDelivery = ref<string>('');
const showCounterInfo = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const showInviteCounter = ref<boolean>(false);
const showConfirmAction = ref<boolean>(false);
const dataMonthYear = ref<string | null>(null);
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
      <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
        <TitlePage title="Controle contábil" />
      </div>
      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
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
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
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
                <!-- <q-btn v-else size="sm" flat round color="black" icon="replay">
                  <q-tooltip> Reabrir </q-tooltip>
                </q-btn> -->
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <InviteCounter
          :open="showInviteCounter"
          @update:open="closeInviteCounter"
        />
        <CounterInfo :open="showCounterInfo" @update:open="closeCounterInfo" />
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Continuar"
          title="Confirmação de entrega de movimentações"
          message="Caso entregue as movimentações, não será possível realizar qualquer ação sobre movimentações do mês do relatório que está sendo entregue. Caso tenha certeza, clique em 'Continuar' para prosseguir."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
