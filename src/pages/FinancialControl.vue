<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useFinancialStore } from 'src/stores/financial-store';
import { onMounted, reactive, ref } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';

defineOptions({
  name: 'FinancialControl',
});

const { listDelivery, loadingDelivery } = storeToRefs(useFinancialStore());
const { getDelivery, updateDelivery } = useFinancialStore();

const filterDelivery = ref<string>('');
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
    <main class="q-pa-sm">
      <q-table
        :rows="loadingDelivery ? [] : listDelivery"
        :columns="columnsDelivery"
        :filter="filterDelivery"
        :loading="loadingDelivery"
        style="max-height: 400px"
        flat
        bordered
        dense
        row-key="name"
        no-data-label="Nenhuma movimentação para mostrar"
      >
        <template v-slot:top>
          <span class="text-subtitle2">Lista de entregas</span>
          <q-space />
          <q-input filled v-model="filterDelivery" dense label="Pesquisar">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr
            :props="props"
            style="height: 28px"
            :class="props.row.type === 'entrada' ? 'text-green' : 'text-red'"
          >
            <q-td key="month_year" :props="props" class="text-left">
              {{ props.row.account.month_year }}
            </q-td>
            <q-td key="status" :props="props" class="text-left">
              {{ props.row.account.status }}
            </q-td>
            <q-td key="date_delivery" :props="props" class="text-left">
              {{ props.row.account.date_delivery }}
            </q-td>
            <q-td key="action" :props="props">
              <q-btn
                @click="finalize(props.row.month_year)"
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
    </main>
  </section>
</template>
