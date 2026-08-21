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
import { useSortMethod } from 'src/composables/useTableSort';

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
  closedMonths,
  listCategoryFilters,
  listAccountFilters,
  movementsAnalyze,
} = storeToRefs(useMovementStore());
const { user } = storeToRefs(useAuthStore());

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
const optionsFiltersPeriod = reactive<QuasarSelect<string>[]>([
  {
    label: 'Hoje',
    value: 'today',
  },
  {
    label: 'Esta semana',
    value: 'this_week',
  },
  {
    label: 'Este mês',
    value: 'this_month',
  },
  {
    label: 'Últimos 30 dias',
    value: 'last_30_days',
  },
  {
    label: 'Últimos 12 meses',
    value: 'last_12_months',
  },
  {
    label: 'Todo o período',
    value: 'all',
  },
  {
    label: 'Personalizado',
    value: 'custom',
  },
]);
const defaultPeriod: QuasarSelect<string> = {
  label: 'Este mês',
  value: 'this_month',
};
const selectedPeriod = ref<QuasarSelect<string>>({ ...defaultPeriod });
const customStartDate = ref<string | null>(null);
const customEndDate = ref<string | null>(null);
const isCustomPeriod = computed(() => selectedPeriod.value.value === 'custom');
const toIsoDate = (date: string | null): string | null => {
  if (!date) return null;

  const [day, month, year] = date.split('/');

  if (!day || !month || !year || year.length !== 4) return null;

  return `${year}-${month}-${day}`;
};
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
const { sortRows: sortMovementRows } = useSortMethod(columnsMovement);
const selectedCategory = ref<QuasarSelect<string | null>>({
  label: 'Todas categorias',
  value: null,
});
const selectedAccount = ref<QuasarSelect<string | null>>({
  label: 'Todas contas',
  value: null,
});
const preview = reactive({
  open: false,
  url: '',
  type: '' as 'image' | 'pdf' | '',
});

const getFileType = (url: string) => {
  const ext = url.split('.').pop()?.toLowerCase();

  if (!ext) return '';

  if (['png', 'jpg', 'jpeg'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';

  return '';
};

const openPreview = (url: string) => {
  const type = getFileType(url);

  if (!type) {
    downloadFile(url);
    return;
  }

  preview.url = url;
  preview.type = type;
  preview.open = true;
};

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
    if (item.category?.name !== 'Transferência') {
      if (item.type === 'entrada') {
        valueEntry += Number(item.value);
      } else {
        valueOut += Number(item.value);
      }
    }
  });

  const total = valueEntry - valueOut;

  return {
    valueEntry: formatCurrencyBRL(valueEntry),
    valueOut: formatCurrencyBRL(valueOut),
    total: formatCurrencyBRL(total),
  };
});

const clear = (): void => {
  selectedDataEdit.value = null;
  selectedExclude.value = '';
  selectedPeriod.value = { ...defaultPeriod };
  customStartDate.value = null;
  customEndDate.value = null;
};
const isMovementClosed = (dateMovement: string): boolean => {
  const [year, month] = dateMovement.split('-');

  return closedMonths.value.includes(`${month}-${year}`);
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
const exportDataExcel = async (): Promise<void> => {
  loadingExport.value = true;
  await exportMovementExcel(
    onlyEntry.value,
    onlyOut.value,
    selectedPeriod.value.value,
    selectedCategory.value.value,
    null,
    null,
    toIsoDate(customStartDate.value),
    toIsoDate(customEndDate.value)
  );
  loadingExport.value = false;
};
const exportDataPdf = async (): Promise<void> => {
  loadingExport.value = true;
  await exportMovementPDF(
    onlyEntry.value,
    onlyOut.value,
    selectedPeriod.value.value,
    selectedCategory.value.value,
    toIsoDate(customStartDate.value),
    toIsoDate(customEndDate.value)
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

const filteredMovement = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };
  if (!filterMovement.value) {
    return listMovement.value;
  }

  const searchTerm = normalize(filterMovement.value);
  return listMovement.value.filter((item) => {
    return (
      (item.account?.name &&
        item.account.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(searchTerm)) ||
      (item.account?.agency_number &&
        item.account.agency_number
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(searchTerm)) ||
      (item.account?.account_number &&
        item.account.account_number
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(searchTerm)) ||
      (item.category?.name &&
        item.category.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(searchTerm)) ||
      (item.value &&
        item.value
          .toString()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(searchTerm)) ||
      (item.description &&
        item.description
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(searchTerm)) ||
      (item.receipt &&
        item.receipt
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(searchTerm)) ||
      (item.date_movement &&
        item.date_movement
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(searchTerm))
    );
  });
});

