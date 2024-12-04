<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormEntry from 'src/components/forms/FormEntry.vue';
import FormOut from 'src/components/forms/FormOut.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { Scheduling } from 'src/ts/interfaces/data/Scheduling';
import { storeToRefs } from 'pinia';
import { useSchedulingStore } from 'src/stores/scheduling-store';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';

defineOptions({
  name: 'Scheduling',
});

const { loadingScheduling, listScheduling, filledData } =
  storeToRefs(useSchedulingStore());
const {
  getSchedulings,
  getSchedulingsWithParams,
  exportScheduling,
  deleteScheduling,
  finalizeScheduling,
} = useSchedulingStore();

const onlyExpired = ref<boolean>(false);
const onlyEntry = ref<boolean>(false);
const onlyOut = ref<boolean>(false);
const loadingExport = ref<boolean>(false);
const showFormEntry = ref<boolean>(false);
const showFormOut = ref<boolean>(false);
const selectedDataEdit = ref<Scheduling | null>(null);
const showAlertDataEnterprise = ref<boolean>(false);
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

const clear = (): void => {
  onlyEntry.value = false;
  onlyOut.value = false;
  onlyExpired.value = false;
  filterScheduling.value = '';
  selectedDataEdit.value = null;
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
const exportData = async (): Promise<void> => {
  loadingExport.value = true;
  await exportScheduling(onlyEntry.value, onlyOut.value, onlyExpired.value);
  loadingExport.value = false;
};

watch(
  [onlyExpired, onlyEntry, onlyOut],
  async ([newExpired, newEntry, newOut], [oldExpired, oldEntry, oldOut]) => {
    let lastChanged = null;

    if (newEntry !== oldEntry) {
      lastChanged = 'onlyEntry';
    } else if (newOut !== oldOut) {
      lastChanged = 'onlyOut';
    } else if (newExpired !== oldExpired) {
      lastChanged = 'onlyExpired';
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

    const shouldCallWithParams = newEntry || newOut || newExpired;

    if (newEntry && newOut) {
      return;
    }

    if (shouldCallWithParams) {
      await getSchedulingsWithParams(newExpired, newEntry, newOut);
    } else {
      await getSchedulings();
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

onMounted(async () => {
  await getSchedulings();
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
          :rows="loadingScheduling ? [] : listScheduling"
          :columns="columnsScheduling"
          :loading="loadingScheduling"
          :filter="filterScheduling"
          :filter-method="customFilterScheduling"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhum agendamento para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de agendamentos</span>
            <q-space />
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
              :class="[
                props.row.type === 'entrada' ? 'text-green' : 'text-red',
              ]"
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
              <q-td
                key="date_movement"
                :props="props"
                class="text-left q-gutter-x-sm"
              >
                {{ formatDate(props.row.date_movement) }}
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
                {{ props.row.description }}
              </q-td>
              <q-td key="receipt" :props="props" class="text-left">
                {{ props.row.receipt }}
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
                <q-icon
                  @click="finalize(props.row.id)"
                  name="task_alt"
                  size="16px"
                  class="cursor-pointer"
                >
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
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
