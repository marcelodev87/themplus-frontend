<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormEntry from 'src/components/forms/FormEntry.vue';
import FormOut from 'src/components/forms/FormOut.vue';
import FormCategory from 'src/components/forms/FormCategory.vue';
import { onMounted, reactive, ref } from 'vue';
import { Scheduling } from 'src/ts/interfaces/data/Scheduling';
import { storeToRefs } from 'pinia';
import { useSchedulingStore } from 'src/stores/scheduling-store';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';

defineOptions({
  name: 'Scheduling',
});

const { loadingScheduling, listScheduling } = storeToRefs(useSchedulingStore());
const { getSchedulings, deleteScheduling } = useSchedulingStore();

const showFormEntry = ref<boolean>(false);
const showFormOut = ref<boolean>(false);
const showFormCategory = ref<boolean>(false);
const selectedDataEdit = ref<Scheduling | null>(null);
const filterScheduling = ref<string>('');
const columnsScheduling = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Banco',
    field: 'account.name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'account_number',
    label: 'Conta',
    field: 'account.account_number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'agency_number',
    label: 'Agência',
    field: 'account.agency_number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category.name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date_movement',
    label: 'Data de movimentação',
    field: 'date_movement',
    align: 'left',
    sortable: true,
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
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

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
const openFormCategory = (): void => {
  showFormCategory.value = true;
};
const closeFormCategory = (): void => {
  showFormCategory.value = false;
};
const handleEdit = (scheduling: Scheduling): void => {
  selectedDataEdit.value = scheduling;
  if (scheduling.type === 'entrada') {
    openFormEntry();
  } else {
    openFormOut();
  }
};
const exclude = async (id: string): Promise<void> => {
  await deleteScheduling(id);
};
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

onMounted(async () => {
  await getSchedulings();
});
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-5">
        <TitlePage title="Gerenciamento de agendamentos" />
      </div>
      <div class="col-7 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormCategory"
          flat
          color="black"
          icon-right="settings"
          label="Categorias"
          unelevated
          no-caps
        />
        <q-btn
          @click="openFormOut"
          color="negative"
          icon-right="remove"
          label="Saida"
          unelevated
          no-caps
        />
        <q-btn
          @click="openFormEntry"
          color="positive"
          icon-right="add"
          label="Entrada"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <main class="q-pa-sm">
      <q-table
        :rows="loadingScheduling ? [] : listScheduling"
        :columns="columnsScheduling"
        :filter="filterScheduling"
        :loading="loadingScheduling"
        style="max-height: 400px"
        flat
        bordered
        dense
        row-key="name"
        no-data-label="Nenhum agendamento para mostrar"
      >
        <template v-slot:top>
          <span class="text-subtitle2">Lista de agendamentos</span>
          <q-space />
          <q-input filled v-model="filterScheduling" dense label="Pesquisar">
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
              {{ `R$ ${props.row.value}` }}
            </q-td>
            <q-td key="date_movement" :props="props" class="text-left">
              {{ formatDate(props.row.date_movement) }}
            </q-td>
            <q-td key="description" :props="props" class="text-left">
              {{ props.row.description }}
            </q-td>
            <q-td key="receipt" :props="props" class="text-left">
              {{ props.row.receipt }}
            </q-td>
            <q-td key="action" :props="props">
              <q-btn
                v-show="props.row.status === 0"
                @click="handleEdit(props.row)"
                size="sm"
                flat
                round
                color="black"
                icon="edit"
                :disabled="props.row.status === 1"
              />
              <q-btn
                v-show="props.row.status === 0"
                @click="exclude(props.row.id)"
                size="sm"
                flat
                round
                color="red"
                icon="delete"
                :disabled="props.row.status === 1"
              />
              <q-icon name="task_alt" size="16px" class="cursor-pointer">
                <q-tooltip> Finalizar </q-tooltip>
              </q-icon>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <FormEntry
        :open="showFormEntry"
        :data-edit="selectedDataEdit"
        title="Agende uma entrada"
        mode="schedule"
        @update:open="closeFormEntry"
      />
      <FormOut
        :open="showFormOut"
        :data-edit="selectedDataEdit"
        title="Agende uma saída"
        mode="schedule"
        @update:open="closeFormOut"
      />
      <FormCategory :open="showFormCategory" @update:open="closeFormCategory" />
    </main>
  </section>
</template>
