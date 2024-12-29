<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useOfficeStore } from 'src/stores/office-store';
import { onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { Alert } from 'src/ts/interfaces/data/Alert';
import FormEnterprise from 'src/components/forms/FormEnterprise.vue';
import FormUser from 'src/components/forms/FormUser.vue';

defineOptions({
  name: 'Office',
});

const { filledData, loadingOffice, listOffice } = storeToRefs(useOfficeStore());
const { getOffices } = useOfficeStore();

const showFormEnterprise = ref<boolean>(false);
const dataNull = ref<null>(null);
const showFormUser = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const filterAlert = ref<string>('');
const selectedDataEdit = ref<Alert | null>(null);
const columnsAlert = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'total_users',
    label: 'Total de usuários',
    field: 'total_users',
    align: 'left',
  },
  {
    name: 'counter',
    label: 'Contador',
    field: 'counter',
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
  selectedDataEdit.value = null;
  filterAlert.value = '';
};
const openFormEnterprise = (): void => {
  showFormEnterprise.value = true;
};
const closeFormEnterprise = (): void => {
  showFormEnterprise.value = false;
  clear();
};
const handleEdit = (alert: Alert) => {
  selectedDataEdit.value = alert;
  openFormEnterprise();
};
const exclude = async (id: string) => {
  // await deleteAlert(id);
  console.log('excluir ', id);
};
const fetchOffices = async () => {
  await getOffices();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const openFormUser = (): void => {
  showFormUser.value = true;
};
const closeFormUser = (): void => {
  showFormUser.value = false;
};

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
  console.log('teste');
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
          @click="openFormEnterprise"
          color="blue-8"
          icon-right="add_home"
          label="Filiais"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md">
        <q-table
          :rows="loadingOffice ? [] : listOffice"
          :columns="columnsAlert"
          :filter="filterAlert"
          :loading="loadingOffice"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhuma filial para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
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
                {{ props.row.name }}
              </q-td>
              <q-td key="total_users" :props="props" class="text-left">
                {{ props.row.total_users }}
              </q-td>
              <q-td key="counter" :props="props" class="text-left">
                {{ props.row.counter ?? 'Sem contador vinculado' }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                  :disabled="loadingOffice"
                />
                <q-btn
                  @click="openFormUser"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="person_add"
                  :disabled="loadingOffice"
                />
                <q-btn
                  @click="exclude(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                  :disabled="loadingOffice"
                />
              </q-td>
            </q-tr>
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
          @update:open="closeFormUser"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
