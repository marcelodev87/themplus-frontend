<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useRegisterStore } from 'src/stores/register-store';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { QuasarSelect, QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import RegisterDetail from 'src/components/shared/RegisterDetail.vue';
import Paginate from 'src/components/general/Paginate.vue';

defineOptions({
  name: 'Alert',
});

const { listRegister, loadingRegister, filledData } =
  storeToRefs(useRegisterStore());
const { getRegisters } = useRegisterStore();

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(10);
const showRegisterDetail = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const filterRegister = ref<string>('');
const selectedDataView = ref<string | null>(null);
const selectedPeriod = ref<QuasarSelect<string>>({
  label: 'Últimos 60 dias',
  value: 'all',
});
const optionsFiltersPeriod = reactive<QuasarSelect<string>[]>([
  {
    label: 'Últimos 60 dias',
    value: 'all',
  },
  {
    label: 'Hoje',
    value: 'today',
  },
  {
    label: 'Ontem',
    value: 'yesterday',
  },
  {
    label: 'Últimos 15 dias',
    value: 'last15',
  },
  {
    label: 'Últimos 30 dias',
    value: 'last30',
  },
]);
const columnsRegister = reactive<QuasarTable[]>([
  {
    name: 'user_name',
    label: 'Nome',
    field: 'user_name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'user_email',
    label: 'Email',
    field: 'user_email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date',
    label: 'Data',
    field: 'date',
    align: 'left',
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
  },
  {
    name: 'text',
    label: 'Descrição',
    field: 'text',
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
  selectedDataView.value = null;
  filterRegister.value = '';
};
const resetPage = (): void => {
  currentPage.value = 1;
};
const openRegisterDetail = (): void => {
  showRegisterDetail.value = true;
};
const closeRegisterDetail = (): void => {
  showRegisterDetail.value = false;
  clear();
};
const handleEdit = (id: string) => {
  selectedDataView.value = id;
  openRegisterDetail();
};
const fetchRegisters = async () => {
  await getRegisters(selectedPeriod.value.value);
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const buildAction = (action: string): string => {
  if (action === 'created') {
    return 'Criação';
  }
  if (action === 'insert') {
    return 'Inserção';
  }
  if (action === 'updated' || action === 'observations') {
    return 'Atualização';
  }
  if (action === 'deleted') {
    return 'Exclusão';
  }
  if (action === 'finalize' || action === 'finalized') {
    return 'Finalização';
  }
  if (action === 'transfer') {
    return 'Transferência';
  }
  if (action === 'reactivated') {
    return 'Reativação';
  }
  if (action === 'inactivated') {
    return 'Inativação';
  }
  if (action === 'delivered') {
    return 'Entrega';
  }
  if (action === 'invite') {
    return 'Solicitação';
  }
  if (action === 'unlink') {
    return 'Desvínculo';
  }
  if (action === 'undone') {
    return 'Reverção';
  }
  if (action === 'reopen') {
    return 'Reabertura';
  }

  return '';
};
const filteredRegister = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };
  const searchTerm = normalize(filterRegister.value);
  resetPage();
  return listRegister.value.filter((item) => {
    return (
      (item.user_name && normalize(item.user_name).includes(searchTerm)) ||
      (item.text && normalize(item.text).includes(searchTerm)) ||
      (item.user_email && normalize(item.user_email).includes(searchTerm))
    );
  });
});

const listRegisterCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredRegister.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(filteredRegister.value.length / rowsPerPage.value);
});

watch(selectedPeriod, async () => {
  await fetchRegisters();
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
watch(filterRegister, () => {
  currentPage.value = 1;
});

onMounted(async () => {
  await fetchRegisters();
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
        <TitlePage title="Gerenciamento de registros" />
      </div>
      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      ></div>
    </header>
    <q-scroll-area class="main-scroll">
      <main
        class="q-pa-sm q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-table
          :rows="loadingRegister ? [] : listRegisterCurrent"
          :columns="columnsRegister"
          :loading="loadingRegister"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma alerta para mostrar"
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
            <span class="text-subtitle2">Lista de registros</span>
            <q-space />
            <q-select
              v-model="selectedPeriod"
              :options="optionsFiltersPeriod"
              :readonly="loadingRegister"
              label="Filtre um período"
              class="q-mr-sm"
              filled
              dense
              options-dense
              bg-color="grey-1"
              label-color="black"
              style="min-width: 200px"
              :class="!$q.screen.lt.md ? '' : 'full-width q-mt-sm'"
            >
              <template v-slot:prepend>
                <q-icon name="calendar_month" color="black" size="20px" />
              </template>
            </q-select>
            <q-input
              filled
              v-model="filterRegister"
              dense
              label="Pesquisar"
              :class="!$q.screen.lt.md ? '' : 'full-width q-mt-sm'"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="user_name" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.user_name }}</span>
              </q-td>
              <q-td key="user_email" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.user_email }}</span>
              </q-td>
              <q-td key="date" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.date }}</span>
              </q-td>
              <q-td key="type" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  buildAction(props.row.action)
                }}</span>
              </q-td>
              <q-td key="text" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.text }}</span>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="visibility"
                  :disable="loadingRegister"
                >
                  <q-tooltip> Detalhes </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:bottom>
            <Paginate
              v-model="currentPage"
              :max="maxPages"
              :length="filteredRegister.length"
            />
          </template>
        </q-table>
        <RegisterDetail
          :open="showRegisterDetail"
          :data-id="selectedDataView"
          @update:open="closeRegisterDetail"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
