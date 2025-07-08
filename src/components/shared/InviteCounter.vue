<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from 'src/stores/order-store';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { OrderClient } from 'src/ts/interfaces/data/Order';
import { useFinancialStore } from 'src/stores/financial-store';
import TitlePage from './TitlePage.vue';

defineOptions({
  name: 'InviteCounter',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { orderCount } = storeToRefs(useFinancialStore());
const { listOrderClient, loadingOrder } = storeToRefs(useOrderStore());
const { actionRequestEnterprise, getOrdersViewClient } = useOrderStore();

const filterOrder = ref<string>('');
const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(10);
const columnsOrder = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Organização',
    field: 'counter.name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'counter.email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
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

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const customFilterOrder = (
  rows: readonly OrderClient[],
  terms: string,
  cols: readonly OrderClient[],
  getCellValue: (row: OrderClient, col: QuasarTable) => unknown
): readonly OrderClient[] => {
  const searchTerm = terms.toLowerCase();

  return listOrderClient.value.filter((item) => {
    currentPage.value = 1;
    return (
      (item.counter.name &&
        item.counter.name.toLowerCase().includes(searchTerm)) ||
      (item.counter.email &&
        item.counter.email.toLowerCase().includes(searchTerm)) ||
      (item.counter.cpf &&
        item.counter.cpf.toLowerCase().includes(searchTerm)) ||
      (item.counter.cnpj &&
        item.counter.cnpj.toLowerCase().includes(searchTerm))
    );
  });
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
const fetchOrders = async () => {
  await getOrdersViewClient();
};
const actionInvite = async (id: string, action: 'accepted' | 'declined') => {
  const response = await actionRequestEnterprise(id, action);
  if (response?.status === 200) {
    orderCount.value = response.data.orders.length;
  }
};
const clear = (): void => {
  filterOrder.value = '';
};

const listUserMemberCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return listOrderClient.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(listOrderClient.value.length / rowsPerPage.value);
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchOrders();
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="min-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Solicitações de contadores" />
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="loadingOrder ? [] : listUserMemberCurrent"
          :columns="columnsOrder"
          :filter="filterOrder"
          :filter-method="customFilterOrder"
          :loading="loadingOrder"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma solicitação para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
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
                {{ props.row.counter.name }}
              </q-td>
              <q-td key="email" :props="props" class="text-left">
                {{ props.row.counter.email }}
              </q-td>
              <q-td key="cnpj" :props="props" class="text-left">
                {{ props.row.counter.cnpj }}
              </q-td>
              <q-td key="cpf" :props="props" class="text-left">
                {{ props.row.counter.cpf }}
              </q-td>
              <q-td key="created" :props="props" class="text-left">
                {{ formatDate(props.row.created_at) }}
              </q-td>
              <q-td key="description" :props="props" class="text-left">
                {{ props.row.description }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="actionInvite(props.row.id, 'declined')"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="close"
                >
                  <q-tooltip> Rejeitar </q-tooltip>
                </q-btn>
                <q-btn
                  @click="actionInvite(props.row.id, 'accepted')"
                  size="sm"
                  flat
                  round
                  color="green"
                  icon="check_circle"
                >
                  <q-tooltip> Aceitar </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:bottom>
            <div
              v-show="listOrderClient.length > 0"
              class="flex justify-between full-width items-center q-py-sm"
            >
              <q-pagination
                style="width: 96%; justify-content: center"
                v-model="currentPage"
                :max="maxPages"
                :max-pages="6"
                rounded
                direction-links
                boundary-links
                color="contabilidade"
                active-text-color="white"
                text-color="red-9"
                icon-first="skip_previous"
                icon-last="skip_next"
                icon-prev="fast_rewind"
                icon-next="fast_forward"
              />
              <span class="text-red-9"
                >Total: {{ listOrderClient.length }}</span
              >
            </div>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="emit('update:open')"
            color="red"
            flat
            label="Fechar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
