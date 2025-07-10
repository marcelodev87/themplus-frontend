<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormEntry from 'src/components/forms/FormEntry.vue';
import FormOut from 'src/components/forms/FormOut.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useMovementStore } from 'src/stores/movement-store';
import { storeToRefs } from 'pinia';
import { QuasarSelect, QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { Movement } from 'src/ts/interfaces/data/Movement';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import FormInsertMovement from 'src/components/forms/FormInsertMovement.vue';
import ConfirmDownloadFile from 'src/components/confirm/ConfirmDownloadFile.vue';
import MovementsAnalyze from 'src/components/general/MovementsAnalyze.vue';
import { useAuthStore } from 'src/stores/auth-store';
import Paginate from 'src/components/general/Paginate.vue';

defineOptions({
  name: 'Movement',
});

const {
  getMovements,
  getMovementsWithParams,
  exportMovementExcel,
  exportMovementPDF,
  deleteMovement,
  downloadFile,
} = useMovementStore();
const {
  loadingMovement,
  listMovement,
  filledData,
  listMonthYear,
  delivered,
  listCategoryFilters,
  listAccountFilters,
  movementsAnalyze,
} = storeToRefs(useMovementStore());
const { user } = storeToRefs(useAuthStore());

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(7);
const showConfirmDownloadFile = ref<boolean>(false);
const showConfirmAction = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const showFormInsertMovement = ref<boolean>(false);
const showMovementsAnalyze = ref<boolean>(false);
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
const selectedCategory = ref<QuasarSelect<string | null>>({
  label: 'Todas categorias',
  value: null,
});
const selectedAccount = ref<QuasarSelect<string | null>>({
  label: 'Todas contas',
  value: null,
});

const dateActual = computed(() => {
  const currentDate = new Date();

  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();

  return `${month}/${year}`;
});
const optionsCategoriesFilter = computed(() => {
  const baseCategories = [
    {
      label: 'Todas categorias',
      value: null,
    },
  ];

  const additionalCategories = (listCategoryFilters.value || [])
    .slice()
    .sort((a, b) => {
      return a.label.localeCompare(b.label);
    });

  return [...baseCategories, ...additionalCategories];
});
const optionsAccountsFilter = computed(() => {
  const baseAccounts = [
    {
      label: 'Todas contas',
      value: null,
    },
  ];

  const additionalAccounts = (listAccountFilters.value || [])
    .slice()
    .sort((a, b) => {
      return a.label.localeCompare(b.label);
    });

  return [...baseAccounts, ...additionalAccounts];
});
const dataMovement = computed(() => {
  let valueEntry = 0;
  let valueOut = 0;

  listMovement.value.forEach((item) => {
    if (item.type === 'entrada') {
      valueEntry += Number(item.value);
    } else {
      valueOut += Number(item.value);
    }
  });

  const total = valueEntry - valueOut;

  return {
    valueEntry: formatCurrencyBRL(valueEntry),
    valueOut: formatCurrencyBRL(valueOut),
    total: formatCurrencyBRL(total),
  };
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
const openMovementsAnalyze = (): void => {
  showMovementsAnalyze.value = true;
};
const closeMovementsAnalyze = (): void => {
  showMovementsAnalyze.value = false;
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
const resetPage = (): void => {
  currentPage.value = 1;
};
const customFilterMovement = (
  rows: readonly Movement[],
  terms: string,
  cols: readonly Movement[],
  getCellValue: (row: Movement | null, col: QuasarTable | null) => unknown
): readonly Movement[] => {
  const searchTerm = terms.toLowerCase();

  resetPage();
  return listMovement.value.filter((item) => {
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
const exportDataExcel = async (): Promise<void> => {
  loadingExport.value = true;
  await exportMovementExcel(
    onlyEntry.value,
    onlyOut.value,
    filterMonthYear.value.replace('/', '-'),
    selectedCategory.value.value
  );
  loadingExport.value = false;
};
const exportDataPdf = async (): Promise<void> => {
  loadingExport.value = true;
  await exportMovementPDF(
    onlyEntry.value,
    onlyOut.value,
    filterMonthYear.value.replace('/', '-'),
    selectedCategory.value.value
  );
  loadingExport.value = false;
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const download = async (url: string) => {
  await downloadFile(url);
};
const openConfirmDownloadFile = (): void => {
  showConfirmDownloadFile.value = true;
};
const closeConfirmDownloadFile = (): void => {
  showConfirmDownloadFile.value = false;
};
const closeConfirmDownloadFileOk = (file: 'Excel' | 'PDF'): void => {
  if (file.toLocaleLowerCase() === 'excel') {
    exportDataExcel();
  } else {
    exportDataPdf();
  }
  showConfirmDownloadFile.value = false;
};
const getClassTotal = (total: string) => {
  const numericValue = parseFloat(
    total.replace(/R\$|\.|\s/g, '').replace(',', '.')
  );

  if (numericValue < 0) {
    return 'bg-red-2';
  }
  if (numericValue === 0) {
    return '';
  }
  return 'bg-green-2';
};

const listMovementCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return listMovement.value.slice(start, end);
});
const maxPages = computed(() => {
  const filterLength = customFilterMovement(
    [],
    filterMovement.value,
    [],
    () => null
  ).length;
  if (filterMovement.value.length > 0) {
    return Math.ceil(filterLength / rowsPerPage.value);
  }
  return Math.ceil(listMovement.value.length / rowsPerPage.value);
});

watch(
  [onlyEntry, onlyOut, selectedCategory, selectedAccount],
  async (
    [newEntry, newOut, newCategory, newAccount],
    [oldEntry, oldOut, oldCategory, oldAccount]
  ) => {
    let lastChanged = null;
    resetPage();

    if (newEntry !== oldEntry) {
      lastChanged = 'onlyEntry';
    }
    if (newOut !== oldOut) {
      lastChanged = 'onlyOut';
    }

    const selectedCategoryChanged = newCategory !== oldCategory;
    const selectedAccountChanged = newAccount !== oldAccount;

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

    const shouldCallWithParams =
      newEntry || newOut || selectedCategoryChanged || selectedAccountChanged;

    if (newEntry && newOut) {
      return;
    }

    if (shouldCallWithParams) {
      await getMovementsWithParams(
        newEntry,
        newOut,
        filterMonthYear.value.replace('/', '-'),
        selectedCategory.value.value,
        selectedAccount.value.value
      );
    } else {
      await getMovements(filterMonthYear.value.replace('/', '-'));
    }
  }
);
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
  resetPage();
  await getMovementsWithParams(
    onlyEntry.value,
    onlyOut.value,
    filterMonthYear.value.replace('/', '-'),
    selectedCategory.value.value,
    selectedAccount.value.value
  );
});
watch(showMovementsAnalyze, async (analyze) => {
  if (!analyze) {
    resetPage();
    await getMovements(dateActual.value.replace('/', '-'));
  }
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
          v-show="
            user?.enterprise_id === user?.view_enterprise_id &&
            movementsAnalyze > 0
          "
          @click="openMovementsAnalyze"
          :loading="loadingMovement"
          flat
          color="black"
          icon-right="task_alt"
          label="Pré-Movimentações"
          unelevated
          no-caps
        >
          <q-badge color="red" rounded floating :label="movementsAnalyze"
        /></q-btn>
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
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
          @click="openConfirmDownloadFile"
          :loading="loadingExport"
          flat
          color="black"
          icon-right="download"
          label="Exportar"
          unelevated
          no-caps
        />
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
          @click="openFormOut"
          color="negative"
          icon-right="remove"
          label="Saida"
          unelevated
          no-caps
        />
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
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
            <q-item
              v-show="user?.enterprise_id === user?.view_enterprise_id"
              clickable
              v-ripple
              @click="openFormEntry"
              class="text-green"
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="add" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Formulário de entrada</q-item-section>
            </q-item>
            <q-item
              v-show="
                user?.enterprise_id === user?.view_enterprise_id &&
                movementsAnalyze > 0
              "
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="task_alt" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Pré-Movimentações</q-item-section>
            </q-item>
            <q-item
              v-show="user?.enterprise_id === user?.view_enterprise_id"
              clickable
              v-ripple
              @click="openFormOut"
              class="text-red"
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="remove" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Formulário de saída</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="openConfirmDownloadFile">
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
    <q-scroll-area
      :class="!$q.screen.lt.sm ? 'main-scroll' : 'movement-scroll'"
    >
      <main
        class="q-pa-sm q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-card flat bordered class="q-my-sm">
          <q-card-section class="row items-center">
            <q-icon name="sync_alt" size="20px" class="q-mr-sm" color="black" />
            <div class="text-h6">Movimentações</div>
          </q-card-section>
          <q-card-section class="q-pt-none row justify-between">
            <span class="text-subtitle1">Total de entrada: </span>
            <span class="text-green">{{ dataMovement.valueEntry }}</span>
          </q-card-section>
          <q-card-section class="q-pt-none row justify-between">
            <span class="text-subtitle1"> Total de saída:</span>
            <span class="text-red">{{ dataMovement.valueOut }} </span>
          </q-card-section>
          <q-separator inset />
          <q-card-section
            class="row justify-between"
            :class="getClassTotal(dataMovement.total)"
          >
            <span class="text-subtitle1">Saldo:</span>
            <span>{{ dataMovement.total }}</span>
          </q-card-section>
        </q-card>
        <q-table
          style="height: 374px"
          :rows="loadingMovement ? [] : listMovementCurrent"
          :columns="columnsMovement"
          :filter="filterMovement"
          :filter-method="customFilterMovement"
          :loading="loadingMovement"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma movimentação para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
          <template v-slot:top>
            <div :class="!$q.screen.lt.md ? '' : 'column full-width'">
              <span class="text-subtitle2">Lista de movimentações</span>
              <q-space />
              <div v-if="!$q.screen.lt.md" class="row">
                <q-toggle
                  v-model="onlyEntry"
                  :disable="loadingMovement || loadingExport"
                  color="primary"
                  label="Entradas"
                  left-label
                />
                <q-toggle
                  v-model="onlyOut"
                  :disable="loadingMovement || loadingExport"
                  color="primary"
                  label="Saídas"
                  left-label
                />
                <q-select
                  v-model="filterMonthYear"
                  :options="listMonthYear"
                  :readonly="
                    listMonthYear.length === 0 ||
                    loadingMovement ||
                    loadingExport
                  "
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
                <q-select
                  v-model="selectedCategory"
                  :options="optionsCategoriesFilter"
                  :readonly="loadingMovement || loadingExport"
                  label="Filtre categoria"
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
                    <q-icon name="category" color="black" size="20px" />
                  </template>
                </q-select>
                <q-select
                  v-model="selectedAccount"
                  :options="optionsAccountsFilter"
                  :readonly="loadingMovement || loadingExport"
                  label="Filtre conta"
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
                    <q-icon name="account_balance" color="black" size="20px" />
                  </template>
                </q-select>
                <q-input
                  filled
                  v-model="filterMovement"
                  dense
                  label="Pesquisar"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <q-expansion-item
                v-else
                expand-separator
                icon="filter_alt"
                label="Filtros"
                class="border-form"
              >
                <q-toggle
                  v-model="onlyEntry"
                  :disable="loadingMovement || loadingExport"
                  color="primary"
                  label="Entradas"
                  left-label
                  class="q-ml-sm"
                />
                <q-toggle
                  v-model="onlyOut"
                  :disable="loadingMovement || loadingExport"
                  color="primary"
                  label="Saídas"
                  left-label
                />
                <q-select
                  v-model="filterMonthYear"
                  :options="listMonthYear"
                  :readonly="
                    listMonthYear.length === 0 ||
                    loadingMovement ||
                    loadingExport
                  "
                  label="Filtrar momento"
                  filled
                  dense
                  options-dense
                  bg-color="grey-1"
                  label-color="black"
                  style="min-width: 200px"
                  :class="!$q.screen.lt.md ? '' : 'full-width'"
                  class="q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="calendar_today" color="black" size="20px" />
                  </template>
                </q-select>
                <q-select
                  v-model="selectedCategory"
                  :options="optionsCategoriesFilter"
                  :readonly="loadingMovement || loadingExport"
                  label="Filtre categoria"
                  filled
                  dense
                  options-dense
                  bg-color="grey-1"
                  label-color="black"
                  style="min-width: 200px"
                  :class="!$q.screen.lt.md ? '' : 'full-width'"
                  class="q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="category" color="black" size="20px" />
                  </template>
                </q-select>
                <q-input
                  filled
                  v-model="filterMovement"
                  dense
                  label="Pesquisar"
                  class="q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </q-expansion-item>
            </div>
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
                <span class="text-subtitle2">{{
                  props.row.category.name
                }}</span>
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
                :class="props.row.receipt ? 'cursor-pointer hover' : ''"
              >
                <q-icon
                  v-if="props.row.receipt"
                  name="attach_file"
                  size="20px"
                />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  v-show="
                    !delivered &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  v-show="
                    !delivered &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
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
          <template v-slot:bottom>
            <Paginate
              v-model="currentPage"
              :max="maxPages"
              :length="listMovement.length"
            />
          </template>
        </q-table>
        <FormEntry
          :open="showFormEntry"
          type="client"
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
          type="client"
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
        <MovementsAnalyze
          :open="showMovementsAnalyze"
          @update:open="closeMovementsAnalyze"
        />
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Excluir"
          title="Confirmação de exclusão"
          message="Este processo é irreversível e os dados não poderão ser recuperados. Caso tenha certeza, clique em 'Excluir' para prosseguir."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
        <ConfirmDownloadFile
          :open="showConfirmDownloadFile"
          title="Selecione o tipo de arquivo"
          @update:ok="closeConfirmDownloadFileOk"
          @update:open="closeConfirmDownloadFile"
        />
      </main>
    </q-scroll-area>
  </section>
</template>

<style scoped lang="scss">
.movement-scroll {
  height: calc(100vh - 180px);
}
</style>
