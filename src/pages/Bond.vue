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
import { OrderCounter } from 'src/ts/interfaces/data/Order';

defineOptions({
  name: 'Bond',
});

const { loadingOrder, listBond, filledData } = storeToRefs(useOrderStore());
const { getBonds } = useOrderStore();

const showFormAlert = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const filterOrder = ref<string>('');
const selectedDataEdit = ref<Alert | null>(null);
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
    name: 'delivery',
    label: 'Entregas não analisadas',
    field: 'delivery',
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
const exclude = async (id: string) => {
  console.log('escluir vinculo', id);
};
const fetchBonds = async () => {
  await getBonds();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const customFilterOrder = (
  rows: readonly OrderCounter[],
  terms: string,
  cols: readonly OrderCounter[],
  getCellValue: (row: OrderCounter, col: QuasarTable) => unknown
): readonly OrderCounter[] => {
  const searchTerm = terms.toLowerCase();

  return rows.filter((item) => {
    return (
      (item.enterprise.name &&
        item.enterprise.name.toLowerCase().includes(searchTerm)) ||
      (item.enterprise.email &&
        item.enterprise.email.toLowerCase().includes(searchTerm)) ||
      (item.enterprise.cpf &&
        item.enterprise.cpf.toLowerCase().includes(searchTerm)) ||
      (item.enterprise.cnpj &&
        item.enterprise.cnpj.toLowerCase().includes(searchTerm))
    );
  });
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
          :rows="loadingOrder ? [] : listBond"
          :columns="columnsBond"
          :filter="filterOrder"
          :loading="loadingOrder"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhuma vin para mostrar"
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
              <q-td key="delivery" :props="props" class="text-left">
                <q-badge rounded color="green" label="0" />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="visibility"
                >
                  <q-tooltip> Analisar </q-tooltip>
                </q-btn>

                <q-btn
                  @click="exclude(props.row.id)"
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
        <FormAlert
          :open="showFormAlert"
          :data-edit="selectedDataEdit"
          @update:open="closeFormAlert"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
