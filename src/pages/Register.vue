<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useRegisterStore } from 'src/stores/register-store';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { QuasarSelect, QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import RegisterDetail from 'src/components/shared/RegisterDetail.vue';

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
        <TitlePage title="Gerenciamento de registros" class="q-ml-sm" />
      </div>
    </header>

    <q-scroll-area class="main-scroll bg-grey-1">
      <main class="q-pa-md">
        <q-card flat bordered class="rounded-borders">
          <q-card-section class="bg-grey-2">
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-md-auto text-subtitle1 text-weight-medium">
                Lista de registros
              </div>

              <div class="col-grow" />

              <div class="col-12 col-md-auto">
                <q-select
                  v-model="selectedPeriod"
                  :options="optionsFiltersPeriod"
                  :readonly="loadingRegister"
                  label="Período"
                  filled
                  dense
                  options-dense
                  bg-color="white"
                  style="min-width: 210px"
                >
                  <template v-slot:prepend>
                    <q-icon name="calendar_month" />
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  filled
                  v-model="filterRegister"
                  dense
                  label="Pesquisar registro"
                  bg-color="white"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-table
            :rows="loadingRegister ? [] : filteredRegister"
            :columns="columnsRegister"
            :loading="loadingRegister"
            flat
            dense
            row-key="index"
            no-data-label="Nenhum registro encontrado"
            virtual-scroll
            :rows-per-page-options="[0]"
          >
            <template v-slot:header="props">
              <q-tr :props="props" class="bg-grey-3 text-weight-medium">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" class="table-row">
                <q-td key="user_name">
                  <div class="text-weight-medium">
                    {{ props.row.user_name }}
                  </div>
                </q-td>

                <q-td key="user_email" class="text-grey-8">
                  {{ props.row.user_email }}
                </q-td>

                <q-td key="date">
                  {{ props.row.date }}
                </q-td>

                <q-td key="type">
                  <q-chip dense color="blue-1" text-color="blue-9" icon="label">
                    {{ buildAction(props.row.action) }}
                  </q-chip>
                </q-td>

                <q-td key="text" class="text-grey-9">
                  {{ props.row.text }}
                </q-td>

                <q-td key="action" class="text-right">
                  <q-btn
                    @click="handleEdit(props.row.id)"
                    size="sm"
                    round
                    unelevated
                    color="grey-3"
                    text-color="dark"
                    icon="visibility"
                    :disable="loadingRegister"
                  >
                    <q-tooltip>Ver detalhes</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>

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
<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
