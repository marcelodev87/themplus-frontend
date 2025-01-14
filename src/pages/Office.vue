<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useOfficeStore } from 'src/stores/office-store';
import { onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import FormEnterprise from 'src/components/forms/FormEnterprise.vue';
import FormUser from 'src/components/forms/FormUser.vue';
import { Office } from 'src/ts/interfaces/data/Enterprise';
import { useAuthStore } from 'src/stores/auth-store';

defineOptions({
  name: 'Office',
});

const { user } = storeToRefs(useAuthStore());
const { filledData, loadingOffice, listOffice } = storeToRefs(useOfficeStore());
const { getOffices } = useOfficeStore();

const showFormEnterprise = ref<boolean>(false);
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

const clear = (): void => {
  filterAlert.value = '';
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
              <q-td key="users" :props="props" class="text-left">
                {{ props.row.users.length }}
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
                  :disabled="loadingOffice"
                />
                <q-btn
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
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
          :office="dataOffice"
          mode="office"
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