watch(
  [onlyEntry, onlyOut, selectedCategory, selectedAccount],
  async (
    [newEntry, newOut, newCategory, newAccount],
    [oldEntry, oldOut, oldCategory, oldAccount]
  ) => {
    let lastChanged = null;

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
        selectedPeriod.value.value,
        selectedCategory.value.value,
        selectedAccount.value.value,
        toIsoDate(customStartDate.value),
        toIsoDate(customEndDate.value)
      );
    } else {
      await getMovements(selectedPeriod.value.value);
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
watch(selectedPeriod, async () => {
  if (isCustomPeriod.value) {
    return;
  }

  await getMovementsWithParams(
    onlyEntry.value,
    onlyOut.value,
    selectedPeriod.value.value,
    selectedCategory.value.value,
    selectedAccount.value.value
  );
});
watch([customStartDate, customEndDate], async ([newStart, newEnd]) => {
  if (!isCustomPeriod.value) {
    return;
  }

  await getMovementsWithParams(
    onlyEntry.value,
    onlyOut.value,
    selectedPeriod.value.value,
    selectedCategory.value.value,
    selectedAccount.value.value,
    toIsoDate(newStart),
    toIsoDate(newEnd)
  );
});
watch(showMovementsAnalyze, async (analyze) => {
  if (!analyze) {
    await getMovements(selectedPeriod.value.value);
  }
});

onMounted(async () => {
  await getMovements(selectedPeriod.value.value);
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
        <q-card
          flat
          bordered
          class="q-my-md shadow-1 overflow-hidden"
          style="border-radius: 12px"
        >
          <q-card-section class="bg-grey-1 row items-center q-py-sm">
            <q-icon
              name="swap_vertical_circle"
              size="24px"
              color="primary"
              class="q-mr-sm"
            />
            <div
              class="text-weight-bold text-subtitle1 text-uppercase text-grey-8"
            >
              Movimentações
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-md q-gutter-y-sm">
            <div class="row justify-between items-center">
              <div class="row items-center text-grey-7">
                <q-icon
                  name="trending_up"
                  color="green"
                  size="xs"
                  class="q-mr-xs"
                />
                <span class="text-weight-medium">Entradas</span>
              </div>
              <div class="text-weight-bold text-green">
                {{ dataMovement.valueEntry }}
              </div>
            </div>

            <div class="row justify-between items-center">
              <div class="row items-center text-grey-7">
                <q-icon
                  name="trending_down"
                  color="red"
                  size="xs"
                  class="q-mr-xs"
                />
                <span class="text-weight-medium">Saídas</span>
              </div>
              <div class="text-weight-bold text-red">
                {{ dataMovement.valueOut }}
              </div>
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section
            class="row justify-between items-center q-py-md"
            :class="getClassTotal(dataMovement.total)"
          >
            <span class="text-weight-medium text-subtitle1">Saldo Total</span>
            <span class="text-h6 text-weight-bolder">
              {{ dataMovement.total }}
            </span>
          </q-card-section>
        </q-card>

        <q-table
          :rows="loadingMovement ? [] : filteredMovement"
          :columns="columnsMovement"
          :loading="loadingMovement"
          flat
          bordered
          row-key="id"
          no-data-label="Nenhuma movimentação para mostrar"
          virtual-scroll
          :rows-per-page-options="[0]"
          class="my-sticky-header-table"
          style="border-radius: 12px"
          column-sort-order="da"
          :sort-method="sortMovementRows"
        >
          <template v-slot:top>
            <div class="column full-width q-gutter-y-md">
              <div class="row items-center full-width">
                <div class="text-h6 text-weight-bold text-grey-8">
                  <q-icon
                    name="swap_horizontal_circle"
                    color="primary"
                    class="q-mr-xs"
                  />
                  Movimentações
                </div>
                <q-space />
                <div v-if="!$q.screen.lt.md" class="row q-gutter-x-sm">
                  <q-toggle
                    v-model="onlyEntry"
                    :disable="loadingMovement"
                    color="positive"
                    label="Entradas"
                    dense
                    left-label
                  />
                  <q-toggle
                    v-model="onlyOut"
                    :disable="loadingMovement"
                    color="negative"
                    label="Saídas"
                    dense
                    left-label
                  />
                </div>
              </div>

              <div
                v-if="!$q.screen.lt.md"
                class="row q-col-gutter-sm items-center"
              >
                <div class="col">
                  <q-select
                    v-model="selectedPeriod"
                    :options="optionsFiltersPeriod"
                    label="Período"
                    outlined
                    dense
                    bg-color="white"
                  >
                    <template v-slot:prepend
                      ><q-icon name="calendar_today" size="xs"
                    /></template>
                  </q-select>
                </div>
                <div v-if="isCustomPeriod" class="col">
                  <q-input
                    v-model="customStartDate"
                    label="Data início"
                    outlined
                    dense
                    clearable
                    bg-color="white"
                    mask="##/##/####"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer" size="xs">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="customStartDate" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Fechar"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div v-if="isCustomPeriod" class="col">
                  <q-input
                    v-model="customEndDate"
                    label="Data fim"
                    outlined
                    dense
                    clearable
                    bg-color="white"
                    mask="##/##/####"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer" size="xs">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="customEndDate" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Fechar"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col">
                  <q-select
                    v-model="selectedCategory"
                    :options="optionsCategoriesFilter"
                    label="Categoria"
                    outlined
                    dense
                    bg-color="white"
                  >
                    <template v-slot:prepend
                      ><q-icon name="category" size="xs"
                    /></template>
                  </q-select>
                </div>
                <div class="col">
                  <q-select
                    v-model="selectedAccount"
                    :options="optionsAccountsFilter"
                    label="Conta"
                    outlined
                    dense
                    bg-color="white"
                  >
                    <template v-slot:prepend
                      ><q-icon name="account_balance" size="xs"
                    /></template>
                  </q-select>
                </div>
                <div class="col">
                  <q-input
                    v-model="filterMovement"
                    outlined
                    dense
                    bg-color="white"
                    placeholder="Pesquisar..."
                  >
                    <template v-slot:append><q-icon name="search" /></template>
                  </q-input>
                </div>
              </div>

              <q-expansion-item
                v-else
                icon="filter_alt"
                label="Filtros"
                header-class="bg-grey-2 text-weight-bold"
                class="border-form overflow-hidden"
                style="border-radius: 8px"
              >
                <div class="q-pa-md q-gutter-y-sm bg-grey-1">
                  <div class="row justify-around">
                    <q-toggle
                      v-model="onlyEntry"
                      color="positive"
                      label="Entradas"
                      dense
                    />
                    <q-toggle
                      v-model="onlyOut"
                      color="negative"
                      label="Saídas"
                      dense
                    />
                  </div>
                  <q-select
                    v-model="selectedPeriod"
                    :options="optionsFiltersPeriod"
                    label="Período"
                    outlined
                    dense
                  />
                  <q-input
                    v-if="isCustomPeriod"
                    v-model="customStartDate"
                    label="Data início"
                    outlined
                    dense
                    clearable
                    mask="##/##/####"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="customStartDate" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Fechar"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input
                    v-if="isCustomPeriod"
                    v-model="customEndDate"
                    label="Data fim"
                    outlined
                    dense
                    clearable
                    mask="##/##/####"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="customEndDate" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Fechar"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-select
                    v-model="selectedCategory"
                    :options="optionsCategoriesFilter"
                    label="Categoria"
                    outlined
                    dense
                  />
                  <q-select
                    v-model="selectedAccount"
                    :options="optionsAccountsFilter"
                    label="Conta"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="filterMovement"
                    outlined
                    dense
                    placeholder="Pesquisar..."
                  />
                </div>
              </q-expansion-item>
            </div>
          </template>

          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-1">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-grey-7 text-weight-bolder text-uppercase"
              >
                <span style="font-size: 11px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" class="hover-shadow transition-all">
              <q-td key="name" :props="props">
                <div class="row items-center no-wrap">
                  <div
                    :class="
                      props.row.category?.name === 'Transferência'
                        ? 'bg-grey-4'
                        : props.row.type === 'entrada'
                          ? 'bg-green'
                          : 'bg-red'
                    "
                    style="width: 4px; height: 18px; border-radius: 10px"
                    class="q-mr-sm"
                  ></div>
                  <span class="text-weight-bold text-grey-9">{{
                    props.row.account.name
                  }}</span>
                </div>
              </q-td>

              <q-td key="account_number" :props="props" class="text-grey-8">{{
                props.row.account.account_number
              }}</q-td>
              <q-td key="agency_number" :props="props" class="text-grey-8">{{
                props.row.account.agency_number
              }}</q-td>

              <q-td key="category" :props="props">
                <q-badge
                  color="blue-grey-1"
                  text-color="blue-grey-9"
                  class="q-pa-xs"
                  style="font-weight: 500"
                >
                  {{ props.row.category.name }}
                </q-badge>
              </q-td>

              <q-td key="value" :props="props" class="text-right">
                <span
                  :class="
                    props.row.type === 'entrada' ? 'text-green-8' : 'text-red-8'
                  "
                  class="text-weight-bolder"
                >
                  {{ formatCurrencyBRL(props.row.value) }}
                </span>
              </q-td>

              <q-td
                key="date_movement"
                :props="props"
                class="text-grey-9 text-weight-medium"
              >
                {{ formatDate(props.row.date_movement) }}
              </q-td>

              <q-td key="description" :props="props">
                <div class="ellipsis text-grey-7" style="max-width: 150px">
                  {{ props.row.description }}
                </div>
              </q-td>

              <q-td key="receipt" :props="props" class="text-center">
                <q-btn
                  v-if="props.row.receipt"
                  flat
                  round
                  dense
                  icon="file_present"
                  size="sm"
                  color="primary"
                  @click="openPreview(props.row.receipt)"
                >
                  <q-tooltip>Ver comprovante</q-tooltip>
                </q-btn>
              </q-td>

              <q-td key="action" :props="props" class="text-right">
                <div class="row no-wrap q-gutter-x-xs justify-end">
                  <q-btn
                    v-if="
                      !isMovementClosed(props.row.date_movement) &&
                      user?.enterprise_id === user?.view_enterprise_id
                    "
                    flat
                    round
                    dense
                    icon="edit"
                    size="sm"
                    color="grey-7"
                    @click="handleEdit(props.row)"
                  />
                  <q-btn
                    v-if="
                      !isMovementClosed(props.row.date_movement) &&
                      user?.enterprise_id === user?.view_enterprise_id
                    "
                    flat
                    round
                    dense
                    icon="delete_outline"
                    size="sm"
                    color="red-4"
                    @click="saveIdExclude(props.row.id)"
                  />
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-dialog v-model="preview.open" maximized>
          <q-card style="width: 80%">
            <q-bar>
              <div>Pré-visualização</div>
              <q-space />
              <q-btn dense flat icon="close" v-close-popup />
            </q-bar>

            <q-card-section class="q-pa-sm flex flex-center">
              <img
                v-if="preview.type === 'image'"
                :src="preview.url"
                style="width: 100%; max-height: 90vh"
              />

              <iframe
                v-else-if="preview.type === 'pdf'"
                :src="preview.url"
                style="width: 100%; height: 90vh; border: none"
              />

              <div v-else class="q-pa-lg">
                Tipo de arquivo não suportado para visualização.
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                label="Baixar"
                icon="download"
                color="primary"
                class="q-mr-sm"
                unelevated
                no-caps
                @click="download(preview.url)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

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
