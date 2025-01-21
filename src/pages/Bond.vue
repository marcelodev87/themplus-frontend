<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormAlert from 'src/components/forms/FormAlert.vue';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { Alert } from 'src/ts/interfaces/data/Alert';
import { useOrderStore } from 'src/stores/order-store';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import DataClient from 'src/components/general/DataClient.vue';
import { useRouter, useRoute } from 'vue-router';

defineOptions({
  name: 'Bond',
});

const { loadingOrder, listBond, filledData } = storeToRefs(useOrderStore());
const { getBonds, deleteBond } = useOrderStore();

const router = useRouter();
const route = useRoute();
const showFormAlert = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const filterOrder = ref<string>('');
const selectedDataEdit = ref<Alert | null>(null);
const showConfirmAction = ref<boolean>(false);
const showDataClient = ref<boolean>(false);
const dataClient = ref<string | null>(null);
const dataBond = ref<string | null>(null);
const columnsBond = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cnpj',
    label: 'CNPJ',
    field: 'cnpj',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cpf',
    label: 'CPF',
    field: 'cpf',
    align: 'left',
    sortable: true,
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
    sortable: true,
  },
  {
    name: 'no_verified',
    label: 'Entregas não analisadas',
    field: 'no_verified',
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

const clear = (): void => {
  selectedDataEdit.value = null;
  filterOrder.value = '';
  dataBond.value = null;
  dataClient.value = null;
};
const openFormAlert = (): void => {
  showFormAlert.value = true;
};
const closeFormAlert = (): void => {
  showFormAlert.value = false;
  clear();
};
const handleEdit = (alert: Alert) => {
  selectedDataEdit.value = alert;
  openFormAlert();
};
const fetchBonds = async () => {
  await getBonds();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  await deleteBond(dataBond.value ?? '');
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
};
const openConfirmAction = (orderId: string): void => {
  dataBond.value = orderId;
  showConfirmAction.value = true;
};
const openDataClient = (id: string) => {
  const routeData = router.resolve({
    name: 'admin-bond-with-id',
    params: { id },
  });

  window.open(routeData.href, '_blank');
};
const closeDataClient = () => {
  clear();
  showDataClient.value = false;
  window.close();
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
watch(
  () => route,
  () => {
    if ('id' in route.params) {
      dataClient.value = Array.isArray(route.params.id)
        ? route.params.id[0]
        : route.params.id;
      showDataClient.value = true;
    }
  },
  { immediate: true, deep: true }
);

onMounted(async () => {
  await fetchBonds();
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
      <div class="col-11">
        <TitlePage title="Gerenciamento de vínculos" />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md">
        <q-table
          v-show="!showDataClient"
          :rows="loadingOrder ? [] : listBond"
          :columns="columnsBond"
          :filter="filterOrder"
          :loading="loadingOrder"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhuma vinculação para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de vínculos</span>
            <q-space />
            <q-input filled v-model="filterOrder" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="email" :props="props" class="text-left">
                {{ props.row.email }}
              </q-td>
              <q-td key="cnpj" :props="props" class="text-left">
                {{ props.row.cnpj }}
              </q-td>
              <q-td key="cpf" :props="props" class="text-left">
                {{ props.row.cpf }}
              </q-td>
              <q-td key="phone" :props="props" class="text-left">
                {{ props.row.phone }}
              </q-td>
              <q-td key="no_verified" :props="props" class="text-left">
                <q-badge
                  rounded
                  :color="props.row.no_verified > 0 ? 'red' : 'green'"
                  :label="props.row.no_verified"
                />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="openDataClient(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="visibility"
                >
                  <q-tooltip> Analisar </q-tooltip>
                </q-btn>

                <q-btn
                  v-show="props.row.created_by === null"
                  @click="openConfirmAction(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <DataClient
          :id-client="dataClient"
          :open="showDataClient"
          @update:open="closeDataClient"
        />
        <FormAlert
          :open="showFormAlert"
          :data-edit="selectedDataEdit"
          @update:open="closeFormAlert"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Continuar"
          title="Confirmação de desvínculo"
          message="Não poderá ter mais acesso aos dados do cliente, além das filiais serem removidas também, caso existam. Caso tenha certeza, clique em 'Continuar' para prosseguir."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
