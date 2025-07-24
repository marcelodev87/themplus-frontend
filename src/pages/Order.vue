<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import FormRequestUser from 'src/components/forms/FormRequestUser.vue';
import { useOrderStore } from 'src/stores/order-store';
import { OrderCounter } from 'src/ts/interfaces/data/Order';
import Paginate from 'src/components/general/Paginate.vue';

defineOptions({
  name: 'Order',
});

const { loadingOrder, filledData, listOrderCounter } =
  storeToRefs(useOrderStore());
const { getOrdersViewCounter, deleteOrder } = useOrderStore();

const currentPage = ref(1);
const rowsPerPage = ref(10);
const filterOrder = ref<string>('');
const showFormRequestUser = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const selectedDataEdit = ref<OrderCounter | null>(null);
const columnsOrder = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Organização',
    field: 'enterprise.name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'enterprise.email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cnpj',
    label: 'CNPJ',
    field: 'enterprise.cnpj',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cpf',
    label: 'CPF',
    field: 'enterprise.cpf',
    align: 'left',
    sortable: true,
  },
  {
    name: 'created',
    label: 'Data de solicitação',
    field: 'created_at',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const resetPage = (): void => {
  currentPage.value = 1;
};
const clear = (): void => {
  selectedDataEdit.value = null;
  filterOrder.value = '';
};
const openFormRequestUser = (): void => {
  showFormRequestUser.value = true;
};
const closeFormRequestUser = (): void => {
  showFormRequestUser.value = false;
  clear();
};
const handleEdit = (order: OrderCounter) => {
  selectedDataEdit.value = order;
  openFormRequestUser();
};
const exclude = async (id: string) => {
  await deleteOrder(id);
};
const fetchOrders = async () => {
  await getOrdersViewCounter();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
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
const filteredOrder = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };
  const searchTerm = normalize(filterOrder.value);
  resetPage();

  return listOrderCounter.value.filter((item) => {
    currentPage.value = 1;
    return (
      (item.enterprise.name &&
        normalize(item.enterprise.name).includes(searchTerm)) ||
      (item.enterprise.email &&
        normalize(item.enterprise.email).includes(searchTerm)) ||
      (item.enterprise.cpf &&
        normalize(item.enterprise.cpf).includes(searchTerm)) ||
      (item.enterprise.cnpj &&
        normalize(item.enterprise.cnpj).includes(searchTerm))
    );
  });
});

const listOrderCounterCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredOrder.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(filteredOrder.value.length / rowsPerPage.value);
});

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
  await fetchOrders();
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
        <TitlePage title="Solicitações para usuários" />
      </div>
      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <q-btn
          @click="openFormRequestUser"
          icon-right="person_add"
          label="Solicitações"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main
        class="q-pa-sm q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-table
          :rows="loadingOrder ? [] : listOrderCounterCurrent"
          :columns="columnsOrder"
          :loading="loadingOrder"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma solicitação para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:top>
            <span class="text-subtitle2">Lista de solicitações</span>
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
                <span class="text-subtitle2">{{
                  props.row.enterprise.name
                }}</span>
              </q-td>
              <q-td key="email" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.enterprise.email
                }}</span>
              </q-td>
              <q-td key="cnpj" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.enterprise.cnpj
                }}</span>
              </q-td>
              <q-td key="cpf" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.enterprise.cpf
                }}</span>
              </q-td>
              <q-td key="created" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  formatDate(props.row.created_at)
                }}</span>
              </q-td>
              <q-td key="description" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.description }}</span>
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
          <template v-slot:bottom>
            <Paginate
              v-model="currentPage"
              :max="maxPages"
              :length="filteredOrder.length"
            />
          </template>
        </q-table>
        <FormRequestUser
          :open="showFormRequestUser"
          :data-edit="selectedDataEdit"
          @update:open="closeFormRequestUser"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
