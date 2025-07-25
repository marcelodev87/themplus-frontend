<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useOfficeStore } from 'src/stores/office-store';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import FormEnterprise from 'src/components/forms/FormEnterprise.vue';
import FormUser from 'src/components/forms/FormUser.vue';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import { Office } from 'src/ts/interfaces/data/Enterprise';
import { useAuthStore } from 'src/stores/auth-store';
import Paginate from 'src/components/general/Paginate.vue';

defineOptions({
  name: 'Office',
});

const { user } = storeToRefs(useAuthStore());
const { filledData, loadingOffice, listOffice } = storeToRefs(useOfficeStore());
const { getOffices, deleteOffice } = useOfficeStore();

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(12);
const showConfirmAction = ref<boolean>(false);
const showFormEnterprise = ref<boolean>(false);
const selectedOffice = ref<string | null>(null);
const dataOffice = ref<Office | null>(null);
const dataNull = ref<null>(null);
const showFormUser = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const filterAlert = ref<string>('');
const columnsAlert = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'users',
    label: 'Total de usuários',
    field: 'users',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const resetPage = (): void => {
  currentPage.value = 1;
};
const clear = (): void => {
  filterAlert.value = '';
  selectedOffice.value = null;
};
const openFormEnterprise = (): void => {
  showFormEnterprise.value = true;
};
const closeFormEnterprise = (): void => {
  showFormEnterprise.value = false;
  clear();
};
const fetchOffices = async () => {
  await getOffices();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const openFormUser = (office: Office): void => {
  dataOffice.value = office;
  showFormUser.value = true;
};
const closeFormUser = (): void => {
  dataOffice.value = null;
  showFormUser.value = false;
};
const openConfirmAction = async (id: string): Promise<void> => {
  selectedOffice.value = id;
  showConfirmAction.value = true;
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  await deleteOffice(selectedOffice.value ?? '');
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const filteredOffice = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };
  const searchTerm = normalize(filterAlert.value);
  resetPage();
  return listOffice.value.filter((item) => {
    currentPage.value = 1;
    return item.name && normalize(item.name).includes(searchTerm);
  });
});

const listOfficeCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredOffice.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(filteredOffice.value.length / rowsPerPage.value);
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

onMounted(async () => {
  await fetchOffices();
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
        <TitlePage title="Gerenciamento de filiais" />
      </div>
      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
          @click="openFormEnterprise"
          icon-right="add"
          label="Filiais"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md">
        <q-table
          :rows="loadingOffice ? [] : listOfficeCurrent"
          :columns="columnsAlert"
          :loading="loadingOffice"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma filial para mostrar"
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
            <span class="text-subtitle2">Lista de filiais</span>
            <q-space />
            <q-input filled v-model="filterAlert" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
              <q-td key="users" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.users.length }}</span>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  @click="openFormUser(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="groups"
                  :disable="loadingOffice"
                />
                <q-btn
                  @click="openConfirmAction(props.row.id)"
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                  :disable="loadingOffice"
                />
              </q-td>
            </q-tr>
          </template>
          <template v-slot:bottom>
            <Paginate
              v-model="currentPage"
              :max="maxPages"
              :length="filteredOffice.length"
            />
          </template>
        </q-table>
        <FormEnterprise
          :open="showFormEnterprise"
          mode="office"
          @update:open="closeFormEnterprise"
        />
        <FormUser
          :open="showFormUser"
          :data-edit="dataNull"
          :office="dataOffice"
          mode="office"
          @update:open="closeFormUser"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Continuar"
          title="Confirmação de exclusão de filial "
          message="Este processo é irreversível e caso tenha certeza que deseja excluir a filial, todos os dados  vinculados do mesmo, serão apagados. Clique em 'Continuar' para prosseguir."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
