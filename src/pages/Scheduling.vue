<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormEntry from 'src/components/forms/FormEntry.vue';
import FormOut from 'src/components/forms/FormOut.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { Scheduling } from 'src/ts/interfaces/data/Scheduling';
import { storeToRefs } from 'pinia';
import { useSchedulingStore } from 'src/stores/scheduling-store';
import { QuasarSelect, QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import ConfirmDownloadFile from 'src/components/confirm/ConfirmDownloadFile.vue';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import { useAuthStore } from 'src/stores/auth-store';

defineOptions({
  name: 'Scheduling',
});

const { user } = storeToRefs(useAuthStore());
const {
  loadingScheduling,
  listScheduling,
  filledData,
  listMonthYear,
  listCategoryFilters,
  listAccountFilters,
} = storeToRefs(useSchedulingStore());
const {
  getSchedulings,
  getSchedulingsWithParams,
  exportSchedulingExcel,
  exportSchedulingPDF,
  deleteScheduling,
  finalizeScheduling,
  downloadFile,
} = useSchedulingStore();

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(7);
const onlyExpired = ref<boolean>(false);
const onlyEntry = ref<boolean>(false);
const onlyOut = ref<boolean>(false);
const loadingExport = ref<boolean>(false);
const showConfirmDownloadFile = ref<boolean>(false);
const showFormEntry = ref<boolean>(false);
const showFormOut = ref<boolean>(false);
const selectedDataEdit = ref<Scheduling | null>(null);
const showAlertDataEnterprise = ref<boolean>(false);
const filterScheduling = ref<string>('');
const selectedCategory = ref<QuasarSelect<string | null>>({
  label: 'Todas categorias',
  value: null,
});
const selectedAccount = ref<QuasarSelect<string | null>>({
  label: 'Todas contas',
  value: null,
});
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
      const labelA = a.label || '';
      const labelB = b.label || '';
      return labelA.localeCompare(labelB);
    });

  return [...baseCategories, ...additionalCategories];
});
const dataScheduling = computed(() => {
  let valueEntry = 0;
  let valueOut = 0;

  listScheduling.value.forEach((item) => {
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
  onlyEntry.value = false;
  onlyOut.value = false;
  onlyExpired.value = false;
  filterScheduling.value = '';
  selectedDataEdit.value = null;
  filterMonthYear.value = dateActual.value;
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
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const handleEdit = (scheduling: Scheduling): void => {
  selectedDataEdit.value = scheduling;
  if (scheduling.type === 'entrada') {
    openFormEntry();
  } else {
    openFormOut();
  }
};
const download = async (url: string) => {
  await downloadFile(url);
};
const exclude = async (id: string): Promise<void> => {
  await deleteScheduling(id);
};
const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');

  return `${day}/${month}/${year}`;
};
const finalize = async (id: string): Promise<void> => {
  await finalizeScheduling(id);
};
const customFilterScheduling = (
  rows: readonly Scheduling[],
  terms: string,
  cols: readonly Scheduling[],
  getCellValue: (row: Scheduling, col: QuasarTable) => unknown
): readonly Scheduling[] => {
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
const isPastDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return date <= yesterday;
};
const exportDataExcel = async (): Promise<void> => {
  loadingExport.value = true;
  await exportSchedulingExcel(
    onlyEntry.value,
    onlyOut.value,
    onlyExpired.value,
    filterMonthYear.value.replace('/', '-'),
    selectedCategory.value.value
  );
  loadingExport.value = false;
};
const exportDataPdf = async (): Promise<void> => {
  loadingExport.value = true;
  await exportSchedulingPDF(
    onlyEntry.value,
    onlyOut.value,
    onlyExpired.value,
    filterMonthYear.value.replace('/', '-'),
    selectedCategory.value.value
  );
  loadingExport.value = false;
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
const listSchedulingCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return listScheduling.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(listScheduling.value.length / rowsPerPage.value);
});

watch(
  [onlyExpired, onlyEntry, onlyOut, selectedCategory, selectedAccount],
  async (
    [newExpired, newEntry, newOut, newCategory, newAccount],
    [oldExpired, oldEntry, oldOut, oldCategory, oldAccount]
  ) => {
    let lastChanged = null;

    if (newEntry !== oldEntry) {
      lastChanged = 'onlyEntry';
    } else if (newOut !== oldOut) {
      lastChanged = 'onlyOut';
    } else if (newExpired !== oldExpired) {
      lastChanged = 'onlyExpired';
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
      newEntry ||
      newOut ||
      newExpired ||
      selectedCategoryChanged ||
      selectedAccountChanged;

    if (newEntry && newOut) {
      return;
    }

    if (shouldCallWithParams) {
      await getSchedulingsWithParams(
        newExpired,
        newEntry,
        newOut,
        filterMonthYear.value.replace('/', '-'),
        selectedCategory.value.value,
        selectedAccount.value.value
      );
    } else {
      await getSchedulings(filterMonthYear.value.replace('/', '-'));
      selectedCategory.value = { label: 'Todas categorias', value: null };
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
  await getSchedulings(filterMonthYear.value.replace('/', '-'));
});
watch(filterScheduling, () => {
  currentPage.value = 1;
});

onMounted(async () => {
  await getSchedulings(dateActual.value.replace('/', '-'));
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
        <TitlePage title="Gerenciamento de agendamentos" />
      </div>
      <div
        v-if="!$q.screen.lt.sm"
        class="col-7 row items-center justify-end q-gutter-x-sm"
      >
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
              :class="!$q.screen.lt.sm ? '' : 'text-green'"
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="add" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Formulário de entrada</q-item-section>
            </q-item>
            <q-item
              v-show="user?.enterprise_id === user?.view_enterprise_id"
              clickable
              v-ripple
              @click="openFormOut"
              :class="!$q.screen.lt.sm ? '' : 'text-red'"
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
      :class="!$q.screen.lt.sm ? 'main-scroll' : 'scheduling-scroll'"
    >
      <main
        class="q-pa-sm q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-card flat bordered class="q-my-sm">
          <q-card-section class="row items-center">
            <q-icon name="sync_alt" size="20px" class="q-mr-sm" color="black" />
            <div class="text-h6">Agendamentos</div>
          </q-card-section>

          <q-card-section class="q-pt-none row justify-between">
            <span class="text-subtitle1">Total de entrada: </span>
            <span class="text-green">{{ dataScheduling.valueEntry }}</span>
          </q-card-section>
          <q-card-section class="q-pt-none row justify-between">
            <span class="text-subtitle1"> Total de saída:</span>
            <span class="text-red">{{ dataScheduling.valueOut }} </span>
          </q-card-section>

          <q-separator inset />

          <q-card-section
            class="row justify-between"
            :class="getClassTotal(dataScheduling.total)"
          >
            <span class="text-subtitle1">Saldo:</span>
            <span>{{ dataScheduling.total }}</span>
          </q-card-section>
        </q-card>
        <q-table
          style="height: 463px"
          :rows="loadingScheduling ? [] : listSchedulingCurrent"
          :columns="columnsScheduling"
          :loading="loadingScheduling"
          :filter="filterScheduling"
          :filter-method="customFilterScheduling"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum agendamento para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
          <template v-slot:top>
            <div :class="!$q.screen.lt.md ? '' : 'column full-width'">
              <span class="text-subtitle2">Lista de agendamentos</span>
              <q-space />
              <div v-if="!$q.screen.lt.md" class="row">
                <q-toggle
                  v-model="onlyExpired"
                  color="primary"
                  label="Expirados"
                  left-label
                />
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
                <q-select
                  v-model="selectedCategory"
                  :options="optionsCategoriesFilter"
                  :readonly="loadingScheduling || loadingExport"
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
                  :readonly="loadingScheduling || loadingExport"
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
                  v-model="filterScheduling"
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
                  v-model="onlyExpired"
                  color="primary"
                  label="Expirados"
                  left-label
                  class="q-ml-sm"
                />
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
                  class="q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="calendar_today" color="black" size="20px" />
                  </template>
                </q-select>
                <q-select
                  v-model="selectedCategory"
                  :options="optionsCategoriesFilter"
                  :readonly="loadingScheduling || loadingExport"
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
                <q-select
                  v-model="selectedAccount"
                  :options="optionsAccountsFilter"
                  :readonly="loadingScheduling || loadingExport"
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
                  v-model="filterScheduling"
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
              :class="[
                props.row.type === 'entrada' ? 'text-green' : 'text-red',
              ]"
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
              <q-td
                key="date_movement"
                :props="props"
                class="text-left q-gutter-x-sm"
              >
                <span class="text-subtitle2">{{
                  formatDate(props.row.date_movement)
                }}</span>
                <q-icon
                  v-show="isPastDate(props.row.date_movement)"
                  name="dangerous"
                  size="16px"
                  color="black"
                >
                  <q-tooltip> Expirado </q-tooltip>
                </q-icon>
              </q-td>
              <q-td key="description" :props="props" class="text-left">
                <span class="text-subtitle2">
                  {{ props.row.description }}
                </span>
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
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  @click="exclude(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                />
                <q-btn
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  @click="finalize(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="green"
                  icon="task_alt"
                >
                  <q-tooltip> Finalizar </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:bottom>
            <div
              v-show="listScheduling.length > 0"
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
              <span class="text-red-9">Total: {{ listScheduling.length }}</span>
            </div>
          </template>
        </q-table>
        <ConfirmDownloadFile
          :open="showConfirmDownloadFile"
          title="Selecione o tipo de arquivo"
          @update:ok="closeConfirmDownloadFileOk"
          @update:open="closeConfirmDownloadFile"
        />
        <FormEntry
          :open="showFormEntry"
          type="client"
          :data-edit="selectedDataEdit"
          title="Agende uma entrada"
          mode="schedule"
          @update:open="closeFormEntry"
        />
        <FormOut
          :open="showFormOut"
          type="client"
          :data-edit="selectedDataEdit"
          title="Agende uma saída"
          mode="schedule"
          @update:open="closeFormOut"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>

<style scoped lang="scss">
.scheduling-scroll {
  height: calc(100vh - 180px);
}
</style>
