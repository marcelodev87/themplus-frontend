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
const filteredScheduling = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };
  const searchTerm = normalize(filterScheduling.value);

  return listScheduling.value.filter((item) => {
    return (
      (item.account?.name &&
        normalize(item.account.name).includes(searchTerm)) ||
      (item.account?.agency_number &&
        normalize(item.account.agency_number).includes(searchTerm)) ||
      (item.account?.account_number &&
        normalize(item.account.account_number).includes(searchTerm)) ||
      (item.category?.name &&
        normalize(item.category.name).includes(searchTerm)) ||
      (item.value && normalize(item.value.toString()).includes(searchTerm)) ||
      (item.description && normalize(item.description).includes(searchTerm)) ||
      (item.receipt && normalize(item.receipt).includes(searchTerm)) ||
      (item.date_movement && normalize(item.date_movement).includes(searchTerm))
    );
  });
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

    const selectedCategoryChanged = newCategory === oldCategory;
    const selectedAccountChanged = newAccount === oldAccount;

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
    }
    // else {
    //   await getSchedulings(filterMonthYear.value.replace('/', '-'));
    //   selectedCategory.value = { label: 'Todas categorias', value: null };
    // }
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
  await getSchedulingsWithParams(
    onlyExpired.value,
    onlyEntry.value,
    onlyOut.value,
    filterMonthYear.value.replace('/', '-'),
    selectedCategory.value.value,
    selectedAccount.value.value
  );
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
        <q-card
          flat
          bordered
          class="q-my-md shadow-1 overflow-hidden"
          style="border-radius: 12px"
        >
          <q-card-section class="bg-grey-1 row items-center q-py-sm">
            <q-icon
              name="event_repeat"
              size="24px"
              color="primary"
              class="q-mr-sm"
            />
            <div
              class="text-weight-bold text-subtitle1 text-uppercase text-grey-8"
            >
              Agendamentos
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-md q-gutter-y-sm">
            <div class="row justify-between items-center">
              <div class="row items-center text-grey-8">
                <q-icon
                  name="add_circle_outline"
                  color="green"
                  size="18px"
                  class="q-mr-sm"
                />
                <span class="text-weight-medium">Entradas Previstas</span>
              </div>
              <div class="text-weight-bold text-green">
                {{ dataScheduling.valueEntry }}
              </div>
            </div>

            <div class="row justify-between items-center">
              <div class="row items-center text-grey-8">
                <q-icon
                  name="remove_circle_outline"
                  color="red"
                  size="18px"
                  class="q-mr-sm"
                />
                <span class="text-weight-medium">Saídas Previstas</span>
              </div>
              <div class="text-weight-bold text-red">
                {{ dataScheduling.valueOut }}
              </div>
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section
            class="row justify-between items-center q-py-md transition-all"
            :class="getClassTotal(dataScheduling.total)"
          >
            <div class="column">
              <span class="text-weight-medium text-subtitle1"
                >Saldo Projetado</span
              >
            </div>
            <div class="text-h6 text-weight-bolder">
              {{ dataScheduling.total }}
            </div>
          </q-card-section>
        </q-card>
        <q-table
          :rows="loadingScheduling ? [] : filteredScheduling"
          :columns="columnsScheduling"
          :loading="loadingScheduling"
          flat
          bordered
          row-key="id"
          no-data-label="Nenhum agendamento para mostrar"
          virtual-scroll
          :rows-per-page-options="[0]"
          class="my-sticky-header-table"
          style="border-radius: 12px"
        >
          <template v-slot:top>
            <div class="column full-width q-gutter-y-md">
              <div class="row items-center full-width">
                <div class="text-h6 text-weight-bold text-grey-8">
                  <q-icon name="event_note" color="primary" class="q-mr-xs" />
                  Agendamentos
                </div>
                <q-space />
                <div v-if="!$q.screen.lt.md" class="row q-gutter-x-sm">
                  <q-toggle
                    v-model="onlyExpired"
                    color="negative"
                    label="Expirados"
                    dense
                    left-label
                  />
                  <q-toggle
                    v-model="onlyEntry"
                    color="positive"
                    label="Entradas"
                    dense
                    left-label
                  />
                  <q-toggle
                    v-model="onlyOut"
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
                    v-model="filterMonthYear"
                    :options="listMonthYear"
                    :readonly="listMonthYear.length === 0"
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

                <div class="col">
                  <q-select
                    v-model="selectedCategory"
                    :options="optionsCategoriesFilter"
                    :readonly="loadingScheduling"
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
                    :readonly="loadingScheduling"
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
                    v-model="filterScheduling"
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
                label="Filtrar Resultados"
                header-class="bg-grey-2 text-weight-bold"
                class="border-form overflow-hidden"
                style="border-radius: 8px"
              >
                <div class="q-pa-md q-gutter-y-sm bg-grey-1">
                  <div class="row justify-around">
                    <q-toggle
                      v-model="onlyExpired"
                      color="negative"
                      label="Expirados"
                      dense
                    />
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
                    v-model="filterMonthYear"
                    :options="listMonthYear"
                    label="Período"
                    outlined
                    dense
                  />
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
                    v-model="filterScheduling"
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
                      props.row.type === 'entrada' ? 'bg-green' : 'bg-red'
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
                  class="q-pa-xs px-sm"
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

              <q-td key="date_movement" :props="props">
                <div class="row items-center no-wrap text-weight-medium">
                  {{ formatDate(props.row.date_movement) }}
                  <q-icon
                    v-if="isPastDate(props.row.date_movement)"
                    name="priority_high"
                    size="14px"
                    color="white"
                    class="bg-orange-9 q-ml-xs rounded-borders"
                    style="padding: 1px"
                  >
                    <q-tooltip class="bg-orange-9 text-white"
                      >Vencido / Expirado</q-tooltip
                    >
                  </q-icon>
                </div>
              </q-td>

              <q-td key="description" :props="props">
                <div class="ellipsis text-grey-7" style="max-width: 140px">
                  {{ props.row.description }}
                </div>
              </q-td>

              <q-td key="receipt" :props="props" class="text-center">
                <q-btn
                  v-if="props.row.receipt"
                  flat
                  round
                  dense
                  icon="description"
                  size="sm"
                  color="indigo-7"
                  @click="download(props.row.receipt)"
                >
                  <q-tooltip>Ver comprovante</q-tooltip>
                </q-btn>
              </q-td>

              <q-td key="action" :props="props" class="text-right">
                <div class="row justify-end no-wrap q-gutter-x-xs">
                  <q-btn
                    flat
                    round
                    dense
                    icon="edit"
                    size="sm"
                    color="grey-7"
                    @click="handleEdit(props.row)"
                  />
                  <q-btn
                    flat
                    round
                    dense
                    icon="check_circle"
                    size="sm"
                    color="green-7"
                    @click="finalize(props.row.id)"
                  >
                    <q-tooltip>Finalizar Lançamento</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete_sweep"
                    size="sm"
                    color="red-4"
                    @click="exclude(props.row.id)"
                  />
                </div>
              </q-td>
            </q-tr>
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
