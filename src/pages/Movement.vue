<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormEntry from 'src/components/forms/FormEntry.vue';
import FormOut from 'src/components/forms/FormOut.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useMovementStore } from 'src/stores/movement-store';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { Movement } from 'src/ts/interfaces/data/Movement';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import FormInsertMovement from 'src/components/forms/FormInsertMovement.vue';

defineOptions({
  name: 'Movement',
});

const {
  getMovements,
  getMovementsWithParams,
  exportMovement,
  deleteMovement,
  downloadFile,
} = useMovementStore();
const { loadingMovement, listMovement, filledData, listMonthYear, delivered } =
  storeToRefs(useMovementStore());

const showConfirmAction = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const showFormInsertMovement = ref<boolean>(false);
const onlyEntry = ref<boolean>(false);
const onlyOut = ref<boolean>(false);
const loadingExport = ref<boolean>(false);
const showFormEntry = ref<boolean>(false);
const showFormOut = ref<boolean>(false);
const filterMovement = ref<string>('');
const selectedDataEdit = ref<Movement | null>(null);
const selectedExclude = ref<string>('');
const columnsMovement = reactive<QuasarTable[]>([
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

const dateActual = computed(() => {
  const currentDate = new Date();

  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();

  return `${month}/${year}`;
});
const filterMonthYear = ref<string>(dateActual.value);

const clear = (): void => {
  selectedDataEdit.value = null;
  selectedExclude.value = '';
  filterMonthYear.value = dateActual.value;
};
const openConfirmAction = (): void => {
  showConfirmAction.value = true;
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  await deleteMovement(selectedExclude.value);
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  selectedExclude.value = '';
};
const openFormEntry = (): void => {
  showFormEntry.value = true;
};
const closeFormEntry = (): void => {
  showFormEntry.value = false;
  clear();
};
const openFormOut = (): void => {
  showFormOut.value = true;
};
const closeFormOut = (): void => {
  showFormOut.value = false;
  clear();
};
const openFormInsertMovement = (): void => {
  showFormInsertMovement.value = true;
};
const closeFormInsertMovement = (): void => {
  showFormInsertMovement.value = false;
  clear();
};
const handleEdit = (movement: Movement) => {
  selectedDataEdit.value = movement;
  if (selectedDataEdit.value.type === 'entrada') {
    openFormEntry();
  } else {
    openFormOut();
  }
};
const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');

  return `${day}/${month}/${year}`;
};
const saveIdExclude = async (id: string) => {
  selectedExclude.value = id;
  openConfirmAction();
};
const customFilterMovement = (
  rows: readonly Movement[],
  terms: string,
  cols: readonly Movement[],
  getCellValue: (row: Movement, col: QuasarTable) => unknown
): readonly Movement[] => {
  const searchTerm = terms.toLowerCase();

  return rows.filter((item) => {
    return (
      (item.account?.name &&
        item.account.name.toLowerCase().includes(searchTerm)) ||
      (item.account?.agency_number &&
        item.account.agency_number.toLowerCase().includes(searchTerm)) ||
      (item.account?.account_number &&
        item.account.account_number.toLowerCase().includes(searchTerm)) ||
      (item.category?.name &&
        item.category.name.toLowerCase().includes(searchTerm)) ||
      (item.value &&
        item.value.toString().toLowerCase().includes(searchTerm)) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm)) ||
      (item.receipt && item.receipt.toLowerCase().includes(searchTerm)) ||
      (item.date_movement &&
        item.date_movement.toLowerCase().includes(searchTerm))
    );
  });
};
const exportData = async (): Promise<void> => {
  loadingExport.value = true;
  await exportMovement(
    onlyEntry.value,
    onlyOut.value,
    filterMonthYear.value.replace('/', '-')
  );
  loadingExport.value = false;
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const download = async (file: string) => {
  await downloadFile(file.split('receipts/')[1]);
};

watch([onlyEntry, onlyOut], async ([newEntry, newOut], [oldEntry, oldOut]) => {
  let lastChanged = null;

  if (newEntry !== oldEntry) {
    lastChanged = 'onlyEntry';
  }
  if (newOut !== oldOut) {
    lastChanged = 'onlyOut';
  }

  if (lastChanged === 'onlyEntry') {
    if (newEntry) {
      onlyOut.value = false;
    }
  }
  if (lastChanged === 'onlyOut') {
    if (newOut) {
      onlyEntry.value = false;
    }
  }

  const shouldCallWithParams = newEntry || newOut;

  if (newEntry && newOut) {
    return;
  }

  if (shouldCallWithParams) {
    await getMovementsWithParams(
      newEntry,
      newOut,
      filterMonthYear.value.replace('/', '-')
    );
  } else {
    await getMovements(filterMonthYear.value.replace('/', '-'));
  }
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
watch(filterMonthYear, async () => {
  await getMovements(filterMonthYear.value.replace('/', '-'));
});

onMounted(async () => {
  await getMovements(dateActual.value.replace('/', '-'));
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
        <TitlePage title="Gerenciamento de movimentações" />
      </div>
      <div
        v-if="!$q.screen.lt.sm"
        class="col-7 row items-center justify-end q-gutter-x-sm"
      >
        <q-btn
          @click="openFormInsertMovement"
          :loading="loadingExport"
          flat
          color="black"
          icon-right="publish"
          label="Inserir"
          unelevated
          no-caps
        />
        <q-btn
          @click="exportData"
          :loading="loadingExport"
          flat
          color="black"
          icon-right="download"
          label="Exportar"
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
      <div v-else class="row justify-end q-mr-sm q-mb-sm">
        <q-btn-dropdown
          class="text-white"
          color="primary"
          ref="dropdown"
          label="Ações"
          unelevated
          no-caps
        >
          <q-list>
            <q-item clickable v-ripple @click="openFormEntry">
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="add" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Formulário de entrada</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="openFormOut">
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="remove" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Formulário de saída</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="exportData">
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="download" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Exportar</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md">
        <q-table
          :rows="loadingMovement ? [] : listMovement"
          :columns="columnsMovement"
          :filter="filterMovement"
          :filter-method="customFilterMovement"
          :loading="loadingMovement"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhuma movimentação para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de categorias</span>
            <q-space />
            <q-toggle
              v-model="onlyEntry"
              color="primary"
              label="Entradas"
              left-label
            />
            <q-toggle
              v-model="onlyOut"
              color="primary"
              label="Saídas"
              left-label
            />
            <q-select
              v-model="filterMonthYear"
              :options="listMonthYear"
              :readonly="listMonthYear.length === 0"
              label="Filtrar momento"
              filled
              dense
              options-dense
              bg-color="grey-1"
              label-color="black"
              style="min-width: 200px"
              :class="!$q.screen.lt.md ? '' : 'full-width'"
              class="q-mr-sm"
            >
              <template v-slot:prepend>
                <q-icon name="calendar_today" color="black" size="20px" />
              </template>
            </q-select>
            <q-input filled v-model="filterMovement" dense label="Pesquisar">
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
                class="text-left cursor-pointer"
              >
                <q-tooltip> {{ props.row.receipt }} </q-tooltip>
                {{ props.row.receipt }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  v-show="!delivered"
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                  :disabled="false"
                />
                <q-btn
                  v-show="!delivered"
                  @click="saveIdExclude(props.row.id)"
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
        <FormEntry
          :open="showFormEntry"
          :data-edit="selectedDataEdit"
          :title="
            selectedDataEdit === null
              ? 'Registre uma entrada'
              : 'Atualize uma entrada'
          "
          mode="movement"
          @update:open="closeFormEntry"
        />
        <FormOut
          :open="showFormOut"
          :data-edit="selectedDataEdit"
          :title="
            selectedDataEdit === null
              ? 'Registre uma saída'
              : 'Atualize uma saída'
          "
          mode="movement"
          @update:open="closeFormOut"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
        <FormInsertMovement
          :open="showFormInsertMovement"
          @update:open="closeFormInsertMovement"
        />
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Excluir"
          title="Confirmação de exclusão"
          message="Este processo é irreversível e os dados não poderão ser recuperados. Caso tenha certeza, clique em 'Excluir' para prosseguir."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
